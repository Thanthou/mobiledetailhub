const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { validateParams } = require('../middleware/validation');
const { serviceAreaSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { getMDHServiceAreas, getAffiliatesForCity } = require('../utils/serviceAreaProcessor');

// Get all service areas organized by state -> city -> slug for footer
router.get('/footer', asyncHandler(async (req, res) => {
  try {
    logger.info('Footer service areas endpoint called');

    if (!pool) {
      logger.error('Database connection not available');
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    // Get all approved affiliates with their service areas
    const result = await pool.query(`
      SELECT id, slug, service_areas
      FROM affiliates 
      WHERE application_status = 'approved' 
        AND service_areas IS NOT NULL
        AND JSONB_ARRAY_LENGTH(service_areas) > 0
    `);
    
    // Process the data to create state -> city -> slug structure
    const serviceAreasMap = {};
    
    result.rows.forEach(affiliate => {
      if (affiliate.service_areas && Array.isArray(affiliate.service_areas)) {
        affiliate.service_areas.forEach(area => {
          const state = area.state?.toUpperCase();
          const city = area.city;
          const slug = affiliate.slug;
          
          if (state && city && slug) {
            if (!serviceAreasMap[state]) {
              serviceAreasMap[state] = {};
            }
            if (!serviceAreasMap[state][city]) {
              serviceAreasMap[state][city] = [];
            }
            // Add slug if not already present
            if (!serviceAreasMap[state][city].includes(slug)) {
              serviceAreasMap[state][city].push(slug);
            }
          }
        });
      }
    });
    
    logger.info(`Processed service areas for ${Object.keys(serviceAreasMap).length} states`);
    
    res.json({
      success: true,
      service_areas: serviceAreasMap,
      count: Object.keys(serviceAreasMap).length
    });
    
  } catch (error) {
    logger.error('Error in footer service areas endpoint:', error);
    throw error;
  }
}));

// Get all service areas (states that have coverage)
router.get('/', asyncHandler(async (req, res) => {
  try {
    logger.info('Service areas endpoint called');
    

    if (!pool) {
      logger.error('Database connection not available');
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    logger.info('Database pool obtained, executing query');
    
    const result = await pool.query(`
      SELECT DISTINCT 
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' as state_code,
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' as name
      FROM affiliates a
      WHERE a.application_status = 'approved' 
        AND a.service_areas IS NOT NULL
        AND JSONB_ARRAY_LENGTH(a.service_areas) > 0
      ORDER BY name
    `);
    
    logger.info(`Query executed successfully, found ${result.rows.length} states`);
    
    res.json(result.rows);
  } catch (error) {
    logger.error('Error in service areas endpoint:', error);
    throw error;
  }
}));

// Get cities for a specific state
router.get('/:state_code', 
  validateParams(serviceAreaSchemas.getCities),
  asyncHandler(async (req, res) => {

    if (!pool) {
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    const { state_code } = req.params;

    const result = await pool.query(`
      SELECT DISTINCT 
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'city' as city,
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' as state_code,
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'zip' as zip
      FROM affiliates a
      WHERE a.application_status = 'approved' 
        AND a.service_areas IS NOT NULL
        AND JSONB_ARRAY_LENGTH(a.service_areas) > 0
        AND JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' = $1
      ORDER BY city
    `, [state_code]);
    
    res.json(result.rows);
  })
);

// Get all MDH service areas (cities and states where approved affiliates serve)
router.get('/mdh/coverage', asyncHandler(async (req, res) => {
  try {
    logger.info('MDH coverage endpoint called');
    
    if (!pool) {
      logger.error('Database connection not available');
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    const serviceAreas = await getMDHServiceAreas();
    
    res.json({
      success: true,
      service_areas: serviceAreas,
      count: serviceAreas.length
    });
  } catch (error) {
    logger.error('Error fetching MDH coverage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coverage data'
    });
  }
}));

// Get affiliates serving a specific city (for directory pages)
router.get('/city/:slug', asyncHandler(async (req, res) => {
  try {
    logger.info('City affiliates endpoint called');
    
    if (!pool) {
      logger.error('Database connection not available');
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    const { slug } = req.params;
    const affiliates = await getAffiliatesForCity(slug);
    
    res.json({
      success: true,
      slug,
      affiliates,
      count: affiliates.length
    });
  } catch (error) {
    logger.error('Error fetching city affiliates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch affiliate data'
    });
  }
}));

module.exports = router;
