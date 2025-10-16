import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper,
  FormControlLabel,
  Switch,
  IconButton
} from '@mui/material';
import { 
  CloudUpload, 
  Link as LinkIcon,
  Business,
  LocationOn,
  Public,
  Description,
  Language
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { companyAPI } from '../../../services/api';

const CompanyInfo = ({ onNext, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      companyName: initialData.company_name || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      country: initialData.country || '',
      postalCode: initialData.postal_code || '',
      website: initialData.website || '',
      industry: initialData.industry || '',
      description: initialData.description || ''
    }
  });
  
  const [logoPreview, setLogoPreview] = useState(initialData.logo_url || null);
  const [bannerPreview, setBannerPreview] = useState(initialData.banner_url || null);
  const [useLogoUrl, setUseLogoUrl] = useState(false);
  const [useBannerUrl, setUseBannerUrl] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Watch for changes in URL switches
  const watchUseLogoUrl = watch('useLogoUrl');
  const watchUseBannerUrl = watch('useBannerUrl');

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Logo file size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner upload
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Banner file size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare company data
      const companyData = {
        company_name: data.companyName,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postalCode,
        industry: data.industry,
        description: data.description,
        website: data.website || null
      };

      // Add logo if available
      if (logoPreview) {
        if (useLogoUrl) {
          companyData.logo_url = logoUrl;
        } else {
          companyData.logo_url = logoPreview;
        }
      }

      // Add banner if available
      if (bannerPreview) {
        if (useBannerUrl) {
          companyData.banner_url = bannerUrl;
        } else {
          companyData.banner_url = bannerPreview;
        }
      }

      // Send data to backend
      const response = await companyAPI.register(companyData);
      
      if (response && response.data.success) {
        toast.success('Company Info saved successfully!');
        onNext(companyData);
      } else {
        toast.error(response?.data?.message || 'Failed to save company information');
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company information. Please try again.');
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
          <Business sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Company Information
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Tell us about your company
        </Typography>
      </Box>
      
      {/* Logo & Banner Upload */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <Business sx={{ mr: 1, color: 'primary.main' }} />
          Branding Assets
        </Typography>
        
        <Grid container spacing={4}>
          {/* Logo Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useLogoUrl}
                    onChange={(e) => setUseLogoUrl(e.target.checked)}
                    name="useLogoUrl"
                  />
                }
                label="Use Logo URL instead of upload"
              />
            </Box>
            
            {useLogoUrl ? (
              <TextField
                fullWidth
                label="Logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                placeholder="https://example.com/logo.png"
              />
            ) : (
              <Box 
                sx={{ 
                  border: '2px dashed #e0e0e0', 
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  position: 'relative',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main'
                  }
                }}
              >
                {logoPreview ? (
                  <Box 
                    component="img" 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                      Upload Logo
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      400x400px, 5MB max
                    </Typography>
                  </>
                )}
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  id="logo-upload"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="logo-upload">
                  <Button 
                    component="span" 
                    variant="outlined" 
                    sx={{ mt: 1, textTransform: 'none', borderRadius: '8px' }}
                  >
                    Choose File
                  </Button>
                </label>
              </Box>
            )}
          </Grid>
          
          {/* Banner Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useBannerUrl}
                    onChange={(e) => setUseBannerUrl(e.target.checked)}
                    name="useBannerUrl"
                  />
                }
                label="Use Banner URL instead of upload"
              />
            </Box>
            
            {useBannerUrl ? (
              <TextField
                fullWidth
                label="Banner URL"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                placeholder="https://example.com/banner.png"
              />
            ) : (
              <Box 
                sx={{ 
                  border: '2px dashed #e0e0e0', 
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  position: 'relative',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main'
                  }
                }}
              >
                {bannerPreview ? (
                  <Box 
                    component="img" 
                    src={bannerPreview} 
                    alt="Banner Preview" 
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                      Upload Banner
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      1520x400px, 5MB max
                    </Typography>
                  </>
                )}
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  id="banner-upload"
                  onChange={handleBannerUpload}
                />
                <label htmlFor="banner-upload">
                  <Button 
                    component="span" 
                    variant="outlined" 
                    sx={{ mt: 1, textTransform: 'none', borderRadius: '8px' }}
                  >
                    Choose File
                  </Button>
                </label>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      
      {/* Company Details Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Company Name"
              {...register('companyName', { required: 'Company name is required' })}
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
              InputProps={{
                startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Address"
              multiline
              rows={3}
              {...register('address', { required: 'Address is required' })}
              error={!!errors.address}
              helperText={errors.address?.message}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="City"
              {...register('city', { required: 'City is required' })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="State"
              {...register('state', { required: 'State is required' })}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Country"
              {...register('country', { required: 'Country is required' })}
              error={!!errors.country}
              helperText={errors.country?.message}
              InputProps={{
                startAdornment: <Public sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Postal Code"
              {...register('postalCode', { required: 'Postal code is required' })}
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              type="url"
              {...register('website')}
              error={!!errors.website}
              helperText={errors.website?.message}
              InputProps={{
                startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Industry"
              {...register('industry', { required: 'Industry is required' })}
              error={!!errors.industry}
              helperText={errors.industry?.message}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              InputProps={{
                startAdornment: <Description sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                {loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CompanyInfo;