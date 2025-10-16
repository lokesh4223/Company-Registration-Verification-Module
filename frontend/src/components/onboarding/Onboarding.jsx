import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import CompanyInfo from './steps/CompanyInfo';
import FoundingInfo from './steps/FoundingInfo';
import SocialMediaProfile from './steps/SocialMediaProfile';
import ContactInfo from './steps/ContactInfo';
import OnboardingLayout from './OnboardingLayout';
import { useSelector } from 'react-redux';

const Onboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  // Determine active step based on current route
  const getActiveStep = () => {
    if (location.pathname.includes('/company-info')) return 0;
    if (location.pathname.includes('/founding-info')) return 1;
    if (location.pathname.includes('/social-media')) return 2;
    if (location.pathname.includes('/contact')) return 3;
    return 0; // default to first step
  };

  const activeStep = getActiveStep();

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        navigate('/onboarding/founding-info');
        break;
      case 1:
        navigate('/onboarding/social-media');
        break;
      case 2:
        navigate('/onboarding/contact');
        break;
      case 3:
        navigate('/completion');
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    switch (activeStep) {
      case 1:
        navigate('/onboarding/company-info');
        break;
      case 2:
        navigate('/onboarding/founding-info');
        break;
      case 3:
        navigate('/onboarding/social-media');
        break;
      default:
        break;
    }
  };

  // Redirect to first step if accessing root onboarding route
  if (location.pathname === '/onboarding') {
    return <Navigate to="/onboarding/company-info" replace />;
  }

  return (
    <OnboardingLayout 
      activeStep={activeStep} 
      onPrevious={handlePrevious} 
      onNext={handleNext}
      showPrevious={activeStep > 0}
      showNext={true}
    >
      <Routes>
        <Route path="/company-info" element={<CompanyInfo onNext={handleNext} onPrevious={handlePrevious} />} />
        <Route path="/founding-info" element={<FoundingInfo onNext={handleNext} onPrevious={handlePrevious} />} />
        <Route path="/social-media" element={<SocialMediaProfile onNext={handleNext} onPrevious={handlePrevious} />} />
        <Route path="/contact" element={<ContactInfo onNext={handleNext} onPrevious={handlePrevious} />} />
      </Routes>
    </OnboardingLayout>
  );
};

export default Onboarding;