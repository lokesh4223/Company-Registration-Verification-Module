import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Avatar,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import { 
  Business, 
  Search,
  LocationOn,
  Work,
  People,
  Link as LinkIcon,
  Visibility,
  Star
} from '@mui/icons-material';

const AllCompanies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 6;

  // Mock company data
  const companies = [
    { 
      id: 1,
      name: 'Tech Innovations Ltd', 
      industry: 'Information Technology',
      location: 'Bangalore, India',
      employees: 127,
      jobs: 12,
      website: 'www.techinnovations.com',
      logo: '',
      featured: true
    },
    { 
      id: 2,
      name: 'Global Finance Corp', 
      industry: 'Finance',
      location: 'Mumbai, India',
      employees: 245,
      jobs: 8,
      website: 'www.globalfinance.com',
      logo: '',
      featured: false
    },
    { 
      id: 3,
      name: 'Creative Solutions', 
      industry: 'Design',
      location: 'Delhi, India',
      employees: 68,
      jobs: 5,
      website: 'www.creativesolutions.in',
      logo: '',
      featured: false
    },
    { 
      id: 4,
      name: 'HealthPlus Medical', 
      industry: 'Healthcare',
      location: 'Hyderabad, India',
      employees: 312,
      jobs: 15,
      website: 'www.healthplus.com',
      logo: '',
      featured: true
    },
    { 
      id: 5,
      name: 'EduTech Learning', 
      industry: 'Education',
      location: 'Chennai, India',
      employees: 96,
      jobs: 7,
      website: 'www.edutechlearning.com',
      logo: '',
      featured: false
    },
    { 
      id: 6,
      name: 'Green Energy Solutions', 
      industry: 'Energy',
      location: 'Pune, India',
      employees: 187,
      jobs: 9,
      website: 'www.greenenergy.com',
      logo: '',
      featured: false
    },
    { 
      id: 7,
      name: 'Retail Masters', 
      industry: 'Retail',
      location: 'Kolkata, India',
      employees: 420,
      jobs: 22,
      website: 'www.retailmasters.com',
      logo: '',
      featured: true
    },
    { 
      id: 8,
      name: 'Logistics Pro', 
      industry: 'Transportation',
      location: 'Ahmedabad, India',
      employees: 156,
      jobs: 6,
      website: 'www.logisticspro.com',
      logo: '',
      featured: false
    }
  ];

  const industries = [
    'All Industries',
    'Information Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Design',
    'Energy',
    'Retail',
    'Transportation'
  ];

  // Filter companies based on search term and industry
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || company.industry.toLowerCase() === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleIndustryChange = (e) => {
    setIndustryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          All Companies
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Business />}
        >
          Add Company
        </Button>
      </Box>
      
      {/* Filters */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Companies"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={industryFilter}
                  onChange={handleIndustryChange}
                  label="Industry"
                >
                  {industries.map((industry, index) => (
                    <MenuItem key={index} value={index === 0 ? 'all' : industry.toLowerCase()}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Company Listings */}
      <Grid container spacing={3}>
        {paginatedCompanies.map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: company.featured ? '1px solid #667eea' : '1px solid #e0e0e0',
                position: 'relative'
              }}
            >
              {company.featured && (
                <Chip 
                  icon={<Star />} 
                  label="Featured" 
                  color="primary" 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: -12, 
                    right: 16,
                    fontWeight: 'bold'
                  }} 
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#667eea' }}>
                    <Business />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {company.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 0.5, fontSize: '0.9rem', color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {company.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Work sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    <strong>{company.jobs}</strong> open jobs
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    <strong>{company.employees}</strong> employees
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="primary">
                    {company.website}
                  </Typography>
                </Box>
                
                <Chip label={company.industry} size="small" variant="outlined" />
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
                <IconButton size="small">
                  <Visibility />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
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

export default AllCompanies;