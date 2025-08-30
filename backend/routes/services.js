const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');

// GET /api/services/:affiliateId - Get all services for an affiliate
router.get('/:affiliateId', async (req, res) => {
  try {
    const { affiliateId } = req.params;
    
    const query = `
      SELECT 
        s.id,
        s.affiliate_id,
        s.category,
        s.name,
        s.description,
        s.base_price_cents,
        s.pricing_unit,
        s.min_duration_min,
        s.active,
        s.created_at,
        s.updated_at
      FROM services s
      WHERE s.affiliate_id = $1
      ORDER BY s.category, s.name
    `;
    
    const result = await pool.query(query, [affiliateId]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services',
      message: error.message
    });
  }
});

// POST /api/services - Create a new service
router.post('/', async (req, res) => {
  try {
    const { affiliate_id, vehicle_id, service_category_id, base_price_cents, name, description } = req.body;
    
    // Validate required fields
    if (!affiliate_id || !name || !vehicle_id || !service_category_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'affiliate_id, vehicle_id, service_category_id, and name are required'
      });
    }
    
    // Map the category based on the service_category_id for the existing 'category' column
    let category = 'auto'; // default
    if (service_category_id) {
      const categoryMap = {
        1: 'auto',      // interior -> auto
        2: 'auto',      // exterior -> auto  
        3: 'auto',      // service-packages -> auto
        4: 'ceramic',   // ceramic-coating -> ceramic
        5: 'auto',      // paint-correction -> auto
        6: 'auto'       // paint-protection-film -> auto
      };
      category = categoryMap[service_category_id] || 'auto';
    }
    
    // Create the service using the new foreign key structure
    const insertQuery = `
      INSERT INTO services (affiliate_id, category, name, description, base_price_cents, pricing_unit, min_duration_min, active, vehicle_id, service_category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      affiliate_id, 
      category, 
      name, 
      description || 'Offered by affiliate',
      base_price_cents || 0,
      'flat',
      60,
      true,
      vehicle_id,
      service_category_id
    ]);
    
    const newService = result.rows[0];
    
    // Create default service tiers
    const tierNames = ['Basic', 'Premium', 'Luxury'];
    const tierPriceDeltas = [0, 5000, 15000]; // $0, $50, $150 in cents
    
    for (let i = 0; i < tierNames.length; i++) {
      await pool.query(`
        INSERT INTO service_tiers (service_id, name, price_delta_cents, description)
        VALUES ($1, $2, $3, $4)
      `, [
        newService.id,
        tierNames[i],
        tierPriceDeltas[i],
        `${tierNames[i]} tier for ${name} service`
      ]);
    }
    
    res.status(201).json({
      success: true,
      data: newService,
      message: 'Service created successfully with default tiers'
    });
    
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service',
      message: error.message
    });
  }
});

// GET /api/services/master/vehicles - Get all vehicle types
router.get('/master/vehicles', async (req, res) => {
  try {
    const query = 'SELECT * FROM vehicles ORDER BY name';
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicles',
      message: error.message
    });
  }
});

// GET /api/services/master/categories - Get all service categories
router.get('/master/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM service_categories ORDER BY name';
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/services/affiliate/:affiliateId/vehicle/:vehicleId/category/:categoryId - Get services with tiers
router.get('/affiliate/:affiliateId/vehicle/:vehicleId/category/:categoryId', async (req, res) => {
  try {
    const { affiliateId, vehicleId, categoryId } = req.params;
    
    // Map frontend IDs to database IDs
    const vehicleMap = {
      'cars': 1,
      'trucks': 2,
      'rvs': 3,
      'boats': 4,
      'motorcycles': 5,
      'offroad': 6,
      'other': 7
    };
    
    const categoryMap = {
      'interior': 1,
      'exterior': 2, 
      'service-packages': 3,
      'addons': 7,
      'ceramic-coating': 4,
      'paint-correction': 5,
      'paint-protection-film': 6
    };
    
    const dbVehicleId = vehicleMap[vehicleId];
    const dbCategoryId = categoryMap[categoryId];
    
    if (!dbVehicleId || !dbCategoryId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle or category ID',
        message: `Vehicle: ${vehicleId}, Category: ${categoryId}`
      });
    }
    
    // Clean query using foreign keys - no more string parsing!
    const query = `
      SELECT 
        s.id as service_id,
        s.name,
        s.category,
        s.description,
        s.base_price_cents,
        s.pricing_unit,
        s.min_duration_min,
        s.active
      FROM services s
      WHERE s.affiliate_id = $1 
        AND s.vehicle_id = $2 
        AND s.service_category_id = $3
      ORDER BY s.created_at DESC, s.name ASC
    `;
    
    const result = await pool.query(query, [affiliateId, dbVehicleId, dbCategoryId]);
    
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // For each service, get its tiers
    const servicesWithTiers = [];
    
    for (const service of result.rows) {
      const tiersQuery = `
        SELECT 
          st.id as tier_id,
          st.name as tier_name,
          st.price_delta_cents,
          st.description as tier_description
        FROM service_tiers st
        WHERE st.service_id = $1
        ORDER BY st.price_delta_cents ASC
      `;
      
      const tiersResult = await pool.query(tiersQuery, [service.service_id]);
      
      const serviceData = {
        id: service.service_id,
        name: service.name,
        basePrice: service.base_price_cents / 100,
        category: service.category,
        description: service.description,
        tiers: tiersResult.rows.map(row => ({
          id: row.tier_id,
          name: row.tier_name,
          price: (service.base_price_cents + row.price_delta_cents) / 100,
          duration: service.min_duration_min / 60, // Convert minutes to hours
          features: row.tier_description ? [row.tier_description] : [],
          enabled: true,
          popular: false
        }))
      };
      
      servicesWithTiers.push(serviceData);
    }
    
    res.json({
      success: true,
      data: servicesWithTiers
    });
    
  } catch (error) {
    console.error('Error fetching service with tiers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service with tiers',
      message: error.message
    });
  }
});

// GET /api/services/:serviceId - Get a specific service by ID
router.get('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const query = `
      SELECT 
        s.id as service_id,
        s.name,
        s.category,
        s.description,
        s.base_price_cents,
        s.pricing_unit,
        s.min_duration_min,
        s.active,
        st.id as tier_id,
        st.name as tier_name,
        st.price_delta_cents,
        st.description as tier_description
      FROM services s
      LEFT JOIN service_tiers st ON st.service_id = s.id
      WHERE s.id = $1
      ORDER BY st.price_delta_cents ASC
    `;
    
    const result = await pool.query(query, [serviceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
        message: 'The requested service does not exist'
      });
    }
    
    // Group the results by service and tiers
    const serviceData = {
      id: result.rows[0].service_id,
      name: result.rows[0].name,
      basePrice: result.rows[0].base_price_cents / 100,
      category: result.rows[0].category,
      description: result.rows[0].description,
      tiers: result.rows
        .filter(row => row.tier_id) // Only include rows with tier data
        .map(row => ({
          id: row.tier_id,
          name: row.tier_name,
          price: (result.rows[0].base_price_cents + row.price_delta_cents) / 100,
          duration: result.rows[0].min_duration_min / 60, // Convert minutes to hours
          features: row.tier_description ? [row.tier_description] : [],
          enabled: true,
          popular: false
        }))
    };
    
    res.json({
      success: true,
      data: serviceData
    });
    
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service',
      message: error.message
    });
  }
});

module.exports = router;
