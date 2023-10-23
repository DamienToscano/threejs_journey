import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
// import * as SPECTOR from 'spectorjs'

/**
 * Spector.js 
 */

// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */

// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Mouse
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
// Flip the texture because it's upside down by default
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding


/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ 
    map: bakedTexture,
 })

 // Pole light material
 const poleLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffe5,
})

debugObject.portalColorStart = '#031f72'
debugObject.portalColorEnd = '#ffffff'

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uTime: { value: 0 },
        uMouseSpeed: { value: 0 },
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) }
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader,
})

gui
    .addColor(debugObject, 'portalColorStart')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })
    
gui
    .addColor(debugObject, 'portalColorEnd')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })


/**
 * Model
 */
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
        const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
        const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')

        bakedMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial

        scene.add(gltf.scene)
    }
)

/**
 * Fireflies
 */

// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount * 1)

for(let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
    positionArray[i * 3 + 1] = Math.random() * 1.5
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    // Add brightness to the fireflies
    blending: THREE.AdditiveBlending,
    // Avoid fireflies to hide each other
    depthWrite: false,
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(1).max(300).step(1).name('firefliesSize')

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

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

    // Update fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

debugObject.clearColor = '#2c2121'
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, 'clearColor').onChange(() =>
{
    renderer.setClearColor(debugObject.clearColor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldMouseX = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update fireflies
    firefliesMaterial.uniforms.uTime.value = elapsedTime

    // Update portal
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Calculate mouse speed
    let speed = 1
    if(mouse.x !== oldMouseX)
    {
        speed = Math.abs(mouse.x - oldMouseX) * 0.01
        oldMouseX = mouse.x
    }
    
    portalLightMaterial.uniforms.uMouseSpeed.value = THREE.MathUtils.lerp(portalLightMaterial.uniforms.uMouseSpeed.value, speed, 0.1)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()