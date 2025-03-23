import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';

// Screens
import Login from './screens/Login';
import Register from './screens/Register';
import Dashboard from './screens/Dashboard';
import ProjectEditor from './screens/ProjectEditor';
import VRViewer from './screens/VRViewer';
import Settings from './screens/Settings';
import Profile from './screens/Profile';
import NotFound from './screens/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Styles
import './themes/global.css';

function App() {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check user authentication status on app load
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="app-container">
          {isAuthenticated && <Navbar />}
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Dashboard />} />
                <Route path="/projects/:projectId" element={<ProjectEditor />} />
                <Route path="/projects/:projectId/vr" element={<VRViewer />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;