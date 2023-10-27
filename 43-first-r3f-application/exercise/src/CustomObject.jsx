import { DoubleSide } from 'three'
import { useEffect, useRef, useMemo } from 'react'

export default function CustomObject()
{
    const geometry = useRef()

    // Create the data for the custom mesh
    const verticesCount = 10 * 3

    // We calculate the positions array only once thanks to useMemo, and not in every render of the component
    const positions = useMemo(() => {
        const positions = new Float32Array(verticesCount * 3)

        // We fill the positions array with random values
        for (let i = 0; i < verticesCount; i++) {
            positions[i] = (Math.random() - 0.5) * 3
        }

        return positions
    }, [])

    // We use useEffect to compute the vertex normal after the first render, because we need the geometry to be created
    useEffect(() =>
    {
        // We calculate the normals to optimise lighting
        geometry.current.computeVertexNormals()
    }, [])

    return <mesh>
        <bufferGeometry ref={ geometry }>
            <bufferAttribute
                attach="attributes-position"
                count={verticesCount}
                itemSize={3}
                array={positions}
            />
        </bufferGeometry>
        <meshStandardMaterial color="red" side={DoubleSide} />
    </mesh>
}