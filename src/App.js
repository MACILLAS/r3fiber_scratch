import React, {useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import DirectionalBox from './components/three/DirectionalBox'
import DroneScene from "./components/three/EgoDrone";
import "./styles.css"

import { meshData } from './constants/meshData';

function MeshArray({data}) {
    const annotRefs = useRef([]);

    const handleStateChange = (state) => {
        console.log(`State change detected in box ${state.name}:`, state);
    };

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
                    _description={item.description}
                    onStateChange={handleStateChange}
                />
            ))}
        </>
    );
}

export default function App() {
    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <MeshArray data={meshData} />
            <DroneScene />
            <OrbitControls/>
        </Canvas>
    )
}