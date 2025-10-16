import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Business, 
  People, 
  Work, 
  TrendingUp, 
  Menu as MenuIcon, 
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ProfileDropdown from './auth/ProfileDropdown';

const NewHomepage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const { isAuthenticated } = useSelector((state) => state.user);

  const features = [
    {
      icon: <Business sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Company Profiles',
      description: 'Create detailed company profiles to showcase your organization to potential candidates.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Talent Pool',
      description: 'Access a vast pool of qualified candidates from various industries and skill levels.'
    },
    {
      icon: <Work sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Job Postings',
      description: 'Post jobs quickly and efficiently to reach the right candidates for your openings.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Analytics',
      description: 'Track your recruitment metrics and optimize your hiring process with detailed analytics.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director, TechCorp',
      content: 'This platform has transformed our hiring process. We\'ve reduced our time-to-hire by 60%.',
    },
    {
      name: 'Michael Chen',
      role: 'CEO, Innovate Solutions',
      content: 'The quality of candidates we receive has significantly improved since using this platform.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Recruitment Manager, Global Enterprises',
      content: 'The analytics dashboard gives us insights we never had before. Highly recommended!',
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Companies' },
    { value: '500,000+', label: 'Job Seekers' },
    { value: '25,000+', label: 'Jobs Posted Monthly' },
    { value: '95%', label: 'Client Satisfaction' }
  ];

  return (
    <>
      <CssBaseline />
      {/* Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'white', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          mb: 0,
          height: isMobile ? '60px' : '70px'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            px: { xs: 0, md: 2 },
            minHeight: isMobile ? '60px' : '70px'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: isMobile ? 32 : 40, 
                  height: isMobile ? 32 : 40, 
                  borderRadius: '12px', 
                  background: theme.custom.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: isMobile ? 1 : 2
                }}
              >
                <Business sx={{ color: 'white', fontSize: isMobile ? 16 : 20 }} />
              </Box>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary,
                  cursor: 'pointer',
                  fontSize: isMobile ? '1rem' : '1.25rem'
                }}
                onClick={() => navigate('/')}
              >
                Company Registration
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: isTablet ? 2 : 4 }}>
                <Button 
                  color="inherit" 
                  sx={{ color: theme.palette.text.secondary, fontWeight: 'medium' }}
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: theme.palette.text.secondary, fontWeight: 'medium' }}
                >
                  Features
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: theme.palette.text.secondary, fontWeight: 'medium' }}
                >
                  How It Works
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: theme.palette.text.secondary, fontWeight: 'medium' }}
                >
                  Pricing
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: theme.palette.text.secondary, fontWeight: 'medium' }}
                >
                  About Us
                </Button>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: '8px',
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      px: isMobile ? 1.5 : 3,
                      py: isMobile ? 0.5 : 1,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      borderRadius: '8px',
                      background: theme.custom.gradients.primary,
                      px: isMobile ? 1.5 : 3,
                      py: isMobile ? 0.5 : 1,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      '&:hover': {
                        background: theme.custom.gradients.primary,
                        opacity: 0.9
                      }
                    }}
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
            
            {isMobile && (
              <IconButton 
                sx={{ color: theme.palette.text.primary }}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: isMobile ? 6 : 16, 
          textAlign: 'center',
          background: theme.custom.gradients.primary,
          mb: isMobile ? 6 : 10,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant={isMobile ? "h3" : "h1"} 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              fontSize: isMobile ? '2rem' : '4rem'
            }}
          >
            Simplify Your Company Registration
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h5"} 
            sx={{ 
              mb: 5, 
              maxWidth: 800, 
              mx: 'auto',
              fontSize: isMobile ? '1rem' : '1.4rem',
              lineHeight: 1.6
            }}
          >
            Streamline your business registration process with our all-in-one platform. 
            Get started in minutes and focus on growing your business.
          </Typography>
          <Box sx={{ display: isMobile ? 'column' : 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              sx={{ 
                mr: isMobile ? 0 : 2,
                borderRadius: '8px',
                px: isMobile ? 3 : 6,
                py: isMobile ? 1 : 1.5,
                background: 'white',
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: '#f8fafc',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                },
                mb: isMobile ? 2 : 0
              }}
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              sx={{ 
                borderRadius: '8px',
                px: isMobile ? 3 : 6,
                py: isMobile ? 1 : 1.5,
                color: 'white',
                borderColor: 'white',
                fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.1rem',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.8)',
                }
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: isMobile ? 6 : 12 }}>
        <Grid container spacing={isMobile ? 2 : 4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: theme.palette.text.secondary }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ background: theme.palette.background.default, py: isMobile ? 6 : 10, mb: isMobile ? 6 : 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            align="center" 
            sx={{ 
              mb: 2, 
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            align="center" 
            sx={{ 
              mb: isMobile ? 4 : 8, 
              color: theme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            We provide everything you need to register and manage your company effectively
          </Typography>
          
          <Grid container spacing={isMobile ? 2 : 4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: isMobile ? 2 : 4, 
                    height: '100%', 
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: theme.custom.shadows.soft,
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: theme.custom.shadows.medium,
                      transform: 'translateY(-8px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant={isMobile ? "h6" : "h6"} sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: isMobile ? 6 : 12 }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          align="center" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          How It Works
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          align="center" 
          sx={{ 
            mb: isMobile ? 4 : 8, 
            color: theme.palette.text.secondary,
            maxWidth: 700,
            mx: 'auto'
          }}
        >
          Get started in just a few simple steps
        </Typography>
        
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: theme.custom.shadows.soft, border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: isMobile ? 2 : 4, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: isMobile ? 48 : 60, 
                    height: isMobile ? 48 : 60, 
                    borderRadius: '50%', 
                    background: theme.custom.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1.25rem' : '1.5rem'
                  }}
                >
                  1
                </Box>
                <Typography variant={isMobile ? "h6" : "h6"} sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
                  Create Your Account
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Sign up and set up your company profile in minutes with our easy onboarding process.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: theme.custom.shadows.soft, border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: isMobile ? 2 : 4, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: isMobile ? 48 : 60, 
                    height: isMobile ? 48 : 60, 
                    borderRadius: '50%', 
                    background: theme.custom.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1.25rem' : '1.5rem'
                  }}
                >
                  2
                </Box>
                <Typography variant={isMobile ? "h6" : "h6"} sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
                  Complete Registration
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Provide all necessary company details and documents through our secure platform.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: theme.custom.shadows.soft, border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: isMobile ? 2 : 4, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: isMobile ? 48 : 60, 
                    height: isMobile ? 48 : 60, 
                    borderRadius: '50%', 
                    background: theme.custom.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1.25rem' : '1.5rem'
                  }}
                >
                  3
                </Box>
                <Typography variant={isMobile ? "h6" : "h6"} sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
                  Start Operating
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Receive your registration certificate and start operating your business legally.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ background: theme.palette.background.default, py: isMobile ? 6 : 10, mb: isMobile ? 6 : 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            align="center" 
            sx={{ 
              mb: 2, 
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}
          >
            What Our Clients Say
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            align="center" 
            sx={{ 
              mb: isMobile ? 4 : 8, 
              color: theme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Don't just take our word for it - hear from businesses that have successfully registered with us
          </Typography>
          
          <Grid container spacing={isMobile ? 2 : 4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: theme.custom.shadows.soft, border: '1px solid rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: isMobile ? 2 : 4 }}>
                    <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 2 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            background: theme.custom.gradients.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          {testimonial.name.charAt(0)}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, fontSize: '1rem' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: isMobile ? 6 : 12, textAlign: 'center' }}>
        <Paper 
          sx={{ 
            p: isMobile ? 3 : (isTablet ? 6 : 8), 
            borderRadius: 3,
            background: theme.custom.gradients.primary,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ 
              mb: 3, 
              fontWeight: 'bold'
            }}
          >
            Ready to Register Your Business?
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            sx={{ 
              mb: 5, 
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Join thousands of companies already using our platform to register and manage their businesses.
          </Typography>
          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            sx={{ 
              borderRadius: '8px',
              px: isMobile ? 4 : 6,
              py: isMobile ? 1 : 2,
              background: 'white',
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: isMobile ? '1rem' : '1.1rem',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                background: '#f8fafc',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              }
            }}
            onClick={() => navigate('/register')}
          >
            Create Your Account Now
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box 
        sx={{ 
          background: '#1e293b',
          color: 'white',
          pt: isMobile ? 4 : 6,
          pb: isMobile ? 2 : 3
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 1 : 2}>
            {/* Company Info */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 2 }}>
                <Business sx={{ mr: 1, color: theme.palette.primary.main, fontSize: isMobile ? 16 : 20 }} />
                <Typography variant={isMobile ? "h6" : "h6"} sx={{ fontWeight: 'bold' }}>
                  Company Registration
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: isMobile ? 1 : 2, color: '#cbd5e1', maxWidth: 200, fontSize: isMobile ? '0.625rem' : '0.75rem' }}>
                Your trusted partner for seamless business registration and compliance management.
              </Typography>
              <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
                <IconButton sx={{ color: 'white', backgroundColor: '#334155', '&:hover': { backgroundColor: '#475569' }, width: isMobile ? 24 : 32, height: isMobile ? 24 : 32 }}>
                  <Facebook sx={{ fontSize: isMobile ? 12 : 16 }} />
                </IconButton>
                <IconButton sx={{ color: 'white', backgroundColor: '#334155', '&:hover': { backgroundColor: '#475569' }, width: isMobile ? 24 : 32, height: isMobile ? 24 : 32 }}>
                  <Twitter sx={{ fontSize: isMobile ? 12 : 16 }} />
                </IconButton>
                <IconButton sx={{ color: 'white', backgroundColor: '#334155', '&:hover': { backgroundColor: '#475569' }, width: isMobile ? 24 : 32, height: isMobile ? 24 : 32 }}>
                  <LinkedIn sx={{ fontSize: isMobile ? 12 : 16 }} />
                </IconButton>
                <IconButton sx={{ color: 'white', backgroundColor: '#334155', '&:hover': { backgroundColor: '#475569' }, width: isMobile ? 24 : 32, height: isMobile ? 24 : 32 }}>
                  <Instagram sx={{ fontSize: isMobile ? 12 : 16 }} />
                </IconButton>
              </Box>
            </Grid>
            
            {/* Quick Links */}
            <Grid item xs={6} sm={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: isMobile ? 1 : 1.5, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.25 : 0.5 }}>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Home
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/register'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Register Now
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Client Login
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/#features'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Our Services
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/#how-it-works'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  How It Works
                </Button>
              </Box>
            </Grid>
            
            {/* Resources */}
            <Grid item xs={6} sm={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: isMobile ? 1 : 1.5, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.25 : 0.5 }}>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Business Blog
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/documentation'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Documentation
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/guides'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Startup Guides
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/support'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  Support Center
                </Button>
                <Button 
                  onClick={(e) => { e.preventDefault(); navigate('/faq'); }}
                  sx={{ color: '#cbd5e1', justifyContent: 'flex-start', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
                >
                  FAQs
                </Button>
              </Box>
            </Grid>
            
            {/* Contact Info */}
            <Grid item xs={12} sm={5} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: isMobile ? 1 : 1.5, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.5 : 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOn sx={{ mr: 0.5, color: theme.palette.primary.main, fontSize: isMobile ? 12 : 16 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: isMobile ? '0.625rem' : '0.75rem' }}>
                      456 Enterprise Blvd
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: isMobile ? '0.5rem' : '0.625rem' }}>
                      Tech Hub, Austin, TX 78701
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Email sx={{ mr: 0.5, color: theme.palette.primary.main, fontSize: isMobile ? 12 : 16 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: isMobile ? '0.625rem' : '0.75rem' }}>
                      support@companyregistration.com
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: isMobile ? '0.5rem' : '0.625rem' }}>
                      help@companyregistration.com
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Phone sx={{ mr: 0.5, color: theme.palette.primary.main, fontSize: isMobile ? 12 : 16 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: isMobile ? '0.625rem' : '0.75rem' }}>
                      +1 (888) 123-4567
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: isMobile ? '0.5rem' : '0.625rem' }}>
                      24/7 Customer Support
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ my: isMobile ? 1 : 2, borderColor: '#334155' }} component="hr" />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: { xs: 1, md: 0 }, fontSize: isMobile ? '0.625rem' : '0.75rem' }}>
              © 2025 Company Registration Services. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2 }}>
              <Button 
                onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}
                sx={{ color: '#94a3b8', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
              >
                Privacy Policy
              </Button>
              <Button 
                onClick={(e) => { e.preventDefault(); navigate('/terms'); }}
                sx={{ color: '#94a3b8', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
              >
                Terms of Service
              </Button>
              <Button 
                onClick={(e) => { e.preventDefault(); navigate('/cookies'); }}
                sx={{ color: '#94a3b8', textTransform: 'none', fontSize: isMobile ? '0.625rem' : '0.75rem', p: 0, minWidth: 'auto' }}
              >
                Cookie Policy
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NewHomepage;