// Business Configuration Loader
// Handles loading business configs for multi-tenant architecture

const path = require('path');
const fs = require('fs');

/**
 * Load business configuration by slug
 * @param {string} slug - Business identifier (e.g., 'jps', 'abc')
 * @returns {object} Business configuration
 */
function loadBusinessConfig(slug) {
  try {
    const configPath = path.join(__dirname, '../../businesses', slug, 'config.js');
    
    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      throw new Error(`Business config not found for slug: ${slug}`);
    }

    // Clear require cache to allow hot reloading in development
    delete require.cache[require.resolve(configPath)];
    
    const config = require(configPath);
    
    // Validate required fields
    if (!config.business || !config.business.name) {
      throw new Error(`Invalid business config for slug: ${slug}`);
    }

    return config;
  } catch (error) {
    console.error(`Error loading business config for ${slug}:`, error);
    throw error;
  }
}

/**
 * Get business slug from domain/hostname
 * @param {string} hostname - Full hostname (e.g., 'mobiledetailhub.com', 'jps.mobiledetailhub.com')
 * @param {object} req - Express request object (optional, for development mode)
 * @returns {string} Business slug
 */
function getSlugFromDomain(hostname, req = null) {
  // Handle localhost development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // In development, try to detect business from URL path or query params
    if (req) {
      // Check if there's a business parameter in the URL
      const businessFromQuery = req.query.business;
      if (businessFromQuery && ['jps', 'mdh', 'abc'].includes(businessFromQuery)) {
        console.log(`Development mode: Using business from query param: ${businessFromQuery}`);
        return businessFromQuery;
      }
      
      // Check if there's a business indicator in the URL path
      const pathParts = req.path.split('/');
      if (pathParts.length > 1 && ['jps', 'mdh', 'abc'].includes(pathParts[1])) {
        console.log(`Development mode: Using business from URL path: ${pathParts[1]}`);
        return pathParts[1];
      }
    }
    
    // Default to 'jps' for development testing
    console.log('Development mode: Defaulting to business: jps');
    return 'jps';
  }

  // Handle main domain (mobiledetailhub.com)
  if (hostname === 'mobiledetailhub.com') {
    return 'mdh';
  }

  // Extract subdomain for other businesses
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts[0]; // First part is the business slug
  }

  // Fallback to mdh if no subdomain
  return 'mdh';
}

/**
 * List all available businesses
 * @returns {Array} Array of business slugs
 */
function listBusinesses() {
  try {
    const businessesDir = path.join(__dirname, '../../businesses');
    return fs.readdirSync(businessesDir)
      .filter(item => {
        const itemPath = path.join(businessesDir, item);
        // Always include template for now (development mode)
        // In production, you can change this to: item !== 'template'
        return fs.statSync(itemPath).isDirectory();
      });
  } catch (error) {
    console.error('Error listing businesses:', error);
    return [];
  }
}

module.exports = {
  loadBusinessConfig,
  getSlugFromDomain,
  listBusinesses
};
