import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export const useProject = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const createProject = useCallback(async (projectData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/projects', projectData);
      setProjects(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      console.error('Error creating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const loadProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/projects/${projectId}`);
      setCurrentProject(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load project');
      console.error('Error loading project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateProject = useCallback(async (projectData) => {
    if (!projectData.id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Update local state immediately for better UX
      setCurrentProject(projectData);
      
      // Then persist to backend
      const response = await api.put(`/projects/${projectData.id}`, projectData);
      
      // Update projects list if needed
      setProjects(prev => 
        prev.map(p => p.id === projectData.id ? response.data : p)
      );
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      console.error('Error updating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(null);
        navigation.navigate('ProjectList');
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      console.error('Error deleting project:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentProject, navigation]);
  
  const addRoomToProject = useCallback(async (projectId, roomData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/projects/${projectId}/rooms`, roomData);
      
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(prev => ({
          ...prev,
          rooms: [...(prev.rooms || []), response.data]
        }));
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add room');
      console.error('Error adding room:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    createProject,
    loadProject,
    updateProject,
    deleteProject,
    addRoomToProject,
    setCurrentProject
  };
};