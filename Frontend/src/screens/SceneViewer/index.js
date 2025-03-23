import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VRScene from '../../components/Room/VRScene';
import ControlPanel from './ControlPanel';
import { fetchProjectDetails } from '../../services/api';

const SceneViewer = () => {
  const { projectId } = useParams();
  const [sceneData, setSceneData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScene = async () => {
      try {
        const data = await fetchProjectDetails(projectId);
        setSceneData(data);
      } catch (error) {
        console.error('Failed to load scene:', error);
      } finally {
        setLoading(false);
      }
    };
    loadScene();
  }, [projectId]);

  if (loading) return <div>Loading scene...</div>;

  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        <VRScene sceneData={sceneData} />
      </div>
      <ControlPanel 
        sceneData={sceneData} 
        onUpdate={(updates) => setSceneData({ ...sceneData, ...updates })}
      />
    </div>
  );
};

export default SceneViewer;