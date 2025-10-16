import express from 'express';
const router = express.Router();
import { pool } from '../database/pool.js';
import { validateParams } from '../middleware/validation.js';
import { customerSchemas } from '../utils/validationSchemas.js';
import { asyncHandler } from '../middleware/errorHandler.js';
// TODO: Add proper logging for customer operations
// import logger from '../utils/logger.js';

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

export default router;
