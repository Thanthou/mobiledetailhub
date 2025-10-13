const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { validateParams } = require('../middleware/validation');
const { customerSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
// TODO: Add proper logging for customer operations
// const logger = require('../utils/logger');

// Get customers
router.get('/', asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  const result = await pool.query('SELECT * FROM customers.customers LIMIT 1');
  if (result.rows.length === 0) {
    const error = new Error('customers not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(result.rows[0]);
}));

// Get customer field
router.get('/field/:field', 
  validateParams(customerSchemas.getField),
  asyncHandler(async (req, res) => {
    const { field } = req.params;
    
  
    if (!pool) {
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    // Use a safer approach with explicit field selection
    const fieldMap = {
      'id': 'id',
      'user_id': 'user_id',
      'default_address_id': 'default_address_id',
      'preferences': 'preferences',
      'created_at': 'created_at',
      'updated_at': 'updated_at'
    };
    
    const safeField = fieldMap[field];
    if (!safeField) {
      const error = new Error('Invalid field');
      error.statusCode = 400;
      throw error;
    }
    
    const result = await pool.query(`SELECT ${safeField} FROM customers.customers LIMIT 1`);
    if (result.rows.length === 0) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ [field]: result.rows[0][safeField] });
  })
);

module.exports = router;
