import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// Instanciate font loader
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axes_helper = new THREE.AxesHelper();
// scene.add(axes_helper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcap_texture = textureLoader.load('/textures/matcaps/16.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    // Function triggered when the font is loaded
    (font) =>
    {
        // Init geometry
        const text_geometry = new TextGeometry(
            'Hello Twitter!',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 10,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 10
                // Try to keep curveSegments and bevelSegments as low as possible
                // To optimize perfs but not to low to avoid quality loss
            }
        );

        // Use Box bouding to get the size of the text to be allowed to center it
        // Bounding box allow THREEJS to compute the surrounding of the element, it can be a cube or a sphere.
        text_geometry.computeBoundingBox();
        // Use the center method
        text_geometry.center();
        // Or in details
        // Move the text by half of this size
        // But remove the bevel size too
        // text_geometry.translate(
        //     - (text_geometry.boundingBox.max.x - 0.02) *0.5,
        //     - (text_geometry.boundingBox.max.y - 0.02) *0.5,
        //     - (text_geometry.boundingBox.max.z - 0.03) *0.5,
        // );

        // Init Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcap_texture });
        // Construct mesh with geometry and material
        const text = new THREE.Mesh(text_geometry, material);
        scene.add(text);

        console.time('donuts');

        // Create so much donuts
        // Create geometry only once
        const tubular_values = [3,4,45];

        for (let i = 0; i < 200; i++) {
            const tubular_segments = tubular_values[Math.floor(Math.random() * tubular_values.length)];
            const donut_geometry = new THREE.TorusBufferGeometry(0.3, 0.08, 20, tubular_segments);
            const donut = new THREE.Mesh(donut_geometry, material);

            donut.position.x = (Math.random() - 0.5) * 10;
            donut.position.y = (Math.random() - 0.5) * 10;
            donut.position.z = (Math.random() - 0.5) * 10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            let scale_value = Math.random();
            donut.scale.set(scale_value, scale_value, scale_value);

            scene.add(donut);
        }

        console.timeEnd('donuts');
    }
);

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()