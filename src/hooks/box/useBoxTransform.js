import { useState } from 'react';

export const useBoxTransform = (initialProps) => {
    const [boxDimensions, setBoxDimensions] = useState(initialProps.size);
    const [boxRotations, setBoxRotations] = useState(initialProps.rotation);
    const [boxPositions, setBoxPositions] = useState(initialProps.position);

    const updateDimension = (index, value) => {
        const newDimensions = [...boxDimensions];
        newDimensions[index] = parseFloat(value) || 0;
        setBoxDimensions(newDimensions);
    };

    const updateRotation = (index, value) => {
        const newRotation = [...boxRotations];
        newRotation[index] = parseFloat(value) || 0;
        setBoxRotations(newRotation);
    };

    const updatePosition = (index, value) => {
        const newPosition = [...boxPositions];
        newPosition[index] = parseFloat(value) || 0;
        setBoxPositions(newPosition);
    };

    return {
        boxDimensions,
        boxRotations,
        boxPositions,
        updateDimension,
        updateRotation,
        updatePosition
    };
};