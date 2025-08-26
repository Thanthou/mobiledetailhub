const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Get all service areas (states that have coverage)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT s.state_code, s.name
      FROM states s
      JOIN affiliate_service_areas asa ON asa.state_code = s.state_code
      ORDER BY s.name
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching service areas:', err);
    res.status(500).json([]);
  }
});

// Get cities for a specific state
router.get('/:state_code', async (req, res) => {
  try {
    const { state_code } = req.params;
    
    const result = await pool.query(`
      SELECT DISTINCT asa.city, asa.state_code, asa.zip
      FROM affiliate_service_areas asa
      WHERE asa.state_code = $1
      ORDER BY asa.city
    `, [state_code]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cities for state:', err);
    res.status(500).json([]);
  }
});

module.exports = router;
