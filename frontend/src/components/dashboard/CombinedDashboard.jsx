import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  Divider, 
  Typography,
  IconButton,
  Button,
  AppBar,
  Toolbar,
  Badge,
  Popover,
  Paper,
  List as NotificationList,
  ListItemAvatar,
  Avatar,
  ListItemText as NotificationListItemText,
  Divider as NotificationDivider,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Business, 
  PostAdd, 
  Work, 
  People, 
  Assignment, 
  Analytics, 
  Settings as SettingsIcon,
  ChevronLeft,
  Person,
  Notifications,
  Logout as LogoutIcon,
  TrendingUp,
  CheckCircle,
  Pending,
  Close,
  Home,
  Search,
  Support
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../../store/userSlice';
import { toast } from 'react-toastify';
// Dashboard Components
import UserProfile from './UserProfile';
import EmployersProfile from './EmployersProfile';
import PostJob from './PostJob';
import MyJobs from './MyJobs';
import SavedCandidates from './SavedCandidates';
import PlansBilling from './PlansBilling';
import AllCompanies from './AllCompanies';
import Settings from './Settings';
import ProfileDropdown from '../auth/ProfileDropdown';
import { companyAPI, jobAPI } from '../../services/api';
import notificationService from '../../services/notificationService';
// Sidebar will be implemented directly in this component

const drawerWidth = 244; // Restored to original width

// Sidebar Component
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'User Profile', icon: <Person />, path: '/dashboard/user-profile' },
    { text: 'Company Profile', icon: <Business />, path: '/dashboard/company-profile' },
    { text: 'Post a Job', icon: <PostAdd />, path: '/dashboard/post-job' },
    { text: 'My Jobs', icon: <Work />, path: '/dashboard/my-jobs' },
    { text: 'Saved Candidates', icon: <People />, path: '/dashboard/saved-candidates' },
    { text: 'Plans & Billing', icon: <Assignment />, path: '/dashboard/plans-billing' },
    { text: 'All Companies', icon: <Analytics />, path: '/dashboard/companies' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out successfully');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
          marginTop: '60px', // Position below the navbar
          height: 'calc(100% - 60px)', // Adjust height to account for navbar
          overflow: 'hidden' // Remove scrolling
        },
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <List sx={{ flex: '1' }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: '0 50px 50px 0',
                margin: '1px 8px',
                padding: '6px 16px',
                backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? '#bbdefb' : '#f0f0f0'
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: location.pathname === item.path ? '#1976d2' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <NotificationListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    color: location.pathname === item.path ? '#1976d2' : 'inherit',
                    fontSize: '0.875rem'
                  }
                }} 
              />
            </ListItem>
          ))}
          
          <Divider sx={{ my: 0.5 }} />
        </List>
        
        {/* Logout Button at the bottom */}
        <List sx={{ mt: 'auto' }}> {/* Added mt: 'auto' to push to bottom */}
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              borderRadius: '0 50px 50px 0',
              margin: '1px 8px',
              padding: '6px 16px',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: 'inherit'
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <NotificationListItemText 
              primary="Logout" 
              sx={{ 
                '& .MuiListItemText-primary': {
                  fontWeight: 'normal',
                  color: 'inherit',
                  fontSize: '0.875rem'
                }
              }} 
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

const CombinedDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [activeContent, setActiveContent] = useState('overview');
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // For notification dropdown
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New application received",
      message: "John Doe applied for Frontend Developer position",
      time: "2 hours ago",
      icon: <People />,
      color: '#667eea',
      read: false
    },
    {
      id: 2,
      title: "Profile Updated",
      message: "Your company profile has been updated successfully",
      time: "1 day ago",
      icon: <Business />,
      color: '#764ba2',
      read: false
    },
    {
      id: 3,
      title: "Job Posted",
      message: "Your job posting for UI/UX Designer is now live",
      time: "2 days ago",
      icon: <Work />,
      color: '#f093fb',
      read: false
    },
    {
      id: 4,
      title: "New Applicant",
      message: "Sarah Johnson applied for Backend Engineer position",
      time: "3 days ago",
      icon: <Notifications />,
      color: '#4facfe',
      read: false
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [
      { title: 'Total Jobs', value: '0', icon: <Work />, color: '#667eea' },
      { title: 'Active Candidates', value: '0', icon: <People />, color: '#764ba2' },
      { title: 'Applications', value: '0', icon: <Notifications />, color: '#f093fb' },
      { title: 'Profile Views', value: '0', icon: <TrendingUp />, color: '#4facfe' }
    ],
    recentJobs: [],
    recentActivity: []
  });

  // Set up real-time notification listener
  useEffect(() => {
    // Subscribe to job posted notifications
    const unsubscribe = notificationService.subscribe('job_posted', (data) => {
      // Add new notification
      const newNotification = {
        id: Date.now(),
        title: "Job Posted",
        message: `Your job posting for ${data.jobTitle} is now live`,
        time: "Just now",
        icon: <Work />,
        color: '#f093fb',
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setNotificationCount(prev => prev + 1);
      
      // Re-fetch dashboard data to ensure consistency
      fetchDashboardData();
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Fetch real dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch company profile to check if user has completed onboarding
      const companyResponse = await companyAPI.getProfile();
      
      if (companyResponse.data.success && companyResponse.data.data) {
        // User has completed onboarding, fetch dashboard data
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
            recentJobs,
            recentActivity: [
              {
                id: 1,
                title: 'Company profile updated successfully',
                time: 'Just now',
                icon: <Business />,
                color: '#764ba2'
              },
              {
                id: 2,
                title: 'Welcome to Jobpilot! Complete your profile to get started.',
                time: 'Today',
                icon: <DashboardIcon />,
                color: '#667eea'
              }
            ]
          });
        }
      } else {
        // User hasn't completed onboarding
        setDashboardData({
          stats: [
            { title: 'Total Jobs', value: '0', icon: <Work />, color: '#667eea' },
            { title: 'Active Candidates', value: '0', icon: <People />, color: '#764ba2' },
            { title: 'Applications', value: '0', icon: <Notifications />, color: '#f093fb' },
            { title: 'Profile Views', value: '0', icon: <TrendingUp />, color: '#4facfe' }
          ],
          recentJobs: [],
          recentActivity: [
            {
              id: 1,
              title: 'Please complete your company profile to get started',
              time: 'Just now',
              icon: <Business />,
              color: '#764ba2'
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to default data
      setDashboardData({
        stats: [
          { title: 'Total Jobs', value: '0', icon: <Work />, color: '#667eea' },
          { title: 'Active Candidates', value: '0', icon: <People />, color: '#764ba2' },
          { title: 'Applications', value: '0', icon: <Notifications />, color: '#f093fb' },
          { title: 'Profile Views', value: '0', icon: <TrendingUp />, color: '#4facfe' }
        ],
        recentJobs: [],
        recentActivity: [
          {
            id: 1,
            title: 'Welcome to Jobpilot! Complete your profile to get started.',
            time: 'Just now',
            icon: <DashboardIcon />,
            color: '#667eea'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardDataWrapper = async () => {
      await fetchDashboardData();
    };

    if (activeContent === 'overview') {
      fetchDashboardDataWrapper();
    }
  }, [activeContent]);

  // Set active content based on current path
  useEffect(() => {
    const pathMap = {
      '/dashboard': 'overview',
      '/dashboard/user-profile': 'user-profile',
      '/dashboard/company-profile': 'company-profile',
      '/dashboard/post-job': 'post-job',
      '/dashboard/my-jobs': 'my-jobs',
      '/dashboard/saved-candidates': 'saved-candidates',
      '/dashboard/plans-billing': 'plans-billing',
      '/dashboard/companies': 'companies',
      '/dashboard/settings': 'settings',
      '/dashboard/realtime-test': 'realtime-test'
    };
    
    setActiveContent(pathMap[location.pathname] || 'overview');
  }, [location.pathname]);

  // Handle notification dropdown open/close
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    // Mark notifications as read when opening
    setNotifications(prev => prev.map(notification => ({...notification, read: true})));
    setNotificationCount(0);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const isNotificationOpen = Boolean(notificationAnchorEl);
  const notificationId = isNotificationOpen ? 'notification-popover' : undefined;

  const handleLogout = () => {
    // Dispatch the logout action to clear user data from Redux store
    dispatch(logout());
    toast.success('You have been logged out successfully');
    navigate('/login');
  };

  // Get status chip component
  const getStatusChip = (status) => {
    switch (status) {
      case 'Active':
        return <Chip icon={<CheckCircle />} label={status} color="success" size="small" />;
      case 'Pending':
        return <Chip icon={<Pending />} label={status} color="warning" size="small" />;
      case 'Closed':
        return <Chip icon={<Close />} label={status} color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Sidebar items are defined in the Sidebar component

  // Render content based on active content
  const renderContent = () => {
    switch (activeContent) {
      case 'overview':
        if (loading) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress />
            </Box>
          );
        }
        
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                  Dashboard Overview
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Welcome back, {user?.full_name || 'User'}! Here's what's happening with your account today.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<PostAdd />}
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
                          startIcon={<PostAdd />}
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
                  {dashboardData.recentJobs.length > 0 && (
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
                  )}
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
                        startIcon={<PostAdd />}
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
                    {dashboardData.recentActivity.map((activity) => (
                      <Box key={activity.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Avatar sx={{ bgcolor: activity.color, width: 40, height: 40, mr: 2 }}>
                          {activity.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 'user-profile':
        return <UserProfile />;
      case 'company-profile':
        return <EmployersProfile />;
      case 'post-job':
        return <PostJob />;
      case 'my-jobs':
        return <MyJobs />;
      case 'saved-candidates':
        return <SavedCandidates />;
      case 'plans-billing':
        return <PlansBilling />;
      case 'companies':
        return <AllCompanies />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Box>
            <Typography variant="h4">Page not found</Typography>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* AppBar with Full Width Two-Column Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          color: 'black',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ display: 'flex', flexDirection: 'column', minHeight: 'auto', p: 0 }}>
          {/* First Column - Very Small - Navigation Links and Profile Dropdown */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '24px',
            px: 2,
            py: 0.2,
            borderBottom: '1px solid #eee'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                startIcon={<Home />} 
                sx={{ 
                  color: location.pathname === '/' ? '#667eea' : 'black',
                  fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  minHeight: '20px',
                  py: 0.1
                }}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button 
                startIcon={<Search />} 
                sx={{ 
                  color: location.pathname === '/dashboard/find-candidates' ? '#667eea' : 'black',
                  fontWeight: location.pathname === '/dashboard/find-candidates' ? 'bold' : 'normal',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  minHeight: '20px',
                  py: 0.1
                }}
                onClick={() => navigate('/dashboard/find-candidates')}
              >
                Find Candidates
              </Button>
              <Button 
                startIcon={<DashboardIcon />} 
                sx={{ 
                  color: location.pathname === '/dashboard' ? '#667eea' : 'black',
                  fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  minHeight: '20px',
                  py: 0.1
                }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                startIcon={<Work />} 
                sx={{ 
                  color: location.pathname === '/dashboard/my-jobs' ? '#667eea' : 'black',
                  fontWeight: location.pathname === '/dashboard/my-jobs' ? 'bold' : 'normal',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  minHeight: '20px',
                  py: 0.1
                }}
                onClick={() => navigate('/dashboard/my-jobs')}
              >
                My Jobs
              </Button>
              <Button 
                startIcon={<Assignment />} 
                sx={{ 
                  color: location.pathname === '/dashboard/applications' ? '#667eea' : 'black',
                  fontWeight: location.pathname === '/dashboard/applications' ? 'bold' : 'normal',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  minHeight: '20px',
                  py: 0.1
                }}
                onClick={() => navigate('/dashboard/applications')}
              >
                Applications
              </Button>
              <Button 
                startIcon={<Support />} 
                sx={{ 
                  color: 'black',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  minHeight: '20px',
                  py: 0.1
                }}
              >
                Customer Support
              </Button>
            </Box>
            
            {/* Profile Dropdown in the first row, right aligned */}
            <ProfileDropdown />
          </Box>
          
          {/* Second Column - Small - Jobpilot with Icon (left), Notify Icon and Post a Job Button (right) */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%',
            minHeight: '36px',
            px: 2
          }}>
            {/* Left Side - Jobpilot with Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1, color: '#667eea', fontSize: '1.2rem' }} />
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Jobpilot
              </Typography>
            </Box>
            
            {/* Right Side - Notification and Post Job Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                sx={{ color: 'black', padding: '4px' }} 
                onClick={handleNotificationClick}
                size="small"
                aria-describedby={notificationId}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications sx={{ fontSize: '1.2rem' }} />
                </Badge>
              </IconButton>
              
              <Button 
                variant="contained" 
                startIcon={<PostAdd />}
                sx={{ 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  px: 2,
                  py: 0.5,
                  fontSize: '0.8rem'
                }}
                onClick={() => navigate('/dashboard/post-job')}
              >
                Post a Job
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Notification Popover */}
      <Popover
        id={notificationId}
        open={isNotificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Paper sx={{ width: 300 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" component="h2">
              Notifications
            </Typography>
          </Box>
          
          <NotificationList sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: notification.color }}>
                      {notification.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <NotificationListItemText
                    primary={notification.title}
                    secondary={
                      <React.Fragment>
                        {notification.message}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <NotificationDivider variant="inset" component="li" />}
              </React.Fragment>
            ))}
            
            {notifications.length === 0 && (
              <ListItem>
                <NotificationListItemText 
                  primary="No notifications" 
                  secondary="You're all caught up!" 
                  sx={{ textAlign: 'center', py: 2 }}
                />
              </ListItem>
            )}
          </NotificationList>
          
          <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid #eee' }}>
            <Button size="small" sx={{ textTransform: 'none' }}>
              View All
            </Button>
          </Box>
        </Paper>
      </Popover>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '60px', // Reduced from 80px to 60px to account for fixed header
          width: 'calc(100% - 244px)', // Subtract sidebar width from total width (244px sidebar width)
          height: 'calc(100vh - 60px)', // Reduced from 80px to 60px
          overflow: 'auto' // Add scroll if content overflows
        }}
      >
        {renderContent()}
        
        {/* Dashboard Footer */}
        <Box 
          sx={{ 
            mt: 6,
            pt: 4,
            pb: 3,
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © 2025 Company Registration. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
            <MuiLink 
              href="#" 
              underline="none" 
              sx={{ color: '#94a3b8', '&:hover': { color: '#64748b' }, fontSize: '0.8rem' }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink 
              href="#" 
              underline="none" 
              sx={{ color: '#94a3b8', '&:hover': { color: '#64748b' }, fontSize: '0.8rem' }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink 
              href="#" 
              underline="none" 
              sx={{ color: '#94a3b8', '&:hover': { color: '#64748b' }, fontSize: '0.8rem' }}
            >
              Support
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CombinedDashboard;