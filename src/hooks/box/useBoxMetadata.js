import { useState, useEffect } from 'react';

export const useBoxMetadata = (initialProps, transform) => {
    const [name, setName] = useState(initialProps.name.toString());
    const [description, setDescription] = useState(initialProps._description.toString());

    useEffect(() => {
        if (initialProps.onStateChange) {
            const { boxDimensions, boxPositions, boxRotations } = transform;
            initialProps.onStateChange({ 
                name, 
                description, 
                boxDimensions, 
                boxPositions, 
                boxRotations 
            });
        }
    }, [name, description, transform, initialProps.onStateChange]);

    return {
        name,
        description,
        setName,
        setDescription
    };
};