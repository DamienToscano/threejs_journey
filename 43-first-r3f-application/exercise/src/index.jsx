import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas
        gl={ {
            // Here a can setup antialias, toneMapping,  outputColorEncoding, alpha ...
        } }
        /* If we want an orthographic camera */
        /* orthographic */
        camera={{
            position: [3, 2, 6],
            fov: 45,
            near: 0.1,
            far: 200,
            /* zoom is for orthographic camera */
            /* zoom: 100 */
        }}>
        <Experience />
    </Canvas>
)