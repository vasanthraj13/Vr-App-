import React from 'react';

const Floor = ({ dimensions }) => {
  const { width, length } = dimensions;
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
};
