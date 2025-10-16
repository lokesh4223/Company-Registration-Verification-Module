import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton
} from '@mui/material';
import { 
  Share,
  Link as LinkIcon,
  Delete,
  Add
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { companyAPI } from '../../../services/api';
import { formatSocialLinks } from '../../../utils/formatSocialLinks';

const SocialMediaProfile = ({ onPrevious, onNext, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      socialLinks: initialData.social_links || [{ platform: '', url: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks"
  });
  
  const [loading, setLoading] = useState(false);
  
  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'snapchat', label: 'Snapchat' }
  ];

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare social media data with proper formatting
      const formattedSocialLinks = formatSocialLinks(data.socialLinks);
      const socialMediaData = {
        social_links: formattedSocialLinks
      };

      // Update company profile with social media info
      const response = await companyAPI.updateProfile(socialMediaData);
      
      if (response && response.data.success) {
        toast.success('Social Media Profile saved successfully!');
        onNext(socialMediaData);
      } else {
        toast.error(response?.data?.message || 'Failed to save social media information');
      }
    } catch (error) {
      console.error('Error saving social media info:', error);
      toast.error('Failed to save social media information. Please try again.');
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
          <Share sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Social Media Profile
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Connect your company's social media accounts
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Social Links */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Social Media Links
            </Typography>
            
            {fields.map((field, index) => (
              <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth error={!!errors.socialLinks?.[index]?.platform}>
                    <InputLabel id={`platform-label-${index}`}>Platform</InputLabel>
                    <Select
                      labelId={`platform-label-${index}`}
                      label="Platform"
                      {...register(`socialLinks.${index}.platform`, { required: 'Platform is required' })}
                    >
                      {platforms.map((platform) => (
                        <MenuItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.socialLinks?.[index]?.platform && (
                      <FormHelperText>{errors.socialLinks[index].platform.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth
                    label="Profile URL"
                    {...register(`socialLinks.${index}.url`, { 
                      required: 'URL is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL'
                      }
                    })}
                    error={!!errors.socialLinks?.[index]?.url}
                    helperText={errors.socialLinks?.[index]?.url?.message}
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    sx={{ 
                      mt: 1,
                      color: fields.length <= 1 ? 'text.disabled' : 'error.main'
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                onClick={() => append({ platform: '', url: '' })}
                variant="outlined"
                startIcon={<Add />}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)'
                  }
                }}
              >
                Add Social Link
              </Button>
            </Box>
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
                {loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SocialMediaProfile;