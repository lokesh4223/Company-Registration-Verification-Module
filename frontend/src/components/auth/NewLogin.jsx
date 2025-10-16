import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  TextField, 
  Typography, 
  Link, 
  Grid, 
  Checkbox, 
  FormControlLabel,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  LockOutlined,
  Business,
  ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { auth, signInWithEmailAndPassword } from '../../services/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken } from '../../store/userSlice';

const NewLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError('');
    
    try {
      console.log('Attempting Firebase login with email:', data.email);
      
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log('Firebase authentication successful for user:', user.email);
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      console.log('Firebase ID token obtained');
      
      // Send token to backend for verification
      const response = await authAPI.firebaseLogin({ idToken });
      const result = response.data;
      
      console.log('Backend verification result:', result);
      
      if (result.success) {
        // Dispatch user and token to Redux store
        dispatch(setUser(result.data.user));
        dispatch(setToken(result.data.token));
        toast.success('Login successful! Welcome back.');
        
        // Redirect to the page they were trying to access, or to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        setTimeout(() => {
          navigate(from);
        }, 1000);
      } else {
        setLoginError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Invalid email or password. Please try again.';
      
      // Handle Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please check your email or register.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format. Please check your email.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid credentials. Please check your email and password.';
            break;
          case 'auth/internal-error':
            errorMessage = 'Internal error occurred. Please try again.';
            break;
          default:
            errorMessage = `Authentication error: ${error.message}`;
        }
      }
      
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Grid container sx={{ height: '100vh' }}>
        {/* Left side - Branding (hidden on mobile) */}
        {!isMobile && (
          <Grid 
            item 
            xs={false} 
            sm={4} 
            md={7} 
            sx={{
              backgroundImage: theme.custom.gradients.primary,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              padding: 4
            }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
              <Business sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Company Registration
              </Typography>
              <Typography variant="h6" component="p" gutterBottom>
                Streamline your business registration process
              </Typography>
              <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic' }}>
                "Join thousands of companies who have simplified their registration process with our platform"
              </Typography>
              
              {/* Home Button */}
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{
                  mt: 4,
                  borderRadius: '8px',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Grid>
        )}
        
        {/* Right side - Login form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: isMobile ? 4 : 8,
              mx: isMobile ? 2 : 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Back button for mobile */}
            {isMobile && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/')}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Home
                </Button>
              </Box>
            )}
            
            <Typography component="h1" variant={isMobile ? "h4" : "h3"} sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Sign in to your company account
            </Typography>
            
            {loginError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, maxWidth: 400 }}>
                {loginError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" size="small" />}
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  background: theme.custom.gradients.primary,
                  '&:hover': {
                    background: theme.custom.gradients.primary,
                    opacity: 0.9
                  },
                  fontWeight: 'bold',
                  textTransform: 'none'
                }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="body2">
                  <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                    Login with OTP
                  </Link>
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link href="/register" variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewLogin;