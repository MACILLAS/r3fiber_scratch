import React, {forwardRef, useEffect, useRef, useState} from "react";
import {Html} from "@react-three/drei";

const CameraOrb = forwardRef(({position,
                              rotation,
                              number,
                              scale=1,
                              color = "orange",
                              opacity = 0.5, onStateChange}, ref) => {
    const sphereRef = useRef();

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    // Expose the internal ref to the parent
    React.useImperativeHandle(ref, () => sphereRef.current);

    useEffect(() => {
        if (onStateChange) {
            onStateChange({clicked, number})
        }
    }, [clicked])

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <mesh ref={sphereRef}
                  onClick={(event) => click(!clicked)}
                  onPointerOver={(event) => (event.stopPropagation(), hover(true))}
                  onPointerOut={(event) => hover(false)}>
                {/* Sphere geometry */}
                <sphereGeometry args={[0.5, 32, 32]}/>
                <meshStandardMaterial
                    color={color}
                    transparent
                    color={(hovered || clicked) ? "#c02040" : color}
                    opacity={(clicked) ? 0.8 : opacity}
                />
                {/* HTML for number */}
                <Html distanceFactor={10} center>
                    <div
                        style={{
                            fontSize: "1.5em",
                            fontWeight: "bold",
                            color: "white",
                            textAlign: "center",
                            userSelect: "none",
                        }}
                    >
                        {number}
                    </div>
                </Html>
            </mesh>
            <mesh position={[0, 0, 0.65 + 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.65, 32]}/>
                <meshStandardMaterial transparent
                                      opacity={(clicked) ? 0.8 : opacity}
                                      color={(hovered || clicked) ? "#c02040" : color}/>
            </mesh>
            <mesh position={[0, 0, 0.70 + 0.625]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.125, 0.5, 4, 1]}/>
                <meshStandardMaterial transparent
                                      opacity={(clicked) ? 0.8 : opacity}
                                      color={(hovered || clicked) ? "#c02040" : color}/>
            </mesh>
        </group>
    );
})

export default CameraOrb