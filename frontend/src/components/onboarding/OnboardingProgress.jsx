import React from 'react';
import { Progress } from "flowbite-react";

const OnboardingProgress = ({ currentStep, totalSteps }) => {
  // Calculate progress percentage - for 4 steps: 0, 25, 50, 75, 100
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100);
  
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progressPercentage));
  
  // Define step labels
  const steps = [
    'Company Info',
    'Founding Info', 
    'Social Media',
    'Contact'
  ];
  
  const currentStepLabel = steps[currentStep] || '';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {currentStepLabel}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {clampedProgress}% Complete
        </span>
      </div>
      
      <Progress
        progress={clampedProgress}
        size="lg"
        color="indigo"
        className="mb-2"
      />
      
      <div className="text-xs text-gray-500 mt-2 text-center">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};

export default OnboardingProgress;