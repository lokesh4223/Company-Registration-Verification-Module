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
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    mobile_no: '',
    gender: ''
  });

  const [editData, setEditData] = useState(userData);
  const user = useSelector((state) => state.user.user);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // User data is already in Redux store, but we can also fetch it from API
        if (user) {
          setUserData({
            full_name: user.full_name || '',
            email: user.email || '',
            mobile_no: user.mobile_no || '',
            gender: user.gender || ''
          });
          setEditData({
            full_name: user.full_name || '',
            email: user.email || '',
            mobile_no: user.mobile_no || '',
            gender: user.gender || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message || 'Failed to fetch user profile');
        toast.error('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would update the user data via API
      // For now, we'll just update the local state
      setUserData(editData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'm': return 'Male';
      case 'f': return 'Female';
      case 'o': return 'Other';
      default: return 'Not specified';
    }
  };

  if (loading && !userData.full_name) {
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
          User Profile
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
        {/* User Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Personal Information
              </Typography>
              
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={editData.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={editData.mobile_no}
                      onChange={(e) => handleChange('mobile_no', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gender"
                      value={editData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#667eea' }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {userData.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          User Profile
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{userData.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{userData.mobile_no}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Gender:</strong> {getGenderLabel(userData.gender)}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Account Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Account Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Account Status:</strong> Active
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Member Since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Last Updated:</strong> {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;