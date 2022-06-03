import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */

 const loader = new GLTFLoader()

 let spaceship = null
 loader.load(
    '/models/spaceship/spaceship.glb',
    (object) =>
    {
        console.log(object)
        spaceship = object.scene.children[0]
        spaceship.scale.set(0.01, 0.01, 0.01)
        spaceship.rotation.y = Math.PI
        scene.add(spaceship)
    }
)
console.log(spaceship)

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/star.png')

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('AmbientLight Intensity')

const pointLight = new THREE.PointLight('#ffffff', 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
pointLight.distance = 10
pointLight.decay = 1
scene.add(pointLight)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('PointLight Intensity')

const PointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(PointLightHelper)

/**
 * Objects
 */

const spaceshipParameters = {
    width: 2,
    height: 1,
    depth: 4,
    color: '#ffeded',
    cruiseSpeed: 1,
    maxSpeed: 20,
    speed: 1,
    turbo: 100,
    turboMode: false,
    turboAllowed: true,
}

// const spaceshipGeometry = new THREE.BoxBufferGeometry(spaceshipParameters.width, spaceshipParameters.height, spaceshipParameters.depth)
// const spaceshipMaterial = new THREE.MeshStandardMaterial({
//     color: spaceshipParameters.color,
// })

// const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial)
// scene.add(spaceship)                      


/**
 * Particles
 */
const particlesCount = 5000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500
    positions[i * 3 + 1] = (Math.random() - 0.5) * 500
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    size: 0.2,
    transparent: true,
    alphaMap: particlesTexture,
})

const particules = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particules)

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
const cameraOffset = new THREE.Vector3(8, 8, 8)
// camera.position.copy(spaceship.position).add(cameraOffset)
// camera.lookAt(spaceship.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Listeners
 */
window.addEventListener('keydown', (event) =>
{
    if (event.code == 'Space' && spaceshipParameters.turboAllowed == true) {
        spaceshipParameters.speed = spaceshipParameters.maxSpeed
        spaceshipParameters.turboMode = true
    }
})

window.addEventListener('keyup', (event) =>
{
    if (event.code == 'Space') {
        spaceshipParameters.speed = spaceshipParameters.cruiseSpeed
        spaceshipParameters.turboMode = false
        spaceshipParameters.turboAllowed = false
    }
})

window.addEventListener('keyup', (event) =>
{
    if (event.code == 'ShiftLeft') {
        gsap.to(
            spaceship.rotation,
            {
                duration: 1,
                ease: 'power2.inOut',
                z: '+=' + Math.PI,
            }
        )
    }
})

window.addEventListener('keyup', (event) =>
{
    if (event.code == 'ShiftRight') {
        gsap.to(
            spaceship.rotation,
            {
                duration: 1,
                ease: 'power2.inOut',
                z: '-=' + Math.PI,
            }
        )
    }

    // TODO: la rotation est galère pour revenir à mon état initial
    if (event.code == 'ArrowUp') {
        gsap.to(
            spaceship.rotation,
            {
                // duration: 1,
                // ease: 'power2.inOut',
                // // TODO:  Voir comment revenir à l'état initial plat
                // x: '+=0.5',
            }
        )
    }
})

window.addEventListener('keydown', (event) =>
{
    if (event.code == 'ArrowUp') {
        gsap.to(
            spaceship.rotation,
            {
                // duration: 1,
                // ease: 'power2.inOut',
                // x: '-=0.5',
            }
        )
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (spaceship !== null)
    {
        // Animate spaceship
        spaceship.position.z += - deltaTime * spaceshipParameters.speed

        // Manage turbo

        // If pressing turbo AND turbo is allowed
        if (spaceshipParameters.turboMode == true) {

            // If turbo is allowed
            if (spaceshipParameters.turboAllowed == true) {

                if (spaceshipParameters.turbo > 0) {
                    // If we still have turbo, lower the jauge
                    spaceshipParameters.turbo -= 1
                } else if (spaceshipParameters.turbo == 0) {
                    // If we don't have turbo anymore, disable it
                    spaceshipParameters.turboAllowed = false
                }

            } else {
                // If turbo is not allowed
                // Reset cruise speed
                spaceshipParameters.speed = spaceshipParameters.cruiseSpeed
            }

        }

        // If not pressing turbo
        if (spaceshipParameters.turboMode == false) {
            if (spaceshipParameters.turbo < 100) {
                // If turbo jauge is not full, fill it
                spaceshipParameters.turbo += 0.5
            } else {
                // If turbo jauge is full, allow turbo again
                spaceshipParameters.turboAllowed = true
            }
        }

        // TODO: Passer le style de jauge turbo en composant visuel en largeur
        if (spaceshipParameters.turboAllowed == true) {
            document.querySelector('#turbo-jauge').style.color = '#b3e6b3'
        } else {
            document.querySelector('#turbo-jauge').style.color = '#ff9999'
        }

        // console.log(spaceshipParameters.turboAllowed, spaceshipParameters.turboMode)

        // Update turbo jauge and speed jauge
        document.querySelector('#turbo-jauge').innerHTML = spaceshipParameters.turbo
        document.querySelector('#speed-jauge').innerHTML = spaceshipParameters.speed

        // TODO: Rendre l'accélération réaliste avec un ease effect comme sur le scroll based animation

        window.addEventListener('keydown', (event) =>
        {
            if (event.code == 'ArrowUp') {
                spaceship.position.y -= 0.001
            }
        })

        window.addEventListener('keydown', (event) =>
        {
            if (event.code == 'ArrowDown') {
                spaceship.position.y += 0.001
            }
        })

        pointLight.position.copy(spaceship.position).add(new THREE.Vector3(4, 4, 4))

    

        // Animate camera
        camera.position.copy(spaceship.position).add(cameraOffset)
        camera.lookAt(spaceship.position)
    }

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()