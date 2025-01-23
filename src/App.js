import React, {useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {OrbitControls, Splat, GizmoHelper, GizmoViewport} from '@react-three/drei'
import DirectionalBox from './components/three/DirectionalBox'
import DroneScene from "./components/three/EgoDrone";
import CameraOrb from "./CameraOrb";
import "./styles.css"

import { meshData_0527 } from './constants/meshData_0527';
import { cameraData_0527 } from './constants/cameraData_0527';
import * as THREE from "three";

function CameraArray({data}) {
    const camRefs = useRef([]);

    const handleStateChange = (state) => {
        console.log(`State change detected in box ${state.number}:`, state);
    }

    return (
        <>
            {data.map((item, index) => (
                <CameraOrb
                    ref={(el) => (camRefs.current[index] = el)}
                    position={item.position}
                    quaternion={item.quaternion}
                    number={item.id}
                    onStateChange={handleStateChange}
                />
            ))}
        </>
    );
}

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
    let camera = new THREE.PerspectiveCamera (90, 1.5, 0.1, 1000);
    camera.position.set(-8.591, 2.577, -350.33)
    camera.rotation.set(2.107, -0.02933, -1.9534)
    return (
        <Canvas camera={camera}>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 400]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[10, 0, 400]} decay={0} intensity={Math.PI}/>
            <MeshArray data={meshData_0527}/>
            <Splat src="model/point_cloud_0527_GPS.splat" />
            <DroneScene/>
            <OrbitControls target={[0, 0, -320]}/>
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white" />
            </GizmoHelper>
        </Canvas>
    )
}