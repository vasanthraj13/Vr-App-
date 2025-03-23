import { useState, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const useVRControls = () => {
  const [vrEnabled, setVrEnabled] = useState(false);
  const [controllers, setControllers] = useState([]);
  const { camera, gl } = useThree();
  
  const initVR = useCallback(async () => {
    if (!gl.xr) {
      console.error('WebXR not supported in this browser or environment');
      return false;
    }
    
    try {
      await gl.xr.setSession(await navigator.xr.requestSession('immersive-vr'));
      setVrEnabled(true);
      
      // Setup controllers
      const controllerGrips = [
        gl.xr.getControllerGrip(0),
        gl.xr.getControllerGrip(1)
      ];
      
      setControllers(controllerGrips);
      return true;
    } catch (error) {
      console.error('Error initializing VR:', error);
      return false;
    }
  }, [gl.xr]);
  
  const exitVR = useCallback(async () => {
    if (gl.xr.getSession()) {
      await gl.xr.getSession().end();
    }
    setVrEnabled(false);
    setControllers([]);
  }, [gl.xr]);
  
  const getRayFromController = useCallback((controller) => {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    
    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    return raycaster;
  }, []);
  
  useEffect(() => {
    return () => {
      if (vrEnabled) {
        exitVR();
      }
    };
  }, [vrEnabled, exitVR]);
  
  return {
    vrEnabled,
    controllers,
    initVR,
    exitVR,
    getRayFromController
  };
};