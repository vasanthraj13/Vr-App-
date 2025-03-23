import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProjectContext = createContext({
  projects: [],
  currentProject: null,
  activeRoom: null,
  isLoading: false,
  error: null,
  fetchProjects: () => {},
  createProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  setCurrentProject: () => {},
  setActiveRoom: () => {},
  saveProjectLocally: () => {},
  exportProject: () => {}
});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load projects initially
  useEffect(() => {
    fetchProjects();
    
    // Try to load last active project from storage
    const loadLastProject = async () => {
      try {
        const lastProjectId = await AsyncStorage.getItem('lastProjectId');
        if (lastProjectId) {
          loadProject(lastProjectId);
        }
      } catch (err) {
        console.error('Error loading last project:', err);
      }
    };
    
    loadLastProject();
  }, []);
  
  // Save last project to storage when changed
  useEffect(() => {
    if (currentProject) {
      AsyncStorage.setItem('lastProjectId', currentProject.id.toString())
        .catch(err => console.error('Error saving last project ID:', err));
    }
  }, [currentProject]);
  
  // Set active room when project changes
  useEffect(() => {
    if (currentProject && currentProject.rooms && currentProject.rooms.length > 0) {
      // Either use the active room ID or default to first room
      const activeRoomId = currentProject.activeRoomId || currentProject.rooms[0].id;
      const room = currentProject.rooms.find(r => r.id === activeRoomId) || currentProject.rooms[0];
      setActiveRoom(room);
    } else {
      setActiveRoom(null);
    }
  }, [currentProject]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/projects', projectData);
      const newProject = response.data;
      
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject);
      
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      console.error('Error creating project:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (updatedProject) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For better UX, update state immediately before API call
      setCurrentProject(updatedProject);
      
      if (updatedProject.id) {
        const response = await api.put(`/projects/${updatedProject.id}`, updatedProject);
        const savedProject = response.data;
        
        // Update in projects list
        setProjects(prev => 
          prev.map(p => p.id === savedProject.id ? savedProject : p)
        );
        
        return savedProject;
      } else {
        throw new Error('Project ID is required for updates');
      }
    } catch (err) {
      setError(err.message || 'Failed to update project');
      console.error('Error updating project:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.delete(`/projects/${projectId}`);
      
      // Remove from projects list
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Clear current project if it was deleted
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(null);
        setActiveRoom(null);
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      console.error('Error deleting project:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const saveProjectLocally = useCallback(async (project) => {
    try {
      await AsyncStorage.setItem(
        `project_${project.id}`,
        JSON.stringify(project)
      );
      return true;
    } catch (err) {
      console.error('Error saving project locally:', err);
      return false;
    }
  }, []);

  const exportProject = useCallback(async (projectId, format = 'json') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/projects/${projectId}/export?format=${format}`);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to export project');
      console.error('Error exporting project:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    projects,
    currentProject,
    activeRoom,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    setActiveRoom,
    saveProjectLocally,
    exportProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};