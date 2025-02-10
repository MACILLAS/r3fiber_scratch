import React, {useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {OrbitControls, Splat, GizmoHelper, GizmoViewport, Line} from '@react-three/drei'
import DirectionalBox from './components/three/DirectionalBox'
import DroneScene from "./components/three/EgoDrone";
import CameraOrb from "./CameraOrb";
import WaypointSphere from "./WaypointSphere";
import "./styles.css"

import { meshData_0527 } from './constants/meshData_0527';
import { cameraData_0527 } from './constants/cameraData_0527';
import * as THREE from "three";

let camera = new THREE.PerspectiveCamera (90, 1.5, 0.1, 1000);
camera.position.set(-8.591, 2.577, -350.33)
camera.rotation.set(2.107, -0.02933, -1.9534)

function WaypointSpawner() {
    const [spheres, setSpheres] = useState([]); // Store the spawned spheres

    const handleKeyDown = (event) => {
        if (event.key === "+") {
            // Get the camera's position and quaternion (orientation)
            const position = camera.position.clone();
            const quaternion = camera.rotation.clone();

            // Add a new sphere with the current position and orientation of the camera
            setSpheres((prev) => [...prev, { position, quaternion }]);
        }
    };

    // Attach the event listener
    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Extract positions for the line
    const linePoints = spheres.map((sphere) => [
        sphere.position.x,
        sphere.position.y,
        sphere.position.z,
    ]);

    return (
        <>
            {spheres.map((sphere, index) => (
                <WaypointSphere
                    key={index}
                    position={[sphere.position.x, sphere.position.y, sphere.position.z]}
                    quaternion={sphere.quaternion}
                />
            ))}

            {/* Line connecting the spheres */}
            {linePoints.length > 1 && (
                <mesh>
                    <Line
                        points={linePoints} // Array of points [[x1, y1, z1], [x2, y2, z2], ...]
                        color="blue" // Line color
                        lineWidth={2} // Line width
                    />
                    <meshStandardMaterial color="blue" opacity={0.5} transparent={true}/>
                </mesh>
            )}
        </>
    );
}


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
    return (
        <Canvas camera={camera}>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 400]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[10, 0, 400]} decay={0} intensity={Math.PI}/>
            <MeshArray data={meshData_0527}/>
            <Splat src="model/point_cloud_0527_GPS.splat"/>
            <DroneScene/>
            <WaypointSpawner/>
            <OrbitControls target={[0, 0, -320]}/>
            <group rotation={[Math.PI, 0, 0]}>
                <CameraArray data={cameraData_0527}/>
            </group>
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white"/>
            </GizmoHelper>
        </Canvas>
    )
}