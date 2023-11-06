import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import * as THREE from 'three'

const root = ReactDOM.createRoot(document.querySelector('#root'))

// We create a function that will be triggered when the canvas will be created
const created = ({ gl, scene }) =>
{
    // We can change the backgroudn color with the setClearColor method
    // gl.setClearColor('#ff0000', 1)

    // Or with the scene
    // scene.background = new THREE.Color('#ff0000')
}

root.render(
    <Canvas
        // Activate the shadows 
        shadows={ false }
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ - 4, 3, 6 ]
        } }
        onCreated={ created }
    >
        <Experience />
    </Canvas>
)