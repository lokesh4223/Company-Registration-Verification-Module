import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Business, 
  People, 
  LocationOn, 
  Link as LinkIcon,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { companyAPI } from '../../services/api';
import { toast } from 'react-toastify';

const EmployersProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    founded: '',
    employees: 0,
    location: '',
    website: '',
    description: '',
    logo: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    contact_email: '',
    map_location: '',
    social_links: []
  });

  const [editData, setEditData] = useState(companyData);

  // Fetch company profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await companyAPI.getProfile();
        
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          const profileData = {
            name: data.company_name || '',
            industry: data.industry || '',
            founded: data.founded_date || '',
            employees: 127, // This would need to be calculated or stored separately
            location: `${data.city || ''}, ${data.state || ''}, ${data.country || ''}`,
            website: data.website || '',
            description: data.description || '',
            logo: data.logo_url || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            postal_code: data.postal_code || '',
            phone: data.phone || '',
            contact_email: data.contact_email || '',
            map_location: data.map_location || '',
            social_links: data.social_links || []
          };
          
          setCompanyData(profileData);
          setEditData(profileData);
        } else {
          throw new Error(response.data.message || 'Failed to fetch company profile');
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
        setError(error.message || 'Failed to fetch company profile');
        toast.error('Failed to fetch company profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(companyData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Prepare data for API
      const updateData = {
        company_name: editData.name,
        industry: editData.industry,
        founded_date: editData.founded,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        country: editData.country,
        postal_code: editData.postal_code,
        website: editData.website,
        description: editData.description,
        phone: editData.phone,
        contact_email: editData.contact_email,
        map_location: editData.map_location
      };

      const response = await companyAPI.updateProfile(updateData);
      
      if (response.data.success) {
        setCompanyData(editData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(companyData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mock employee data - in a real app this would come from the backend
  const employeeData = [
    { department: 'Engineering', count: 65 },
    { department: 'Sales', count: 22 },
    { department: 'Marketing', count: 18 },
    { department: 'HR', count: 8 },
    { department: 'Finance', count: 7 },
    { department: 'Operations', count: 7 }
  ];

  if (loading && !companyData.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Employers Profile
        </Typography>
        {isEditing ? (
          <Box>
            <Button 
              variant="contained" 
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Company Information
              </Typography>
              
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={editData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      value={editData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Founded"
                      value={editData.founded}
                      onChange={(e) => handleChange('founded', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={editData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={editData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={editData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={editData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={editData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={editData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={editData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={editData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={companyData.logo || undefined} 
                        sx={{ width: 56, height: 56, mr: 2, bgcolor: '#667eea' }}
                      >
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {companyData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {companyData.industry}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{companyData.location}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="primary">
                        {companyData.website}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Founded:</strong> {companyData.founded}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Employees:</strong> {companyData.employees}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {companyData.description}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Information
              </Typography>
              
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={editData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editData.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Map Location"
                      value={editData.map_location}
                      onChange={(e) => handleChange('map_location', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {companyData.phone || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {companyData.contact_email || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Address:</strong> {companyData.address || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>City:</strong> {companyData.city || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>State:</strong> {companyData.state || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Country:</strong> {companyData.country || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Postal Code:</strong> {companyData.postal_code || 'Not provided'}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
          
          {/* Employee Statistics */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Employee Statistics
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#764ba2' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {companyData.employees}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Employees
                  </Typography>
                </Box>
              </Box>
              
              {employeeData.map((dept, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{dept.department}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {dept.count}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: '#e0e0e0', 
                        flexGrow: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${(dept.count / companyData.employees) * 100}%`, 
                          bgcolor: '#667eea',
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Departments */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Departments
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {employeeData.map((dept, index) => (
                  <Chip 
                    key={index}
                    label={`${dept.department} (${dept.count})`}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployersProfile;