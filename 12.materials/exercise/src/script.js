import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

/**
 * Debug
 */

// Init panel console
const gui = new dat.GUI();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Textures 
 */

const texture_loader = new THREE.TextureLoader();
const cube_texture_loader = new THREE.CubeTextureLoader();

const door_color_texture = texture_loader.load('/textures/door/color.jpg');
const door_alpha_texture = texture_loader.load('/textures/door/alpha.jpg');
const door_height_texture = texture_loader.load('/textures/door/height.jpg');
const door_normal_texture = texture_loader.load('/textures/door/normal.jpg');
const door_ambient_occlusion_texture = texture_loader.load('/textures/door/ambientOcclusion.jpg');
const door_metalness_texture = texture_loader.load('/textures/door/metalness.jpg');
const door_roughness_texture = texture_loader.load('/textures/door/roughness.jpg');
const gradient_texture = texture_loader.load('/textures/gradients/3.jpg');
gradient_texture.minFilter = THREE.NearestFilter;
gradient_texture.magFilter = THREE.NearestFilter;
gradient_texture.generateMipmaps = false;
const matcap_texture = texture_loader.load('/textures/matcaps/1.png');

// Set 6 maps to the cube texture loader
const environment_map_texture = cube_texture_loader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
]);

// To get environment maps -> HDRIHaven -> https://polyhaven.com/hdris

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// const material = new THREE.MeshBasicMaterial();
// 2 ways of updating color
// material.color.set('yellow');
// material.color = new THREE.Color('green');
// material.map = door_color_texture;
// material.wireframe = true;

// For opacity, we have to use opacity and transparent properties
// material.opacity = 0.5;
// material.transparent = true;

// Apply alpha texture
// material.alphaMap = door_alpha_texture;
// material.transparent = true;

// Choose which side to render
// material.side = THREE.DoubleSide; // Usefull for plane

// Normals are information that contains the direction of the outside of the face
// Normals are used to calculate the lighting, reflection , refraction and more
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;

// Property only from normal. FlatShading remove the smoothness.
// material.flatShading = true;

// MeshMatcapMaterial
// It allows to simulate lights and shadows
// const material = new THREE.MeshMatcapMaterial();
// Set a matcap texture
// material.matcap = matcap_texture;

// MeshDepthMaterial
// Color material in white if it is closer to the camera and black if it is further
// const material = new THREE.MeshDepthMaterial();

// Add two lights for next material

// MeshLambertMaterial -> Material that react to light
// This material is great, performant, but can have weird pattern on the geometry
// const material = new THREE.MeshLambertMaterial();

// MeshPhongMaterial
// Better effect than MeshLambertMaterial, but less performant
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color('red');

// MeshToonMaterial
// Create a cartoonish effect
// const material = new THREE.MeshToonMaterial();
// We can set gradient texture
// material.gradientMap = gradient_texture;

// MeshStandardMaterial -> The best one
// Support better lights with better performance
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;
// material.map = door_color_texture;
// // Param aoMap (Ambient Occlusion Map) -> Add shadows
// // For aoMap, we need to duplicate the uv coordinates
// material.aoMap = door_ambient_occlusion_texture;
// material.aoMapIntensity = 1;
// // Displacement param -> Veritcal movement 
// material.displacementMap = door_height_texture;
// material.displacementScale = 0.05;
// material.metalnessMap = door_metalness_texture;
// material.roughnessMap = door_roughness_texture;
// material.normalMap = door_normal_texture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = door_alpha_texture;

// Environment map is an image of what is surrounding the scene
const material = new THREE.MeshStandardMaterial();
material.metalness = 0;
material.roughness = 0;
material.envMap = environment_map_texture;


gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.001);


// We can find matcaps here : https://github.com/nidorx/matcaps

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
);
sphere.position.x = - 1.5;
// Set uv2 attirubte to use aoMap param
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
);
// Set uv2 attirubte to use aoMap param
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5, 0.2, 64, 128),
    material
);
torus.position.x = 1.5;
// Set uv2 attirubte to use aoMap param
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));

// scene.add(sphere, plane, torus);

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
);

// scene.add(cube);

/**
 * Lights
 */

// const ambient_light = new THREE.AmbientLight(0xffffff, 0.5);
const point_light = new THREE.PointLight('red', 0.5);
point_light.position.set(2, 3, 4);

scene.add(cube, point_light/* , ambient_light */);

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
camera.position.z = 2
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

    // Update objects

    sphere.rotation.y = 0.15 * elapsedTime;
    plane.rotation.y = 0.20 * elapsedTime;
    torus.rotation.y = 0.17 * elapsedTime;
    
    sphere.rotation.x = 0.20 * elapsedTime;
    plane.rotation.x = 0.17 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()