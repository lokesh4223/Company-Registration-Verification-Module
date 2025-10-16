import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Assignment, 
  Check,
  Star,
  Business,
  People,
  Work,
  Storage,
  Support,
  History,
  CreditCard,
  AttachMoney
} from '@mui/icons-material';

const PlansBilling = () => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: annualBilling ? '$99' : '$9',
      period: annualBilling ? '/year' : '/month',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 10 job postings',
        'Up to 100 candidate profiles',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: annualBilling ? '$299' : '$29',
      period: annualBilling ? '/year' : '/month',
      description: 'Ideal for growing companies',
      features: [
        'Up to 50 job postings',
        'Up to 1000 candidate profiles',
        'Advanced analytics',
        'Priority email support',
        'Custom job templates',
        'Team collaboration tools'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited job postings',
        'Unlimited candidate profiles',
        'Advanced analytics & reporting',
        '24/7 dedicated support',
        'Custom job templates',
        'Team collaboration tools',
        'API access',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false
    }
  ];

  const currentPlan = {
    name: 'Professional',
    startDate: '2025-01-15',
    endDate: '2026-01-15',
    status: 'Active',
    amount: '$299.00',
    nextBilling: '2026-01-15'
  };

  const billingHistory = [
    { id: 1, date: '2025-09-15', description: 'Professional Plan (Annual)', amount: '$299.00', status: 'Paid' },
    { id: 2, date: '2024-09-15', description: 'Professional Plan (Annual)', amount: '$299.00', status: 'Paid' },
    { id: 3, date: '2023-09-15', description: 'Basic Plan (Annual)', amount: '$99.00', status: 'Paid' }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleBillingToggle = () => {
    setAnnualBilling(!annualBilling);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Plans & Billing
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<CreditCard />}
        >
          Update Payment Method
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Current Plan */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Current Plan
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {currentPlan.name} Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Billing period: {currentPlan.startDate} to {currentPlan.endDate}
                  </Typography>
                  <Chip label={currentPlan.status} color="success" size="small" />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {currentPlan.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next billing: {currentPlan.nextBilling}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
              <Button size="small" variant="outlined">
                Cancel Plan
              </Button>
              <Button size="small" variant="contained">
                Upgrade Plan
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Plan Selection */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Choose a Plan
                </Typography>
                <FormControlLabel
                  control={<Switch checked={annualBilling} onChange={handleBillingToggle} />}
                  label={annualBilling ? "Annual Billing (Save 20%)" : "Monthly Billing"}
                />
              </Box>
              
              <Grid container spacing={3}>
                {plans.map((plan) => (
                  <Grid item xs={12} md={4} key={plan.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 2,
                        border: selectedPlan === plan.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                        position: 'relative',
                        boxShadow: selectedPlan === plan.id ? '0 6px 16px rgba(102, 126, 234, 0.2)' : '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      {plan.popular && (
                        <Chip 
                          icon={<Star />} 
                          label="Most Popular" 
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
                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {plan.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                            {plan.price}
                          </Typography>
                          <Typography variant="body1" sx={{ ml: 1 }}>
                            {plan.period}
                          </Typography>
                        </Box>
                        <List dense>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Check sx={{ color: '#667eea' }} />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Button 
                          variant={selectedPlan === plan.id ? "contained" : "outlined"}
                          fullWidth
                          sx={{ mx: 2 }}
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          {selectedPlan === plan.id ? "Current Plan" : "Select Plan"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Billing History */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                Billing History
              </Typography>
              <List>
                {billingHistory.map((bill) => (
                  <React.Fragment key={bill.id}>
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemText 
                        primary={bill.description}
                        secondary={bill.date}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {bill.amount}
                        </Typography>
                        <Chip label={bill.status} color="success" size="small" />
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Plan Features */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Plan Features
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText primary="Company Profile" secondary="Create and manage your company profile" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText primary="Job Postings" secondary="Post unlimited jobs with detailed descriptions" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="Candidate Search" secondary="Access our database of qualified candidates" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Storage />
                  </ListItemIcon>
                  <ListItemText primary="Storage" secondary="Store all your job applications and candidate data" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Support />
                  </ListItemIcon>
                  <ListItemText primary="Support" secondary="Get help when you need it with our support team" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlansBilling;