import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Work, 
  LocationOn, 
  AttachMoney,
  Schedule,
  Save,
  Preview
} from '@mui/icons-material';
import { jobAPI } from '../../services/api';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';

const PostJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: '',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: [],
    newSkill: '',
    remote: false,
    urgent: false
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddSkill = () => {
    if (jobData.newSkill.trim() && !jobData.skills.includes(jobData.newSkill.trim())) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, jobData.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for API
      const jobPayload = {
        title: jobData.title,
        department: jobData.department,
        location: jobData.location,
        employmentType: jobData.employmentType,
        experience: jobData.experience,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        description: jobData.description,
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        skills: jobData.skills,
        remote: jobData.remote,
        urgent: jobData.urgent
      };

      // Send job data to backend
      const response = await jobAPI.createJob(jobPayload);
      
      if (response.data.success) {
        // Show success message
        toast.success('Job posted successfully!');
        
        // Send real-time notification
        notificationService.emit('job_posted', {
          jobTitle: jobData.title,
          timestamp: new Date().toISOString()
        });
        
        // Reset form
        setJobData({
          title: '',
          department: '',
          location: '',
          employmentType: '',
          experience: '',
          salaryMin: '',
          salaryMax: '',
          description: '',
          requirements: '',
          responsibilities: '',
          skills: [],
          newSkill: '',
          remote: false,
          urgent: false
        });
        
        // Delay navigation to allow time for notification processing
        setTimeout(() => {
          navigate('/dashboard/my-jobs');
        }, 1000);
      } else {
        throw new Error(response.data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Temporary'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive',
    'Internship'
  ];

  const departments = [
    'Engineering',
    'Sales',
    'Marketing',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Service',
    'Product',
    'Design',
    'Quality Assurance'
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Post a Job
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<Preview />}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Preview
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </Box>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Job Details */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Job Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      name="title"
                      value={jobData.title}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={loading}>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={jobData.department}
                        onChange={handleInputChange}
                        label="Department"
                      >
                        {departments.map((dept, index) => (
                          <MenuItem key={index} value={dept}>{dept}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={loading}>
                      <InputLabel>Employment Type</InputLabel>
                      <Select
                        name="employmentType"
                        value={jobData.employmentType}
                        onChange={handleInputChange}
                        label="Employment Type"
                        required
                      >
                        {employmentTypes.map((type, index) => (
                          <MenuItem key={index} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={loading}>
                      <InputLabel>Experience Level</InputLabel>
                      <Select
                        name="experience"
                        value={jobData.experience}
                        onChange={handleInputChange}
                        label="Experience Level"
                      >
                        {experienceLevels.map((level, index) => (
                          <MenuItem key={index} value={level}>{level}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Minimum Salary"
                      name="salaryMin"
                      type="number"
                      value={jobData.salaryMin}
                      onChange={handleInputChange}
                      disabled={loading}
                      InputProps={{
                        startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Maximum Salary"
                      name="salaryMax"
                      type="number"
                      value={jobData.salaryMax}
                      onChange={handleInputChange}
                      disabled={loading}
                      InputProps={{
                        startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Description"
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Key Responsibilities"
                      name="responsibilities"
                      value={jobData.responsibilities}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Requirements"
                      name="requirements"
                      value={jobData.requirements}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TextField
                        label="Add Skills"
                        value={jobData.newSkill}
                        onChange={(e) => setJobData(prev => ({...prev, newSkill: e.target.value}))}
                        sx={{ flexGrow: 1, mr: 1 }}
                        disabled={loading}
                      />
                      <Button variant="outlined" onClick={handleAddSkill} disabled={loading}>
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {jobData.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => handleRemoveSkill(skill)}
                          sx={{ m: 0.5 }}
                          disabled={loading}
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="remote"
                          checked={jobData.remote}
                          onChange={handleCheckboxChange}
                          disabled={loading}
                        />
                      }
                      label="Remote Position"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="urgent"
                          checked={jobData.urgent}
                          onChange={handleCheckboxChange}
                          disabled={loading}
                        />
                      }
                      label="Urgent Hiring"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostJob;