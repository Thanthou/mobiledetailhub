/**
 * Avatar Utilities for Review System
 * Handles local avatar file management with standard naming convention
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate standard avatar filename
 * Format: {clean_name}_{review_id}_{timestamp}.{extension}
 * 
 * @param {string} reviewerName - Name of the reviewer
 * @param {number} reviewId - Database ID of the review
 * @param {string} extension - File extension (jpg, png, etc.)
 * @returns {string} Standardized filename
 */
const generateAvatarFilename = (reviewerName, reviewId, extension = 'jpg') => {
  const cleanName = reviewerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
  // Remove leading dot from extension if present
  const cleanExtension = extension.startsWith('.') ? extension.substring(1) : extension;
  return `${cleanName}_${reviewId}_${timestamp}.${cleanExtension}`;
};

/**
 * Check if custom avatar exists for a review
 * 
 * @param {string} reviewerName - Name of the reviewer
 * @param {number} reviewId - Database ID of the review
 * @returns {string|null} Path to avatar file or null if not found
 */
const findCustomAvatar = (reviewerName, reviewId) => {
  const uploadsDir = path.join(__dirname, '../uploads/avatars');
  
  if (!fs.existsSync(uploadsDir)) {
    return null;
  }
  
  const cleanName = reviewerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const pattern = new RegExp(`^${cleanName}_${reviewId}_\\d+\\.(jpg|jpeg|png|gif|webp)$`);
  
  try {
    const files = fs.readdirSync(uploadsDir);
    const avatarFile = files.find(file => pattern.test(file));
    
    if (avatarFile) {
      return `/uploads/avatars/${avatarFile}`;
    }
  } catch (error) {
    console.error('Error checking for custom avatar:', error.message);
  }
  
  return null;
};

/**
 * Get avatar URL (custom only, no fallback)
 * 
 * @param {string} reviewerName - Name of the reviewer
 * @param {number} reviewId - Database ID of the review
 * @param {string} source - Review source (google, yelp, etc.) - unused now
 * @returns {string|null} Avatar URL or null if no custom avatar
 */
const getAvatarUrl = (reviewerName, reviewId, _source = 'website') => {
  // Check for custom avatar only
  const customAvatar = findCustomAvatar(reviewerName, reviewId);
  if (customAvatar) {
    return customAvatar;
  }
  
  // Return null instead of Unsplash fallback
  return null;
};

/**
 * Create uploads directory if it doesn't exist
 */
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads/avatars');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

module.exports = {
  generateAvatarFilename,
  findCustomAvatar,
  getAvatarUrl,
  ensureUploadsDir
};
