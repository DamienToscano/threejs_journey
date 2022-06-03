import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

gui.close()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Textures
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
// Choose NearestFilter to have the separated shades effects, and no mixes between gradient colors
gradientTexture.magFilter = THREE.NearestFilter

const particlesTexture = textureLoader.load('textures/particles/9.png')

// Material 
// To add more gradient to a meshToonMaterial, you need to add texture to construct gradient.
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture,
})

// Distance between objects
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotBufferGeometry(0.8, 0.35, 100, 16),
    material
)

// We have to place the objects on the scene
mesh1.position.y = - objectsDistance * 0
mesh1.position.x = 2
mesh2.position.y = - objectsDistance * 1
mesh2.position.x = - 2
mesh3.position.y = - objectsDistance * 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */

const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++)
{
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    size: 0.2,
    transparent: true,
    alphaMap: particlesTexture,
    depthWrite: false
})

const particules = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particules)

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
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

// Group
// We create a group for the camera to fix parallax and scroll conflict
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // To make the canvas transparent
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Scroll
 */
let scrollY = window.scrollY

// We want to make an object rotation when we arrive in the section
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY

    // Check when we see a new section and round the value
    const newSection = Math.round(scrollY / sizes.height)

    // Check when we change section
    if (newSection !== currentSection)
    {
        currentSection = newSection

        // Animate the object in the current section with GSAP
        // We can have a conflict with the rotation animation in tick function
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=6',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

// Update cursor values with the mouse movements
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Calculate the delta time for having the same animation according to the framerate
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    // When we scroll the value of the viewport, we should move the camera to the next object
    camera.position.y = (- scrollY / sizes.height) * objectsDistance

    // Adding parallax
    const parallaxX = cursor.x
    const parallaxY =  - cursor.y
    // Move the camera group to avoid conflicts with the camera move Y on scroll
    // We will ease the camera movement by adding a 10th of the distance between current position and destination on each frame
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

    // Animate the objects
    for ( const mesh of sectionMeshes ) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()