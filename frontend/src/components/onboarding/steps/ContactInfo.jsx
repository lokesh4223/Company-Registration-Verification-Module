import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper
} from '@mui/material';
import { 
  ContactMail,
  LocationOn, 
  Email, 
  Phone
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { companyAPI } from '../../../services/api';

const ContactInfo = ({ onPrevious, onNext, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      mapLocation: initialData.map_location || '',
      email: initialData.contact_email || '',
      phone: initialData.phone || ''
    }
  });
  
  const [phone, setPhone] = useState(initialData.phone || '');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare contact info data
      const contactData = {
        phone: phone,
        contact_email: data.email,
        map_location: data.mapLocation
      };

      // Update company profile with contact info
      const response = await companyAPI.updateProfile(contactData);
      
      if (response && response.data.success) {
        toast.success('Contact Info saved successfully!');
        onNext(contactData);
      } else {
        toast.error(response?.data?.message || 'Failed to save contact information');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box 
          sx={{ 
            width: 60, 
            height: 60, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            color: 'white'
          }}
        >
          <ContactMail sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Contact Information
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          How can people reach your company?
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Map Location"
              {...register('mapLocation', { required: 'Map location is required' })}
              error={!!errors.mapLocation}
              helperText={errors.mapLocation?.message}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Phone Number
              </Typography>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={phone => setPhone(phone)}
                inputProps={{
                  name: 'phone',
                  required: true
                }}
                containerStyle={{ width: '100%' }}
                inputStyle={{ width: '100%', height: '56px' }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
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
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={onPrevious}
                variant="outlined"
                size="large"
                sx={{ 
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none'
                }}
              >
                Back
              </Button>
              
              <Button 
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  fontWeight: 'bold',
                  textTransform: 'none'
                }}
              >
                {loading ? 'Saving...' : 'Finish Setup'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ContactInfo;