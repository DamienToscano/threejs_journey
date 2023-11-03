import { OrbitControls } from '@react-three/drei'
/* This is the debug bar */
import { button, useControls } from 'leva'
import { Perf } from 'r3f-perf'

export default function Experience() {
    // Instanciate the controls debugbar
    const { perfVisible } = useControls({
        perfVisible: false,
    })

    const { position, color, visible } = useControls('sphere', {
        position:
        {
            value: { x: -2, y: 0 },
            step: 0.01,
            /* Fix the joystick inversion bug */
            joystick: 'invertY'
        },
        color: '#b73b3b',
        visible: true,
        myInterval:
        {
            min: 0,
            max: 10,
            value: [0, 10],
        },
        clickMe: button(() => alert('clicked!')),
        choices: { options: ['a', 'b', 'c'] }
    })

    const { scale } = useControls('cube', {
        scale: {
            value: 1.5,
            min: 0,
            max: 10,
            step: 0.1
        }
    })

    // On each change of the debugbar, the component will re-render

    return <>

        {/* Stats bar */}
        {/* Stats bar can be controls in the debug bar */}
        {perfVisible && <Perf position="top-left" />}

        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <mesh position={[position.x, position.y, 0]} visible={visible}>
            <sphereGeometry />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>


        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>
    </>
}