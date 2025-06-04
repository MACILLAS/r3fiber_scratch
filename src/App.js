import { Canvas, useThree } from '@react-three/fiber'
import React, { useEffect } from 'react'
import { OrbitControls, Splat } from '@react-three/drei'
import WaypointSpawner from "./WaypointSpawner"
import "./styles.css"
import * as THREE from "three"

function Scene() {
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
                makeDefault
                target={camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()))}
            />
            <WaypointSpawner sceneCamera={camera}/>
        </>
    )
}

export default function App() {
    return (
        <Canvas>
            <Scene />
        </Canvas>
    )
}