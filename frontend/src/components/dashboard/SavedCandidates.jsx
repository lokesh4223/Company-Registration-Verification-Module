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
  Pagination,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  People, 
  Search,
  Work,
  LocationOn,
  Email,
  Phone,
  Bookmark,
  BookmarkBorder,
  Visibility,
  Delete
} from '@mui/icons-material';

const SavedCandidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const candidatesPerPage = 5;

  // Mock candidate data
  const candidates = [
    { 
      id: 1,
      name: 'John Smith', 
      email: 'john.smith@example.com',
      phone: '+91 98765 43210',
      position: 'Frontend Developer',
      experience: '3 years',
      location: 'Bangalore',
      skills: ['React', 'JavaScript', 'CSS'],
      status: 'Active',
      savedDate: '2025-10-05'
    },
    { 
      id: 2,
      name: 'Priya Sharma', 
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43211',
      position: 'Backend Engineer',
      experience: '5 years',
      location: 'Hyderabad',
      skills: ['Node.js', 'Python', 'MongoDB'],
      status: 'Active',
      savedDate: '2025-10-03'
    },
    { 
      id: 3,
      name: 'Raj Kumar', 
      email: 'raj.kumar@example.com',
      phone: '+91 98765 43212',
      position: 'UI/UX Designer',
      experience: '4 years',
      location: 'Mumbai',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
      status: 'Contacted',
      savedDate: '2025-09-28'
    },
    { 
      id: 4,
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@example.com',
      phone: '+91 98765 43213',
      position: 'Data Scientist',
      experience: '6 years',
      location: 'Delhi',
      skills: ['Python', 'TensorFlow', 'SQL'],
      status: 'Interviewed',
      savedDate: '2025-10-01'
    },
    { 
      id: 5,
      name: 'Amit Patel', 
      email: 'amit.patel@example.com',
      phone: '+91 98765 43214',
      position: 'Product Manager',
      experience: '7 years',
      location: 'Bangalore',
      skills: ['Agile', 'Product Strategy', 'Analytics'],
      status: 'Hired',
      savedDate: '2025-09-25'
    },
    { 
      id: 6,
      name: 'Emily Davis', 
      email: 'emily.davis@example.com',
      phone: '+91 98765 43215',
      position: 'Marketing Specialist',
      experience: '2 years',
      location: 'Pune',
      skills: ['SEO', 'Content Marketing', 'Social Media'],
      status: 'Active',
      savedDate: '2025-10-07'
    }
  ];

  // Filter candidates based on search term and status
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || candidate.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + candidatesPerPage);

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

  const handleSelectCandidate = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCandidates(paginatedCandidates.map(candidate => candidate.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'primary';
      case 'contacted': return 'info';
      case 'interviewed': return 'warning';
      case 'hired': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Saved Candidates
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<People />}
          disabled={selectedCandidates.length === 0}
        >
          Contact Selected ({selectedCandidates.length})
        </Button>
      </Box>
      
      {/* Filters */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Candidates"
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
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="interviewed">Interviewed</MenuItem>
                  <MenuItem value="hired">Hired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Select All */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedCandidates.length === paginatedCandidates.length && paginatedCandidates.length > 0}
              indeterminate={selectedCandidates.length > 0 && selectedCandidates.length < paginatedCandidates.length}
              onChange={handleSelectAll}
            />
          }
          label="Select all on this page"
        />
        <Typography variant="body2" sx={{ ml: 2 }}>
          {filteredCandidates.length} candidates found
        </Typography>
      </Box>
      
      {/* Candidate Listings */}
      <Grid container spacing={3}>
        {paginatedCandidates.map((candidate) => (
          <Grid item xs={12} key={candidate.id}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => handleSelectCandidate(candidate.id)}
                  />
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#667eea' }}>
                    {candidate.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {candidate.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Work sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            {candidate.position}
                          </Typography>
                          <LocationOn sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {candidate.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Email sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            {candidate.email}
                          </Typography>
                          <Phone sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {candidate.phone}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={candidate.status} 
                        color={getStatusColor(candidate.status)} 
                        size="small" 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        <strong>Experience:</strong> {candidate.experience}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Saved:</strong> {candidate.savedDate}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        <strong>Skills:</strong>
                      </Typography>
                      {candidate.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 1, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <IconButton>
                    <Bookmark />
                  </IconButton>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  variant="outlined"
                >
                  View Profile
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Email />}
                  variant="contained"
                >
                  Contact
                </Button>
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

export default SavedCandidates;