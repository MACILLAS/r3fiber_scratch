import * as THREE from "three";
import React from "react";

function WaypointSphere({position, quaternion}) {
    return (
        <group position={position} rotation={quaternion}>
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]}/>
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
    );
}

export default WaypointSphere