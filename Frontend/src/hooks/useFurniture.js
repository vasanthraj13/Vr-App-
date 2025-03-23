import { useState, useCallback, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const useFurniture = () => {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [furniturePosition, setFurniturePosition] = useState(new THREE.Vector3());
  const [furnitureRotation, setFurnitureRotation] = useState(new THREE.Euler());
  const { scene } = useThree();
  const { currentProject, updateProject } = useContext(ProjectContext);
  
  const selectFurniture = useCallback((furniture) => {
    setSelectedFurniture(furniture);
  }, []);
  
  const placeFurniture = useCallback((furniture, position, rotation) => {
    if (!currentProject || !currentProject.activeRoom) return;
    
    const newFurniture = {
      id: furniture.id || `furniture_${Date.now()}`,
      type: furniture.type,
      model: furniture.model,
      position: {
        x: position.x,
        y: position.y,
        z: position.z
      },
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z
      },
      scale: furniture.scale || { x: 1, y: 1, z: 1 },
      metadata: furniture.metadata || {}
    };
    
    const updatedRoom = {
      ...currentProject.activeRoom,
      furniture: [
        ...(currentProject.activeRoom.furniture || []),
        newFurniture
      ]
    };
    
    updateProject({
      ...currentProject,
      activeRoom: updatedRoom
    });
    
    setPlacementMode(false);
    return newFurniture;
  }, [currentProject, updateProject]);
  
  const moveFurniture = useCallback((furnitureId, newPosition, newRotation) => {
    if (!currentProject || !currentProject.activeRoom) return;
    
    const updatedFurniture = currentProject.activeRoom.furniture.map(item => {
      if (item.id === furnitureId) {
        return {
          ...item,
          position: newPosition ? {
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z
          } : item.position,
          rotation: newRotation ? {
            x: newRotation.x,
            y: newRotation.y,
            z: newRotation.z
          } : item.rotation
        };
      }
      return item;
    });
    
    const updatedRoom = {
      ...currentProject.activeRoom,
      furniture: updatedFurniture
    };
    
    updateProject({
      ...currentProject,
      activeRoom: updatedRoom
    });
  }, [currentProject, updateProject]);
  
  const removeFurniture = useCallback((furnitureId) => {
    if (!currentProject || !currentProject.activeRoom) return;
    
    const updatedFurniture = currentProject.activeRoom.furniture.filter(
      item => item.id !== furnitureId
    );
    
    const updatedRoom = {
      ...currentProject.activeRoom,
      furniture: updatedFurniture
    };
    
    updateProject({
      ...currentProject,
      activeRoom: updatedRoom
    });
  }, [currentProject, updateProject]);
  
  return {
    selectedFurniture,
    placementMode,
    furniturePosition,
    furnitureRotation,
    selectFurniture,
    setPlacementMode,
    placeFurniture,
    moveFurniture,
    removeFurniture,
    setFurniturePosition,
    setFurnitureRotation
  };
};
