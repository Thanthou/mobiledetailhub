const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { getDatabaseId } = require('../utils/vehicleMapping');


// POST /api/services - Create a new service
router.post('/', async (req, res) => {
  try {
    const { tenant_id, vehicle_id, service_category_id, base_price_cents, name, description, tiers } = req.body;
    
    
    // Validate required fields
    if (!tenant_id || !name || !vehicle_id || !service_category_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'tenant_id, vehicle_id, service_category_id, and name are required'
      });
    }
    
    // Map the category based on the service_category_id
    let category = 'service-packages'; // default
    let originalCategory = 'service-packages'; // default
    
    if (service_category_id) {
      // Convert to number in case it's a string
      const categoryId = parseInt(service_category_id);
      
      const categoryMap = {
        1: { db: 'interior', original: 'interior' },
        2: { db: 'exterior', original: 'exterior' },
        3: { db: 'service-packages', original: 'service-packages' },
        4: { db: 'ceramic-coating', original: 'ceramic-coating' },
        5: { db: 'paint-correction', original: 'paint-correction' },
        6: { db: 'paint-protection-film', original: 'paint-protection-film' },
        7: { db: 'addons', original: 'addons' }
      };
      
      const mapping = categoryMap[categoryId] || { db: 'service-packages', original: 'service-packages' };
      category = mapping.db;
      originalCategory = mapping.original;
    }
    
    // Create the service using the correct table and column names
    const insertQuery = `
      INSERT INTO tenants.services (business_id, service_name, service_description, service_category, vehicle_types, metadata, is_active, is_featured, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    // Handle both string vehicle IDs (from old frontend) and numeric vehicle IDs (from new frontend)
    const dbVehicleId = typeof vehicle_id === 'string' ? getDatabaseId(vehicle_id) : vehicle_id;
    const vehicleTypes = JSON.stringify([dbVehicleId]);
    const metadata = JSON.stringify({
      base_price_cents: base_price_cents || 0,
      pricing_unit: 'flat',
      min_duration_min: 60,
      original_category: originalCategory
    });
    
    const result = await pool.query(insertQuery, [
      tenant_id,  // business_id
      name,          // service_name
      description || 'Offered by tenant', // service_description
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
      console.log('Backend - Received tiers data:', JSON.stringify(tiers, null, 2));
      // Use custom tiers provided by the frontend
      for (const tier of tiers) {
        if (tier.name && tier.name.trim() !== '') {
          console.log('Backend - Processing tier:', tier.name, 'tierCopies:', tier.tierCopies);
          await pool.query(`
            INSERT INTO tenants.service_tiers (service_id, tier_name, price_cents, included_services, duration_minutes, metadata, is_active, is_featured, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [
            newService.id,
            tier.name,
            Math.round((tier.price || 0) * 100), // Price in cents
            JSON.stringify(tier.features || []), // Features as JSON array
            tier.duration || 60, // Duration in minutes
            JSON.stringify({}), // Empty metadata
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
          INSERT INTO tenants.service_tiers (service_id, tier_name, price_cents, included_services, duration_minutes, is_active, is_featured, sort_order)
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

// PUT /api/services/:serviceId - Update a service and its tiers
router.put('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { tenant_id, vehicle_id, service_category_id, base_price_cents, name, description, tiers } = req.body;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing service ID',
        message: 'Service ID is required'
      });
    }
    
    // Validate required fields
    if (!tenant_id || !name || !vehicle_id || !service_category_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'tenant_id, vehicle_id, service_category_id, and name are required'
      });
    }
    
    // Map the category based on the service_category_id
    let category = 'service-packages'; // default
    let originalCategory = 'service-packages'; // default
    
    if (service_category_id) {
      // Convert to number in case it's a string
      const categoryId = parseInt(service_category_id);
      
      const categoryMap = {
        1: { db: 'interior', original: 'interior' },
        2: { db: 'exterior', original: 'exterior' },
        3: { db: 'service-packages', original: 'service-packages' },
        4: { db: 'ceramic-coating', original: 'ceramic-coating' },
        5: { db: 'paint-correction', original: 'paint-correction' },
        6: { db: 'paint-protection-film', original: 'paint-protection-film' },
        7: { db: 'addons', original: 'addons' }
      };
      
      const mapping = categoryMap[categoryId] || { db: 'service-packages', original: 'service-packages' };
      category = mapping.db;
      originalCategory = mapping.original;
    }
    
    const dbVehicleId = getDatabaseId(vehicle_id);
    const vehicleTypes = JSON.stringify([dbVehicleId]);
    const metadata = JSON.stringify({
      base_price_cents: base_price_cents || 0,
      pricing_unit: 'flat',
      min_duration_min: 60,
      original_category: originalCategory
    });
    
    // Start a transaction to ensure both updates succeed or both fail
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update the service
      const updateServiceQuery = `
        UPDATE tenants.services 
        SET service_name = $1, 
            service_description = $2, 
            service_category = $3, 
            vehicle_types = $4, 
            metadata = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6 AND business_id = $7
        RETURNING *
      `;
      
      const serviceResult = await client.query(updateServiceQuery, [
        name,
        description || 'Offered by tenant',
        category,
        vehicleTypes,
        metadata,
        serviceId,
        tenant_id
      ]);
      
      if (serviceResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Service not found',
          message: 'No service found with the provided ID or you do not have permission to update it'
        });
      }
      
      // Delete existing tiers
      await client.query('DELETE FROM tenants.service_tiers WHERE service_id = $1', [serviceId]);
      
      // Create new service tiers
      if (tiers && Array.isArray(tiers) && tiers.length > 0) {
        console.log('Backend PUT - Received tiers data:', JSON.stringify(tiers, null, 2));
        // Use custom tiers provided by the frontend
        for (const tier of tiers) {
          if (tier.name && tier.name.trim() !== '') {
            console.log('Backend PUT - Processing tier:', tier.name, 'tierCopies:', tier.tierCopies);
            await client.query(`
              INSERT INTO tenants.service_tiers (service_id, tier_name, price_cents, included_services, duration_minutes, metadata, is_active, is_featured, sort_order)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
              serviceId,
              tier.name,
              Math.round((tier.price || 0) * 100), // Price in cents
              JSON.stringify(tier.features || []), // Features as JSON array
              tier.duration || 60, // Duration in minutes
              JSON.stringify({}), // Empty metadata
              true, // is_active
              tier.popular || false, // is_featured
              0 // sort_order
            ]);
          }
        }
      } else {
        // Create default service tiers if no custom tiers provided
        const tierNames = ['Basic', 'Premium', 'Luxury'];
        const tierPrices = [50, 100, 150]; // Default prices in dollars
        
        for (let i = 0; i < tierNames.length; i++) {
          await client.query(`
            INSERT INTO tenants.service_tiers (service_id, tier_name, price_cents, included_services, duration_minutes, is_active, is_featured, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            serviceId,
            tierNames[i],
            Math.round(tierPrices[i] * 100), // Convert to cents
            JSON.stringify([`${tierNames[i]} tier features`]), // Features as JSON array
            60, // Duration in minutes
            true, // is_active
            i === 1, // Mark Premium as featured
            i // sort_order
          ]);
        }
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      
      res.json({
        success: true,
        data: serviceResult.rows[0],
        message: 'Service updated successfully'
      });
      
    } catch (error) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update service',
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
    
    // Start a transaction to ensure both deletions succeed or both fail
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // First, delete all service tiers for this service
      const deleteTiersQuery = 'DELETE FROM tenants.service_tiers WHERE service_id = $1';
      const tiersResult = await client.query(deleteTiersQuery, [serviceId]);
      
      // Then, delete the service itself
      const deleteServiceQuery = 'DELETE FROM tenants.services WHERE id = $1';
      const serviceResult = await client.query(deleteServiceQuery, [serviceId]);
      
      if (serviceResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Service not found',
          message: 'No service found with the provided ID'
        });
      }
      
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

