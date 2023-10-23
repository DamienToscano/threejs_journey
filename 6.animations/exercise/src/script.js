import './style.css'
import * as THREE from 'three'
// import gsap from 'gsap';

// --save to add dependency to package.json file
// To install GSAP library -> npm install --save gsap@3.5.1

// For animation, we need to make sure that animation look the same regardless the framerate

// The requestAnimation Frame make a call of a function for the next frame

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Time
// let time = Date.now();

// Clock
const clock = new THREE.Clock();

// It is possible with GSAP too
// gsap.to(mesh.position, {duration : 1, delay: 1, x: 2});
// gsap.to(mesh.position, {duration : 1, delay: 2, x: 0});

// Animations

// Create function
const tick = () =>
{
    // Solution 1 
    // Make sure the animation look the same regardless the framerate
    // Use timestamp to force a real 60 FPS
    // const current_time = Date.now();
    // const delta_time = current_time - time;
    // time = current_time;
    // Use that delta_time in the cube animation belows

    // Solution 2
    // Use THREE js clock element
    // ATTENTION : Do not use getDelta() function, it get things messes up
    const elapsed_time = clock.getElapsedTime();

    // Update Objects

    // mesh.position.x += 0.01;
    // mesh.position.y -= 0.01;
    // mesh.rotation.y += 0.001 * delta_time;
    // mesh.rotation.x += 0.001 * delta_time;

    // mesh.rotation.x = elapsed_time;
    // mesh.rotation.y = elapsed_time;
    // Use sin and cos to make loop
    mesh.position.x = Math.cos(elapsed_time);
    // mesh.position.y = Math.sin(elapsed_time);
    // mesh.position.z = Math.cos(elapsed_time);

    // Make the render in the animation function
    renderer.render(scene, camera);

    // Pass the function to request animation frame , to call it on the next frame, and has the function on each frame
    window.requestAnimationFrame(tick);
}


// Call function
tick();
