/**
 * Utility function to properly format social links data for API submission
 * @param {Array} socialLinks - Array of social link objects
 * @returns {Array} - Properly formatted social links array
 */
export const formatSocialLinks = (socialLinks) => {
  if (!socialLinks || !Array.isArray(socialLinks)) {
    return [];
  }
  
  // Filter out any empty or invalid entries
  return socialLinks
    .filter(link => 
      link && 
      typeof link === 'object' && 
      link.platform && 
      link.url &&
      link.url.trim() !== ''
    )
    .map(link => ({
      platform: link.platform,
      url: link.url.trim()
    }));
};

/**
 * Utility function to validate social link URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Utility function to ensure all social links have valid URLs
 * @param {Array} socialLinks - Array of social link objects
 * @returns {Array} - Social links with validated URLs
 */
export const validateSocialLinks = (socialLinks) => {
  if (!socialLinks || !Array.isArray(socialLinks)) {
    return [];
  }
  
  return socialLinks
    .filter(link => 
      link && 
      typeof link === 'object' && 
      link.platform && 
      link.url &&
      isValidUrl(link.url)
    )
    .map(link => ({
      platform: link.platform,
      url: link.url
    }));
};