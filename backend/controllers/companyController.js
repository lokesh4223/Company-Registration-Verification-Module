const createError = require('http-errors');
const companyModel = require('../models/companyModel');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// Get all companies
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyModel.getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies,
      message: 'Companies retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get company by ID
const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await companyModel.getCompanyById(id);
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    res.status(200).json({
      success: true,
      data: company,
      message: 'Company retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get company by owner ID
const getCompanyByOwnerId = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    const company = await companyModel.getCompanyByOwnerId(owner_id);
    
    if (!company) {
      return next(createError(404, 'Company profile not found'));
    }
    
    res.status(200).json({
      success: true,
      data: company,
      message: 'Company profile retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create a new company
const createCompany = async (req, res, next) => {
  try {
    const companyData = { ...req.body };
    
    // Ensure owner_id is set from authenticated user
    if (req.user && req.user.id) {
      companyData.owner_id = req.user.id;
    } else {
      return next(createError(400, 'User ID is required'));
    }
    
    const newCompany = await companyModel.createCompany(companyData);
    
    res.status(201).json({
      success: true,
      data: newCompany,
      message: 'Company profile created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update company by ID
const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if company exists
    const existingCompany = await companyModel.getCompanyById(id);
    if (!existingCompany) {
      return next(createError(404, 'Company not found'));
    }
    
    const updatedCompany = await companyModel.updateCompany(id, req.body);
    
    res.status(200).json({
      success: true,
      data: updatedCompany,
      message: 'Company updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update company by owner ID
const updateCompanyByOwnerId = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    
    // Check if company exists for this owner
    const existingCompany = await companyModel.getCompanyByOwnerId(owner_id);
    if (!existingCompany) {
      return next(createError(404, 'Company profile not found'));
    }
    
    // Process social_links if present to ensure proper JSON format
    const companyData = { ...req.body };
    if (companyData.social_links && typeof companyData.social_links === 'object') {
      // If it's already an object, make sure it's properly formatted
      if (!Array.isArray(companyData.social_links)) {
        // Convert to array format if it's not already
        companyData.social_links = Object.values(companyData.social_links);
      }
      
      // Ensure each social link has proper structure
      companyData.social_links = companyData.social_links.map(link => {
        if (typeof link === 'string') {
          try {
            return JSON.parse(link);
          } catch (e) {
            return link;
          }
        }
        return link;
      });
      
      // Validate that social_links is a proper array of objects
      if (!Array.isArray(companyData.social_links)) {
        companyData.social_links = [];
      }
    }
    
    const updatedCompany = await companyModel.updateCompany(existingCompany.id, companyData);
    
    res.status(200).json({
      success: true,
      data: updatedCompany,
      message: 'Company profile updated successfully'
    });
  } catch (error) {
    console.error('Update company error:', error);
    // Provide more specific error message for JSON parsing issues
    if (error.message && error.message.includes('invalid input syntax for type json')) {
      return next(createError(400, 'Invalid social links format. Please check your social media URLs.'));
    }
    next(error);
  }
};

// Delete company by ID
const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if company exists
    const existingCompany = await companyModel.getCompanyById(id);
    if (!existingCompany) {
      return next(createError(404, 'Company not found'));
    }
    
    // Delete logo from Cloudinary if exists
    if (existingCompany.logo_public_id) {
      try {
        await deleteImage(existingCompany.logo_public_id);
      } catch (deleteError) {
        console.error('Logo deletion error:', deleteError);
      }
    }
    
    // Delete banner from Cloudinary if exists
    if (existingCompany.banner_public_id) {
      try {
        await deleteImage(existingCompany.banner_public_id);
      } catch (deleteError) {
        console.error('Banner deletion error:', deleteError);
      }
    }
    
    const deletedCompany = await companyModel.deleteCompany(id);
    
    res.status(200).json({
      success: true,
      data: deletedCompany,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Upload company logo
const uploadLogo = async (req, res, next) => {
  try {
    const { image } = req.body;
    const owner_id = req.user.id;
    
    if (!image) {
      return next(createError(400, 'Image data is required'));
    }
    
    // Check if company exists for this owner
    let company = await companyModel.getCompanyByOwnerId(owner_id);
    if (!company) {
      return next(createError(404, 'Company profile not found'));
    }
    
    // Delete old logo if exists
    if (company.logo_public_id) {
      try {
        await deleteImage(company.logo_public_id);
      } catch (deleteError) {
        console.error('Logo deletion error:', deleteError);
      }
    }
    
    // Upload new logo
    const logoResult = await uploadImage(image, {
      folder: 'company_logos',
      transformation: [
        { width: 200, height: 200, crop: 'fill' }
      ]
    });
    
    // Update company with new logo URL
    const updatedCompany = await companyModel.updateCompany(company.id, {
      logo_url: logoResult.secure_url,
      logo_public_id: logoResult.public_id
    });
    
    res.status(200).json({
      success: true,
      data: {
        url: logoResult.secure_url
      },
      message: 'Logo uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Upload company banner
const uploadBanner = async (req, res, next) => {
  try {
    const { image } = req.body;
    const owner_id = req.user.id;
    
    if (!image) {
      return next(createError(400, 'Image data is required'));
    }
    
    // Check if company exists for this owner
    let company = await companyModel.getCompanyByOwnerId(owner_id);
    if (!company) {
      return next(createError(404, 'Company profile not found'));
    }
    
    // Delete old banner if exists
    if (company.banner_public_id) {
      try {
        await deleteImage(company.banner_public_id);
      } catch (deleteError) {
        console.error('Banner deletion error:', deleteError);
      }
    }
    
    // Upload new banner
    const bannerResult = await uploadImage(image, {
      folder: 'company_banners',
      transformation: [
        { width: 800, height: 300, crop: 'fill' }
      ]
    });
    
    // Update company with new banner URL
    const updatedCompany = await companyModel.updateCompany(company.id, {
      banner_url: bannerResult.secure_url,
      banner_public_id: bannerResult.public_id
    });
    
    res.status(200).json({
      success: true,
      data: {
        url: bannerResult.secure_url
      },
      message: 'Banner uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  getCompanyByOwnerId,
  createCompany,
  updateCompany,
  updateCompanyByOwnerId,
  deleteCompany,
  uploadLogo,
  uploadBanner
};