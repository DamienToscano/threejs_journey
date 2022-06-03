import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// There are techniques to get a more realistic renders
// GUI is very important to set little details
// It is better to use physically correct values for elements, like lights. To get things realistics

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateMaterials = () =>
{
    // Traverse all scene elements recursively
    scene.traverse((child) => {
        // We want to apply the environment map to all mesh materials
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // Set the environment map
            // child.material.envMap = environmentMap //  This is done automatically now on scene.environment = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            // Allow material to be updated
            child.material.needsUpdate = true
            // Shadow management
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

// Apply the sRGD encoding to the environment map
environmentMap.encoding = THREE.sRGBEncoding
// Apply the environment map on the background
scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 1
gui.add(debugObject, 'envMapIntensity',).min(0).max(10).onChange(updateMaterials)

/**
 * Models
 */
// Load the fligth helmet
gltfLoader.load(
    // './models/FlightHelmet/glTF/FlightHelmet.gltf',
    './models/burger.glb',
    (gltf) =>
    {
        // Add the gltf to the scene
        // gltf.scene.scale.set(10, 10, 10)
        gltf.scene.scale.set(0.3, 0.3, 0.3)
        // gltf.scene.position.set(0, -4, 0)
        gltf.scene.position.set(0, -1, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('HelmetRotation')
        updateMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 5)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
// To avoid stairs effect on shadow on smooth surfecs, like the burger
// We move the normals a bit to avoid object creating shadow on itself
directionalLight.shadow.normalBias = 0.02
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('LightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('LightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('LightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('LightZ')

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Activate anti aliasing to avois stairs effect on geometries edges
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Tell the rendere to use physically correct values for lights
renderer.physicallyCorrectLights = true

// Change the output encoding to improve perf on colors
renderer.outputEncoding = THREE.sRGBEncoding

// Set tone mapping properties
renderer.toneMapping = THREE.ReinhardToneMapping

// Set light intensity
renderer.toneMappingExposure = 2

// Optimize shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    'None': THREE.NoToneMapping,
    'Linear': THREE.LinearToneMapping,
    'Reinhard': THREE.ReinhardToneMapping,
    'Cineon': THREE.CineonToneMapping,
    'ACESFilmic': THREE.ACESFilmicToneMapping,
})
.onFinishChange(() => {
    // Convert tonemapping to a number to avoid bug
    renderer.toneMapping = Number(renderer.toneMapping)
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01).name('ToneMappingExposure')

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()