import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Work, 
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  Close
} from '@mui/icons-material';
import { jobAPI } from '../../services/api';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobs();
      
      if (response.data.success) {
        setJobs(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to fetch jobs');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Set up real-time update listener
  useEffect(() => {
    // Subscribe to job posted notifications
    const unsubscribe = notificationService.subscribe('job_posted', () => {
      // Refresh jobs list when a job is posted
      fetchJobs();
    });
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
      case 'closed':
        return <Chip icon={<Close />} label="Closed" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await jobAPI.deleteJob(jobId);
        
        if (response.data.success) {
          // Remove job from state
          setJobs(jobs.filter(job => job.id !== jobId));
          toast.success('Job deleted successfully');
        } else {
          throw new Error(response.data.message || 'Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to delete job');
      }
    }
  };

  const handleEditJob = (jobId) => {
    // Navigate to edit job page (you'll need to implement this)
    navigate(`/dashboard/edit-job/${jobId}`);
  };

  const handleViewJob = (jobId) => {
    // Navigate to view job page (you'll need to implement this)
    console.log('View job', jobId);
  };

  if (loading) {
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
          My Jobs
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate('/dashboard/post-job')}
        >
          Post New Job
        </Button>
      </Box>
      
      {/* Filters */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Jobs"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Job Listings */}
      {paginatedJobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Work sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No jobs found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {filteredJobs.length === 0 && jobs.length > 0 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by posting your first job'}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => navigate('/dashboard/post-job')}
          >
            Post New Job
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginatedJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          {job.department}
                        </Typography>
                        <Chip label={job.employment_type} size="small" variant="outlined" sx={{ mr: 2 }} />
                        <Chip label={job.location} size="small" variant="outlined" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 3 }}>
                          <strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Applicants:</strong> {job.applicants_count || 0}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusChip(job.status)}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
                  <IconButton size="small" onClick={() => handleViewJob(job.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEditJob(job.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteJob(job.id)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default MyJobs;