import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
// We use the class Effect composer to manage psot processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// Get the render pass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// Import the passes we want
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

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
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
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
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
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

    // Update effectComposer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post processing
 */

// We create our own render target to correct antialiasing in it
const renderTarget = new THREE.WebGLRenderTarget(
    // These dimensions are random, they will be update immediately in the update
    800,
    600,
    {
        // This param will reactivate the antialiasing
        // Find the smallest value possible that looks good, because it lower performances
        // And we activate the antialiasing only for screens with a pixel ratio > 1
        // But it is not supported by some browsers versions, so if it is supported, it will be applied, if not it will be ignored
        samples: renderer.getPixelRatio() === 1 ? 2 : 0,
    }
)


const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
// Add a pass
effectComposer.addPass(renderPass)

// Dot screen effect
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)
gui.add(dotScreenPass, 'enabled').name('Dot screen')

// Glitch effect
const glitchPass = new GlitchPass()
glitchPass.goWild = false
glitchPass.enabled = false
effectComposer.addPass(glitchPass)
const glitchFolder = gui.addFolder('Glitch')
glitchFolder.add(glitchPass, 'enabled').name('Active')
glitchFolder.add(glitchPass, 'goWild').name('Wild mode')

// RGB shift shader
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)
gui.add(rgbShiftPass, 'enabled').name('Rgb Shift')

// Unreal bloom pass
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)
const unrealBloomFolder = gui.addFolder('Unreal bloom')
unrealBloomFolder.add(unrealBloomPass, 'enabled').name('Active')
unrealBloomFolder.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
unrealBloomFolder.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
unrealBloomFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

// Tint Pass
const TintShader = {
    uniforms: {
        // The result of the previous pass is automatically added by effectComposer in the tDiffuse uniform
        tDiffuse: { value: null },
        uTint: {  value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        // We get the previous texture
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;

        varying vec2 vUv;

        void main()
        {
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += uTint;
            gl_FragColor = color;
        }
    `
}

const tintPass = new ShaderPass(TintShader)
tintPass.enabled = false
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

const tintFolder = gui.addFolder('Tint')
tintFolder.add(tintPass, 'enabled').name('Active')
tintFolder.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name('Red')
tintFolder.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name('Green')
tintFolder.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name('Blue')

// Displacement pass
const displacementShader = {
    uniforms: {
        // The result of the previous pass is automatically added by effectComposer in the tDiffuse uniform
        tDiffuse: { value: null },
        // Send the texture
        uNormalMap: { value: null },
        uTime: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        // We get the previous texture
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        uniform float uTime;

        varying vec2 vUv;

        void main()
        {
            vec3 normalColor = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1 * sin(uTime) * 0.5;
            vec4 color = texture2D(tDiffuse, newUv);

            // vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            // float lightness = clamp(dot(normalize(normalColor), lightDirection), 0.0, 1.0);
            // color.rgb += lightness * 2.0;
            gl_FragColor = color;
        }
    `
}

const displacementPass = new ShaderPass(displacementShader)
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
displacementPass.material.uniforms.uTime.value = 0
displacementPass.enabled = false
effectComposer.addPass(displacementPass)

const displacementFolder = gui.addFolder('Displacement')
displacementFolder.add(displacementPass, 'enabled').name('Active')


// Pass needed to corect color too dark
// It's important to keep the gamma correction shader at the end of the list of the classic passes
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
gammaCorrectionPass.enabled = true
effectComposer.addPass(gammaCorrectionPass)

// Antialiasing class come at the end
// We will activate the SMAAPass only if the pixel ratio is > 1 and the browser does not support the WebGLRenderTarget method
if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const snaaPass = new SMAAPass()
    snaaPass.enabled = true
    effectComposer.addPass(snaaPass)
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update passes
    displacementPass.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render with effectComposer instead of classic render
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()