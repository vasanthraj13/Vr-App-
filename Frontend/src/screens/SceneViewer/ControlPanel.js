import React from 'react';
import { updateProjectSettings } from '../../services/api';

const ControlPanel = ({ sceneData, onUpdate }) => {
  const handleSettingChange = async (setting, value) => {
    try {
      await updateProjectSettings(sceneData.id, { [setting]: value });
      onUpdate({ [setting]: value });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Scene Controls</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Lighting
          </label>
          <select 
            value={sceneData.lighting}
            onChange={(e) => handleSettingChange('lighting', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="ambient">Ambient</option>
            <option value="spot">Spot</option>
            <option value="directional">Directional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Shadow Quality
          </label>
          <select 
            value={sceneData.shadowQuality}
            onChange={(e) => handleSettingChange('shadowQuality', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => handleSettingChange('vr', !sceneData.vrEnabled)}
        >
          {sceneData.vrEnabled ? 'Exit VR' : 'Enter VR'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;