import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// We need to get the url of the image we are using

// Put the image directly in the src folder but not great
// import imageSource from './color.jpg'

/**
 * Textures
 */

// Native way to load a texture

/* // Load the image we want
const image = new Image();
// Convert the image to a texture
const texture = new THREE.Texture(image);


image.onload = () =>
{
    // Update the texture once the image has loaded
    texture.needsUpdate = true;
}

image.src = '/textures/door/color.jpg'; */

// Three js textureLoader method

// Loading manager can manage functions according to loading events
const loading_manager = new THREE.LoadingManager();

/* loading_manager.onStart = () =>
{
    console.log('Started loading');
};
loading_manager.onProgress = () =>
{
    console.log('Is loading');
};
loading_manager.onError = () =>
{
    console.log('Error during loading');
}; */

// Init the texture loader (One texture loader can create multiple textures)
const texture_loader = new THREE.TextureLoader(loading_manager);

// Create the texture with the load method
const color_texture = texture_loader.load(
    '/textures/minecraft.png',
    // Callback function when the texture is loaded
    /* () =>
    {
        console.log('Texture loaded');
    },
    // Callback function when the texture is loading (Not working very well)
    () =>
    {
        console.log('Texture is loading');
    },
    // Callback function when the texture is error
    () =>
    {
        console.log('Texture error');
    }, */
);

// Add more textures
const alpha_texture = texture_loader.load('/textures/door/alpha.jpg');
const height_texture = texture_loader.load('/textures/door/height.jpg');
const normal_texture = texture_loader.load('/textures/door/normal.jpg');
const ambient_occlusion_texture = texture_loader.load('/textures/door/ambientOcclusion.jpg');
const metalness_texture = texture_loader.load('/textures/door/metalness.jpg');
const roughness_texture = texture_loader.load('/textures/door/roughness.jpg');

// Transform textures
color_texture.repeat.set(2, 3);
color_texture.wrapS = THREE.MirroredRepeatWrapping;
color_texture.wrapT = THREE.RepeatWrapping;

color_texture.offset.x = 0.5;
color_texture.offset.y = 0.5;


color_texture.rotation = Math.PI * 0.25;
// By default, rotation is around bottom left corner, but we can change it to set the rotation around the center face
color_texture.center.x = 0.5;
color_texture.center.y = 0.5;

// Three js use minification and magnification filter to render textures with lower quality when it can. And it is possible to change this behavior.
color_texture.minFilter = THREE.NearestFilter;
// If we use minFilter NearestFilter, we can desactivate the mipmaps
// color_texture.generateMipmaps = false;
color_texture.magFilter = THREE.NearestFilter;

// Textures optimisation have 3 importants elements

// Weight -> The user will have to download the texture. Choose the right compression format (google webP format is great for example)

// Size -> Each pixel will have to be stored on the GPU. And it has storage limitations. Try to reduce the texture sizes has much as possible. With mipMaping, the texture width and height must be a power of two.

// Data -> Textures support transparency, must use png file for that. But it is heavier.

// WHERE to find the textures : 
// poliigon.com
// 3dtextures.me
// arroway-textures.ch
// Create procedural textures with substance designer https://www.adobe.com/fr/products/substance3d-designer.html#:~:text=Exploit%C3%A9%20dans%20de%20nombreux%20secteurs,int%C3%A8gre%20parfaitement%20%C3%A0%20chaque%20workflow.



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
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// const geometry = new THREE.ConeGeometry(1, 1, 32)
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100)
// Insert texture in the material
const material = new THREE.MeshBasicMaterial({ map: color_texture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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