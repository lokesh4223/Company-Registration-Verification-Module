const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param {string} imagePath - Path to the image file or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
const uploadImage = async (imagePath, options = {}) => {
  try {
    // Default options
    const defaultOptions = {
      folder: 'company_registration',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      ...options,
    };

    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, defaultOptions);
    return result;
  } catch (error) {
    throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};

/**
 * Get image details from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<Object>} - Image details
 */
const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error getting image details from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getImageDetails,
};