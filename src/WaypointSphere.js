import * as THREE from "three";
import React from "react";
import { PivotControls } from '@react-three/drei';

function WaypointSphere({position, quaternion}) {
    return (
        <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={2}
            scale={50}
            fixed={true}
        >
            <group position={position} rotation={quaternion}>
                <mesh>
                    <sphereGeometry args={[0.25, 32, 32]}/>
                    <meshStandardMaterial color="blue" opacity={0.5} transparent={true}/>
                </mesh>
                <arrowHelper
                    args={[
                        new THREE.Vector3(0, 0, -1),
                        new THREE.Vector3(0, 0, 0),
                        2,
                        0x00ff00,
                    ]}
                />
            </group>
        </PivotControls>
    );
}

export default WaypointSphere