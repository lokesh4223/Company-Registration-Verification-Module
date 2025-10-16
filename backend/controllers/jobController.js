const jobModel = require('../models/jobModel');
const companyModel = require('../models/companyModel');
const { validationResult } = require('express-validator');

// Create a new job
const createJob = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get company ID from authenticated user
    const company = await companyModel.getCompanyByOwnerId(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found. Please complete your company profile first.'
      });
    }

    // Prepare job data
    const jobData = {
      company_id: company.id,
      title: req.body.title,
      department: req.body.department,
      location: req.body.location,
      employment_type: req.body.employmentType,
      experience_level: req.body.experience,
      salary_min: req.body.salaryMin ? parseInt(req.body.salaryMin) : null,
      salary_max: req.body.salaryMax ? parseInt(req.body.salaryMax) : null,
      description: req.body.description,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      skills: req.body.skills || [],
      is_remote: req.body.remote || false,
      is_urgent: req.body.urgent || false
    };

    // Create job
    const job = await jobModel.createJob(jobData);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all jobs for a company
const getJobsByCompany = async (req, res) => {
  try {
    // Get company ID from authenticated user
    const company = await companyModel.getCompanyByOwnerId(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Get jobs
    const jobs = await jobModel.getJobsByCompanyId(company.id);

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get job
    const job = await jobModel.getJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user has access to this job
    const company = await companyModel.getCompanyByOwnerId(req.user.id);
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get job
    const job = await jobModel.getJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user has access to this job
    const company = await companyModel.getCompanyByOwnerId(req.user.id);
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Prepare update data
    const updateData = {};
    
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.department !== undefined) updateData.department = req.body.department;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.employmentType !== undefined) updateData.employment_type = req.body.employmentType;
    if (req.body.experience !== undefined) updateData.experience_level = req.body.experience;
    if (req.body.salaryMin !== undefined) updateData.salary_min = req.body.salaryMin ? parseInt(req.body.salaryMin) : null;
    if (req.body.salaryMax !== undefined) updateData.salary_max = req.body.salaryMax ? parseInt(req.body.salaryMax) : null;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.requirements !== undefined) updateData.requirements = req.body.requirements;
    if (req.body.responsibilities !== undefined) updateData.responsibilities = req.body.responsibilities;
    if (req.body.skills !== undefined) updateData.skills = req.body.skills;
    if (req.body.remote !== undefined) updateData.is_remote = req.body.remote;
    if (req.body.urgent !== undefined) updateData.is_urgent = req.body.urgent;

    // Update job
    const updatedJob = await jobModel.updateJob(id, updateData);

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get job
    const job = await jobModel.getJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user has access to this job
    const company = await companyModel.getCompanyByOwnerId(req.user.id);
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete job
    await jobModel.deleteJob(id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update job status
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'active', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: pending, active, closed'
      });
    }
    
    // Get job
    const job = await jobModel.getJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user has access to this job
    const company = await companyModel.getCompanyByOwnerId(req.user.id);
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update job status
    const updatedJob = await jobModel.updateJobStatus(id, status);

    res.json({
      success: true,
      message: 'Job status updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Apply to job (public route)
const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get job
    const job = await jobModel.getJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment applicants count
    const updatedJob = await jobModel.incrementApplicantsCount(id);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createJob,
  getJobsByCompany,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  applyToJob
};