import { Float, Html, OrbitControls, Text, TransformControls, PivotControls, MeshReflectorMaterial } from "@react-three/drei"
import { useRef } from "react"

export default function Experience() {

    const cube = useRef()
    const sphere = useRef()

    return <>

        {/* makeDefault allow other helpers like transformControls to desactivate it when we move the controls */}
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        {/* Pivot controls is a transformControls that looks better */}
        {/* Anchor arg to position it on the sphere */}
        {/* dephTest false to see it even if it is inside the sphere */}
        <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={4}
            axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
            scale={2}
        >
            <mesh ref={sphere} position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html
                    position={[1, 1, 0]}
                    /* Add a class to the html element */
                    wrapperClass="label"
                    center
                    /* Apply perspective */
                    distanceFactor={6}
                    /* Set what objects can occlude it */
                    occlude={[sphere, cube]}
                >
                    That's a sphere 👍
                </Html>
            </mesh>
        </PivotControls>

        {/* We use the transforms controls on the cube */}
        <mesh ref={cube} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        {/* We seoperate the mesh and the transform controls and re associated them, as a solution to position the gizmo on the cube */}
        <TransformControls object={cube} mode="translate" />

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial
                resolution={ 512 }
                blur={ [ 1000, 1000 ] }
                mixBlur={ 1 }
                mirror={ 0.7 }
                color={ 'greenyellow' }
            />
        </mesh>

        <Float
            speed={ 5 }
            floatIntensity={ 2 }
        >
            <Text
                /* The font can be changed, by default it is roboto */
                font="./bangers-v20-latin-regular.woff"
                fontSize={1}
                color={'salmon'}
                position-y={2}
                /* Manage line breaks */
                maxWidth={5}
                textAlign="center"
            >
                I LOVE R3F
                {/* <meshNormalMaterial /> */}
            </Text>
        </Float>
    </>
}