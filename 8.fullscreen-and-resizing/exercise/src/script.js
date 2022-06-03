import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
//  Let's use the viewport size
// Fix the body margin in the css file
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => 
{
    // Update sizes on window resize
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    // When update properties like aspect, we have to updateProjectionMatrix
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);

    // Update pixel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Listen to double click to toggle fullscreen
window.addEventListener('dblclick', () => 
{
    // Prefix version for safari (With webkit prefix)
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    // Check if we go to fullscreen or leave fullscreen
    if (!fullscreenElement) {
        // Element + requestFullscreen to go fullscreen
        // With patch for safari
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        // Document + exitFullscreen to leave fullscreen
        // With patch for safari
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
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
renderer.setSize(sizes.width, sizes.height);
// Provide pixel ratio of the device to the renderer and let three js do the adaptation to avoid blurry or stairs effect
// But limit the pixel ratio to 2 to avoid having to many pixels to render
// We take the lowest pixel ratio between the real one and 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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