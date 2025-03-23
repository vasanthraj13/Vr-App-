import React, { useState, useEffect } from 'react';
import { fetchUserPreferences, updateUserPreferences } from '../../services/api';

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    defaultQuality: 'medium',
    autoLoadVR: false,
    showTutorial: true,
    units: 'metric',
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await fetchUserPreferences();
        setPreferences(data);
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserPreferences(preferences);
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Default Quality
        </label>
        <select
          value={preferences.defaultQuality}
          onChange={(e) => setPreferences({
            ...preferences,
            defaultQuality: e.target.value
          })}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.autoLoadVR}
            onChange={(e) => setPreferences({
              ...preferences,
              autoLoadVR: e.target.checked
            })}
            className="rounded"
          />
          <span>Auto-load VR mode when available</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.showTutorial}
            onChange={(e) => setPreferences({
              ...preferences,
              showTutorial: e.target.checked
            })}
            className="rounded"
          />
          <span>Show tutorial for new users</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Measurement Units
        </label>
        <select
          value={preferences.units}
          onChange={(e) => setPreferences({
            ...preferences,
            units: e.target.value
          })}
          className="w-full p-2 border rounded"
        >
          <option value="metric">Metric (m, cm)</option>
          <option value="imperial">Imperial (ft, in)</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default PreferencesForm;