import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Homepage
import NewHomepage from './components/NewHomepage';
// Authentication Components
import NewLogin from './components/auth/NewLogin';
import NewRegister from './components/auth/NewRegister';
// Onboarding Components
import Onboarding from './components/onboarding/Onboarding';
import CompletionMessage from './components/onboarding/CompletionMessage';
// Dashboard Components
import CombinedDashboard from './components/dashboard/CombinedDashboard';
import Overview from './components/dashboard/Overview';
import EmployersProfile from './components/dashboard/EmployersProfile';
import PostJob from './components/dashboard/PostJob';
import MyJobs from './components/dashboard/MyJobs';
import SavedCandidates from './components/dashboard/SavedCandidates';
import PlansBilling from './components/dashboard/PlansBilling';
import AllCompanies from './components/dashboard/AllCompanies';
import Settings from './components/dashboard/Settings';
// Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
// 404 Component
import NotFound from './components/NotFound';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Container maxWidth="lg" disableGutters>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <NewHomepage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <NewLogin />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <NewRegister />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          {/* Onboarding Routes */}
          <Route path="/onboarding/*" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/completion" element={
            <ProtectedRoute>
              <CompletionMessage />
            </ProtectedRoute>
          } />
          
          {/* Dashboard Routes - Using combined component */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <CombinedDashboard />
            </ProtectedRoute>
          } />
          
          {/* 404 Route - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </Router>
  );
}

export default App;