// GET /api/services/tenant/:tenantId/vehicle/:vehicleId/category/:categoryId - Get services with tiers
router.get('/tenant/:tenantId/vehicle/:vehicleId/category/:categoryId', async (req, res) => {
  try {
    const { tenantId, vehicleId, categoryId } = req.params;
    
    // Map the category ID to the actual category name
    const categoryMap = {
      1: 'interior',
      2: 'exterior', 
      3: 'service-packages',
      4: 'ceramic-coating',
      5: 'paint-correction',
      6: 'paint-protection-film',
      7: 'addons'
    };
    
    const dbCategory = categoryMap[parseInt(categoryId)] || 'service-packages';
    
    // Get database ID for the vehicle type
    const dbVehicleType = getDatabaseId(vehicleId);
    
    // Check for the specific vehicle type requested
    // Only return services that specifically support this vehicle type
    const vehicleTypesFilter = 's.vehicle_types @> $3::jsonb';
    
    // Clean query using the correct table structure with proper category filtering
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
      FROM tenants.services s
      WHERE s.business_id = $1 
        AND s.service_category = $2
        AND ${vehicleTypesFilter}
      ORDER BY s.created_at DESC, s.service_name ASC
    `;
    
    const queryParams = [tenantId, dbCategory, JSON.stringify([dbVehicleType])];
    
    const result = await pool.query(query, queryParams);
    
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
          st.duration_minutes,
          st.metadata,
          st.is_active,
          st.is_featured
        FROM tenants.service_tiers st
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
          enabled: row.is_active,
          popular: row.is_featured
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