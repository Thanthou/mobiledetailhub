const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');

// POST /api/services - Create a new service
router.post('/', async (req, res) => {
  try {
    const { affiliate_id, vehicle_id, service_category_id, base_price_cents, name, description, tiers } = req.body;
    
    // Validate required fields
    if (!affiliate_id || !name || !vehicle_id || !service_category_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'affiliate_id, vehicle_id, service_category_id, and name are required'
      });
    }
    
    // Map the category based on the service_category_id
    let category = 'auto'; // default
    let originalCategory = 'service-packages'; // default
    
    if (service_category_id) {
      const categoryMap = {
        1: { db: 'auto', original: 'interior' },
        2: { db: 'auto', original: 'exterior' },
        3: { db: 'auto', original: 'service-packages' },
        4: { db: 'ceramic', original: 'ceramic-coating' },
        5: { db: 'auto', original: 'paint-correction' },
        6: { db: 'auto', original: 'paint-protection-film' }
      };
      
      const mapping = categoryMap[service_category_id] || { db: 'auto', original: 'service-packages' };
      category = mapping.db;
      originalCategory = mapping.original;
    }
    
    // Create the service using the correct table and column names
    const insertQuery = `
      INSERT INTO affiliates.services (business_id, service_name, service_description, service_category, vehicle_types, metadata, is_active, is_featured, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    // Map frontend vehicle IDs to database vehicle IDs
    const vehicleMap = {
      'cars': 1,
      'trucks': 2,
      'rvs': 3,
      'boats': 4,
      'motorcycles': 5,
      'offroad': 6,
      'other': 7
    };
    
    const dbVehicleId = vehicleMap[vehicle_id] || 1;
    const vehicleTypes = JSON.stringify([dbVehicleId]);
    const metadata = JSON.stringify({
      base_price_cents: base_price_cents || 0,
      pricing_unit: 'flat',
      min_duration_min: 60,
      original_category: originalCategory
    });
    
    const result = await pool.query(insertQuery, [
      affiliate_id,  // business_id
      name,          // service_name
      description || 'Offered by affiliate', // service_description
      category,      // service_category
      vehicleTypes,  // vehicle_types
      metadata,      // metadata
      true,          // is_active
      false,         // is_featured
      0              // sort_order
    ]);
    
    const newService = result.rows[0];
    
    // Create service tiers - use custom tiers if provided, otherwise create default tiers
    if (tiers && Array.isArray(tiers) && tiers.length > 0) {
      // Use custom tiers provided by the frontend
      for (const tier of tiers) {
        if (tier.name && tier.name.trim() !== '') {
          await pool.query(`
            INSERT INTO affiliates.service_tiers (service_id, tier_name, price_cents, included_services, duration_minutes, is_active, is_featured, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            newService.id,
            tier.name,
            Math.round((tier.price || 0) * 100), // Price in cents
            JSON.stringify(tier.features || []), // Features as JSON array
            tier.duration || 60, // Duration in minutes
            true, // is_active
            tier.popular || false, // is_featured
            0 // sort_order
          ]);
        }
      }
      
      res.status(201).json({
        success: true,
        data: newService,
        message: 'Service created successfully with custom tiers'
      });
    } else {
      // Create default service tiers if no custom tiers provided
      const tierNames = ['Basic', 'Premium', 'Luxury'];
      const tierPrices = [50, 100, 150]; // Default prices in dollars
      
      for (let i = 0; i < tierNames.length; i++) {
        await pool.query(`
          INSERT INTO affiliates.service_tiers (service_id, tier_name, price_cents, included_services, duration_minutes, is_active, is_featured, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          newService.id,
          tierNames[i],
          Math.round(tierPrices[i] * 100), // Convert to cents
          JSON.stringify([`${tierNames[i]} tier features`]), // Features as JSON array
          60, // Duration in minutes
          true, // is_active
          i === 1, // Mark Premium as featured
          i // sort_order
        ]);
      }
      
      res.status(201).json({
        success: true,
        data: newService,
        message: 'Service created successfully with default tiers'
      });
    }
    
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service',
      message: error.message
    });
  }
});

// DELETE /api/services/:serviceId - Delete a service and its tiers
router.delete('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing service ID',
        message: 'Service ID is required'
      });
    }
    
    console.log('🗑️ Deleting service:', serviceId);
    
    // Start a transaction to ensure both deletions succeed or both fail
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // First, delete all service tiers for this service
      const deleteTiersQuery = 'DELETE FROM affiliates.service_tiers WHERE service_id = $1';
      const tiersResult = await client.query(deleteTiersQuery, [serviceId]);
      console.log('✅ Deleted', tiersResult.rowCount, 'service tiers');
      
      // Then, delete the service itself
      const deleteServiceQuery = 'DELETE FROM affiliates.services WHERE id = $1';
      const serviceResult = await client.query(deleteServiceQuery, [serviceId]);
      
      if (serviceResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Service not found',
          message: 'No service found with the provided ID'
        });
      }
      
      console.log('✅ Deleted service:', serviceId);
      
      // Commit the transaction
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Service and all associated tiers deleted successfully',
        deletedServiceId: serviceId,
        deletedTiersCount: tiersResult.rowCount
      });
      
    } catch (error) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete service',
      message: error.message
    });
  }
});

// GET /api/services/affiliate/:affiliateId/vehicle/:vehicleId/category/:categoryId - Get services with tiers
router.get('/affiliate/:affiliateId/vehicle/:vehicleId/category/:categoryId', async (req, res) => {
  try {
    const { affiliateId, vehicleId, categoryId } = req.params;
    
    // Map frontend IDs to database categories
    const categoryMap = {
      'interior': 'auto',
      'exterior': 'auto', 
      'service-packages': 'auto',
      'addons': 'auto',
      'ceramic-coating': 'ceramic',
      'paint-correction': 'auto',
      'paint-protection-film': 'auto'
    };
    
    const dbCategory = categoryMap[categoryId] || 'auto';
    
    // Map frontend vehicle IDs to database vehicle IDs
    const vehicleMap = {
      'cars': 1,
      'trucks': 2,
      'rvs': 3,
      'boats': 4,
      'motorcycles': 5,
      'offroad': 6,
      'other': 7
    };
    
    const dbVehicleId = vehicleMap[vehicleId] || 1;
    
    // Clean query using the correct table structure with original category filtering
    const query = `
      SELECT 
        s.id as service_id,
        s.service_name as name,
        s.service_category as category,
        s.service_description as description,
        s.metadata->>'base_price_cents' as base_price_cents,
        s.metadata->>'pricing_unit' as pricing_unit,
        s.metadata->>'min_duration_min' as min_duration_min,
        s.is_active as active
      FROM affiliates.services s
      WHERE s.business_id = $1 
        AND s.service_category = $2
        AND s.vehicle_types @> $3::jsonb
        AND (s.metadata->>'original_category' = $4 OR s.metadata->>'original_category' IS NULL)
      ORDER BY s.created_at DESC, s.service_name ASC
    `;
    
    console.log('🔍 Fetching services:', { affiliateId, vehicleId, categoryId, dbCategory, dbVehicleId });
    const result = await pool.query(query, [affiliateId, dbCategory, JSON.stringify([dbVehicleId]), categoryId]);
    console.log('📊 Query result:', result.rows.length, 'services found');
    
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
          st.tier_name,
          st.price_cents,
          st.included_services,
          st.duration_minutes
        FROM affiliates.service_tiers st
        WHERE st.service_id = $1
        ORDER BY st.price_cents ASC
      `;
      
      const tiersResult = await pool.query(tiersQuery, [service.service_id]);
      
      const serviceData = {
        id: service.service_id,
        name: service.name,
        basePrice: service.base_price_cents ? parseFloat(service.base_price_cents) / 100 : 0,
        category: service.category,
        description: service.description,
        tiers: tiersResult.rows.map(row => ({
          id: row.tier_id,
          name: row.tier_name,
          price: row.price_cents / 100,
          duration: row.duration_minutes || 60,
          features: row.included_services || [],
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

module.exports = router;