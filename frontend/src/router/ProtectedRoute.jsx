import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, token, loading } = useAuth();
  
  // 1. Wait for Auth Check to finish
  if (loading) {
    // You can replace this with a nice <LoadingSpinner /> component if you want
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  // 2. If no token after loading, go to Login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 3. If role mismatch (e.g. Student trying to access Admin), go to Login
  if (role && user?.role !== role) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;