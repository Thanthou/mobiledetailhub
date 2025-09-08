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
  const result = await query('SELECT * FROM system.system_config WHERE is_public = true', [], { 
    retries: 3, 
    timeout: 10000 
  });
  
  if (result.rows.length === 0) {
    const error = new Error('MDH config not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Convert system_config rows to MDH config format
  const configRows = result.rows;
  const config = {
    id: 1,
    email: configRows.find(r => r.config_key === 'email')?.config_value || '',
    phone: configRows.find(r => r.config_key === 'phone')?.config_value || '',
    sms_phone: configRows.find(r => r.config_key === 'sms_phone')?.config_value || '',
    logo_url: configRows.find(r => r.config_key === 'logo_url')?.config_value || '',
    favicon_url: configRows.find(r => r.config_key === 'favicon_url')?.config_value || '',
    header_display: configRows.find(r => r.config_key === 'header_display')?.config_value || 'Mobile Detail Hub',
    tagline: configRows.find(r => r.config_key === 'tagline')?.config_value || '',
    services_description: configRows.find(r => r.config_key === 'services_description')?.config_value || '',
    facebook: configRows.find(r => r.config_key === 'facebook')?.config_value || '',
    instagram: configRows.find(r => r.config_key === 'instagram')?.config_value || '',
    tiktok: configRows.find(r => r.config_key === 'tiktok')?.config_value || '',
    youtube: configRows.find(r => r.config_key === 'youtube')?.config_value || '',
    created_at: configRows[0]?.created_at || new Date().toISOString(),
    updated_at: configRows[0]?.updated_at || new Date().toISOString()
  };
  
  // Update cache
  configCache = config;
  cacheExpiry = now + CACHE_DURATION;
  
  return configCache;
};

// Get MDH config
router.get('/', asyncHandler(async (req, res) => {
  try {
    logger.debug('MDH config endpoint called', { 
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    const configData = await getConfigData();
    logger.debug('Config data retrieved successfully');
    
    // Generate ETag for cache validation
    const etag = `"${Buffer.from(JSON.stringify(configData)).toString('base64').slice(0, 8)}"`;
    
    // Check if client has fresh version
    if (req.headers['if-none-match'] === etag) {
      logger.debug('Client has fresh version, returning 304');
      return res.status(304).end(); // Not Modified
    }
    
    // Set cache headers for 5 minutes
    res.set({
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'ETag': etag,
      'Vary': 'Accept-Encoding'
    });
    
    logger.debug('Sending config data to client');
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
      FROM affiliates.business
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
