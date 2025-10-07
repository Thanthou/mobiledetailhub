const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

/**
 * GET /api/tenants/:slug
 * Fetch tenant data by slug with industry information
 */
router.get('/:slug', apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    
    const query = `
      SELECT 
        id, slug, business_name, owner, first_name, last_name, user_id,
        application_status, business_start_date, business_phone, personal_phone,
        business_email, personal_email, twilio_phone, sms_phone, website,
        gbp_url, facebook_url, instagram_url, youtube_url, tiktok_url,
        source, notes, service_areas, application_date, approved_date,
        last_activity, created_at, updated_at, industry
      FROM tenants.business 
      WHERE slug = $1 AND application_status = 'approved'
    `;
    
    const result = await pool.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found or not approved'
      });
    }
    
    const tenant = result.rows[0];
    
    // Parse service_areas JSON if it's a string
    if (typeof tenant.service_areas === 'string') {
      try {
        tenant.service_areas = JSON.parse(tenant.service_areas);
      } catch (parseError) {
        console.error('Error parsing service_areas:', parseError);
        tenant.service_areas = [];
      }
    }
    
    res.json({
      success: true,
      data: tenant
    });
    
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/tenants
 * Fetch tenants by industry (optional filter)
 */
router.get('/', apiLimiter, async (req, res) => {
  try {
    const { industry, status = 'approved' } = req.query;
    
    let query = `
      SELECT 
        id, slug, business_name, owner, first_name, last_name, user_id,
        application_status, business_start_date, business_phone, personal_phone,
        business_email, personal_email, twilio_phone, sms_phone, website,
        gbp_url, facebook_url, instagram_url, youtube_url, tiktok_url,
        source, notes, service_areas, application_date, approved_date,
        last_activity, created_at, updated_at, industry
      FROM tenants.business 
      WHERE application_status = $1
    `;
    
    const params = [status];
    
    if (industry) {
      query += ` AND industry = $2`;
      params.push(industry);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await pool.query(query, params);
    
    // Parse service_areas JSON for each tenant
    const tenants = result.rows.map(tenant => {
      if (typeof tenant.service_areas === 'string') {
        try {
          tenant.service_areas = JSON.parse(tenant.service_areas);
        } catch (parseError) {
          console.error('Error parsing service_areas:', parseError);
          tenant.service_areas = [];
        }
      }
      return tenant;
    });
    
    res.json({
      success: true,
      data: tenants
    });
    
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/tenants/industries/list
 * Get list of available industries
 */
router.get('/industries/list', apiLimiter, async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT industry, COUNT(*) as count
      FROM tenants.business 
      WHERE application_status = 'approved' AND industry IS NOT NULL
      GROUP BY industry
      ORDER BY count DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;