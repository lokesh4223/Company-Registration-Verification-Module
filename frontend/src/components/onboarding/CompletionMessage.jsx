import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  Typography,
  Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const CompletionMessage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center' }}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 3, 
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography component="h1" variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#334155' }}>
            Congratulations!
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'medium' }}>
            Profile Setup Complete
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem' }}>
            You have successfully completed your company profile setup. You can now start using all the features of our platform.
          </Typography>
          
          <Box 
            sx={{ 
              bgcolor: '#f1f5f9', 
              borderRadius: 2, 
              p: 3, 
              mb: 4,
              border: '1px solid #e2e8f0'
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Redirecting to your dashboard in 5 seconds...
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderRadius: '8px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc'
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="contained"
              size="large"
              sx={{ 
                borderRadius: '8px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/dashboard/settings')}
            >
              View Profile
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompletionMessage;