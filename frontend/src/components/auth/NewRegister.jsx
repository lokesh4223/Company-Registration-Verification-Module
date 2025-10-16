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
  FormControlLabel,
  Checkbox,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  PersonOutlined, 
  EmailOutlined, 
  LockOutlined,
  Phone,
  Business,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { auth, createUserWithEmailAndPassword } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../store/userSlice';
import OTPVerificationModal from './OTPVerificationModal';

const NewRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      gender: '',
      password: '',
      confirmPassword: ''
    }
  });
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    'Account Info',
    'Personal Details', 
    'Verify Phone'
  ];

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    console.log('Phone state:', phone);
    console.log('Terms accepted:', termsAccepted);
    
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!termsAccepted) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }

    if (!phone) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setRegistrationError('');
    
    try {
      // Firebase authentication - create user in Firebase
      console.log('Creating user in Firebase with email:', data.email);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log('Firebase user created:', user.email);
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      console.log('Firebase ID token obtained');
      
      // Send to backend to create user in our database
      const userData = {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        gender: data.gender,
        mobile_no: phone,
        signup_type: 'e',
        is_mobile_verified: false, // Set to false initially for OTP verification
        is_email_verified: user.emailVerified // Use Firebase's email verification status
      };
      
      console.log('Sending user data to backend:', userData);
      
      const response = await authAPI.firebaseLogin({ idToken, userData });
      const result = response.data;
      
      console.log('Backend response:', result);
      
      if (result.success) {
        // Store registered user data
        const userDataWithId = {
          ...userData,
          id: result.data.user.id,
          is_mobile_verified: false
        };
        setRegisteredUser(userDataWithId);
        
        // Show OTP verification modal
        setShowOtpModal(true);
        
        toast.success('Registration successful! Please verify your phone number.');
      } else {
        setRegistrationError(result.message || 'Registration failed. Please try again.');
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
      
      setRegistrationError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerificationSuccess = (verifiedUser) => {
    // Close OTP modal
    setShowOtpModal(false);
    
    // Dispatch user and token to Redux store
    dispatch(setUser(verifiedUser));
    dispatch(setToken(verifiedUser.token));
    
    // Redirect to onboarding process
    toast.success('Phone number verified successfully!');
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    // Optionally logout the user or handle cancellation
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
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
              autoComplete="new-password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
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
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => 
                  value === watch('password') || 'Passwords do not match'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              name="full_name"
              autoComplete="name"
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: errors.gender ? 'error.main' : 'inherit' }}>
                Gender *
              </Typography>
              <FormControl fullWidth error={!!errors.gender}>
                <Select
                  id="gender"
                  {...register('gender', { required: 'Gender is required' })}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Gender
                  </MenuItem>
                  <MenuItem value="m">Male</MenuItem>
                  <MenuItem value="f">Female</MenuItem>
                  <MenuItem value="o">Other</MenuItem>
                </Select>
                {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
              </FormControl>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Mobile Number *
              </Typography>
              <PhoneInput
                country={'in'}
                value={phone || ''} // Ensure value is always a string
                onChange={phone => {
                  console.log('Phone changed to:', phone);
                  setPhone(phone);
                }}
                inputProps={{
                  name: 'mobile_no',
                  required: true
                }}
                containerStyle={{ width: '100%' }}
                inputStyle={{ width: '100%' }}
              />
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="body1">
                {phone || 'No phone number provided'}
              </Typography>
            </Box>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              We'll send a verification code to your phone number to complete registration
            </Alert>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link href="#" onClick={(e) => e.preventDefault()}>Terms of Service</Link> and <Link href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          </>
        );
      default:
        return 'Unknown step';
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
        
        {/* Right side - Registration form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: isMobile ? 2 : 4,
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
            
            <Typography component="h1" variant={isMobile ? "h4" : "h3"} sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Register your company account
            </Typography>
            
            <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ 
                '& .MuiStepConnector-line': { 
                  borderColor: theme.palette.divider 
                } 
              }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel 
                      sx={{
                        '& .MuiStepLabel-label': {
                          ...(activeStep === steps.indexOf(label) && {
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                          }),
                          '&.Mui-completed': {
                            color: theme.palette.success.main
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
            
            {registrationError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, maxWidth: 400 }}>
                {registrationError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !termsAccepted}
                    sx={{ 
                      borderRadius: '8px',
                      background: theme.custom.gradients.primary,
                      '&:hover': {
                        background: theme.custom.gradients.primary,
                        opacity: 0.9
                      },
                      fontWeight: 'bold',
                      textTransform: 'none'
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Complete Registration'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ 
                      borderRadius: '8px',
                      background: theme.custom.gradients.primary,
                      '&:hover': {
                        background: theme.custom.gradients.primary,
                        opacity: 0.9
                      },
                      fontWeight: 'bold',
                      textTransform: 'none'
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
              
              {activeStep === steps.length - 1 && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link href="/login" variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* OTP Verification Modal */}
      {registeredUser && (
        <OTPVerificationModal
          open={showOtpModal}
          onClose={handleCloseOtpModal}
          user={registeredUser}
          phoneNumber={phone}
          onVerificationSuccess={handleOtpVerificationSuccess}
        />
      )}
    </Container>
  );
};

export default NewRegister;