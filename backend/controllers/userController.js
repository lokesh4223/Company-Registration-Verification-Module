const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { createUserWithEmailAndPassword, verifyIdToken } = require('../utils/firebase');
require('dotenv').config();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, full_name, gender, mobile_no } = req.body;
    
    // Check if user already exists in our database
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user in Firebase
    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (firebaseError) {
      console.error('Firebase user creation error:', firebaseError);
      // Continue with local user creation even if Firebase fails
    }
    
    // Create new user in our database
    const newUser = await userModel.createUser({
      email,
      password,
      full_name,
      gender,
      mobile_no,
      signup_type: 'e',
      is_mobile_verified: true, // Set to true since we're removing OTP verification
      is_email_verified: false
    });
    
    // Generate token
    const token = generateToken(newUser.id);
    
    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const isPasswordValid = await userModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'User logged in successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await userModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const updatedUser = await userModel.updateUser(id, req.body);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile_no, ...otherData } = req.body;
    
    // Check if user exists
    const existingUser = await userModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user profile data
    const updatedUser = await userModel.updateUser(id, {
      mobile_no,
      ...otherData
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'User profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await userModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const deletedUser = await userModel.deleteUser(id);
    
    res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserProfile,
  deleteUser,
};