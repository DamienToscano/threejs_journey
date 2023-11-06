import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Stage, Lightformer, Environment, Sky, ContactShadows, RandomizedLight, AccumulativeShadows, SoftShadows, BakeShadows, useHelper, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

export default function Experience() {
    const cube = useRef()
    const directionalLight = useRef()

    const { color, opacity, blur } = useControls('contact shadows', {
        color: '#4b2709',
        opacity: { value: 0.4, min: 0, max: 1 },
        blur: { value: 2.8, min: 0, max: 10 },
    })

    const { sunPosition } = useControls('sky', {
        /* To calculate the position of the sun, it is better to use Spherical coordinates, convert to Vector3 and use the setFromSpherical method, but it is more complicated than the method below */
        sunPosition: { value: [1, 2, 3] }
    })

    const { envMapIntensity, ennvMapHeight, ennvMapRadius, ennvMapScale } = useControls('env', {
        envMapIntensity: { value: 3.5, min: 0, max: 12 },
        ennvMapHeight: { value: 7, min: 0, max: 100 },
        ennvMapRadius: { value: 50, min: 10, max: 1000 },
        ennvMapScale: { value: 100, min: 10, max: 1000 },
    })

    // We can use the useHelper hook to display a helper for a light
    // useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    useFrame((state, delta) => {
        // const time = state.clock.elapsedTime
        cube.current.rotation.y += delta * 0.2
        // cube.current.position.x = 2 + Math.sin(time)
    })

    return <>

        {/* Set up environment maps */}
        {/* Environment can bu used to light the scene */}
        {/* The background property is used to display the env map as a background in the scene  */}
        {/* The ground property is used to display the env map as a ground in the scene */}
        {/* <Environment
            // background
            // ground={ {
            //     height: ennvMapHeight,
            //     radius: ennvMapRadius,
            //     scale: ennvMapScale,
            // } }
            // Exemple with an envmap cube
            // files={ [
            //     './environmentMaps/2/px.jpg',
            //     './environmentMaps/2/nx.jpg',
            //     './environmentMaps/2/py.jpg',
            //     './environmentMaps/2/ny.jpg',
            //     './environmentMaps/2/pz.jpg',
            //     './environmentMaps/2/nz.jpg',
            // ] }
            // Example with an envmap hdr
            // HDR are better for lighting the scene
            // files={ './environmentMaps/the_sky_is_on_fire_2k.hdr' }
            // The drei component have already links to polyhaven hdr availablaes in the preset prop -> https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts
            // preset='sunset'
            // If we don't use the env map as a background, we can set a really low resolution, for performances issues
            // resolution={32}
            // The environment map intensity as to be setup on each mesh
        > */}
        {/* <color args={['#000000']} attach="background" /> */}
        {/* We can twek tha env map by creative mesh in it */}
        {/* <mesh position-z={-5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color={[5, 0, 0]} />
            </mesh> */}
        {/* The LightFormer allow to make the same thing as the mesh above */}
        {/* <Lightformer
                position-z={-5}
                scale={10}
                color="red"
                intensity={5}
                // We can use it to make the light shape reflect on meshes -> https://codesandbox.io/s/lwo219?file=/src/App.js:917-1016
                form='ring'
            /> */}
        {/* </Environment> */}

        {/* BakeShadows allow to render the shadow once, and fix it on other frames, it's good for performances, but we need a static scene */}
        {/* <BakeShadows /> */}
        {/* SoftShadow make it sharp when it is near the object an blur when it is far */}
        {/* <SoftShadows size={ 25 } samples={ 10 } focus={ 0 } /> */}

        {/* Color for background can be instanciated with r3f color too */}
        {/* And we tell the color to attach to the background property of its parent, the scene */}
        {/* <color args={['ivory']} attach="background" /> */}

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <directionalLight
            ref={directionalLight}
            position={ sunPosition }
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-top={5}
            shadow-camera-right={5}
            shadow-camera-bottom={- 5}
            shadow-camera-left={- 5}
            shadow-camera-near={1}
            shadow-camera-far={10}
        /> */}

        {/* <AccumulativeShadows
            position={[0, - 0.99, 0]}
            scale={10}
            color="#316d39"
            opacity={ 0.8 }
            // How many renders to do
            // Set it to infinity if the scene is moving
            frames={ Infinity }
            // Temporal will delay the renders on time, and not all on one render, to avoid freezing the app
            temporal
            // Blend more shadow maps to avoid the jumpy effect
            blend={ 100 }
        > */}
        {/* In the accumulative shadows, we have to set a proper light, the randomized light will change on each render, great for the accumulative shadow */}
        {/* <RandomizedLight
                amount={ 8 }
                radius={ 1 }
                ambient={ 0.5 }
                position={ [ 1, 2, 3 ] }
                bias={ 0.001 }
            /> */}
        {/* </AccumulativeShadows> */}

        {/* <ambientLight intensity={0.5} /> */}

        {/* <Sky sunPosition={ sunPosition } /> */}

        {/* ContactShadows is great for a simple objects but bad for perfs for more complex scenes */}
        {/* <ContactShadows
            position={[0, 0, 0]}
            scale={10}
            resolution={512}
            far={5}
            color={color}
            opacity={opacity}
            blur={blur}
            // frames allow to bake the shadows, great for performances
            frames={1}
        /> */}

        {/* <mesh castShadow position-y={1} position-x={- 2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity} />
        </mesh> */}

        {/* <mesh castShadow ref={cube} position-y={1} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
        </mesh> */}

        {/* <mesh position-y={0} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity} />
        </mesh> */}

        <Stage
            shadows={ {
                type: 'contact',
                opacity: 0.2,
                blur: 3
            } }
            /* Preset of the env map */
            environment='sunset'
            /* Preset of the lights */
            preset='portrait'
            intensity={ 1.1 }
        >
            <mesh castShadow position-y={1} position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity} />
            </mesh>

            <mesh castShadow ref={cube} position-y={1} position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
            </mesh>
        </Stage>
    </>
}