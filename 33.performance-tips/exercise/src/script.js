import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'
// Buffer geometry utils to merge geometry and reduce draw calls
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Perofmance goal, have at least 60 fps

// https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk
// Spector JS can monitor draw calls of a project.

// More tips : https://discoverthreejs.com/tips-and-tricks/

/**
 * Stats
 * 
 * To test the performance, we can unlock the framerate limit of chrome for test
 */
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const displacementTexture = textureLoader.load('/textures/displacementMap.png')

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
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Tell the render to use the best GPU possible if we have framerate issues, it can be usefull
    powerPreference: 'high-performance',
    // Use antialias if not usefull
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Test meshes
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
)
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(- 5, 0, 0)
// scene.add(cube)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
// scene.add(torusKnot)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
sphere.position.set(5, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
// scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0, - 2, 0)
floor.rotation.x = - Math.PI * 0.5
floor.castShadow = true
floor.receiveShadow = true
// scene.add(floor)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update stats.js
    stats.begin()

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    stats.end();
}

tick()

/**
 * Tips
 */

// // Tip 4
// Analysing the renderer can be usefull to see performances
// console.log(renderer.info)

// Tip 5: Optimize the most possible the js code, especially in the tick function

// // Tip 6
// Dispose and remove things when you don't need it anymore
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// Tip 7
// Avoid lights when it is possible

// Tip 8
// Avoid adding or removing lights in the scene. Just keep in stable

// Tip 9
// Avoid shadows too

// // Tip 10
// If shadows needed, optimise shadowmap
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// // Tip 11
// Use cast shadow and receive shadow wisely. Only when necessary
// cube.castShadow = true
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// // Tip 12
// Deactivate shadow auto update if the shadow of the scene does not move
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// Tip 13
// Resize textures and limit the resolution

// Tip 14   
// When resizing textures, keep in mind to keep a power of 2 resolution

// Tip 15
// Use the right format for textures, and the right compression depending on the needs
// If possible use basis format https://github.com/BinomialLLC/basis_universal
// Very powerfull compression, but can have low quality depending on the image

// Tip 17
// Do not update vertices on geometries. Especially in the tick function

// // Tip 18
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()

// for(let i = 0; i < 50; i++)
// {
    
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 19

// Merge geometries
// const geometries = []

// for(let i = 0; i < 50; i++)
// {
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

//     geometry.rotateX(Math.random() * Math.PI * 2)
//     geometry.rotateY(Math.random() * Math.PI * 2)

//     geometry.translate(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )

//     geometries.push(geometry)
    
// }

// // Create one geometry containing all the geometries
// const mergeGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)

// const material = new THREE.MeshNormalMaterial()
    
// const mesh = new THREE.Mesh(mergeGeometry, material)

// scene.add(mesh)

// // Tip 20
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()
    
// for(let i = 0; i < 50; i++)
// {

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// Tip 21 ->  Avoid really realistic heavy materials if not needed

// // Tip 22
// Use instanced meshes. If we can't merge geometries because we need to move mesh individually
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// const material = new THREE.MeshNormalMaterial()

// // Third param is the number of instances
// const mesh = new THREE.InstancedMesh(geometry, material, 50)
// // If you intend to change these matrices in the tick function, activate this option
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
// scene.add(mesh)
    
// for(let i = 0; i < 50; i++)
// {
//     // Create a position
//     const position = new THREE.Vector3(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )

//     // Create a quaternion
//     const quaternion = new THREE.Quaternion()
//     quaternion.setFromEuler(new THREE.Euler(
//         (Math.random() - 0.5) * Math.PI * 2,
//         (Math.random() - 0.5) * Math.PI * 2
//     ))

//     // Create a matrix abd transform it
//     const matrix = new THREE.Matrix4()
//     matrix.makeRotationFromQuaternion(quaternion)
//     matrix.setPosition(position)


//     // Set it to the mesh
//     mesh.setMatrixAt(i, matrix)   
// }

// Tip 23
// Try to use low poly models

// Tip 24
// If you have a complex scene, use the draco compression

// Tip 25
// GZIP -> Compression on the server size
// Usually servers don't apply gzip on .glb, .gltf, .obj. So it is better to activate gzip on that files

// Tip 26
// Cameras
// If you reduce the field of view, there will be less objects to render
// Move the near and far planes too

// // Tip 29
// Cap the pixel ratio
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tip 30
// Power preferences

// Post processing
// Limit passes, merge them if possible

// // Tip 31, 32, 34 and 35
// Avoid if statements in the shaders, they are very bad for performances
// Textures are more performant than perlin noise to generate maps, ...
// Do the more calculations possible in the vertex shader
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new THREE.ShaderMaterial({
    // Setting the shader precision : lowp, mediump, highp
    precision: 'lowp',
    uniforms:
    {
        uDisplacementTexture: { value: displacementTexture },
        // uDisplacementStrength: { value: 1.5 }
    },
    defines:
    {
        // Define is better for performances than uniforms. But we can't tweek or animate it
        uDisplacementStrength: 1.5,
    },
    vertexShader: `
        uniform sampler2D uDisplacementTexture;
        // uniform float uDisplacementStrength;

        varying vec2 vUv;
        varying vec3 vColor;

        void main()
        {
            // Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;

            modelPosition.y += clamp(elevation, 0.5, 1.0) * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            // Color
            float colorElevation = max(elevation, 0.25);

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 color = mix(depthColor, surfaceColor, colorElevation);

            vColor = color;
        }
    `,
    fragmentShader: `     
        varying vec3 vColor;

        void main()
        {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `
})

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)