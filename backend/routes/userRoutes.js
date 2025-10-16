const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.put('/:id/profile', authMiddleware, userController.updateUserProfile);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;