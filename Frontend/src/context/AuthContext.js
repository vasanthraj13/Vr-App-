import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  forgotPassword: () => {},
  resetPassword: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check token
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        
        if (token) {
          // Set token in axios default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user info
          const response = await api.get('/auth/me');
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Token might be invalid, remove it
        await AsyncStorage.removeItem('authToken');
        console.error('Error loading auth token:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadToken();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Save token
      await AsyncStorage.setItem('authToken', token);
      
      // Set token in axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response.data;
      
      // Save token
      await AsyncStorage.setItem('authToken', token);
      
      // Set token in axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Remove token from storage
      await AsyncStorage.removeItem('authToken');
      
      // Remove token from axios headers
      delete api.defaults.headers.common['Authorization'];
      
      setUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/forgot-password', { email });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed');
      console.error('Forgot password error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      console.error('Reset password error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};