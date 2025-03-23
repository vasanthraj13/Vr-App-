import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { Gyroscope } from 'react-native-sensors';
import Walls from './Walls';
import Floor from './Floor';

const VRScene = ({ roomData }) => {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const gyroscope = new Gyroscope({ updateInterval: 100 });
    gyroscope.subscribe(({ x, y, z }) => setGyroData({ x, y, z }));
    return () => gyroscope.stop();
  }, []);

  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.8} />
      <Walls dimensions={roomData.dimensions} />
      <Floor dimensions={roomData.dimensions} />
      {roomData.furniture.map((item, index) => (
        <FurnitureItem key={index} {...item} />
      ))}
      <OrbitControls enableZoom={true} enableRotate={true} rotateSpeed={gyroData.y} />
    </Canvas>
  );
};