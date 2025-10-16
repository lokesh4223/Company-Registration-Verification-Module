import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import { Business, CheckCircle } from '@mui/icons-material';
import OnboardingProgress from './OnboardingProgress';

const steps = [
  'Company Info',
  'Founding Info', 
  'Social Media Profile',
  'Contact'
];

const OnboardingLayout = ({ children, activeStep, onPrevious, onNext, showPrevious = true, showNext = true }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Function to validate current step
  const validateCurrentStep = () => {
    // Get all required fields in the current step
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
      const currentForm = forms[0]; // Assuming there's only one form per step
      const requiredFields = currentForm.querySelectorAll('[required]');
      
      // Check if all required fields are filled
      for (let field of requiredFields) {
        if (!field.value.trim()) {
          setSnackbarMessage('Please fill all required fields before proceeding.');
          setOpenSnackbar(true);
          return false;
        }
      }
      
      // Check if form is valid
      if (!currentForm.checkValidity()) {
        setSnackbarMessage('Please correct errors in the form before proceeding.');
        setOpenSnackbar(true);
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      onNext();
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'white', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          color: 'black',
          height: '70px'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            justifyContent: 'space-between',
            minHeight: '70px'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Business sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#334155' }}>
                Company Registration
              </Typography>
            </Box>
            
            {/* Flowbite Progress Bar */}
            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '300px' }}>
              <OnboardingProgress currentStep={activeStep} totalSteps={steps.length} />
            </Box>
            
            <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Stepper */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box 
          sx={{ 
            mb: 4, 
            bgcolor: 'white', 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              '& .MuiStepConnector-line': {
                borderColor: '#e2e8f0'
              }
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  sx={{
                    '& .MuiStepLabel-label': {
                      ...(activeStep === index && {
                        color: '#667eea',
                        fontWeight: 'bold'
                      }),
                      '&.Mui-completed': {
                        color: '#10b981'
                      }
                    },
                    '& .MuiStepIcon-root': {
                      '&.Mui-active': {
                        color: '#667eea'
                      },
                      '&.Mui-completed': {
                        color: '#10b981'
                      }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <Box sx={{ mb: 4 }}>
          {children}
        </Box>
      </Container>

      {/* Snackbar for validation messages */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="warning" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OnboardingLayout;