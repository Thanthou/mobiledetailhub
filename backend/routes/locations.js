const express = require('express');
const { pool } = require('../database/pool');
const router = express.Router();

// Get service areas for a tenant
router.get('/service-areas/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    
    const result = await pool.query(
      'SELECT service_areas FROM tenants.business WHERE slug = $1',
      [tenantSlug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    const serviceAreas = result.rows[0].service_areas || [];
    res.json(serviceAreas);
  } catch (error) {
    console.error('Error fetching service areas:', error);
    res.status(500).json({ error: 'Failed to fetch service areas' });
  }
});

// Update service areas for a tenant
router.put('/service-areas/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    const { serviceAreas } = req.body;
    
    if (!Array.isArray(serviceAreas)) {
      return res.status(400).json({ error: 'Service areas must be an array' });
    }
    
    const result = await pool.query(
      'UPDATE tenants.business SET service_areas = $1, updated_at = NOW() WHERE slug = $2 RETURNING slug',
      [JSON.stringify(serviceAreas), tenantSlug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json({ success: true, serviceAreas });
  } catch (error) {
    console.error('Error updating service areas:', error);
    res.status(500).json({ error: 'Failed to update service areas' });
  }
});

// Add a new service area
router.post('/service-areas/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    const { city, state, zip, minimum, multiplier } = req.body;
    
    // Get current service areas
    const currentResult = await pool.query(
      'SELECT service_areas FROM tenants.business WHERE slug = $1',
      [tenantSlug]
    );
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    const currentServiceAreas = currentResult.rows[0].service_areas || [];
    
    // Add new service area
    const newServiceArea = {
      id: Date.now().toString(), // Simple ID generation
      city,
      state,
      zip: zip || null,
      minimum: minimum || 0,
      multiplier: multiplier || 1
    };
    
    const updatedServiceAreas = [...currentServiceAreas, newServiceArea];
    
    // Update database
    await pool.query(
      'UPDATE tenants.business SET service_areas = $1, updated_at = NOW() WHERE slug = $2 RETURNING slug',
      [JSON.stringify(updatedServiceAreas), tenantSlug]
    );
    
    res.json({ success: true, serviceArea: newServiceArea });
  } catch (error) {
    console.error('Error adding service area:', error);
    res.status(500).json({ error: 'Failed to add service area' });
  }
});

// Delete a service area
router.delete('/service-areas/:tenantSlug/:areaId', async (req, res) => {
  try {
    const { tenantSlug, areaId } = req.params;
    
    // Get current service areas
    const currentResult = await pool.query(
      'SELECT service_areas FROM tenants.business WHERE slug = $1',
      [tenantSlug]
    );
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    const currentServiceAreas = currentResult.rows[0].service_areas || [];
    const updatedServiceAreas = currentServiceAreas.filter(area => area.id !== areaId);
    
    // Update database
    await pool.query(
      'UPDATE tenants.business SET service_areas = $1, updated_at = NOW() WHERE slug = $2 RETURNING slug',
      [JSON.stringify(updatedServiceAreas), tenantSlug]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service area:', error);
    res.status(500).json({ error: 'Failed to delete service area' });
  }
});

module.exports = router;
