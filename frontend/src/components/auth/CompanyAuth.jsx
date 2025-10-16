import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../store/userSlice';

const CompanyAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Form states
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOTPVerification, setIsOTPVerification] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailForOTP, setEmailForOTP] = useState('');
  
  // Form hooks
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });
  const [newPasswordData, setNewPasswordData] = useState({ password: '', confirmPassword: '' });

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle login
  const handleLogin = async (data) => {
    setLoading(true);
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
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/onboarding/company-info');
        }, 1000);
      } else {
        toast.error(result.message || 'Login failed. Please check your credentials.');
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
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password authentication is not enabled. Please contact support.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
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
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Send to backend to create user in our database
      const userData = {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        signup_type: 'e',
        is_mobile_verified: true, // Set to true since we're removing OTP verification
        is_email_verified: user.emailVerified // Use Firebase's email verification status
      };
      
      const response = await authAPI.firebaseLogin({ idToken, userData });
      const result = response.data;
      
      if (result.success) {
        // Dispatch user and token to Redux store
        dispatch(setUser(result.data.user));
        dispatch(setToken(result.data.token));
        toast.success('Registration successful! Welcome to our platform.');
        
        // Redirect to onboarding directly (no OTP verification)
        setTimeout(() => {
          navigate('/onboarding/company-info');
        }, 1000);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account already exists with this email. Please try logging in.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format. Please check your email.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password registration is not enabled. Please contact support.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use a stronger password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          default:
            errorMessage = `Registration error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!forgotPasswordData.email) {
      toast.error('Please enter your email address');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(forgotPasswordData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      // Call backend API to send reset password email
      const response = await authAPI.forgotPassword({ email: forgotPasswordData.email });
      const result = response.data;
      
      if (result.success) {
        setEmailForOTP(forgotPasswordData.email);
        setIsForgotPassword(false);
        setIsOTPVerification(true);
        toast.success(result.message || 'OTP sent to your email address');
      } else {
        toast.error(result.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify the OTP with the backend
      const response = await authAPI.verifyEmailOTP({ 
        email: emailForOTP, 
        otp: otp 
      });
      const result = response.data;
      
      if (result.success) {
        toast.success(result.message || 'Email OTP verified successfully!');
        setIsOTPVerification(false);
        setIsNewPassword(true);
      } else {
        toast.error(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      // Call backend API to resend OTP
      const response = await authAPI.sendEmailOTP({ email: emailForOTP });
      const result = response.data;
      
      if (result.success) {
        toast.success(result.message || 'OTP resent to your email address');
      } else {
        toast.error(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  // Handle new password
  const handleNewPassword = async () => {
    if (!newPasswordData.password) {
      toast.error('Please enter a new password');
      return;
    }
    
    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPasswordData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      // Call backend API to update the password
      const response = await authAPI.resetPassword({ 
        email: emailForOTP, 
        password: newPasswordData.password 
      });
      const result = response.data;
      
      if (result.success) {
        toast.success(result.message || 'Password updated successfully!');
        setIsNewPassword(false);
        setIsLogin(true);
        reset();
      } else {
        toast.error(result.message || 'Failed to update password. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Back to login
  const backToLogin = () => {
    setIsLogin(true);
    setIsForgotPassword(false);
    setIsOTPVerification(false);
    setIsNewPassword(false);
    reset();
  };

  return (
    <Container component="main" maxWidth={false} disableGutters>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0d6efd, #0b5ed7)',
          padding: 2
        }}
      >
        <Grid container sx={{ 
          position: 'relative',
          width: '850px',
          height: '550px',
          background: '#fff',
          margin: '20px',
          borderRadius: '30px',
          boxShadow: '0 0 30px rgba(0, 0, 0, .2)',
          overflow: 'hidden'
        }}>
          {/* Login Form */}
          {isLogin && !isForgotPassword && !isOTPVerification && !isNewPassword && (
            <>
              <Grid item xs={12} md={6} sx={{
                position: 'absolute',
                right: 0,
                width: { xs: '100%', md: '50%' },
                height: '100%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                color: '#333',
                textAlign: 'center',
                padding: '40px',
                zIndex: 1
              }}>
                <Box sx={{ width: '100%' }}>
                  <Typography component="h1" variant="h4" sx={{ 
                    fontSize: { xs: '24px', sm: '28px', md: '36px' },
                    margin: '-10px 0 15px'
                  }}>
                    Login
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ width: '100%' }}>
                    <Box sx={{ position: 'relative', margin: '30px 0' }}>
                      <TextField
                        fullWidth
                        id="email"
                        placeholder="Email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '13px 50px 13px 20px',
                            background: '#eee',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ position: 'relative', margin: '30px 0' }}>
                      <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        {...register('password', { required: 'Password is required' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '13px 50px 13px 20px',
                            background: '#eee',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                sx={{ color: '#888' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ textAlign: 'left', margin: '-15px 0 15px' }}>
                      <Link 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setIsForgotPassword(true);
                        }}
                        sx={{ 
                          fontSize: '14.5px',
                          color: '#333',
                          textDecoration: 'none'
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        width: '100%',
                        height: '48px',
                        background: '#7494ec',
                        borderRadius: '8px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: '#5a7bd9'
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
                    </Button>
                    
                    <Typography sx={{ 
                      fontSize: '14.5px',
                      margin: '15px 0'
                    }}>
                      or login with social platforms
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
                      </IconButton>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/color/24/000000/facebook-new.png" alt="Facebook" />
                      </IconButton>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/ios-filled/24/000000/github.png" alt="GitHub" />
                      </IconButton>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/color/24/000000/linkedin.png" alt="LinkedIn" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              {/* Register Toggle Panel */}
              <Box sx={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}>
                <Box sx={{
                  content: '""',
                  position: 'absolute',
                  left: '-250%',
                  width: '300%',
                  height: '100%',
                  background: '#7494ec',
                  borderRadius: '150px',
                  zIndex: 2,
                  transition: '1.8s ease-in-out'
                }} />
                
                <Box sx={{
                  position: 'absolute',
                  width: '50%',
                  height: '100%',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  transition: '.6s ease-in-out',
                  left: 0,
                  transitionDelay: '1.2s'
                }}>
                  <Typography component="h1" variant="h4" sx={{ 
                    fontSize: { xs: '18px', sm: '20px', md: '36px' },
                    margin: '0 0 20px'
                  }}>
                    Hello, Welcome!
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '14.5px',
                    marginBottom: '20px'
                  }}>
                    Don't have an account?
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={toggleAuthMode}
                    sx={{
                      width: '160px',
                      height: '46px',
                      background: 'transparent',
                      border: '2px solid #fff',
                      boxShadow: 'none',
                      color: '#fff',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </Box>
                
                <Box sx={{
                  position: 'absolute',
                  width: '50%',
                  height: '100%',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  transition: '.6s ease-in-out',
                  right: '-50%',
                  transitionDelay: '.6s'
                }}>
                  <Typography component="h1" variant="h4" sx={{ 
                    fontSize: { xs: '18px', sm: '20px', md: '36px' },
                    margin: '0 0 20px'
                  }}>
                    Welcome Back!
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '14.5px',
                    marginBottom: '20px'
                  }}>
                    Already have an account?
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={toggleAuthMode}
                    sx={{
                      width: '160px',
                      height: '46px',
                      background: 'transparent',
                      border: '2px solid #fff',
                      boxShadow: 'none',
                      color: '#fff',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </>
          )}
          
          {/* Registration Form */}
          {!isLogin && !isForgotPassword && !isOTPVerification && !isNewPassword && (
            <>
              <Grid item xs={12} md={6} sx={{
                position: 'absolute',
                right: { xs: 0, md: '50%' },
                width: { xs: '100%', md: '50%' },
                height: '100%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                color: '#333',
                textAlign: 'center',
                padding: '40px',
                zIndex: 1,
                transition: '.6s ease-in-out 1.2s, visibility 0s 1s'
              }}>
                <Box sx={{ width: '100%' }}>
                  <Typography component="h1" variant="h4" sx={{ 
                    fontSize: { xs: '24px', sm: '28px', md: '36px' },
                    margin: '-10px 0 15px'
                  }}>
                    Registration
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubmit(handleRegister)} sx={{ width: '100%' }}>
                    <Box sx={{ position: 'relative', margin: '30px 0' }}>
                      <TextField
                        fullWidth
                        id="full_name"
                        placeholder="Full Name"
                        {...register('full_name', { required: 'Full name is required' })}
                        error={!!errors.full_name}
                        helperText={errors.full_name?.message}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '13px 50px 13px 20px',
                            background: '#eee',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ position: 'relative', margin: '30px 0' }}>
                      <TextField
                        fullWidth
                        id="email"
                        placeholder="Email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '13px 50px 13px 20px',
                            background: '#eee',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ position: 'relative', margin: '30px 0' }}>
                      <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '13px 50px 13px 20px',
                            background: '#eee',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                sx={{ color: '#888' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ position: 'relative', margin: '30px 0' }}>
                      <TextField
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: (value) => 
                            value === watch('password') || 'Passwords do not match'
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '13px 50px 13px 20px',
                            background: '#eee',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                                edge="end"
                                sx={{ color: '#888' }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        width: '100%',
                        height: '48px',
                        background: '#7494ec',
                        borderRadius: '8px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: '#5a7bd9'
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
                    </Button>
                    
                    <Typography sx={{ 
                      fontSize: '14.5px',
                      margin: '15px 0'
                    }}>
                      or register with social platforms
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
                      </IconButton>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/color/24/000000/facebook-new.png" alt="Facebook" />
                      </IconButton>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/ios-filled/24/000000/github.png" alt="GitHub" />
                      </IconButton>
                      <IconButton sx={{
                        display: 'inline-flex',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '24px',
                        color: '#333',
                        margin: '0 8px'
                      }}>
                        <img src="https://img.icons8.com/color/24/000000/linkedin.png" alt="LinkedIn" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              {/* Login Toggle Panel */}
              <Box sx={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}>
                <Box sx={{
                  content: '""',
                  position: 'absolute',
                  left: '-250%',
                  width: '300%',
                  height: '100%',
                  background: '#7494ec',
                  borderRadius: '150px',
                  zIndex: 2,
                  transition: '1.8s ease-in-out'
                }} />
                
                <Box sx={{
                  position: 'absolute',
                  width: '50%',
                  height: '100%',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  transition: '.6s ease-in-out',
                  left: 0,
                  transitionDelay: '1.2s'
                }}>
                  <Typography component="h1" variant="h4" sx={{ 
                    fontSize: { xs: '18px', sm: '20px', md: '36px' },
                    margin: '0 0 20px'
                  }}>
                    Hello, Welcome!
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '14.5px',
                    marginBottom: '20px'
                  }}>
                    Don't have an account?
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={toggleAuthMode}
                    sx={{
                      width: '160px',
                      height: '46px',
                      background: 'transparent',
                      border: '2px solid #fff',
                      boxShadow: 'none',
                      color: '#fff',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </Box>
                
                <Box sx={{
                  position: 'absolute',
                  width: '50%',
                  height: '100%',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  transition: '.6s ease-in-out',
                  right: '-50%',
                  transitionDelay: '.6s'
                }}>
                  <Typography component="h1" variant="h4" sx={{ 
                    fontSize: { xs: '18px', sm: '20px', md: '36px' },
                    margin: '0 0 20px'
                  }}>
                    Welcome Back!
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '14.5px',
                    marginBottom: '20px'
                  }}>
                    Already have an account?
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={toggleAuthMode}
                    sx={{
                      width: '160px',
                      height: '46px',
                      background: 'transparent',
                      border: '2px solid #fff',
                      boxShadow: 'none',
                      color: '#fff',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </>
          )}
          
          {/* Forgot Password Form */}
          {isForgotPassword && (
            <Grid item xs={12} md={6} sx={{
              position: 'absolute',
              right: 0,
              width: { xs: '100%', md: '50%' },
              height: '100%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              color: '#333',
              textAlign: 'center',
              padding: '40px',
              zIndex: 1
            }}>
              <Box sx={{ width: '100%' }}>
                <Typography component="h1" variant="h4" sx={{ 
                  fontSize: { xs: '24px', sm: '28px', md: '36px' },
                  margin: '-10px 0 15px'
                }}>
                  Forgot Password
                </Typography>
                <Typography sx={{ 
                  fontSize: '14.5px',
                  margin: '15px 0'
                }}>
                  Enter your email to reset your password
                </Typography>
                
                <Box sx={{ position: 'relative', margin: '30px 0' }}>
                  <TextField
                    fullWidth
                    id="forgot-email"
                    placeholder="Email"
                    value={forgotPasswordData.email}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: '13px 50px 13px 20px',
                        background: '#eee',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#888' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  sx={{
                    width: '100%',
                    height: '48px',
                    background: '#7494ec',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#fff',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: '#5a7bd9'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Continue'}
                </Button>
                
                <Box sx={{ margin: '20px 0' }}>
                  <Link 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      backToLogin();
                    }}
                    sx={{ 
                      color: '#333',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <ArrowBackIcon sx={{ marginRight: '5px' }} /> Back to Login
                  </Link>
                </Box>
              </Box>
            </Grid>
          )}
          
          {/* OTP Verification Form */}
          {isOTPVerification && (
            <Grid item xs={12} md={6} sx={{
              position: 'absolute',
              right: 0,
              width: { xs: '100%', md: '50%' },
              height: '100%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              color: '#333',
              textAlign: 'center',
              padding: '40px',
              zIndex: 1
            }}>
              <Box sx={{ width: '100%' }}>
                <Typography component="h1" variant="h4" sx={{ 
                  fontSize: { xs: '24px', sm: '28px', md: '36px' },
                  margin: '-10px 0 15px'
                }}>
                  Security Verification
                </Typography>
                <Typography sx={{ 
                  color: '#666',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  margin: '15px 0 30px',
                  lineHeight: 1.5
                }}>
                  We've sent a verification code to your email: <strong>{emailForOTP}</strong>. Please enter it below to continue.
                </Typography>
                
                <Box sx={{ position: 'relative', margin: '30px 0' }}>
                  <TextField
                    fullWidth
                    id="otp"
                    placeholder="Enter verification code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: '13px 50px 13px 20px',
                        background: '#eee',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#888' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOTPVerify}
                  disabled={loading}
                  sx={{
                    width: '100%',
                    height: '48px',
                    background: '#7494ec',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#fff',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: '#5a7bd9'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit'}
                </Button>
                
                <Box sx={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ 
                    color: '#777', 
                    fontSize: '14px' 
                  }}>
                    <Link 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleAuthMode();
                      }}
                      sx={{ color: '#777', textDecoration: 'none' }}
                    >
                      Signup now
                    </Link>
                  </Typography>
                  <Typography sx={{ 
                    color: '#777', 
                    fontSize: '14px' 
                  }}>
                    <Link 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        backToLogin();
                      }}
                      sx={{ color: '#777', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <ArrowBackIcon sx={{ marginRight: '5px' }} /> Login
                    </Link>
                  </Typography>
                </Box>
                
                <Box sx={{ margin: '20px 0' }}>
                  <Button 
                    onClick={handleResendOTP}
                    sx={{ 
                      color: '#333',
                      textDecoration: 'none',
                      padding: 0,
                      minWidth: 0
                    }}
                  >
                    Resend OTP
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
          
          {/* New Password Form */}
          {isNewPassword && (
            <Grid item xs={12} md={6} sx={{
              position: 'absolute',
              right: 0,
              width: { xs: '100%', md: '50%' },
              height: '100%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              color: '#333',
              textAlign: 'center',
              padding: '40px',
              zIndex: 1
            }}>
              <Box sx={{ width: '100%' }}>
                <Typography component="h1" variant="h4" sx={{ 
                  fontSize: { xs: '24px', sm: '28px', md: '36px' },
                  margin: '-10px 0 15px'
                }}>
                  New Password
                </Typography>
                <Typography sx={{ 
                  color: '#666',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  margin: '15px 0 30px',
                  lineHeight: 1.5
                }}>
                  Create a new password for your account
                </Typography>
                
                <Box sx={{ position: 'relative', margin: '30px 0' }}>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    id="new-password"
                    placeholder="New Password"
                    value={newPasswordData.password}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: '13px 50px 13px 20px',
                        background: '#eee',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#888' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: '#888' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                
                <Box sx={{ position: 'relative', margin: '30px 0' }}>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-new-password"
                    placeholder="Confirm Password"
                    value={newPasswordData.confirmPassword}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: '13px 50px 13px 20px',
                        background: '#eee',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#888' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            sx={{ color: '#888' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleNewPassword}
                  disabled={loading}
                  sx={{
                    width: '100%',
                    height: '48px',
                    background: '#7494ec',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#fff',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: '#5a7bd9'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Update Password'}
                </Button>
                
                <Box sx={{ margin: '20px 0' }}>
                  <Link 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      backToLogin();
                    }}
                    sx={{ 
                      color: '#333',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <ArrowBackIcon sx={{ marginRight: '5px' }} /> Back to Login
                  </Link>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CompanyAuth;