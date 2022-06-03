import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

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
 * Lights
 */
// Omnidirectional lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('AmbientLight Intensity')
// scene.add(ambientLight)

// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Light Intensity')

// One source of light that spreads in every direction
// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// // Change position
// pointLight.position.set(1, - 0.5, 1)
// // Change fade distance
// pointLight.distance = 10
// // Change the way it fade
// pointLight.decay = 2
// gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('PointLight Intensity')
// scene.add(pointLight)

// Parrallel light rays like a sun effect
// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.6)
// scene.add(directionalLight)
// // Set the position of the light, by default it comes from above
// directionalLight.position.set(1, 0.25, 0)

// Like ambiant light but with a color from the sky and a color from the ground
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
// scene.add(hemisphereLight)

// RectAreaLight
// Light a rectangle area of the scene
const rectAreaLight = new THREE.RectAreaLight(0x4c00ff, 2, 3, 3)
// Move it and make it look at the center of the scene
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// SpotLight
// Like a flashlight
// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
// spotLight.position.set(0, 2, 3)
// // To rotate the spotlight, we need to add the spotlight target to the scene
// spotLight.target.position.x = - 0.75
// scene.add(spotLight.target)
// scene.add(spotLight)

// Lights are reakky heavy for performance, so we need to use just a few.
// Juste use the less heavy ones
// Low cost : ambientLight, hemisphereLight
// Medium cost : pointLight, directionalLight
// High cost : spotLight, rectAreaLight

// If we need too many light for a project, we can "Bake" the light in the textures into a 3D software

/**
 * Helpers
 * To help position the lights
 */

// const HemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(HemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// const PointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(PointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// If spotLight target has been moved, we have to manually update the helper
// window.requestAnimationFrame(() =>
// {
//     spotLightHelper.update()
// })

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// Helper can also be added as a child of the light and not the scene
rectAreaLight.add(rectAreaLightHelper)



/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

gui.add(material, 'roughness', 0, 1, 0.01);


// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
    sphere.rotation.y = 0.11 * elapsedTime
    cube.rotation.y = 0.12 * elapsedTime
    torus.rotation.y = 0.13 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.16 * elapsedTime
    torus.rotation.x = 0.17 * elapsedTime

    rectAreaLight.position.x = Math.sin(elapsedTime * 0.5) * 2
    rectAreaLight.position.y = Math.cos(elapsedTime * 0.5) * 2
    rectAreaLight.lookAt(new THREE.Vector3())

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()