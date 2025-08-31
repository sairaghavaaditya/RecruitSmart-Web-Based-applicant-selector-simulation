import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './UserAuthContext';

const UserPrivateRoute = ({ children }) => {
  const { authState } = useAuth();

  if (!authState || authState.role !== 'candidate') {
    // Redirect to login if not authenticated
    return <Navigate to="/userlogin" />;
  }

  return children;
};

export default UserPrivateRoute;
