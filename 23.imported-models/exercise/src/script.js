import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Get the loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// Get the Draco loader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

/**
 * Lesson
 */
// We have many formats for the models -> https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics
// Weight
// Complexity of data inside
// Opensource or not
// Binary files
// Ascii files
// ...

// Popular formats
// OBJ
// FBX
// STL
// PLY
// COLLADA
// 3DS
// GLTF

// One format is becoming a standard and should cover all our need -> The GLTF
// Gltf is for realistic renders
// GL Transmission Format
// .gltf contains a json of data
// .bin contains the binary data of the geometry
// .png contains the texture of our duck
// When we load the gltf file, the other ones will be loaded automatically by the loader. There are references to the other files in the gltf file

// gltf-binary : We also can wrap all this in one .glb binary file. It's easier to load, but we can't changes things
// gltf-Draco : Like classic gltf but with the draco compression, so it is lighter
// gltf-embedded : Like classic gltf but with all in one file, but it can be read

// We can find models to test directly in the GLTF repo https://github.com/KhronosGroup/glTF-Sample-Models

// For DRACO, get the draco folder from node_modules/three/examples/js/libs/draco/ and paste it in our static folder

// When to use the draco compression
// If the model is heavy, it is ok to use DRACO
// If the model is light, it is better to use the standard format, because DRACO need to be loaded too.
// DRACO can freeze on some models

// To test 3D models, we can drag and drop here https://threejs.org/editor/

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
// Instantiate the DRACO Loader
const dracoLoader = new DRACOLoader()
// Set the decoder path for a more performant decoding
dracoLoader.setDecoderPath('/draco/')
// Tell the gltf loader to use our DRACO loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
// Duck
/* gltfLoader.load(
    './models/Duck/glTF-Draco/Duck.gltf',
    (gltf) =>
    {
        // Add the model to the scene
        scene.add(gltf.scene.children[0])
    }
) */
// Helmet
gltfLoader.load(
    './models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        console.log(gltf)
        // Add the model to the scene
        // For of will bug here, we have to put data in a new array first
        // const children = [...gltf.scene.children]
        // // And loop on it
        // for(const child of children)
        // {
        //     scene.add(child)
        // }

        // We can also add all the scene
        scene.add(gltf.scene)
    }
)
// Fox
let mixer = null
/* gltfLoader.load(
    './models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        // We need a mixer to play the animations
        // We need to tell the mixer to update itself on the tick function
        mixer = new THREE.AnimationMixer(gltf.scene)
        // Get the action
        const action = mixer.clipAction(gltf.animations[1])
        // Play the action
        action.play()
        // Add the model to the scene
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    }
) */

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer !== null) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()