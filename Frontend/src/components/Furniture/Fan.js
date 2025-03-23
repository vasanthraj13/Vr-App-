
// Fan.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';

const Fan = ({
  position = [0, 3.5, 0],
  bladeColor = '#8B4513',
  baseColor = '#A0522D',
  speed = 0.1
}) => {
  const fanRef = useRef();
  const [isOn, setIsOn] = useState(false);
  const [rotation, setRotation] = useState(0);

  useFrame(() => {
    if (isOn && fanRef.current) {
      setRotation(prev => prev + speed);
      fanRef.current.rotation.y = rotation;
    }
  });

  const toggleFan = () => {
    setIsOn(!isOn);
  };

  return (
    <group position={position}>
      {/* Fan base/mount */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Fan rod */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Fan blades */}
      <group ref={fanRef} onClick={toggleFan}>
        {[0, 1, 2, 3].map((blade) => (
          <mesh
            key={blade}
            position={[0, 0, 0]}
            rotation={[0, (Math.PI / 2) * blade, 0.2]}
          >
            <boxGeometry args={[1.2, 0.1, 0.2]} />
            <meshStandardMaterial color={bladeColor} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default Fan;