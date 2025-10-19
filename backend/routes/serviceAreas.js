import express from 'express';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { getPlatformServiceAreas, getTenantsForCity } from '../utils/serviceAreaProcessor';
import { getPool } from '../database/pool.js';
import { serviceAreaSchemas } from '../utils/validationSchemas';
import { validateParams } from '../middleware/validation';

/**
 * @fileoverview API routes for serviceAreas
 * @version 1.0.0
 * @author That Smart Site
 */
const router = express.Router();

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
    
    // First, check if we have any approved tenants
    const countResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM tenants.business 
      WHERE approved_date IS NOT NULL
    `);
    
    const approvedCount = parseInt(countResult.rows[0].count);
    logger.info(`Found ${approvedCount} approved tenants`);
    
    if (approvedCount === 0) {
      logger.info('No approved tenants found, returning empty service areas');
      return res.json({
        success: true,
        service_areas: {},
        count: 0,
        message: 'No approved tenants found'
      });
    }
    
    // Get all approved tenants with their service areas
    const result = await pool.query(`
      SELECT id, slug, service_areas
      FROM tenants.business 
      WHERE approved_date IS NOT NULL 
        AND service_areas IS NOT NULL
    `);
    
    logger.info(`Found ${result.rows.length} tenants with service areas data`);
    
    // Process the data to create state -> city -> slug structure
    const serviceAreasMap = {};
    
    result.rows.forEach(tenant => {
      try {
        if (tenant.service_areas && Array.isArray(tenant.service_areas)) {
          tenant.service_areas.forEach(area => {
            const state = area.state?.toUpperCase();
            const city = area.city;
            const slug = tenant.slug;
            
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
      } catch (areaError) {
        logger.warn(`Error processing service areas for tenant ${tenant.slug}:`, areaError);
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
      FROM tenants.business a
      WHERE a.approved_date IS NOT NULL 
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

    const pool = await getPool();
    
    const { state_code } = req.params;

    const result = await pool.query(`
      SELECT DISTINCT 
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'city' as city,
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' as state_code,
        JSONB_ARRAY_ELEMENTS(a.service_areas)->>'zip' as zip
      FROM tenants.business a
      WHERE a.approved_date IS NOT NULL 
        AND a.service_areas IS NOT NULL
        AND JSONB_ARRAY_LENGTH(a.service_areas) > 0
        AND JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' = $1
      ORDER BY city
    `, [state_code]);
    
    res.json(result.rows);
  })
);

// Get all platform service areas (cities and states where approved tenants serve)
router.get('/platform/coverage', asyncHandler(async (req, res) => {
  try {
    logger.info('Platform coverage endpoint called');
    
    if (!pool) {
      logger.error('Database connection not available');
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    const serviceAreas = await getPlatformServiceAreas();
    
    res.json({
      success: true,
      service_areas: serviceAreas,
      count: serviceAreas.length
    });
  } catch (error) {
    logger.error('Error fetching platform coverage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coverage data'
    });
  }
}));

// Get tenants serving a specific city (for directory pages)
router.get('/city/:slug', asyncHandler(async (req, res) => {
  try {
    logger.info('City tenants endpoint called');
    
    if (!pool) {
      logger.error('Database connection not available');
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    const { slug } = req.params;
    const tenants = await getTenantsForCity(slug);
    
    res.json({
      success: true,
      slug,
      tenants,
      count: tenants.length
    });
  } catch (error) {
    logger.error('Error fetching city tenants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tenant data'
    });
  }
}));

export default router;
