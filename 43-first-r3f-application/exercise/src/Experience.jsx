import { extend, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CustomObject from './CustomObject.jsx'

export default function Experience() {
    const cube = useRef()
    const group = useRef()
    // useThree is a hook that gives us access to the threejs scene, camera and renderer, like the useFrame hook but only once
    const { camera, gl } = useThree()

    // We want to convert the OrbitControls from threejs to a react component
    // We use extend to do that
    extend({ OrbitControls: OrbitControls })


    // useFrame is the tick equivalent of threejs
    // To animate thing, it is better to do it on useFrame, by updating the meshes directly here
    useFrame((state, delta) => {
        /* Delta contains the delta time */
        /* Make the cube rotate, we use the ref, using the delta, so the animation is the same regardless of the framerate  */
        cube.current.rotation.y += delta
        // group.current.rotation.y += delta * 0.5

        // Animate the camera around the scene manually
        /* const angle = state.clock.elapsedTime * 0.3
        state.camera.position.x = Math.sin(angle) * 3
        state.camera.position.z = Math.cos(angle) * 3
        state.camera.lookAt(0, 0, 0) */
    })

    return <>
        {<orbitControls args={ [ camera, gl.domElement ] } />}

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.1 } />
        <ambientLight intensity={ 0.4 } />

        <group ref={ group }>
            <mesh position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh ref={cube} rotation-y={Math.PI * 0.23} position-x={2} scale={1.5}>
                {/* We can put the classic threejs parameters in args prop  */}
                {/* Be careful of not change too much the args of a geometry beacause it needs rebuilding it */}
                <boxGeometry />
                {/* It is better fto use args directly as props */}
                <meshStandardMaterial color="mediumpurple" /* wireframe */ />
            </mesh>
        </group>

        <mesh position-y={-1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        <CustomObject />
    </>
}