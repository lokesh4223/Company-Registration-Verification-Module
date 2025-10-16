const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Company routes
router.post('/register', authMiddleware, companyController.createCompany);
router.get('/profile', authMiddleware, companyController.getCompanyByOwnerId);
router.put('/profile', authMiddleware, companyController.updateCompanyByOwnerId);
router.post('/upload-logo', authMiddleware, companyController.uploadLogo);
router.post('/upload-banner', authMiddleware, companyController.uploadBanner);

module.exports = router;