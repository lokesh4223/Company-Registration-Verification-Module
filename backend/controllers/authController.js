const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const userModel = require('../models/userModel');
const { verifyIdToken } = require('../utils/firebase');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// Register user
const register = async (req, res, next) => {
  try {
    const { email, password, full_name, gender, mobile_no, signup_type } = req.body;
    
    // Validate required fields
    if (!email || !password || !full_name || !gender || !mobile_no) {
      return next(createError(400, 'All fields are required'));
    }
    
    // Normalize gender to lowercase to match database constraint
    const normalizedGender = gender.toLowerCase();
    
    // Check if user already exists in our database
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return next(createError(400, 'User already exists with this email'));
    }
    
    // Create new user in our database
    const newUser = await userModel.createUser({
      email,
      password,
      full_name,
      gender: normalizedGender, // Use normalized gender
      mobile_no,
      signup_type: signup_type || 'e',
      is_mobile_verified: false, // Set to false initially
      is_email_verified: false
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify mobile OTP.',
      data: { user_id: newUser.id }
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    
    // Check if user exists
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      return next(createError(401, 'Invalid email or password'));
    }
    
    console.log('User found:', user.email);
    
    // Verify password
    const isPasswordValid = await userModel.verifyPassword(user, password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return next(createError(401, 'Invalid email or password'));
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          gender: user.gender,
          mobile_no: user.mobile_no,
          is_mobile_verified: user.is_mobile_verified,
          is_email_verified: user.is_email_verified
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Verify email
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return next(createError(400, 'Verification token is required'));
    }
    
    // In a real implementation, you would verify the token
    // For now, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Verify mobile
const verifyMobile = async (req, res, next) => {
  try {
    const { user_id, otp } = req.body;
    
    if (!user_id || !otp) {
      return next(createError(400, 'User ID and OTP are required'));
    }
    
    // In a real implementation, you would verify the OTP
    // For now, we'll just update the user's mobile verification status
    const user = await userModel.updateUser(user_id, {
      is_mobile_verified: true
    });
    
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    
    // Generate token for the verified user
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      message: 'Mobile verified successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          gender: user.gender,
          mobile_no: user.mobile_no,
          is_mobile_verified: user.is_mobile_verified,
          is_email_verified: user.is_email_verified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Demo OTP verification
const demoOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return next(createError(400, 'Phone number and OTP are required'));
    }
    
    // Demo data for testing
    const demoData = [
      { phone: '+919876543210', otp: '123456', name: 'John Doe' },
      { phone: '+919876543211', otp: '654321', name: 'Jane Smith' },
      { phone: '+919876543212', otp: '111111', name: 'Robert Johnson' },
      { phone: '+919876543213', otp: '222222', name: 'Emily Davis' },
      { phone: '+919876543214', otp: '333333', name: 'Michael Wilson' }
    ];
    
    // Check if the OTP matches
    const user = demoData.find(u => u.phone === phone && u.otp === otp);
    
    if (user) {
      // Generate a demo token
      const token = 'demo-token-' + Date.now();
      
      res.status(200).json({
        success: true,
        message: 'OTP verification successful!',
        data: {
          token,
          user: {
            id: Date.now(), // Demo user ID
            full_name: user.name,
            mobile_no: user.phone,
            is_mobile_verified: true
          }
        }
      });
    } else {
      return next(createError(400, 'Invalid OTP. Please try again.'));
    }
  } catch (error) {
    next(error);
  }
};

// Firebase login handler
const firebaseLogin = async (req, res, next) => {
  try {
    const { idToken, userData } = req.body;
    
    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;
    
    let user;
    
    // Check if user already exists in our database
    const existingUser = await userModel.getUserByEmail(email);
    
    if (existingUser) {
      // User exists, update last login
      user = existingUser;
      console.log('User found in database:', user.email);
    } else if (userData) {
      // New user registration
      console.log('Creating new user with data:', userData);
      
      // Normalize gender to lowercase to match database constraint
      const normalizedGender = userData.gender ? userData.gender.toLowerCase() : 'other';
      
      // Create new user in our database
      user = await userModel.createUser({
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        gender: normalizedGender,
        mobile_no: userData.mobile_no || '0000000000',
        signup_type: userData.signup_type || 'e',
        is_mobile_verified: userData.is_mobile_verified || false,
        is_email_verified: true // Firebase email is already verified
      });
      console.log('New user created:', user.email);
    } else {
      // User doesn't exist and no registration data provided
      console.log('User not found and no registration data provided');
      return next(createError(400, 'User not found. Please register first.'));
    }
    
    // Generate our JWT token
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          gender: user.gender,
          mobile_no: user.mobile_no,
          is_mobile_verified: user.is_mobile_verified,
          is_email_verified: user.is_email_verified
        }
      }
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    next(createError(401, 'Invalid authentication token'));
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  verifyMobile,
  demoOtp,
  firebaseLogin
};