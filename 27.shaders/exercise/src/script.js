import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
// We need to configurate bundler/webpack.common.js to import these glsl files

// Shaders are used everywhere on three js
// It's a program return in GLSL
// Sent to the GPU
// Position each vertex of a geometry
// Colorize each visible fragment of that geometry

// We send a lot of data to the shader (Vertices coordinates, Mesh transformations, Camera information, Colors, Textures, Lights, Fog, etc.)
// The GPU process all of this data following the shader instructions

// There are 2 types of shaders
// Vertex Shader : Position each vertex of a geometry
// Fragment Shader: : Colorize each visible fragment of that geometry

// Each verteces use the same vertex program to be created but some data are dynamic -> Attributes

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-french.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

// Get how many vertices we have
const count = geometry.attributes.position.count
// Set an array of random value for each vertex
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}

// Send that random values to the geometry attributes
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
// aRandom -> a for attribute and random for the description

// Material
// const material = new THREE.RawShaderMaterial({
    // In the ShaderMaterial, some values are prepended on the shader code
    const material = new THREE.ShaderMaterial({
    // Shader programm has to be written into backquotes
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    // We can use properties like side, wireframe, opacity
    // but map, color and other ones need to be re written
    side: THREE.DoubleSide,
    // Uniforms params for the shader
    uniforms:
    {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        // Add time value to animate the shader
        uTime: { value: 0 },
        // Send color
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture },
    }
})

// Add frequency to debug panel
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('Frequency X')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('Frequency Y')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
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
camera.position.set(0.25, - 0.25, 1)
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

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()