import axios from 'axios';
import { handleApiError } from '../utils/helpers';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchProjectDetails = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProjectSettings = async (projectId, settings) => {
  try {
    const response = await api.patch(`/projects/${projectId}/settings`, settings);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchUserPreferences = async () => {
  try {
    const response = await api.get('/user/preferences');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserPreferences = async (preferences) => {
  try {
    const response = await api.patch('/user/preferences', preferences);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};