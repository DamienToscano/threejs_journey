// Script.js is the main entrance of the website in webpack
// The css file is imported in the script.js file
import './style.css';
// To access the THREE variable
import * as THREE from 'three';

// Continue at 22:11

// npm install first time I use a project

// npm run dev to start the server

// npm run build to create a production build in dist.  The bundle is created in dist, and we can send that in production to have our site

console.log(THREE.PerspectiveCamera);

// First step is to create a scene
const scene = new THREE.Scene();

// Create a red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);

// Add the cube to the scene
scene.add(cube);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Manage Camera to create a point of view
// 2 parameters : field of view (in degree, how large can we see the scene), aspect ratio (width/height)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// We have to move camera to see the scene well
// Move objects with positin properties
// z = towards us
// x = to the right
// y = up
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 1;
scene.add(camera);

// Set how we render the scene from the camera point of view (canvas created in html file) -> Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});

// Resize the renderer
renderer.setSize(sizes.width, sizes.height);

// Render the scene
renderer.render(scene, camera);