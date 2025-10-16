const express = require('express');
const { register, login, verifyEmail, verifyMobile, demoOtp, firebaseLogin } = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin); // Add Firebase login route
router.get('/verify-email', verifyEmail);
router.post('/verify-mobile', verifyMobile);
router.post('/demo-otp', demoOtp);

module.exports = router;