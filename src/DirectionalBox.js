import React, {forwardRef, useRef, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import {Edges, Html} from "@react-three/drei";

const DirectionalBox = forwardRef((props, ref) => {
    // These reference gives us direct access to the THREE.Mesh objects
    const boxRef = useRef();

    // Expose the internal ref to the parent
    React.useImperativeHandle(ref, () => boxRef.current);

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    // Hold state for form inputs
    const [name, setName] = useState(props.name.toString());
    const [description, setDescription] = useState(props._description.toString());

    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref2.current.rotation.z += delta))

    // Hold state for attributes of the box
    const [boxDimensions, setBoxDimensions] = useState(props.size)
    const [boxRotations, setBoxRotations] = useState(props.rotation)
    const [boxPositions, setBoxPositions] = useState(props.position)

    // Update box dimensions from input
    const updateDimension = (index, value) => {
        const newDimensions = [...boxDimensions];
        newDimensions[index] = parseFloat(value) || 0; // Default to 1 if invalid
        setBoxDimensions(newDimensions);
    };
    // Update box rotation from input
    const updateRotation = (index, value) => {
        const newRotation = [...boxRotations];
        newRotation[index] = parseFloat(value) || 0; // Default to 1 if invalid
        setBoxRotations(newRotation);
    };
    // Update box position from input
    const updatePosition = (index, value) => {
        const newPosition = [...boxPositions];
        newPosition[index] = parseFloat(value) || 0; // Default to 1 if invalid
        setBoxPositions(newPosition);
    };

    useEffect(() => {
        if (props.onStateChange) {
            props.onStateChange({name, description, boxDimensions, boxPositions, boxRotations});
        }
    }, [name, description, boxDimensions, boxPositions, boxRotations, props.onStateChange]);

    // UseFrame to dynamically change box pose
    useFrame(() => {
        if (boxRef.current){
            boxRef.current._name = name;
            boxRef.current._description = description;
            boxRef.current.rotation.set(boxRotations[0], boxRotations[1], boxRotations[2]);
            boxRef.current.position.set(boxPositions[0], boxPositions[1], boxPositions[2]);
        }
    });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        < group {...props} ref={boxRef}>
            <mesh
                scale={clicked ? 1 : 1}
                onClick={(event) => click(!clicked)}
                onPointerOver={(event) => (event.stopPropagation(), hover(true))}
                onPointerOut={(event) => hover(false)}>
                <boxGeometry args={boxDimensions}/>
                <meshStandardMaterial transparent opacity={hovered ? 0.5 : 0}/>
                <Edges linewidth={5} threshold={15} color={(hovered) ? "#c02040" : "yellow"}/>
                {(hovered || clicked) && (
                    <Html distanceFactor={10}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "10px",
                                background: "rgba(0, 0, 0, 0.8)",
                                borderRadius: "5px",
                                color: "white",
                            }}
                        >
                            <form>
                                <label htmlFor="fname">Name:</label><br/>
                                <input type="text" id="fname" name="fname" value={name}
                                       onChange={(e) => setName(e.target.value)}/><br/>
                                <label htmlFor={"fdescription"}>Description:</label><br/>
                                <input type="text" id="fdescription" name="fdescription" value={description}
                                       onChange={(e) => setDescription(e.target.value)}/>
                            </form>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            alignItems: "center",
                            padding: "10px",
                            background: "rgba(0, 0, 0, 0.8)",
                            borderRadius: "5px",
                            color: "white",
                        }}>
                            <div>
                                <label>
                                    X:
                                    <input
                                        type="number"
                                        value={boxDimensions[0]}
                                        onChange={(e) => updateDimension(0, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                                <label>
                                    Y:
                                    <input
                                        type="number"
                                        value={boxDimensions[1]}
                                        onChange={(e) => updateDimension(1, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                                <label>
                                    Z:
                                    <input
                                        type="number"
                                        value={boxDimensions[2]}
                                        onChange={(e) => updateDimension(2, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Rot X:
                                    <input
                                        type="number"
                                        value={boxRotations[0]}
                                        onChange={(e) => updateRotation(0, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                                <label>
                                    Rot Y:
                                    <input
                                        type="number"
                                        value={boxRotations[1]}
                                        onChange={(e) => updateRotation(1, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                                <label>
                                    Rot Z:
                                    <input
                                        type="number"
                                        value={boxRotations[2]}
                                        onChange={(e) => updateRotation(2, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Pos X:
                                    <input
                                        type="number"
                                        value={boxPositions[0]}
                                        onChange={(e) => updatePosition(0, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                                <label>
                                    Pos Y:
                                    <input
                                        type="number"
                                        value={boxPositions[1]}
                                        onChange={(e) => updatePosition(1, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                                <label>
                                    Pos Z:
                                    <input
                                        type="number"
                                        value={boxPositions[2]}
                                        onChange={(e) => updatePosition(2, e.target.value)}
                                        style={{margin: "5px", width: "50px"}}
                                    />
                                </label>
                            </div>
                        </div>
                    </Html>)}
            </mesh>
            <mesh position={[0, (boxDimensions[1] / 2) + 0.125, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 32]}/>
                <meshStandardMaterial color={(hovered) ? "#c02040" : "yellow"}/>
            </mesh>
            <mesh position={[0, (boxDimensions[1] / 2) + 0.625, 0]}>
                <coneGeometry args={[0.125, 0.5, 4, 1]}/>
                <meshStandardMaterial color={(hovered) ? "#c02040" : "yellow"}/>
            </mesh>
        </group>
    )
})

export default DirectionalBox