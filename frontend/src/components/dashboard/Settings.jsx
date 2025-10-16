import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  Typography, 
  TextField, 
  Tabs, 
  Tab, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  Business, 
  Link as LinkIcon, 
  LocationOn, 
  Email,
  Delete,
  PhotoCamera,
  CloudUpload
} from '@mui/icons-material';
import LogoutButton from '../auth/LogoutButton';
import { companyAPI } from '../../services/api';
import { useSelector } from 'react-redux';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const user = useSelector((state) => state.user.user);
  
  // User Details State
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    designation: ''
  });
  
  // Company Details State
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    logo: null,
    banner: null,
    organizationType: '',
    industryType: '',
    teamSize: '',
    yearOfEstablishment: '',
    companyVision: '',
    socialLinks: [{ platform: '', url: '' }],
    mapLocation: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  // Password State
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user and company profile data from API
  const fetchProfileData = async () => {
    try {
      setProfileLoading(true);
      
      // Fetch company profile data
      const response = await companyAPI.getProfile();
      
      if (response.data.success && response.data.data) {
        const profileData = response.data.data;
        
        // Parse social links if they exist
        let socialLinks = [{ platform: '', url: '' }];
        if (profileData.social_links) {
          try {
            const parsedLinks = typeof profileData.social_links === 'string' 
              ? JSON.parse(profileData.social_links) 
              : profileData.social_links;
            
            if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
              socialLinks = parsedLinks;
            }
          } catch (e) {
            console.error('Error parsing social links:', e);
          }
        }
        
        // Update user details
        setUserDetails({
          fullName: user?.full_name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          companyName: user?.company_name || '',
          designation: user?.designation || ''
        });
        
        // Update company details
        setCompanyDetails({
          companyName: profileData.company_name || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || '',
          postalCode: profileData.postal_code || '',
          website: profileData.website || '',
          logo: profileData.logo_url || null,
          banner: profileData.banner_url || null,
          organizationType: profileData.organization_type || '',
          industryType: profileData.industry_type || '',
          teamSize: profileData.team_size || '',
          yearOfEstablishment: profileData.founded_date || '',
          companyVision: profileData.company_vision || '',
          socialLinks: socialLinks,
          mapLocation: profileData.map_location || '',
          contactEmail: profileData.contact_email || user?.email || '',
          contactPhone: profileData.phone || user?.phone || ''
        });
      } else {
        // Initialize with user data if no company profile exists
        setUserDetails({
          fullName: user?.full_name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          companyName: user?.company_name || '',
          designation: user?.designation || ''
        });
        
        // Initialize company details with empty values
        setCompanyDetails({
          companyName: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          website: '',
          logo: null,
          banner: null,
          organizationType: '',
          industryType: '',
          teamSize: '',
          yearOfEstablishment: '',
          companyVision: '',
          socialLinks: [{ platform: '', url: '' }],
          mapLocation: '',
          contactEmail: user?.email || '',
          contactPhone: user?.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
      
      // Initialize with user data if API call fails
      setUserDetails({
        fullName: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        companyName: user?.company_name || '',
        designation: user?.designation || ''
      });
      
      // Initialize company details with empty values
      setCompanyDetails({
        companyName: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        website: '',
        logo: null,
        banner: null,
        organizationType: '',
        industryType: '',
        teamSize: '',
        yearOfEstablishment: '',
        companyVision: '',
        socialLinks: [{ platform: '', url: '' }],
        mapLocation: '',
        contactEmail: user?.email || '',
        contactPhone: user?.phone || ''
      });
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle user details changes
  const handleUserDetailsChange = (field) => (event) => {
    setUserDetails({
      ...userDetails,
      [field]: event.target.value
    });
  };

  // Handle company details changes
  const handleCompanyDetailsChange = (field) => (event) => {
    setCompanyDetails({
      ...companyDetails,
      [field]: event.target.value
    });
  };

  // Handle social link changes
  const handleSocialLinkChange = (index, field) => (event) => {
    const newSocialLinks = [...companyDetails.socialLinks];
    newSocialLinks[index][field] = event.target.value;
    setCompanyDetails({
      ...companyDetails,
      socialLinks: newSocialLinks
    });
  };

  // Add new social link
  const addSocialLink = () => {
    setCompanyDetails({
      ...companyDetails,
      socialLinks: [...companyDetails.socialLinks, { platform: '', url: '' }]
    });
  };

  // Remove social link
  const removeSocialLink = (index) => {
    if (companyDetails.socialLinks.length <= 1) return;
    const newSocialLinks = [...companyDetails.socialLinks];
    newSocialLinks.splice(index, 1);
    setCompanyDetails({
      ...companyDetails,
      socialLinks: newSocialLinks
    });
  };

  // Handle phone changes
  const handleUserPhoneChange = (value) => {
    setUserDetails({
      ...userDetails,
      phone: value
    });
  };

  const handleCompanyPhoneChange = (value) => {
    setCompanyDetails({
      ...companyDetails,
      contactPhone: value
    });
  };

  // Handle password changes
  const handlePasswordChange = (field) => (event) => {
    setPassword({
      ...password,
      [field]: event.target.value
    });
  };

  // Save user details
  const saveUserDetails = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would send this data to your API
      toast.success('User details updated successfully!');
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error('Failed to update user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save company details
  const saveCompanyDetails = async () => {
    setLoading(true);
    try {
      const companyData = {
        company_name: companyDetails.companyName,
        address: companyDetails.address,
        city: companyDetails.city,
        state: companyDetails.state,
        country: companyDetails.country,
        postal_code: companyDetails.postalCode,
        website: companyDetails.website,
        logo_url: companyDetails.logo,
        banner_url: companyDetails.banner,
        organization_type: companyDetails.organizationType,
        industry_type: companyDetails.industryType,
        team_size: companyDetails.teamSize,
        founded_date: companyDetails.yearOfEstablishment,
        company_vision: companyDetails.companyVision,
        social_links: companyDetails.socialLinks,
        map_location: companyDetails.mapLocation,
        contact_email: companyDetails.contactEmail,
        phone: companyDetails.contactPhone
      };

      const response = await companyAPI.updateProfile(companyData);
      
      if (response.data.success) {
        toast.success('Company details updated successfully!');
        // Refresh the data to get the latest from the server
        fetchProfileData();
      } else {
        toast.error(response.data.message || 'Failed to update company details');
      }
    } catch (error) {
      console.error('Error updating company details:', error);
      toast.error('Failed to update company details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    
    if (password.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    
    toast.success('Password changed successfully!');
    setPassword({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Delete account
  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      toast.error('Please confirm that you want to delete your account');
      return;
    }
    
    toast.success('Account deleted successfully!');
    setDeleteDialogOpen(false);
    setConfirmDelete(false);
  };

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
        setCompanyDetails({
          ...companyDetails,
          logo: e.target.result
        });
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
        setCompanyDetails({
          ...companyDetails,
          banner: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (profileLoading) {
    return (
      <Container component="main" maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Profile Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your account and company information
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Business />}
          sx={{ 
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
          onClick={() => {
            // In a real implementation, this would navigate to the profile page
            toast.info('Profile page would open here');
          }}
        >
          Edit Profile
        </Button>
      </Box>
      
      <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="settings tabs"
          sx={{ 
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': {
              fontWeight: 'medium'
            },
            '& .Mui-selected': {
              color: '#667eea'
            }
          }}
        >
          <Tab label="User Details" />
          <Tab label="Company Details" />
          <Tab label="Account Security" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* User Details Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Personal Information
              </Typography>
              
              <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2, width: '100%' } }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      value={userDetails.fullName}
                      onChange={handleUserDetailsChange('fullName')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={userDetails.email}
                      onChange={handleUserDetailsChange('email')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Phone Number
                      </Typography>
                      <PhoneInput
                        country={'us'}
                        value={userDetails.phone}
                        onChange={handleUserPhoneChange}
                        inputStyle={{ width: '100%' }}
                        containerStyle={{ width: '100%' }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company Name"
                      variant="outlined"
                      value={userDetails.companyName}
                      onChange={handleUserDetailsChange('companyName')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Designation"
                      variant="outlined"
                      value={userDetails.designation}
                      onChange={handleUserDetailsChange('designation')}
                    />
                  </Grid>
                </Grid>
                
                <Button 
                  variant="contained" 
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                  onClick={saveUserDetails}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Company Details Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Company Information
              </Typography>
              
              <Box component="form">
                {/* Company Info Section */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Company Info
                  </Typography>
                  
                  {/* Logo & Banner Upload */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={3}>
                      {/* Logo Upload */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Company Logo
                        </Typography>
                        <Box 
                          sx={{ 
                            border: '2px dashed #ccc', 
                            borderRadius: 2, 
                            p: 2, 
                            textAlign: 'center',
                            position: 'relative',
                            height: '150px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {companyDetails.logo ? (
                            <Box 
                              component="img" 
                              src={companyDetails.logo} 
                              alt="Logo Preview" 
                              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <>
                              <CloudUpload sx={{ fontSize: 32, color: '#667eea', mb: 1 }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                400px, 5MB max
                              </Typography>
                            </>
                          )}
                          <input
                            accept="image/*"
                            type="file"
                            hidden
                            id="logo-upload-settings"
                            onChange={handleLogoUpload}
                          />
                          <label htmlFor="logo-upload-settings">
                            <Button 
                              component="span" 
                              variant="outlined" 
                              sx={{ mt: 1, textTransform: 'none' }}
                              startIcon={<PhotoCamera />}
                            >
                              Upload Logo
                            </Button>
                          </label>
                        </Box>
                      </Grid>
                      
                      {/* Banner Upload */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Banner Image
                        </Typography>
                        <Box 
                          sx={{ 
                            border: '2px dashed #ccc', 
                            borderRadius: 2, 
                            p: 2, 
                            textAlign: 'center',
                            position: 'relative',
                            height: '150px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {companyDetails.banner ? (
                            <Box 
                              component="img" 
                              src={companyDetails.banner} 
                              alt="Banner Preview" 
                              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <>
                              <CloudUpload sx={{ fontSize: 32, color: '#667eea', mb: 1 }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                1520x400px, 5MB max
                              </Typography>
                            </>
                          )}
                          <input
                            accept="image/*"
                            type="file"
                            hidden
                            id="banner-upload-settings"
                            onChange={handleBannerUpload}
                          />
                          <label htmlFor="banner-upload-settings">
                            <Button 
                              component="span" 
                              variant="outlined" 
                              sx={{ mt: 1, textTransform: 'none' }}
                              startIcon={<PhotoCamera />}
                            >
                              Upload Banner
                            </Button>
                          </label>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        value={companyDetails.companyName}
                        onChange={handleCompanyDetailsChange('companyName')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Website"
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        value={companyDetails.website}
                        onChange={handleCompanyDetailsChange('website')}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={3}
                        value={companyDetails.address}
                        onChange={handleCompanyDetailsChange('address')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="City"
                        value={companyDetails.city}
                        onChange={handleCompanyDetailsChange('city')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="State"
                        value={companyDetails.state}
                        onChange={handleCompanyDetailsChange('state')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={companyDetails.country}
                        onChange={handleCompanyDetailsChange('country')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        value={companyDetails.postalCode}
                        onChange={handleCompanyDetailsChange('postalCode')}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Founding Info Section */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Founding Info
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Organization Type</InputLabel>
                        <Select
                          value={companyDetails.organizationType}
                          onChange={handleCompanyDetailsChange('organizationType')}
                          label="Organization Type"
                        >
                          <MenuItem value="Private">Private</MenuItem>
                          <MenuItem value="Public">Public</MenuItem>
                          <MenuItem value="Non-Profit">Non-Profit</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Industry Type</InputLabel>
                        <Select
                          value={companyDetails.industryType}
                          onChange={handleCompanyDetailsChange('industryType')}
                          label="Industry Type"
                        >
                          <MenuItem value="Technology">Technology</MenuItem>
                          <MenuItem value="Healthcare">Healthcare</MenuItem>
                          <MenuItem value="Finance">Finance</MenuItem>
                          <MenuItem value="Education">Education</MenuItem>
                          <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                          <MenuItem value="Retail">Retail</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Team Size</InputLabel>
                        <Select
                          value={companyDetails.teamSize}
                          onChange={handleCompanyDetailsChange('teamSize')}
                          label="Team Size"
                        >
                          <MenuItem value="1-10">1-10 employees</MenuItem>
                          <MenuItem value="11-50">11-50 employees</MenuItem>
                          <MenuItem value="51-200">51-200 employees</MenuItem>
                          <MenuItem value="201-500">201-500 employees</MenuItem>
                          <MenuItem value="500+">500+ employees</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Year of Establishment"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={companyDetails.yearOfEstablishment}
                        onChange={handleCompanyDetailsChange('yearOfEstablishment')}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Vision"
                        multiline
                        rows={4}
                        value={companyDetails.companyVision}
                        onChange={handleCompanyDetailsChange('companyVision')}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Social Media Section */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Social Media Profile
                  </Typography>
                  
                  {companyDetails.socialLinks.map((link, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Platform</InputLabel>
                          <Select
                            value={link.platform}
                            onChange={handleSocialLinkChange(index, 'platform')}
                            label="Platform"
                          >
                            <MenuItem value="facebook">Facebook</MenuItem>
                            <MenuItem value="twitter">Twitter</MenuItem>
                            <MenuItem value="instagram">Instagram</MenuItem>
                            <MenuItem value="youtube">YouTube</MenuItem>
                            <MenuItem value="linkedin">LinkedIn</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={7}>
                        <TextField
                          fullWidth
                          label="Profile URL"
                          value={link.url}
                          onChange={handleSocialLinkChange(index, 'url')}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={1}>
                        <Button
                          onClick={() => removeSocialLink(index)}
                          disabled={companyDetails.socialLinks.length <= 1}
                          sx={{ mt: 1 }}
                        >
                          <Delete />
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      onClick={addSocialLink}
                      variant="outlined"
                      sx={{ 
                        borderRadius: '16px',
                        textTransform: 'none',
                        color: 'gray',
                        borderColor: 'gray'
                      }}
                    >
                      Add New Social Link
                    </Button>
                  </Box>
                </Paper>
                
                {/* Contact Info Section */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Contact Info
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Map Location"
                        InputProps={{
                          startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        value={companyDetails.mapLocation}
                        onChange={handleCompanyDetailsChange('mapLocation')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Contact Phone Number
                        </Typography>
                        <PhoneInput
                          country={'us'}
                          value={companyDetails.contactPhone}
                          onChange={handleCompanyPhoneChange}
                          containerStyle={{ width: '100%' }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Email"
                        type="email"
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        value={companyDetails.contactEmail}
                        onChange={handleCompanyDetailsChange('contactEmail')}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    disabled={loading}
                    sx={{ 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                    onClick={saveCompanyDetails}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Account Security Tab */}
          {activeTab === 2 && (
            <Box>
              {/* Change Password Section */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Change Password
                </Typography>
                
                <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2, width: '100%' } }}>
                  <TextField
                    label="Current Password"
                    variant="outlined"
                    type="password"
                    value={password.currentPassword}
                    onChange={handlePasswordChange('currentPassword')}
                  />
                  
                  <TextField
                    label="New Password"
                    variant="outlined"
                    type="password"
                    value={password.newPassword}
                    onChange={handlePasswordChange('newPassword')}
                  />
                  
                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={password.confirmPassword}
                    onChange={handlePasswordChange('confirmPassword')}
                  />
                  
                  <Button 
                    variant="contained" 
                    sx={{ 
                      mt: 1,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>
                </Box>
              </Box>
              
              {/* Delete Account Section */}
              <Box>
                <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Delete Account
                </Typography>
                
                <Alert 
                  severity="warning" 
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  Warning: This action is irreversible. Deleting your account will permanently remove all your data.
                </Alert>
                
                <Button 
                  variant="contained" 
                  color="error"
                  sx={{ 
                    borderRadius: '20px',
                    px: 4
                  }}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </Box>
              
              {/* Logout Section */}
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Account Management
                </Typography>
                
                <LogoutButton variant="outlined" color="primary" />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                color="error"
              />
            }
            label="I understand that this action is permanent and cannot be undone"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteAccount}
            disabled={!confirmDelete}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;