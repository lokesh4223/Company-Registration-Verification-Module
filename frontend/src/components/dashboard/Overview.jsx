import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Work, 
  People, 
  Notifications, 
  TrendingUp,
  CheckCircle,
  Pending,
  Close,
  Search,
  Business
} from '@mui/icons-material';
import { jobAPI } from '../../services/api';
import notificationService from '../../services/notificationService';

const Overview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [
      { title: 'Total Jobs', value: '0', icon: <Work />, color: '#667eea' },
      { title: 'Active Candidates', value: '0', icon: <People />, color: '#764ba2' },
      { title: 'Applications', value: '0', icon: <Notifications />, color: '#f093fb' },
      { title: 'Profile Views', value: '0', icon: <TrendingUp />, color: '#4facfe' }
    ],
    recentJobs: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs for dashboard
      const jobsResponse = await jobAPI.getJobs();
      
      if (jobsResponse.data.success) {
        const jobs = jobsResponse.data.data;
        
        // Calculate stats
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'active').length;
        const totalApplications = jobs.reduce((sum, job) => sum + (job.applicants_count || 0), 0);
        
        // Get recent jobs (limit to 5)
        const recentJobs = jobs.slice(0, 5).map(job => ({
          id: job.id,
          title: job.title,
          status: job.status,
          applicants: job.applicants_count || 0,
          type: job.employment_type,
          posted: new Date(job.created_at).toLocaleDateString()
        }));
        
        setDashboardData({
          stats: [
            { title: 'Total Jobs', value: totalJobs.toString(), icon: <Work />, color: '#667eea' },
            { title: 'Active Candidates', value: '142', icon: <People />, color: '#764ba2' },
            { title: 'Applications', value: totalApplications.toString(), icon: <Notifications />, color: '#f093fb' },
            { title: 'Profile Views', value: '342', icon: <TrendingUp />, color: '#4facfe' }
          ],
          recentJobs
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data
      setDashboardData({
        stats: [
          { title: 'Total Jobs', value: '12', icon: <Work />, color: '#667eea' },
          { title: 'Active Candidates', value: '142', icon: <People />, color: '#764ba2' },
          { title: 'Applications', value: '89', icon: <Notifications />, color: '#f093fb' },
          { title: 'Profile Views', value: '342', icon: <TrendingUp />, color: '#4facfe' }
        ],
        recentJobs: [
          { 
            id: 1,
            title: 'Frontend Developer', 
            status: 'active', 
            applicants: 12, 
            type: 'Full-time',
            posted: '2 days ago'
          },
          { 
            id: 2,
            title: 'Backend Engineer', 
            status: 'active', 
            applicants: 8, 
            type: 'Full-time',
            posted: '1 week ago'
          },
          { 
            id: 3,
            title: 'UI/UX Designer', 
            status: 'closed', 
            applicants: 24, 
            type: 'Part-time',
            posted: '3 weeks ago'
          },
          { 
            id: 4,
            title: 'Data Scientist', 
            status: 'pending', 
            applicants: 5, 
            type: 'Contract',
            posted: '1 day ago'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time update listener
  useEffect(() => {
    // Fetch initial data
    fetchDashboardData();
    
    // Subscribe to job posted notifications
    const unsubscribe = notificationService.subscribe('job_posted', () => {
      // Refresh dashboard data when a job is posted
      fetchDashboardData();
    });
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Make fetchDashboardData available outside useEffect

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back! Here's what's happening with your account today.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Work />}
          sx={{ 
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
            px: 3,
            py: 1.5
          }}
          onClick={() => navigate('/dashboard/post-job')}
        >
          Post New Job
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Recent Jobs and Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Jobs
              </Typography>
              {dashboardData.recentJobs.length > 0 ? (
                dashboardData.recentJobs.map((job, index) => (
                  <Box 
                    key={job.id}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < dashboardData.recentJobs.length - 1 ? '1px solid #eee' : 'none'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {job.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          {job.applicants} applicants
                        </Typography>
                        <Chip label={job.type} size="small" variant="outlined" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          Posted {job.posted}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      {getStatusChip(job.status)}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Work sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No jobs posted yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get started by posting your first job opening
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Work />}
                    sx={{ 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                    onClick={() => navigate('/dashboard/post-job')}
                  >
                    Post a Job
                  </Button>
                </Box>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
              <Button 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 'bold',
                  color: '#667eea'
                }}
                onClick={() => navigate('/dashboard/my-jobs')}
              >
                View All Jobs
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Work />}
                  fullWidth
                  sx={{ 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5
                  }}
                  onClick={() => navigate('/dashboard/post-job')}
                >
                  Post a New Job
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<Search />}
                  fullWidth
                  sx={{ 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5
                  }}
                  onClick={() => navigate('/dashboard/find-candidates')}
                >
                  Find Candidates
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<People />}
                  fullWidth
                  sx={{ 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5
                  }}
                  onClick={() => navigate('/dashboard/applications')}
                >
                  Review Applications
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<Business />}
                  fullWidth
                  sx={{ 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5
                  }}
                  onClick={() => navigate('/dashboard/company-profile')}
                >
                  Update Company Profile
                </Button>
              </Box>
              
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#667eea', width: 40, height: 40, mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    New application received for Frontend Developer
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2 hours ago
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: '#764ba2', width: 40, height: 40, mr: 2 }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    Company profile updated successfully
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 day ago
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;