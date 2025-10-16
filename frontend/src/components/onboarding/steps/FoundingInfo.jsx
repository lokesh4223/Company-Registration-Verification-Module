import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  FormHelperText
} from '@mui/material';
import { 
  CorporateFare,
  Groups,
  CalendarToday,
  Language,
  Visibility
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { companyAPI } from '../../../services/api';

const FoundingInfo = ({ onPrevious, onNext, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      organizationType: initialData.organization_type || '',
      industryType: initialData.industry_type || '',
      teamSize: initialData.team_size || '',
      yearOfEstablishment: initialData.founded_date || '',
      companyWebsite: initialData.website || '',
      companyVision: initialData.company_vision || ''
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare founding info data
      const foundingData = {
        organization_type: data.organizationType,
        industry_type: data.industryType,
        team_size: data.teamSize,
        founded_date: data.yearOfEstablishment,
        website: data.companyWebsite,
        company_vision: data.companyVision
      };

      // Update company profile with founding info
      const response = await companyAPI.updateProfile(foundingData);
      
      if (response && response.data.success) {
        toast.success('Founding Info saved successfully!');
        onNext(foundingData);
      } else {
        toast.error(response?.data?.message || 'Failed to save founding information');
      }
    } catch (error) {
      console.error('Error saving founding info:', error);
      toast.error('Failed to save founding information. Please try again.');
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
          <CorporateFare sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Founding Information
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Share details about your company's foundation
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* First Row */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.organizationType}>
              <InputLabel id="organization-type-label">Organization Type</InputLabel>
              <Select
                labelId="organization-type-label"
                label="Organization Type"
                {...register('organizationType', { required: 'Organization type is required' })}
              >
                <MenuItem value="Private">Private</MenuItem>
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Non-Profit">Non-Profit</MenuItem>
                <MenuItem value="Government">Government</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
              </Select>
              {errors.organizationType && <FormHelperText>{errors.organizationType.message}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.industryType}>
              <InputLabel id="industry-type-label">Industry Type</InputLabel>
              <Select
                labelId="industry-type-label"
                label="Industry Type"
                {...register('industryType', { required: 'Industry type is required' })}
              >
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
                <MenuItem value="Hospitality">Hospitality</MenuItem>
                <MenuItem value="Media">Media & Entertainment</MenuItem>
                <MenuItem value="Transportation">Transportation</MenuItem>
                <MenuItem value="Energy">Energy</MenuItem>
              </Select>
              {errors.industryType && <FormHelperText>{errors.industryType.message}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Second Row */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.teamSize}>
              <InputLabel id="team-size-label">Team Size</InputLabel>
              <Select
                labelId="team-size-label"
                label="Team Size"
                {...register('teamSize', { required: 'Team size is required' })}
              >
                <MenuItem value="1-10">1-10 employees</MenuItem>
                <MenuItem value="11-50">11-50 employees</MenuItem>
                <MenuItem value="51-200">51-200 employees</MenuItem>
                <MenuItem value="201-500">201-500 employees</MenuItem>
                <MenuItem value="501-1000">501-1000 employees</MenuItem>
                <MenuItem value="1000+">1000+ employees</MenuItem>
              </Select>
              {errors.teamSize && <FormHelperText>{errors.teamSize.message}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year of Establishment"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('yearOfEstablishment', { required: 'Year of establishment is required' })}
              error={!!errors.yearOfEstablishment}
              helperText={errors.yearOfEstablishment?.message}
              InputProps={{
                startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          {/* Third Row */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Website"
              {...register('companyWebsite', { 
                required: 'Company website is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL'
                }
              })}
              error={!!errors.companyWebsite}
              helperText={errors.companyWebsite?.message}
              InputProps={{
                startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          {/* Fourth Row */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Vision"
              multiline
              rows={4}
              {...register('companyVision', { required: 'Company vision is required' })}
              error={!!errors.companyVision}
              helperText={errors.companyVision?.message}
              InputProps={{
                startAdornment: <Visibility sx={{ mr: 1, color: 'text.secondary' }} />
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
                {loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FoundingInfo;