import React, {useEffect, useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Splat, GizmoHelper, GizmoViewport, Line} from '@react-three/drei'
import "./styles.css"
import {MeshBVH, computeBoundsTree, disposeBoundsTree, acceleratedRaycast} from "three-mesh-bvh";

import { PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";

let camera = new THREE.PerspectiveCamera (90, 1.5, 0.1, 1000);
camera.position.set(0, -20, 5)
camera.rotation.set(0, 0, 0)

// Add the extension functions
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

function RedBall({ position }) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.025, 16, 16]} />  {/* Small red ball */}
            <meshStandardMaterial color="red" />
        </mesh>
    );
}

function PLYModel({ url, onClick }) {
    const geometry = useLoader(PLYLoader, url);

    useEffect(() => {
            geometry.computeVertexNormals();
            geometry.boundsTree = new MeshBVH(geometry);
        }, [geometry]);

    return (
        <mesh geometry={geometry} visible={false} onClick={onClick}>
            <meshStandardMaterial />
        </mesh>
    );
}

export default function App() {
    const [ballPosition, setBallPosition] = useState(null);

    const handleMeshClick = (event) => {
        // Get click position in world coordinates
        const { point } = event;
        setBallPosition([point.x, point.y, point.z]);
    };


    return (
        <Canvas camera={camera}>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[0, 0, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[10, 0, 0]} decay={0} intensity={Math.PI}/>
            <Splat src="model/point_cloud_0607.splat"/>
            <group rotation={[Math.PI, 0, 0]} >
                <PLYModel url={"model/0607_mesh.ply"} onClick={handleMeshClick}/>
            </group>
            {ballPosition && <RedBall position={ballPosition} />}
            <OrbitControls/>
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white"/>
            </GizmoHelper>
        </Canvas>
    )
}