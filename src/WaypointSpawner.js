import React, { useState } from 'react'
import {PivotControls, Line, useGLTF} from '@react-three/drei'
import * as THREE from "three";
import { socket } from "./socket";

// Use environment variables or PUBLIC_URL at build time
const DRONE_MODEL_PATH = process.env.PUBLIC_URL + "/model/drone_sample_centered_aboutface.glb";

function WaypointSpawner({ sceneCamera }) {
    const [spheres, setSpheres] = useState([]);

    const { scene: droneScene } = useGLTF(DRONE_MODEL_PATH)

    const handleKeyDown = (event) => {
        if (event.key === "+") {
            const position = sceneCamera.position.clone();
            // const euler = sceneCamera.rotation.clone();
            // euler.y += Math.PI;
            // const quaternion = new THREE.Quaternion().setFromEuler(euler);
            console.log(sceneCamera.position);
            console.log(sceneCamera.quaternion);
            // Get camera's local directions
            const forward = new THREE.Vector3(0, 0, -1);
            const up = new THREE.Vector3(0, 1, 0);

            forward.applyQuaternion(sceneCamera.quaternion);
            up.applyQuaternion(sceneCamera.quaternion);

            // Create rotation matrix from camera's orientation
            const matrix = new THREE.Matrix4();
            matrix.lookAt(
                new THREE.Vector3(0, 0, 0),
                forward,
                up
            );

            // Convert to quaternion and flip 180 degrees around Y
            const quaternion = new THREE.Quaternion();
            quaternion.setFromRotationMatrix(matrix);
            quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI));

            setSpheres(prev => [...prev, {
                position,
                quaternion
            }]);
        }
        if (event.code === "Space") {
            spheres.forEach((sphere, index) => {
                const sphere_quat = sphere.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI));
                //const sphere_quat = sphere.quaternion.clone();

                console.log(`Waypoint ${index}:`, {
                    position: {
                        x: sphere.position.x.toFixed(3),
                        y: sphere.position.y.toFixed(3),
                        z: sphere.position.z.toFixed(3)
                    },
                    rotation: {
                        x: sphere_quat.x.toFixed(3),
                        y: sphere_quat.y.toFixed(3),
                        z: sphere_quat.z.toFixed(3),
                        w: sphere_quat.w.toFixed(3)
                    }
                });
            });
        }
        if (event.key === "!") {
            console.log('Sening waypoints to server...');
            const waypointsData = spheres.map((sphere, index) => {
                // Create a quaternion rotated 180° around Y axis for correct drone orientation
                const sphere_quat = sphere.quaternion.clone().multiply(
                    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI)
                );

                return {
                    position: {
                        x: Number(sphere.position.x.toFixed(5)),
                        y: Number(sphere.position.y.toFixed(5)),
                        z: Number(sphere.position.z.toFixed(5))
                    },
                    rotation: {
                        x: Number(sphere_quat.x.toFixed(5)),
                        y: Number(sphere_quat.y.toFixed(5)),
                        z: Number(sphere_quat.z.toFixed(5)),
                        w: Number(sphere_quat.w.toFixed(5))
                    }
                };
            });

            socket.emit('waypoints', waypointsData);
            console.log('Waypoints sent:', waypointsData);

        }


    };

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [spheres]);

    const updateSpherePosition = (index, matrix) => {
        setSpheres(prev => {
            const newSpheres = [...prev];
            const position = new THREE.Vector3();
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3();
            matrix.decompose(position, quaternion, scale);

            newSpheres[index] = {
                position,
                quaternion: quaternion.normalize()
            };
            return newSpheres;
        });
    };

    return (
        <>
            {spheres.map((sphere, index) => (
                <PivotControls
                    key={index}
                    anchor={[-0.75, -0.75, -0.75]}
                    depthTest={false}
                    lineWidth={2}
                    scale={50}
                    fixed={true}
                    matrix={new THREE.Matrix4().compose(
                        sphere.position,
                        sphere.quaternion,
                        new THREE.Vector3(1, 1, 1)
                    )}
                    onDrag={(matrix) => updateSpherePosition(index, matrix)}
                >
                    <primitive object={droneScene.clone()} scale={1} />
                    <primitive object={new THREE.AxesHelper(2)} />
                    <arrowHelper
                        args={[
                            new THREE.Vector3(0, 0, 1),
                            new THREE.Vector3(0, 0, 0),
                            2,
                            0x3366cc,
                        ]}
                    />
                </PivotControls>
            ))}

            {spheres.length > 1 && (
                <Line
                    points={spheres.map(sphere => [
                        sphere.position.x,
                        sphere.position.y,
                        sphere.position.z
                    ])}
                    color="blue"
                    lineWidth={2}
                />
            )}
        </>
    );
}

useGLTF.preload(DRONE_MODEL_PATH);
export default WaypointSpawner;