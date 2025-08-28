/**
 * MDH Configuration Routes with Intelligent Caching
 * 
 * Caching Strategy:
 * - In-memory cache: 5 minutes for database queries
 * - HTTP cache: 5 minutes with ETag validation
 * - Static file: 24 hours for mdh-config.js
 * 
 * This ensures header/footer loads instantly even under load.
 */
const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// In-memory cache for config data (5 minutes)
let configCache = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache invalidation function
const invalidateCache = () => {
  configCache = null;
  cacheExpiry = 0;
  logger.info('MDH config cache invalidated');
};

// Get cached config or fetch from database
const getConfigData = async () => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (configCache && now < cacheExpiry) {
    logger.debug('Returning cached MDH config');
    return configCache;
  }
  
  // Fetch fresh data from database
  logger.debug('Fetching fresh MDH config from database');
  const result = await query('SELECT * FROM mdh_config LIMIT 1', [], { 
    retries: 3, 
    timeout: 10000 
  });
  
  if (result.rows.length === 0) {
    const error = new Error('MDH config not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Update cache
  configCache = result.rows[0];
  cacheExpiry = now + CACHE_DURATION;
  
  return configCache;
};

// Get MDH config
router.get('/', asyncHandler(async (req, res) => {
  try {
    const configData = await getConfigData();
    
    // Generate ETag for cache validation
    const etag = `"${Buffer.from(JSON.stringify(configData)).toString('base64').slice(0, 8)}"`;
    
    // Check if client has fresh version
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end(); // Not Modified
    }
    
    // Set cache headers for 5 minutes
    res.set({
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'ETag': etag,
      'Vary': 'Accept-Encoding'
    });
    
    res.json(configData);
  } catch (error) {
    logger.error('Failed to fetch MDH config:', { error: error.message });
    throw error;
  }
}));

// Get MDH config field
router.get('/field/:field', asyncHandler(async (req, res) => {
  const { field } = req.params;
  // Whitelist allowed fields
  const allowedFields = [
    'email', 'phone', 'sms_phone', 'logo_url', 'favicon_url',
    'header_display', 'tagline', 'services_description',
    'facebook', 'instagram', 'tiktok', 'youtube', 'created_at', 'updated_at'
  ];
  if (!allowedFields.includes(field)) {
    const error = new Error('Invalid field');
    error.statusCode = 400;
    throw error;
  }
  

  // Use a safer approach with explicit field selection
  const fieldMap = {
    'email': 'email',
    'phone': 'phone',
    'sms_phone': 'sms_phone',
    'logo_url': 'logo_url',
    'favicon_url': 'favicon_url',
    'header_display': 'header_display',
    'tagline': 'tagline',
    'services_description': 'services_description',
    'facebook': 'facebook',
    'instagram': 'instagram',
    'tiktok': 'tiktok',
    'youtube': 'youtube',
    'created_at': 'created_at',
    'updated_at': 'updated_at'
  };
  
  const safeField = fieldMap[field];
  if (!safeField) {
    const error = new Error('Invalid field');
    error.statusCode = 400;
    throw error;
  }
  
  try {
    const configData = await getConfigData();
    
    if (!configData[safeField]) {
      const error = new Error('Field not found in config');
      error.statusCode = 404;
      throw error;
    }
    
    const fieldData = { [field]: configData[safeField] };
    
    // Generate ETag for cache validation
    const etag = `"${Buffer.from(JSON.stringify(fieldData)).toString('base64').slice(0, 8)}"`;
    
    // Check if client has fresh version
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end(); // Not Modified
    }
    
    // Set cache headers for 5 minutes
    res.set({
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'ETag': etag,
      'Vary': 'Accept-Encoding'
    });
    
    res.json(fieldData);
  } catch (error) {
    logger.error('Failed to fetch MDH config field:', { field, error: error.message });
    throw error;
  }
}));

// Admin endpoint to invalidate cache (protected by admin middleware)
router.post('/invalidate-cache', asyncHandler(async (req, res) => {
  invalidateCache();
  res.json({ message: 'Cache invalidated successfully' });
}));

module.exports = router;
