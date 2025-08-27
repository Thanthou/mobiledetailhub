const express = require('express');
const router = express.Router();
const pool = require('../database/pool');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Get MDH config
router.get('/', asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  const result = await pool.query('SELECT * FROM mdh_config LIMIT 1');
  if (result.rows.length === 0) {
    const error = new Error('MDH config not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(result.rows[0]);
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
  

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
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
  
  const result = await pool.query(`SELECT ${safeField} FROM mdh_config LIMIT 1`);
  if (result.rows.length === 0) {
    const error = new Error('Config not found');
    error.statusCode = 404;
    throw error;
  }
  res.json({ [field]: result.rows[0][safeField] });
}));

module.exports = router;
