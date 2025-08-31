import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { authState } = useAuth();

  if (!authState || authState.role !== 'admin') {
    // Redirect to login if not authenticated
    return <Navigate to="/adminlogin" />;
  }

  return children;
};

export default PrivateRoute;
