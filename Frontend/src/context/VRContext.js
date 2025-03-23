import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useVRControls } from '../hooks/useVRControls';

export const VRContext = createContext({
  vrMode: false,
  vrSupported: false,
  enterVR: () => {},
  exitVR: () => {},
  controllers: [],
  controllerRays: [],
  cameraPosition: { x: 0, y: 1.6, z: 5 },
  setCameraPosition: () => {},
  vrQuality: 'high',
  setVRQuality: () => {}
});

export const VRProvider = ({ children }) => {
  const [vrMode, setVRMode] = useState(false);
  const [vrSupported, setVRSupported] = useState(false);
  const [vrQuality, setVRQuality] = useState('high'); 
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 1.6, z: 5 });
  const { vrEnabled, controllers, initVR, exitVR, getRayFromController } = useVRControls();
  
  // Check VR support on mount
  useEffect(() => {
    const checkVRSupport = async () => {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setVRSupported(supported);
        } catch (err) {
          console.error('Error checking VR support:', err);
          setVRSupported(false);
        }
      } else {
        setVRSupported(false);
      }
    };
    
    checkVRSupport();
  }, []);
  
  // Sync vrMode with vrEnabled from hook
  useEffect(() => {
    setVRMode(vrEnabled);
  }, [vrEnabled]);
  
  const enterVR = useCallback(async () => {
    const success = await initVR();
    return success;
  }, [initVR]);
  
  // Generate rays from controllers for interaction
  const controllerRays = controllers.map(controller => 
    getRayFromController(controller)
  );
  
  const value = {
    vrMode,
    vrSupported,
    enterVR,
    exitVR,
    controllers,
    controllerRays,
    cameraPosition,
    setCameraPosition,
    vrQuality,
    setVRQuality
  };
  
  return (
    <VRContext.Provider value={value}>
      {children}
    </VRContext.Provider>
  );
};