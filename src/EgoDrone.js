import React, {forwardRef, useEffect, useRef, useState} from "react";
import {useGLTF} from "@react-three/drei";
import {useThree} from "@react-three/fiber";

const EgoDrone = forwardRef((props, ref) => {
    const { scene } = useGLTF("/model/drone_sample_centered.glb");

    return (
        <mesh ref={ref} {...props}>
            <primitive object={scene}/>
        </mesh>
    )
})

export default function DroneScene() {
    const { camera } = useThree(); // Access the camera from the scene
    const droneRef = useRef(); // Reference to the drone

    const [isVisible, setIsVisible] = useState(false); // Initially invisible

    // Listen for Tab key press
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
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [camera]);

    return (
        <EgoDrone ref={droneRef} visible={isVisible} scale={2}/>
    );
};
