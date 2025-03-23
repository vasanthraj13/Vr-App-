// FurnitureItem.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';

const FurnitureItem = ({ 
  modelPath, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1],
  isSelectable = true 
}) => {
  const meshRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const { scene } = useGLTF(modelPath);

  useFrame(() => {
    if (isSelected && meshRef.current) {
      // Add highlight effect for selected items
      meshRef.current.material.emissive.setRGB(0.2, 0.2, 0.2);
    }
  });

  const handleSelect = (event) => {
    if (!isSelectable) return;
    event.stopPropagation();
    setIsSelected(!isSelected);
  };

  return (
    <primitive
      ref={meshRef}
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleSelect}
      castShadow
      receiveShadow
    />
  );
};

export default FurnitureItem;