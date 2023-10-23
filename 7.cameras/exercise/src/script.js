import './style.css'
import * as THREE from 'three'
// Import OrbitControls specifically
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

// Discover different usage of cameras
// Camera is an abstract class, don't use it
// Array camera -> Render the scene from multiple cameras on specific parts of the render
// Stereo camera -> Render the scene from two cameras on different parts of the render. It mimic the eyes to create a parallax effect. Use for VR or red and blue glasses.
// Cube camera -> Do 6 renders, each one facing a different direction. Create a render of the surrounding scene.
// Orthographic camera -> Render the scene without perspective.

/**
 * Cursor
 */
// Get the mouse position
const cursor = {
    x: 0,
    y: 0,
};
window.addEventListener('mousemove', (event) =>
{
    // Convert the mouse position to a normalized value between -0.5 and +0.5
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = - (event.clientY / sizes.height - 0.5);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
// scene.add(mesh)

const geometry = new THREE.SphereGeometry( 1, 32, 32 ); 
const material = new THREE.MeshBasicMaterial( { color: 'yellow' } ); 
const sphere = new THREE.Mesh( geometry );
scene.add(sphere);

console.log(sphere);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// Camera params:
// fov: Field of view
// aspect: Aspect ratio
// near: Near clipping plane. Any object closer to the near will not be visible
// far: Far clipping plane. Any object farther from the far will not be visible
// Configure near and far according to the project needs

// Perspective camera
// We use aspect ratio to make a good render of the cube, has our scene is not a square, and we are using a square camera
// const aspect_ratio = sizes.width / sizes.height;
// console.log(aspect_ratio);
// const camera = new THREE.OrthographicCamera(-1 * aspect_ratio, 1 * aspect_ratio, 1, -1, 0.1, 100);

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Instanciate OrbitControls here
const controls = new OrbitControls(camera, canvas);
// It is possible to change properties of the controls
// controls.target.y = 1;
// But we need to call the update function after that
// controls.update();
// Enable dumping allow acceleration and friction effects
// It is important to also update the damping in the tick function
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime;

    // Update camera position on each frame
    // We want to be able to move the camera around the cube
    // Important to give the same value to math sin and math cos
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position);

    // We can do the same with built in three js functions -> Controls in the documentation
    // We are gonna use orbit controls -> Not by default in three js

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()