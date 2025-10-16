import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import { authAPI, setAuthToken } from '../../services/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../store/userSlice';

const OTPVerificationModal = ({ open, onClose, user, phoneNumber, onVerificationSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0 && open) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, open]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle paste OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pasteArray.length === 6) {
      setOtp(pasteArray);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    
    setLoading(true);
    try {
      // Use actual verification endpoint
      const response = await authAPI.verifyMobile({
        user_id: user.id,
        otp: otpString
      });
      
      if (response.data.success) {
        toast.success('OTP verified successfully!');
        
        // Use the token from the backend response
        const token = response.data.data.token;
        
        // Create a complete user object with verification status
        const verifiedUser = {
          ...response.data.data.user,
          is_mobile_verified: true,
          token: token
        };
        
        // Dispatch verified user to Redux store
        dispatch(setUser(verifiedUser));
        dispatch(setToken(token));
        
        // Also update the axios default headers
        setAuthToken(token);
        
        onVerificationSuccess(verifiedUser);
      } else {
        toast.error(response.data.message || 'Invalid OTP. Please try again.');
        // Clear OTP fields
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResending(true);
    try {
      // In a real implementation, you would call an API to resend OTP
      // For now, we'll just reset the timer and show a success message
      setTimer(30);
      toast.success('OTP resent successfully! (This is a demo - in production, a real OTP would be sent)');
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerifyOtp();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Verify Your Phone Number
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            We've sent a 6-digit code to your phone number:
          </Typography>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              mb: 3, 
              textAlign: 'center', 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {phoneNumber}
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Enter the 6-digit verification code below
          </Alert>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  variant="outlined"
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.5rem' }
                  }}
                  sx={{
                    width: '50px',
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px'
                      }
                    }
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                onClick={handleResendOtp}
                disabled={resending || timer > 0}
                sx={{ textTransform: 'none' }}
              >
                {resending ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Resending...
                  </>
                ) : timer > 0 ? (
                  `Resend OTP in ${timer}s`
                ) : (
                  'Resend OTP'
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: '16px',
            px: 4,
            mr: 2
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleVerifyOtp}
          variant="contained"
          disabled={loading || otp.join('').length !== 6}
          sx={{ 
            borderRadius: '16px',
            px: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPVerificationModal;