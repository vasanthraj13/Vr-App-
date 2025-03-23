// Sofa.js
import React from 'react';
import FurnitureItem from './FurnitureItem';

const Sofa = ({ position = [0, 0, 0], rotation = [0, 0, 0], style = 'modern' }) => {
  const sofaModels = {
    modern: '/models/modern_sofa.glb',
    classic: '/models/classic_sofa.glb',
    sectional: '/models/sectional_sofa.glb'
  };

  const sofaScale = [1.5, 1.5, 1.5]; // Adjust based on your model size

  return (
    <FurnitureItem
      modelPath={sofaModels[style]}
      position={position}
      rotation={rotation}
      scale={sofaScale}
      isSelectable={true}
    />
  );
};

export default Sofa;