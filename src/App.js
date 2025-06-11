import React, {useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Splat } from '@react-three/drei'
import * as THREE from 'three'
import DirectionalBox from './components/three/DirectionalBox'
import DroneScene from "./components/three/EgoDrone";
import CameraOrb from "./CameraOrb";
import WaypointSpawner from "./WaypointSpawner"; 
import "./styles.css"

import { meshData } from './constants/meshData_0607';
import { cameraData } from './constants/cameraData_0607';

// Keyboard status display component
function KeyboardDisplay({ keysPressed }) {
    // Filter only camera control keys
    const cameraKeys = ['KeyQ', 'KeyE', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyI', 'KeyK', 'KeyJ', 'KeyL', 'KeyR'];
    const pressedCameraKeys = Object.keys(keysPressed).filter(key => 
        keysPressed[key] && cameraKeys.includes(key)
    );

    const keyLabels = {
        'KeyQ': 'Q (Down)',
        'KeyE': 'E (Up)', 
        'KeyA': 'A (Left)',
        'KeyD': 'D (Right)',
        'KeyW': 'W (Forward)',
        'KeyS': 'S (Backward)',
        'KeyI': 'I (Pitch Up)',
        'KeyK': 'K (Pitch Down)',
        'KeyJ': 'J (Yaw Left)',
        'KeyL': 'L (Yaw Right)',
        'KeyR': 'R (Reset)'
    };

    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '12px',
            minWidth: '200px'
        }}>
            <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                Camera Controls:
            </div>
            {pressedCameraKeys.length > 0 ? (
                pressedCameraKeys.map(key => (
                    <div key={key} style={{ 
                        color: '#00ff00', 
                        fontWeight: 'bold',
                        marginBottom: '2px'
                    }}>
                        ● {keyLabels[key]}
                    </div>
                ))
            ) : (
                <div style={{ color: '#888' }}>No keys pressed</div>
            )}
            <div style={{ marginTop: '10px', fontSize: '10px', color: '#aaa' }}>
                Move: WASD+QE | Rotate: IJKL | Reset: R
            </div>
        </div>
    );
}

// Keyboard control component
function KeyboardControls({ onKeysChange }) {
    const { camera } = useThree();
    const [keysPressed, setKeysPressed] = useState({});

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Exclude keys used by WaypointSpawner
            if (!['Space', 'Equal', 'Exclamation'].includes(event.code) && event.key !== '+' && event.key !== '!') {
                setKeysPressed((prevKeys) => {
                    const newKeys = { ...prevKeys, [event.code]: true };
                    onKeysChange(newKeys); // Pass key state to parent component
                    return newKeys;
                });
            }
        };

        const handleKeyUp = (event) => {
            if (!['Space', 'Equal', 'Exclamation'].includes(event.code) && event.key !== '+' && event.key !== '!') {
                setKeysPressed((prevKeys) => {
                    const newKeys = { ...prevKeys, [event.code]: false };
                    onKeysChange(newKeys); // Pass key state to parent component
                    return newKeys;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [onKeysChange]);

    useFrame((state, delta) => {
        if (!keysPressed) return;

        const moveSpeed = delta * 5;
        const rotateSpeed = delta * 1;

        // Camera movement based on local coordinate system (original method)
        if (keysPressed['KeyQ']) camera.translateY(-moveSpeed);
        if (keysPressed['KeyE']) camera.translateY(moveSpeed);
        if (keysPressed['KeyA']) camera.translateX(-moveSpeed);
        if (keysPressed['KeyD']) camera.translateX(moveSpeed);
        if (keysPressed['KeyW']) camera.translateZ(-moveSpeed);
        if (keysPressed['KeyS']) camera.translateZ(moveSpeed);

        // Precise rotation (original method)
        const effectiveRotationDelta = rotateSpeed * 0.1;
        
        // Calculate local axes
        const localXAxis = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(camera.quaternion)
            .normalize();
        const localYAxis = new THREE.Vector3(0, 1, 0)
            .applyQuaternion(camera.quaternion)
            .normalize();

        // Pitch (up/down)
        if (keysPressed['KeyI']) {
            const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(
                localXAxis, effectiveRotationDelta
            );
            camera.quaternion.multiplyQuaternions(pitchQuaternion, camera.quaternion);
        }
        if (keysPressed['KeyK']) {
            const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(
                localXAxis, -effectiveRotationDelta
            );
            camera.quaternion.multiplyQuaternions(pitchQuaternion, camera.quaternion);
        }

        // Yaw (left/right)
        if (keysPressed['KeyJ']) {
            const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(
                localYAxis, effectiveRotationDelta
            );
            camera.quaternion.multiplyQuaternions(yawQuaternion, camera.quaternion);
        }
        if (keysPressed['KeyL']) {
            const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(
                localYAxis, -effectiveRotationDelta
            );
            camera.quaternion.multiplyQuaternions(yawQuaternion, camera.quaternion);
        }

        camera.quaternion.normalize();

        // Camera reset
        if (keysPressed['KeyR']) {
            camera.position.set(0, 0, 5);
            camera.rotation.set(0, 0, 0);
        }
    });

    return null;
}

function Scene({ onKeysChange }) {
    const { camera } = useThree()

    useEffect(() => {
        // COLMAP position - transform coordinate system
        const position = new THREE.Vector3(
            1.4133970198205512,
            3.6500249679628887, // negate
            0.371647995782348 //negate
        )

        camera.position.copy(position)

        // COLMAP quaternion (xyzw format)
        const quaternionArray = [
            0.007192137254854774, // use the original colmap
            0.8397260191550984,
            0.4796326032643834,
            0.25448192824141613
        ]

        camera.quaternion.set(quaternionArray[0], quaternionArray[1], quaternionArray[2], quaternionArray[3])

        camera.updateProjectionMatrix()

    }, [camera])

    return (
        <>
            <ambientLight intensity={Math.PI / 2}/>
            <Splat src="model/0318_3D.splat"/>
            <OrbitControls
                enabled={false}  // Completely disable OrbitControls
            />
            <WaypointSpawner sceneCamera={camera}/>
            <KeyboardControls onKeysChange={onKeysChange} />
        </>
    )
}

export default function App() {
    const [currentKeys, setCurrentKeys] = useState({});

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <KeyboardDisplay keysPressed={currentKeys} />
            <Canvas style={{ width: '100%', height: '100%' }}>
                <Scene onKeysChange={setCurrentKeys} />
            </Canvas>
        </div>
    )
}