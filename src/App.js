import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import DirectionalBox from './DirectionalBox'
import "./styles.css"

function MeshArray({data}) {
    const annotRefs = useRef([]);

    useEffect(() => {
        // Log positions of all names of the Directional Boxes when they mount
        console.log("Name of all DirectionalBoxes:");
        annotRefs.current.forEach((ref, index) => {
            if (ref) {
                console.log(`Box ${index + 1}:`, ref.name);
            }
        });
    }, []);

    return (
        <>
            {data.map((item, index) => (
                <DirectionalBox
                    ref={(el) => (annotRefs.current[index] = el)}
                    position={item.position}
                    rotation={item.rotation}
                    size={item.size}
                    name={item.id}
                    _description={item.description} />
            ))}
        </>
    );
}

export default function App() {
    const meshData = [
        { id: 55, position: [-5, 0, 0], rotation: [-Math.PI / 4, 0, 0], size: [1, 0.5, 4], description: "Antenna Object 55"},
        { id: 66, position: [0, 0, 0], rotation: [0, 0, 0], size: [1, 0.5, 4], description: "Antenna Object 66"},
        { id: 77, position: [5, 0, 0], rotation: [Math.PI/4, 0, 0], size: [1, 0.5, 4], description: "Antenna Object 77"},
    ];

    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <MeshArray data={meshData} />
            <OrbitControls/>
        </Canvas>
    )
}