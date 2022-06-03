import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
// particles package https://www.kenney.nl/assets/particle-pack
const textureLoader = new THREE.TextureLoader()
const particuleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * particles
 */
// A particule need a geometry, a material and points

// Geometry
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32)
const count = 10000

// Define positions of the particles
const positions = new Float32Array(count * 3) // For x, y and z
// Define colors of the particles
const colors = new Float32Array(count * 3) // For r, g and b

// Set them randomly
for (let index = 0; index < positions.length; index++) {
    positions[index] = (Math.random() - 0.5) * 10
    colors[index] = Math.random()
    
}

// Set the attribute for the positions
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// Set the attributes for the colors
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// particles background can hide some particles behind them, even with alphaMap and transparent

// There are several techniques to counter that, regarding the project specificities

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    // To create perspective
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particuleTexture,
})

// One solution is alphaTest, which tell the GPU to not render anything when we have nothing to render instead of render transparent pixels
// It is better, but the edge of the particule is still hiding ones below
// particlesMaterial.alphaTest = 0.001

// Another solution is desactive depthTest. Because depthTest assume which pixels to render or not according to the depth of the pixel in the scene. By desactivating it, we can tell to render all the pixels.
// But it can create bugs if we have other objects of different color on the scene. The particles behind the objects will be visible.
// particlesMaterial.depthTest = false

// Another solution is use the depthWrite. WebGL store the depth of what's already been drawn in the depth buffer. With that config, we tell three js not to write on this buffer.
particlesMaterial.depthWrite = false

// Another solution is Blending. Webgl add the color of the pixel with the color of the pixel already in the buffer. It change the color of element superposing themselfs. It can make great resultsn but can have impact on perfomances
particlesMaterial.blending = THREE.AdditiveBlending

// Enable colors attribute
particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Animate the particles
 */
// In the tick function

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
camera.position.z = 3
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

    // Update particles all together
    // particles.rotation.y = elapsedTime * 0.2

    // But we can update each particule individually
    // We can update particlesGeometry.attributes.position.array, which contains the positions of the particles
    // But it is not a good idea
    for (let i = 0; i < count; i++) {
        // Subindex for each 3 values of particules
        const i3 = i * 3
        // i3 to get x property
        // i3 + 1 to get y property
        // i3 + 2 to get z property

        // Update y positions
        // To have a wave effect, we will offset the y animation according to the x position
        const x = positions[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)

        // This method works, but it is demands high perfomances
        // The best way to do this is to build our own shader, see that in another chapter !!!!
    }

    // We need to tell threejs the positions need to be updated
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()