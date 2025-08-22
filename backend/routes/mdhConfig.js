const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Get MDH config
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mdh_config LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'MDH config not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching MDH config:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get MDH config field
router.get('/field/:field', async (req, res) => {
  const { field } = req.params;
  // Whitelist allowed fields
  const allowedFields = [
    'email', 'phone', 'sms_phone', 'logo_url', 'favicon_url',
    'header_display', 'tagline', 'services_description',
    'facebook', 'instagram', 'tiktok', 'youtube', 'created_at', 'updated_at'
  ];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field' });
  }
  try {
    const result = await pool.query(`SELECT ${field} FROM mdh_config LIMIT 1`);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Config not found' });
    }
    res.json({ [field]: result.rows[0][field] });
  } catch (err) {
    console.error('Error fetching config by field:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
