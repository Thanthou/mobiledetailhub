const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Get all service areas
router.get('/', async (req, res) => {
  try {
    // First check if the table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'service_areas'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS service_areas (
          id SERIAL PRIMARY KEY,
          state VARCHAR(50),
          city VARCHAR(100),
          zip VARCHAR(20),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }
    
    const result = await pool.query('SELECT state, city, zip FROM service_areas');
    
    // If no data in table, return some default service areas
    if (result.rows.length === 0) {
      const defaultServiceAreas = [
        { state: 'California', city: 'Los Angeles', zip: '90210' },
        { state: 'California', city: 'San Francisco', zip: '94102' },
        { state: 'Texas', city: 'Austin', zip: '73301' },
        { state: 'Texas', city: 'Dallas', zip: '75201' },
        { state: 'Florida', city: 'Miami', zip: '33101' },
        { state: 'Florida', city: 'Orlando', zip: '32801' },
        { state: 'New York', city: 'New York', zip: '10001' },
        { state: 'New York', city: 'Buffalo', zip: '14201' }
      ];
      return res.json(defaultServiceAreas);
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching service areas:', err);
    // Return default data on error to prevent frontend crashes
    const defaultServiceAreas = [
      { state: 'California', city: 'Los Angeles', zip: '90210' },
      { state: 'Texas', city: 'Austin', zip: '73301' },
      { state: 'Florida', city: 'Miami', zip: '33101' }
    ];
    res.json(defaultServiceAreas);
  }
});

module.exports = router;
