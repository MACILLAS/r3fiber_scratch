import React, {forwardRef, useRef } from "react";
import {useFrame} from "@react-three/fiber";
import {Edges, Html} from "@react-three/drei";
import * as THREE from "three";

import BoxInfo from "../common/BoxInfo";
import BoxControls from "../common/BoxControls";
import { useBoxTransform } from "../../hooks/box/useBoxTransform";
import { useBoxMetadata } from "../../hooks/box/useBoxMetadata";
import { useBoxInteraction } from "../../hooks/box/useBoxInteraction";

const DirectionalBox = forwardRef((props, ref) => {
    // These reference gives us direct access to the THREE.Mesh objects
    const boxRef = useRef();

    // Expose the internal ref to the parent
    React.useImperativeHandle(ref, () => boxRef.current);

    const transform = useBoxTransform(props);
    const metadata = useBoxMetadata(props, transform);
    const interaction = useBoxInteraction();

    // UseFrame to dynamically change box pose and align the arrow
    useFrame(() => {
        if (boxRef.current){
            const { name, description } = metadata;
            const { boxRotations, boxPositions } = transform;
            
            boxRef.current._name = name;
            boxRef.current._description = description;
            boxRef.current.rotation.set(...boxRotations);
            boxRef.current.position.set(...boxPositions);
        }
    });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        < group {...props} ref={boxRef}>
            <mesh
                {...props}
                ref={boxRef}
                scale={interaction.clicked ? 1 : 1}
                onClick={interaction.handleClick}
                onPointerOver={interaction.handlePointerOver}
                onPointerOut={interaction.handlePointerOut}>
                <boxGeometry args={transform.boxDimensions}/>
                <meshStandardMaterial transparent opacity={interaction.hovered ? 0.5 : 0}/>
                <Edges linewidth={5} threshold={15} color={interaction.hovered ? "#c02040" : "yellow"}/>
                {(interaction.hovered || interaction.clicked) && (
                    <Html distanceFactor={10}>
                        <BoxInfo {...metadata} />
                        <BoxControls {...transform} />
                    </Html>
                )}
            </mesh>
            <mesh position={[0, (transform.boxDimensions[1] / 2) + 0.125, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 32]}/>
                <meshStandardMaterial color={(interaction.hovered) ? "#c02040" : "yellow"}/>
            </mesh>
            <mesh position={[0, (transform.boxDimensions[1] / 2) + 0.625, 0]}>
                <coneGeometry args={[0.125, 0.5, 4, 1]}/>
                <meshStandardMaterial color={(interaction.hovered) ? "#c02040" : "yellow"}/>
            </mesh>
        </group>
    )
})

export default DirectionalBox