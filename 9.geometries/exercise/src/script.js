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

// Object
// BoxGeometry takes 3 more arguments: widthSegments, heightSegments, depthSegments
// It is used to divise the box into smaller pieces, and has more triangles componing the box
// It allows to have more details
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

// To create our own shape, we store data in a float32 array
// It is a typed array, where we can store one type of data only, float
// Has a fixed length
// Is easier to handle for the computer

// Create array with a length of 9 for three vertices
// const positions_array =  new Float32Array(9);

// // First vertice (x, y, z)
// positions_array[0] = 0;
// positions_array[1] = 0;
// positions_array[2] = 0;

// // Second vertice (x, y, z)
// positions_array[3] = 0;
// positions_array[4] = 1;
// positions_array[5] = 0;

// // Third vertice (x, y, z)
// positions_array[6] = 1;
// positions_array[7] = 0;
// positions_array[8] = 0;

// Create buffer geometry 
const geometry = new THREE.BufferGeometry();

const count = 50;

// Create array for those count triangles
const positions_array =  new Float32Array(count * 3 * 3);

// Fill array with random values
for (let i = 0; i < count * 3 * 3; i++) {
    // -0.5 to center it
    positions_array[i] = (Math.random() - 0.5) * 2;
}

// Convert this array to buffer attribute
// Param 1 -> Array
// Param 2 -> item size
const positions_attribute = new THREE.BufferAttribute(positions_array, 3);

// Send the attribuyte to it

// Position is the name that will be used inside the shaders
geometry.setAttribute('position', positions_attribute);

// But we can't see the triangles by default
// To see it, just add wireframe: true in the material
const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
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