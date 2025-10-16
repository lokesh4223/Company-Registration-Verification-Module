import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isMobileVerified } = useSelector((state) => state.user);
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Check if token exists in localStorage as a fallback
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // If token exists, allow access (assume it's valid)
    // The main.jsx file will restore the proper state
  }

  // If authenticated but mobile not verified, redirect to OTP verification
  // For now, we'll allow access to onboarding even if mobile is not verified
  // In a real implementation, you might want to restrict access until verification

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;