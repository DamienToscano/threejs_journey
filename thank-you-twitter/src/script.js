import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Get the loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

// Me
gltfLoader.load(
    './models/Me/glTF-Binary/Me.glb',
    (gltf) => {
        scene.add(gltf.scene.children[0])
    }
)

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    // Function triggered when the font is loaded
    (font) => {
        // Init geometry
        const text_geometry = new TextGeometry(
            'Merci les devs!',
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
            }
        );

        // Use Box bouding to get the size of the text to be allowed to center it
        // Bounding box allow THREEJS to compute the surrounding of the element, it can be a cube or a sphere.
        text_geometry.computeBoundingBox();
        // Use the center method
        text_geometry.center();

        const textureLoader = new THREE.TextureLoader();
        const matcap_texture = textureLoader.load('/textures/matcaps/13.png')

        // Init Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcap_texture });
        // Construct mesh with geometry and material
        const text = new THREE.Mesh(text_geometry, material);
        text.scale.set(0.4, 0.4, 0.4)
        text.position.y = -0.2
        scene.add(text)
    }
);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.set(0, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#C5D9F8')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
// Optimize shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let count = 0
let previousCount = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update count
    if (count < 10487) {
        count += 2
    }

    if (previousCount != parseInt(count)) {
        document.querySelector('#count span').innerHTML = parseInt(count)
    }
    previousCount = parseInt(count)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()