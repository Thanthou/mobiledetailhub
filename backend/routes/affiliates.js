const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// POST endpoint for affiliate applications
router.post('/apply', async (req, res) => {
  try {
    // Test database connection first
    try {
      await pool.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection test failed:', dbError);
      return res.status(500).json({ error: 'Database connection failed. Please try again.' });
    }

    const {
      legal_name,
      primary_contact,
      phone,
      email,
      base_location,
      categories,
      gbp_url,
      instagram_url,
      tiktok_url,
      facebook_url,
      youtube_url,
      website_url,
      has_insurance,
      source,
      notes
    } = req.body;

    // Debug logging
    console.log('Received application data:', {
      legal_name,
      primary_contact,
      phone,
      email,
      base_location,
      categories
    });

    // Validate required fields
    if (!legal_name || !primary_contact || !phone || !email || !base_location) {
      return res.status(400).json({ 
        error: 'Missing required fields: legal_name, primary_contact, phone, email, base_location' 
      });
    }

    // Validate base_location structure
    if (!base_location.city || !base_location.state) {
      return res.status(400).json({ 
        error: 'Missing required location fields: city and state are required' 
      });
    }

    // Generate a temporary slug for new applications
    // This satisfies the NOT NULL constraint and can be updated later by admin
    const tempSlug = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Format phone numbers
    const formattedPhone = phone.replace(/\D/g, '');
    const smsPhone = formattedPhone.length === 10 ? `+1${formattedPhone}` : null;

    // First, create or find the address record
    let addressId;
    try {
      // Check if address already exists
      const addressCheckQuery = `
        SELECT id FROM addresses 
        WHERE city = $1 AND state_code = $2 AND postal_code = $3
      `;
      const addressCheck = await pool.query(addressCheckQuery, [
        base_location.city, 
        base_location.state, 
        base_location.zip || null
      ]);
      
      if (addressCheck.rows.length > 0) {
        addressId = addressCheck.rows[0].id;
        console.log(`Using existing address ID: ${addressId}`);
      } else {
        // Create new address record
        const addressQuery = `
          INSERT INTO addresses (line1, city, state_code, postal_code) 
          VALUES ($1, $2, $3, $4) 
          RETURNING id
        `;
        const addressResult = await pool.query(addressQuery, [
          `${base_location.city}, ${base_location.state}`, // Format line1 as "City, State"
          base_location.city, 
          base_location.state, 
          base_location.zip || null
        ]);
        addressId = addressResult.rows[0].id;
        console.log(`Created new address ID: ${addressId}`);
      }
    } catch (addressErr) {
      console.error('Error handling address:', addressErr);
      return res.status(500).json({ 
        error: 'Failed to process location information. Please try again.' 
      });
    }

    // Insert new affiliate application
    // Insert into affiliates table with base_address_id
    const affiliateQuery = `
      INSERT INTO affiliates (
        slug, business_name, owner, phone, sms_phone, email, 
        base_address_id, services, website_url, gbp_url, 
        facebook_url, instagram_url, youtube_url, tiktok_url,
        has_insurance, source, notes, application_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, slug, business_name, application_status
    `;

    // Convert categories array to services JSONB format
    // Map frontend category names to backend service keys
    const categoryMapping = {
      'Auto Detailing': 'auto',
      'Boat Detailing': 'boat',
      'RV Detailing': 'rv',
      'PPF Installation': 'ppf',
      'Ceramic Coating': 'ceramic',
      'Paint Correction': 'paint_correction'
    };
    
    const servicesJson = {
      rv: categories.includes('RV Detailing'),
      ppf: categories.includes('PPF Installation'),
      auto: categories.includes('Auto Detailing'),
      boat: categories.includes('Boat Detailing'),
      ceramic: categories.includes('Ceramic Coating'),
      paint_correction: categories.includes('Paint Correction')
    };
    
    console.log('Categories received:', categories);
    console.log('Services JSON created:', servicesJson);

    const affiliateValues = [
      tempSlug,
      legal_name,
      primary_contact,
      formattedPhone,
      smsPhone,
      email,
      addressId, // Use the address ID instead of JSONB
      JSON.stringify(servicesJson), // services column
      website_url || null,
      gbp_url || null,
      facebook_url || null,
      instagram_url || null,
      youtube_url || null,
      tiktok_url || null,
      has_insurance,
      source || null,
      notes || null,
      'pending'
    ];

    const result = await pool.query(affiliateQuery, affiliateValues);
    console.log('Affiliate created successfully:', result.rows[0]);
    
    // Insert service areas for the affiliate
    if (result.rows[0] && base_location.city && base_location.state) {
      try {
        // Insert directly into affiliate_service_areas using city name and state
        // Handle empty zip by using null since zip column is nullable
        const zipValue = base_location.zip && base_location.zip.trim() !== '' ? base_location.zip.trim() : null;
        
        await pool.query(
          'INSERT INTO affiliate_service_areas (affiliate_id, city, state_code, zip) VALUES ($1, $2, $3, $4)',
          [result.rows[0].id, base_location.city, base_location.state, zipValue]
        );
        console.log(`Created service area for affiliate ${result.rows[0].id}`);
      } catch (serviceAreaErr) {
        console.warn('Failed to insert service area, but affiliate was created:', serviceAreaErr);
      }
    }
    
    console.log('Sending success response');
    res.status(201).json({
      ok: true,
      message: 'Application submitted successfully',
      affiliate: result.rows[0],
      note: 'A temporary slug has been assigned. This will be updated to a permanent slug once the application is approved.'
    });

  } catch (err) {
    console.error('Error submitting affiliate application:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    res.status(500).json({ 
      error: 'Failed to submit application. Please try again.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Test endpoint to verify server and database are working
router.get('/test', async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    res.json({ 
      status: 'ok', 
      message: 'Affiliates route is working',
      database: {
        connected: true,
        current_time: result.rows[0].current_time,
        version: result.rows[0].db_version
      }
    });
  } catch (err) {
    console.error('Test endpoint error:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: err.message 
    });
  }
});

// Get all APPROVED affiliate slugs for public use
router.get('/slugs', async (req, res) => {
  try {
    const result = await pool.query('SELECT slug, business_name FROM affiliates WHERE application_status = \'approved\' ORDER BY business_name');
    
    const affiliates = result.rows.map(row => ({
      slug: row.slug,
      name: row.business_name || row.slug
    }));
    
    res.json(affiliates);
  } catch (err) {
    console.error('Error fetching affiliate slugs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Affiliate lookup by location (city, state, zip) - MUST come before /:slug routes
router.get('/lookup', async (req, res) => {
  const { city, state, zip } = req.query;
  
  if (!city || !state) {
    return res.status(400).json({ error: 'city and state are required' });
  }
  
  try {
    // Query using the current structure: affiliate_service_areas.city/state_code
    // Only return APPROVED affiliates (not pending or rejected)
    let query = `
      SELECT DISTINCT a.slug 
      FROM affiliates a 
      JOIN affiliate_service_areas asa ON a.id = asa.affiliate_id 
      WHERE LOWER(asa.city) = LOWER($1) AND LOWER(asa.state_code) = LOWER($2)
        AND a.application_status = 'approved'
    `;
    const params = [city, state];
    
    // Only add zip constraint if zip is provided
    if (zip) {
      query += ` AND (asa.zip = $3 OR asa.zip IS NULL)`;
      params.push(zip);
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      // Check what's actually in the database for debugging
      const debugQuery = `
        SELECT asa.city, asa.state_code, asa.zip, a.slug 
        FROM affiliate_service_areas asa 
        JOIN affiliates a ON a.id = asa.affiliate_id 
        WHERE asa.city ILIKE $1 OR asa.state_code ILIKE $2 
        LIMIT 5
      `;
      const debugResult = await pool.query(debugQuery, [`%${city}%`, `%${state}%`]);
      
      return res.status(404).json({ 
        error: 'No affiliates found for this location',
        debug: {
          searchedFor: { city, state, zip },
          similarResults: debugResult.rows
        }
      });
    }
    
    // Return array of affiliate slugs
    const slugs = result.rows.map(row => row.slug);
    res.json({ slugs, count: slugs.length });
    
  } catch (err) {
    console.error('Error looking up affiliates by location:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual zip code update endpoint (for admin use)
router.post('/update-zip', async (req, res) => {
  const { city, state, zip } = req.body;
  
  if (!city || !state || !zip) {
    return res.status(400).json({ error: 'city, state, and zip are required' });
  }
  
  try {
    // Update zip codes using the current structure
    const updateQuery = `
      UPDATE affiliate_service_areas 
      SET zip = $1 
      WHERE LOWER(city) = LOWER($2) 
        AND LOWER(state_code) = LOWER($3) 
        AND zip IS NULL
    `;
    
    const updateResult = await pool.query(updateQuery, [zip, city, state]);
    
    res.json({ 
      success: true, 
      message: `Updated ${updateResult.rowCount} zip code(s) for ${city}, ${state} to ${zip}`,
      updatedCount: updateResult.rowCount
    });
    
  } catch (error) {
    console.error('Error in manual zip update:', error);
    res.status(500).json({ error: 'Failed to update zip codes' });
  }
});

// Get affiliate by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    // Get affiliate data with base location in a single query
    // Only return APPROVED affiliates (not pending or rejected)
    const result = await pool.query(`
      SELECT 
        a.*,
        addr.city,
        addr.state_code,
        s.name AS state_name,
        addr.postal_code AS zip,
        addr.lat,
        addr.lng
      FROM affiliates a
      LEFT JOIN addresses addr ON addr.id = a.base_address_id
      LEFT JOIN states s ON s.state_code = addr.state_code
      WHERE a.slug = $1 AND a.application_status = 'approved'
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const affiliate = result.rows[0];
    
    // Format the response to include base location
    const response = {
      ...affiliate,
      base_location: {
        city: affiliate.city,
        state_code: affiliate.state_code,
        state_name: affiliate.state_name,
        zip: affiliate.zip,
        lat: affiliate.lat,
        lng: affiliate.lng
      }
    };
    
    // Remove the individual fields to avoid duplication
    delete response.city;
    delete response.state_code;
    delete response.state_name;
    delete response.zip;
    delete response.lat;
    delete response.lng;
    
    res.json(response);
  } catch (err) {
    console.error('Error fetching affiliate by slug:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get affiliate field by slug
router.get('/:slug/field/:field', async (req, res) => {
  const { slug, field } = req.params;
  const allowedFields = [
    'id', 'slug', 'business_name', 'owner', 'email', 'phone', 'sms_phone', 'base_location', 'services', 'website_url', 'gbp_url', 'facebook_url', 'instagram_url', 'youtube_url', 'tiktok_url', 'application_status', 'has_insurance', 'source', 'notes', 'uploads', 'business_license', 'insurance_provider', 'insurance_expiry', 'service_radius_miles', 'operating_hours', 'emergency_contact', 'total_jobs', 'rating', 'review_count', 'created_at', 'updated_at', 'application_date', 'approved_date', 'last_activity'
  ];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field' });
  }
  try {
    const result = await pool.query(`SELECT ${field} FROM affiliates WHERE slug = $1 AND application_status = 'approved'`, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    res.json({ [field]: result.rows[0][field] });
  } catch (err) {
    console.error('Error fetching affiliate field by slug:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get affiliate base location by slug
router.get('/:slug/base_location', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        a.id AS affiliate_id,
        a.slug,
        a.business_name,
        addr.city,
        addr.state_code,
        s.name AS state_name,
        addr.postal_code AS zip,
        addr.lat,
        addr.lng
      FROM affiliates a
      LEFT JOIN addresses addr ON addr.id = a.base_address_id
      LEFT JOIN states s ON s.state_code = addr.state_code
      WHERE a.slug = $1 AND a.application_status = 'approved'
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const affiliate = result.rows[0];
    
    if (!affiliate.city || !affiliate.state_code) {
      return res.status(404).json({ 
        error: 'AFFILIATE_BASE_ADDRESS_INCOMPLETE',
        message: 'Affiliate base address is missing city or state information'
      });
    }
    
    res.json({
      affiliate_id: affiliate.affiliate_id,
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      city: affiliate.city,
      state_code: affiliate.state_code,
      state_name: affiliate.state_name,
      zip: affiliate.zip,
      lat: affiliate.lat,
      lng: affiliate.lng
    });
  } catch (err) {
    console.error('Error fetching affiliate base location:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get affiliate service areas by slug
router.get('/:slug/service_areas', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(
      'SELECT services, base_location FROM affiliates WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    // Return the services JSONB and base_location
    const affiliate = result.rows[0];
    res.json({
      services: affiliate.services || {},
      base_location: affiliate.base_location || {}
    });
  } catch (err) {
    console.error('Error fetching affiliate service areas:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;
