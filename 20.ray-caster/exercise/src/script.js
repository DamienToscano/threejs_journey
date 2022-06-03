import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

// Ray caster -> Allow to cast a ray in a direction and see if there is a wall, a collision, if something is under the mouse

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// // Shoot to the right -> Positive x value
// const rayDirection = new THREE.Vector3(10, 0, 0)
// // Convert rayDirection vector3 values with a length of 1. Raycaster needs that
// rayDirection.normalize()
// // Raycaster need an origin and a direction
// raycaster.set(rayOrigin, rayDirection)

// Cast a ray
// intersectObject to test one object. But we can go to one object multiple times. If it has a weird shape like a donut
// intersectObjects to test multiple objects

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)


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

// Get mouse position
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => 
{
    // Transform mouse corrdinates between -1 and +1
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

// Simulate click event
window.addEventListener('click', (event) => 
{
    // Check if we are hovering something
    if (currentIntersect) {

        // Test which object to have different actions
        switch (currentIntersect.object) {
            case object1:
                console.log('Click on object1')
                break
            case object2:
                console.log('Click on object2')
                break
            case object3:
                console.log('Click on object3')
                break
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

// Init witness variable to simulate mouseEnter and mouseLeave events
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5

    // Set raycaster
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // // Shoot to the right -> Positive x value
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // // Convert rayDirection vector3 values with a length of 1. Raycaster needs that
    // rayDirection.normalize()
    // // Raycaster need an origin and a direction
    // raycaster.set(rayOrigin, rayDirection)
    // // Check intersections
    const objectsTotest = [object1, object2, object3]

    // // Reset colors to red on each frame
    // for (const objectToTest of objectsTotest) {
    //     objectToTest.material.color.set('#ff0000')
    // }

    // // Get intersects objects
    // const intersects = raycaster.intersectObjects(objectsTotest)
    // // Change objects intersected color to red
    // for (const intersect of intersects) {
    //     console.log(intersect.object)
    //     intersect.object.material.color.set('#0000ff')
    // }

    /**
     * Check hovering
     */

    // Init raycaster as we need
    // At the mouse position
    // In the camera direction
    raycaster.setFromCamera(mouse, camera)
    
    // Reset colors to red on each frame
    for (const objectToTest of objectsTotest) {
        objectToTest.material.color.set('#ff0000')
    }

    // Get intersects objects
    const intersects = raycaster.intersectObjects(objectsTotest)
    // Change objects intersected color to red
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    // Update currentIntersect value
    if (intersects.length) {
        // If there is result but not before, mouse enter
        if (currentIntersect === null) {
            console.log('mouseEnter')
        }
        currentIntersect = intersects[0]
    } else {
        // If there were result but not anymore, mouse leave
        if (currentIntersect !== null) {
            console.log('mouseLeave')
        }
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()