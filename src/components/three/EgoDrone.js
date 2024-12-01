import React, {forwardRef, useEffect, useRef, useState} from "react";
import {useGLTF} from "@react-three/drei";
import {useThree} from "@react-three/fiber";

// Use environment variables or PUBLIC_URL at build time
const DRONE_MODEL_PATH = process.env.PUBLIC_URL + "/model/drone_sample_centered.glb";

const EgoDrone = forwardRef((props, ref) => {
    const [model, setModel] = useState(null);
    const { scene } = useGLTF(DRONE_MODEL_PATH);

    useEffect(() => {
        // Handle model loading error
        if (!scene) {
            console.error("Failed to load drone model");
            return;
        }
        setModel(scene);
    }, [scene]);

    if (!model) {
        return null; // Handle when model is not loaded
    }

    return (
        <mesh ref={ref} {...props}>
            <primitive object={model}/>
        </mesh>
    );
});

export default function DroneScene() {
    const { camera } = useThree();  // Access the camera from the scene
    const droneRef = useRef(); // Reference to the drone
    const [isVisible, setIsVisible] = useState(false); // Initially invisible

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                if (droneRef.current) {
                    setIsVisible((prev) => !prev);
                    // Update the drone's position and rotation to match the camera
                    droneRef.current.position.copy(camera.position);
                    droneRef.current.rotation.copy(camera.rotation);
                }
            }
        };

        // Add event listener
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup listener on unmount
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []); // camera is excluded from the dependency array because the camera provided by useThree hook always maintains the latest reference, so it doesn't need to be added as a dependency

    return <EgoDrone ref={droneRef} visible={isVisible} scale={2}/>
}

// Preload model
useGLTF.preload(DRONE_MODEL_PATH);
