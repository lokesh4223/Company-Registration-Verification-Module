const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const createError = require('http-errors');

// Load environment variables
dotenv.config();

// Import routes
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Add job routes

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001; // Changed default to 3001

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(compression()); // Gzip compression
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Company Registration Backend API' });
});

// API routes
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // Add job routes

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle http-errors
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { error: err })
    });
  }
  
  // Handle other errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;