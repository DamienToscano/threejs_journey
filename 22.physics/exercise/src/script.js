import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// import CANNON from 'cannon'
import * as CANNON from 'cannon-es'

// To modelize physics, we have to create a physics world, which will be linked to the real scene to update the objects.

// By default, cannon js test object with every other objects, it is very bad for performance. It is call the BroadPhase. By default it uses the gridBroadphase http://schteppe.github.io/cannon.js/docs/classes/NaiveBroadphase.html
// The gridApproach is better, because it test objects only in parts of the scene separated in a grid. It only test with adjacent grids.

// Another way to improve performance is to set sleep property to true on objects not moving

// Constraints
// We can create constraints between bodies
// HingeConstraint -> Like a door rotating around an axe
// DistanceConstraint -> Like a rope, two objects have always the same distance
// LockConstraint -> Merge the two bodies, like if they are one
// PointToPointConstraint -> Glue the objects together in a specific point

// Find demos https://schteppe.github.io/cannon.js/

// To update performances, we can use workers to run the physics in a separate thread. It imporve performances.
// Exemple : https://schteppe.github.io/cannon.js/examples/worker.html

// Cannon js is old and has not been updated for years.
// There are been forks on github to update it.
// Use cannon ES for that -> npm install --save cannon-es@0.15.1
// https://github.com/pmndrs/cannon-es

// A library  -> physijs, allows to create mesh and object at the same timen and handle the sync, ... 
// https://github.com/chandlerprall/Physijs/wiki
// But we have less control on the physics

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}
debugObject.createSphere = () =>
{
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.reset = () =>
{
    // Remove all objects
    for (const object of objectsToUpdate)
    {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.remove(object.body)

        //Remove mesh
        scene.remove(object.mesh)
    }
    objectsToUpdate.splice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) =>
{
    const impactStrenght = collision.contact.getImpactVelocityAlongNormal()

    // Play the sound only if the collision is strong enough
    if (impactStrenght > 1.5) {
        // Add some randomness to the sound
        const impactVolume = impactStrenght / 10 <= 1 ? impactStrenght / 10 : 1
        hitSound.volume = impactVolume
        // Allow to replay the sound even if it is nt finished on the previous play
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */

// Create the physics world
const world = new CANNON.World()
// Update broadphase to have better performance
world.broadphase = new CANNON.SAPBroadphase(world)
// Allow sleep on objects to avoid comparing not moving objects
world.allowSleep = true
// Add some gravity, set gravity constant on earth on y axe
world.gravity.set(0, -9.82, 0)

gui.add(world.gravity, 'y').name('Gravity').min(-20).max(0).step(0.01)

// Create objects inside the physics world
// Objects are bodies in the physics world

// Materials
// Materials in a physical way (plastic, concrete, ...)

// Create a concrete material
// const concreteMaterial = new CANNON.Material('concrete')

// Create a plastic material
// const plasticMaterial = new CANNON.Material('plastic')

// We can use only one default material to make the code simpler
const defaultMaterial = new CANNON.Material('default')

// Create a contact material -> What happens if a collision happens between plastic and concrete in our example
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         // Friction -> How quickly the object will slow if they rub against each other
//         friction: 0.1,
//         // Restitution -> How much bounce the object will have
//         restitution: 0.7,
//     }
// )

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        // Friction -> How quickly the object will slow if they rub against each other
        friction: 0.1,
        // Restitution -> How much bounce the object will have
        restitution: 0.7,
    }
)

// Add it to the world
// world.addContactMaterial(concretePlasticContactMaterial)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     // material: defaultContactMaterial,
// })

// // Push the sphere at the begining of the scene
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3())

// // Add it to the world
// world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
// floorBody.material = defaultContactMaterial
// Make the floor static
floorBody.mass = 0
// Set the shape
floorBody.addShape(floorShape)
// We need to rotate the floor to make it horizontal. CANNON js use quaternion to represent rotation.
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)

// Add it to the world
world.addBody(floorBody)



/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
// Save all the objects to update in an array
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

// Make a function to create spheres
const createSphere = (radius, position) =>
{
    // THREE.js mesh
    const mesh = new THREE.Mesh( sphereGeometry, material)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(0, 3, 0),
        material: defaultMaterial,
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objectsToUpdate
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

// Make a function to create boxes
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const createBox = (width, height, depth, position) =>
{
    // THREE.js mesh
    const mesh = new THREE.Mesh( boxGeometry, material)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    // For boxes in cannon, we have to divide the dimensions by 2
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const body = new CANNON.Body({
        mass: 2,
        shape: shape,
        position: new CANNON.Vec3(0, 3, 0),
        material: defaultMaterial,
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objectsToUpdate
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

createSphere(0.5, {x: 0, y: 3, z: 0})
createBox(0.5, 0.5, 0.5, {x: 0, y: 4, z: 0})

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics world

    // Simulate wind in opposite direction
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // Framerate
    // Time since last tick
    // How many sub steps
    world.step(1 / 60, deltaTime, 3)

    // Sync the objects to update
    // sphere.position.copy(sphereBody.position)
    for (const object of objectsToUpdate)
    {
        // Update the position
        object.mesh.position.copy(object.body.position)
        // Update the rotation (quaternion)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()