const express = require('express');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Job routes
router.post('/', authMiddleware, jobController.createJob);
router.get('/', authMiddleware, jobController.getJobsByCompany);
router.get('/:id', authMiddleware, jobController.getJobById);
router.put('/:id', authMiddleware, jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deleteJob);
router.put('/:id/status', authMiddleware, jobController.updateJobStatus);
router.post('/:id/apply', jobController.applyToJob); // Public route for job applications

module.exports = router;