import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  // If authenticated, redirect to appropriate page
  if (isAuthenticated) {
    // Check if user has completed onboarding
    // For now, redirect to dashboard, but this could be customized based on user state
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, render children
  return children;
};

export default PublicRoute;