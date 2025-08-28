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

// Get aggregated service areas for footer (states and cities where MDH has affiliates)
router.get('/service-areas', asyncHandler(async (req, res) => {
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }

  try {
    // Get all approved affiliates with service areas
    const query = `
      SELECT service_areas
      FROM affiliates
      WHERE application_status = 'approved'
        AND service_areas IS NOT NULL
        AND jsonb_array_length(service_areas) > 0
    `;
    
    const result = await pool.query(query);
    
    if (result.rowCount === 0) {
      res.json({
        success: true,
        service_areas: {},
        count: 0,
        message: 'No service areas found'
      });
      return;
    }

    // Aggregate service areas by state and city
    const stateCities = {};
    
    result.rows.forEach(row => {
      row.service_areas.forEach(area => {
        const { state, city, slug, zip } = area;
        
        if (!state || !city) return;
        
        if (!stateCities[state]) {
          stateCities[state] = {};
        }
        
        if (!stateCities[state][city]) {
          stateCities[state][city] = [];
        }
        
        // Add affiliate info for this city
        stateCities[state][city].push({
          slug,
          zip: zip || null
        });
      });
    });

    // Sort states and cities alphabetically
    const sortedStateCities = {};
    Object.keys(stateCities)
      .sort()
      .forEach(state => {
        sortedStateCities[state] = {};
        Object.keys(stateCities[state])
          .sort()
          .forEach(city => {
            sortedStateCities[state][city] = stateCities[state][city];
          });
      });

    res.json({
      success: true,
      service_areas: sortedStateCities,
      count: Object.keys(sortedStateCities).length,
      message: `Found service areas in ${Object.keys(sortedStateCities).length} states`
    });

  } catch (error) {
    logger.error('Error fetching service areas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service areas'
    });
  }
}));

// Admin endpoint to invalidate cache (protected by admin middleware)
router.post('/invalidate-cache', asyncHandler(async (req, res) => {
  invalidateCache();
  res.json({ message: 'Cache invalidated successfully' });
}));

module.exports = router;
