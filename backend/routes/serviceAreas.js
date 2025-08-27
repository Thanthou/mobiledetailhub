const express = require('express');
const router = express.Router();
const pool = require('../database/pool');
const { validateParams } = require('../middleware/validation');
const { serviceAreaSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

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
      SELECT DISTINCT s.state_code, s.name
      FROM states s
      JOIN cities c ON c.state_code = s.state_code
      JOIN affiliate_service_areas asa ON asa.city_id = c.id
      ORDER BY s.name
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
      SELECT DISTINCT c.name as city, c.state_code, asa.zip
      FROM affiliate_service_areas asa
      JOIN cities c ON asa.city_id = c.id
      WHERE c.state_code = $1
      ORDER BY c.name
    `, [state_code]);
    
    res.json(result.rows);
  })
);

module.exports = router;
