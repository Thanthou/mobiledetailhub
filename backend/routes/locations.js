/**
 * @fileoverview API routes for locations
 * @version 1.0.0
 * @author That Smart Site
 */

import express from 'express';
import { getPool } from '../database/pool.js';
import { withTenantBySlug } from '../middleware/withTenant.js';
import { validateBody } from '../middleware/zodValidation.js';
import { serviceAreaSchemas } from '../schemas/apiSchemas.js';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = express.Router();

// Get service areas for a tenant
router.get('/service-areas/:slug', withTenantBySlug, asyncHandler((req, res) => {
  const serviceAreas = req.tenant.service_areas || [];
  res.json(serviceAreas);
}));

// Update service areas for a tenant
router.put('/service-areas/:slug', 
  withTenantBySlug, 
  validateBody(serviceAreaSchemas.update),
  asyncHandler(async (req, res) => {
    const { serviceAreas } = req.body;
    
    await pool.query(
      'UPDATE tenants.business SET service_areas = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(serviceAreas), req.tenant.id]
    );
    
    res.json({ success: true, serviceAreas });
  })
);

// Add a new service area
router.post('/service-areas/:slug', 
  withTenantBySlug, 
  validateBody(serviceAreaSchemas.add),
  asyncHandler(async (req, res) => {
    const { city, state, zip, minimum, multiplier } = req.body;
    
    const currentServiceAreas = req.tenant.service_areas || [];
    
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
      'UPDATE tenants.business SET service_areas = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(updatedServiceAreas), req.tenant.id]
    );
    
    res.json({ success: true, serviceArea: newServiceArea });
  })
);

// Delete a service area
router.delete('/service-areas/:slug/:areaId', withTenantBySlug, asyncHandler(async (req, res) => {
  const { areaId } = req.params;
  
  const currentServiceAreas = req.tenant.service_areas || [];
  const updatedServiceAreas = currentServiceAreas.filter(area => area.id !== areaId);
  
  // Update database
  await pool.query(
    'UPDATE tenants.business SET service_areas = $1, updated_at = NOW() WHERE id = $2',
    [JSON.stringify(updatedServiceAreas), req.tenant.id]
  );
  
  res.json({ success: true });
}));

export default router;
