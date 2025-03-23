import React from 'react';

const Walls = ({ dimensions }) => {
  const { width, height, length } = dimensions;
  
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, height/2, -length/2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, height/2, length/2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Side walls */}
      <mesh position={[-width/2, height/2, 0]}>
        <boxGeometry args={[0.1, height, length]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[width/2, height/2, 0]}>
        <boxGeometry args={[0.1, height, length]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};