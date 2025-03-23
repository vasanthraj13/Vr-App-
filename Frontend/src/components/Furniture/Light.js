// Light.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';

const Light = ({
  position = [0, 3, 0],
  intensity = 1,
  color = '#ffffff',
  type = 'ceiling'
}) => {
  const lightRef = useRef();
  const [isOn, setIsOn] = useState(true);

  // Fixture geometry based on type
  const getFixtureGeometry = () => {
    switch (type) {
      case 'ceiling':
        return <cylinderGeometry args={[0.2, 0.2, 0.3]} />;
      case 'wall':
        return <boxGeometry args={[0.3, 0.5, 0.2]} />;
      case 'floor':
        return <coneGeometry args={[0.3, 0.8, 16]} />;
      default:
        return <sphereGeometry args={[0.2]} />;
    }
  };

  const toggleLight = () => {
    setIsOn(!isOn);
  };

  return (
    <group position={position}>
      {/* Light fixture */}
      <mesh onClick={toggleLight}>
        {getFixtureGeometry()}
        <meshStandardMaterial 
          color={color} 
          emissive={isOn ? color : '#000000'}
          emissiveIntensity={isOn ? 0.5 : 0}
        />
      </mesh>
      
      {/* Actual light source */}
      {isOn && (
        <pointLight
          ref={lightRef}
          intensity={intensity}
          color={color}
          distance={10}
          castShadow
        />
      )}
    </group>
  );
};

export default Light;