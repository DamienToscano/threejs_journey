import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// We need to have a deubg UI on the screen to test directly on our browser instead of in the code
// We will use a library to do that


/**
 * Debug
 */
// Tips: press H tp hide the panel
const gui = new dat.GUI({ closed: true, width: 400 });
// We can hiding it at the page loading
// gui.hide();
// By default, the debug panel is empty, we need to add theone we need -> In the code

const params = {
    color: 0xff0000,
    // Function to spin the cube
    spin: () => 
    {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}

// DEBUG: Change material color
gui
    .addColor(params, 'color')
    .onChange(() => 
    {
        material.color.set(params.color);
    })

gui
    .add(params, 'spin');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: params.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// DEBUG: Add mesh position in debug panel
// First param -> The object
// Second param -> Name of the property
// Third param -> Min
// Fourth param -> Max
// Fifth param -> Step
gui.add(mesh.position, 'y', -3, 3, 0.01).name('Elevation');
gui.add(mesh.position, 'x', -3, 3, 0.01).name('X range');
// We can also do it with methods chaining
gui.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('Z range');
// Toggle visible or not in the panel
gui.add(mesh, 'visible').name('Show/Hide');
// Toggle to wireframe view
gui.add(mesh.material, 'wireframe').name('Wireframe');

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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()