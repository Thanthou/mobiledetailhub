const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { validateBody, validateParams, sanitize } = require('../middleware/validation');
const { affiliateSchemas, sanitizationSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Test endpoint to verify server and database are working
router.get('/test', (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    // Test database connection synchronously
    pool.query('SELECT NOW() as current_time, version() as db_version')
      .then(result => {
        res.json({ 
          status: 'ok', 
          message: 'Affiliates route is working',
          database: {
            connected: true,
            current_time: result.rows[0].current_time,
            version: result.rows[0].db_version
          }
        });
      })
      .catch(error => {
        res.status(500).json({ error: 'Database test failed', details: error.message });
      });
      
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Simple test endpoint without validation or sanitization
router.post('/test-simple', asyncHandler(async (req, res) => {
  try {
    logger.info('Testing simple POST endpoint...');
    logger.debug('Request body:', req.body);
    
    res.json({ 
      status: 'ok', 
      message: 'Simple POST endpoint working',
      received: req.body
    });
  } catch (error) {
    logger.error('Simple test endpoint error:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// Simple test endpoint without validation or sanitization
router.post('/test-simple', asyncHandler(async (req, res) => {
  try {
    logger.info('Testing simple POST endpoint...');
    logger.debug('Request body:', req.body);
    
    res.json({ 
      status: 'ok', 
      message: 'Simple POST endpoint working',
      received: req.body
    });
  } catch (error) {
    logger.error('Simple test endpoint error:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// POST endpoint for affiliate applications
router.post('/apply', 
  (req, res, next) => {
    logger.debug('Raw request body received:', JSON.stringify(req.body, null, 2));
    next();
  },
  sanitize(sanitizationSchemas.affiliate),
  (req, res, next) => {
    logger.debug('After sanitization:', JSON.stringify(req.body, null, 2));
    next();
  },
  validateBody(affiliateSchemas.apply),
  asyncHandler(async (req, res) => {
    try {
      // Test database connection first
      if (!pool) {
        const error = new Error('Database connection not available');
        error.statusCode = 500;
        throw error;
      }
      
      await pool.query('SELECT 1');

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
      logger.debug('Received application data:', {
        legal_name,
        primary_contact,
        phone,
        email,
        base_location,
        categories
      });

      // Generate a temporary slug for new applications
      console.log('🏷️ [BACKEND] Generating temporary slug...');
      const tempSlug = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('✅ [BACKEND] Temporary slug generated:', tempSlug);

      // Format phone numbers
      console.log('📞 [BACKEND] Formatting phone numbers...');
      const formattedPhone = phone.replace(/\D/g, '');
      const smsPhone = formattedPhone.length === 10 ? `+1${formattedPhone}` : null;
      console.log('✅ [BACKEND] Phone formatted:', { original: phone, formatted: formattedPhone, sms: smsPhone });

      // First, create or find the address record
      console.log('🏠 [BACKEND] Starting address processing...');
      let addressId;
      // Check if address already exists
      const addressCheckQuery = `
        SELECT id FROM addresses 
        WHERE city = $1 AND state_code = $2 AND postal_code = $3
      `;
      console.log('🔍 [BACKEND] Checking for existing address...');
      const addressCheck = await pool.query(addressCheckQuery, [
        base_location.city, 
        base_location.state, 
        base_location.zip || null
      ]);
      console.log('✅ [BACKEND] Address check completed, rows found:', addressCheck.rows.length);
      
      if (addressCheck.rows.length > 0) {
        addressId = addressCheck.rows[0].id;
        console.log('✅ [BACKEND] Using existing address ID:', addressId);
        logger.debug(`Using existing address ID: ${addressId}`);
      } else {
        // Create new address record
        console.log('🏗️ [BACKEND] Creating new address record...');
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
        console.log('✅ [BACKEND] New address created with ID:', addressId);
        logger.debug(`Created new address ID: ${addressId}`);
      }

      // Insert new affiliate application
      console.log('👤 [BACKEND] Starting affiliate creation...');
      // Insert into affiliates table with base_address_id
      // Reuse existing pool connection
      if (!pool) {
        console.log('❌ [BACKEND] Pool check failed during affiliate creation');
        return res.status(500).json({ error: 'Database connection not available' });
      }
      const affiliateQuery = `
      INSERT INTO affiliates (
        slug, business_name, owner, phone, sms_phone, email, 
        base_address_id, website_url, gbp_url, 
        facebook_url, instagram_url, youtube_url, tiktok_url,
        has_insurance, source, notes, application_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, slug, business_name, application_status
    `;

      // Convert categories array to services JSONB format
      console.log('🏷️ [BACKEND] Processing categories...');
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
      
      console.log('✅ [BACKEND] Categories processed:', { categories, servicesJson });
      logger.debug('Categories received:', { categories });
      logger.debug('Services JSON created:', { servicesJson });

      const affiliateValues = [
        tempSlug,
        legal_name,
        primary_contact,
        formattedPhone,
        smsPhone,
        email,
        addressId, // Use the address ID instead of JSONB
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

      console.log('📝 [BACKEND] About to insert affiliate with values:', affiliateValues);
      const result = await pool.query(affiliateQuery, affiliateValues);
      console.log('✅ [BACKEND] Affiliate created successfully:', result.rows[0]);
      logger.info('Affiliate created successfully:', { affiliate: result.rows[0] });
      
      // Insert services for the affiliate based on selected categories
      console.log('🔧 [BACKEND] Starting service creation...');
      const affiliateId = result.rows[0].id;
      if (categories && categories.length > 0) {
        try {
          for (const category of categories) {
            console.log(`🔧 [BACKEND] Creating service for category: ${category}`);
            const categoryKey = categoryMapping[category];
            if (categoryKey) {
              await pool.query(
                'INSERT INTO services (affiliate_id, category, name, description) VALUES ($1, $2, $3, $4)',
                [affiliateId, categoryKey, category, `${category} service offered by ${legal_name}`]
              );
              console.log(`✅ [BACKEND] Service created for ${category}`);
              logger.debug('Service created:', { affiliateId, category: categoryKey, name: category });
            }
          }
          console.log('✅ [BACKEND] All services created successfully');
          logger.info('Services created successfully for affiliate:', { affiliateId, categories });
        } catch (serviceError) {
          console.log('⚠️ [BACKEND] Error creating services:', serviceError.message);
          logger.error('Error creating services for affiliate:', { 
            error: serviceError.message, 
            affiliateId, 
            categories 
          });
          // Don't fail the whole request for service creation errors
        }
      }
      
      // Insert service areas for the affiliate using the new simplified JSONB approach
      console.log('🗺️ [BACKEND] Starting service area creation...');
      if (result.rows[0] && base_location.city && base_location.state) {
        try {
          // Create service areas in the new JSONB format
          const serviceAreas = [{
            city: base_location.city,
            state: base_location.state.toUpperCase(),
            zip: base_location.zip && base_location.zip.trim() !== '' ? base_location.zip.trim() : null,
            slug: tempSlug // Use temp slug for now, will be updated on approval
          }];
          
          // Update the affiliate with service areas
          await pool.query(
            'UPDATE affiliates SET service_areas = $1 WHERE id = $2',
            [JSON.stringify(serviceAreas), result.rows[0].id]
          );
          
          console.log('✅ [BACKEND] Service areas created successfully in JSONB format');
          logger.info(`Created service areas for affiliate ${result.rows[0].id}:`, serviceAreas);
          
          // Extract location from service areas and update city, state, zip columns
          try {
            console.log('🔍 [DEBUG] Service areas data:', JSON.stringify(serviceAreas, null, 2));
            console.log('🔍 [DEBUG] First service area:', JSON.stringify(serviceAreas[0], null, 2));
            
            const primaryLocation = serviceAreas[0];
            console.log('🔍 [DEBUG] Primary location object:', primaryLocation);
            console.log('🔍 [DEBUG] Available properties:', Object.keys(primaryLocation));
            console.log('🔍 [DEBUG] City value:', primaryLocation.city);
            console.log('🔍 [DEBUG] State value:', primaryLocation.state);
            console.log('🔍 [DEBUG] Zip value:', primaryLocation.zip);
            
            // Update affiliate with the location data from service areas
            const locationUpdateQuery = `
              UPDATE affiliates 
              SET city = $1, state = $2, zip = $3
              WHERE id = $4
              RETURNING *
            `;
            
            await pool.query(locationUpdateQuery, [
              primaryLocation.city,
              primaryLocation.state, 
              primaryLocation.zip,
              result.rows[0].id
            ]);
            
            console.log('✅ [BACKEND] Location columns updated for affiliate:', {
              city: primaryLocation.city,
              state: primaryLocation.state,
              zip: primaryLocation.zip
            });
            logger.info(`Location columns updated for affiliate ${result.rows[0].id}:`, {
              city: primaryLocation.city,
              state: primaryLocation.state,
              zip: primaryLocation.zip
            });
          } catch (locationError) {
            console.log('⚠️ [BACKEND] Location update failed:', locationError.message);
            console.log('⚠️ [BACKEND] Location update error stack:', locationError.stack);
            logger.warn('Location update failed, but affiliate was created:', { error: locationError.message });
          }
        } catch (error) {
          console.log('⚠️ [BACKEND] Service area creation failed:', error.message);
          logger.warn('Failed to create service areas, but affiliate was created:', { error: error.message });
        }
      }
      
      console.log('📤 [BACKEND] Sending success response...');
      logger.debug('Sending success response');
      res.status(201).json({
        ok: true,
        message: 'Application submitted successfully',
        affiliate: result.rows[0],
        note: 'A temporary slug has been assigned. This will be updated to a permanent slug once the application is approved.'
      });
      console.log('✅ [BACKEND] Success response sent');

    } catch (error) {
      console.error('🚨 [BACKEND] Error in main route handler:', error);
      console.error('🚨 [BACKEND] Error stack:', error.stack);
      throw error;
    }
  })
);

// GET /api/affiliates - List all affiliates
router.get('/', asyncHandler(async (req, res) => {
  try {
    const query = `
      SELECT id, business_name, email, phone, application_status, created_at, updated_at
      FROM affiliates 
      WHERE application_status = 'approved'
      ORDER BY business_name
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    logger.error('Error fetching affiliates:', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch affiliates',
      message: error.message
    });
  }
}));

// Get all APPROVED affiliate slugs for public use
router.get('/slugs', asyncHandler(async (req, res) => {
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  const result = await pool.query('SELECT slug, business_name FROM affiliates WHERE application_status = \'approved\' ORDER BY business_name');

  const affiliates = result.rows.map(row => ({
    slug: row.slug,
    name: row.business_name || row.slug
  }));
  
  res.json(affiliates);
}));

// Affiliate lookup by location (city, state, zip) - MUST come before /:slug routes
router.get('/lookup', asyncHandler(async (req, res) => {
  const { city, state, zip } = req.query;
  
  if (!city || !state) {
    const error = new Error('city and state are required');
    error.statusCode = 400;
    throw error;
  }
  
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
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
    
    const error = new Error('No affiliates found for this location');
    error.statusCode = 404;
    error.details = {
      searchedFor: { city, state, zip },
      similarResults: debugResult.rows
    };
    throw error;
  }
  
  // Return array of affiliate slugs
  const slugs = result.rows.map(row => row.slug);
  res.json({ slugs, count: slugs.length });
}));

// Manual zip code update endpoint (for admin use)
router.post('/update-zip', asyncHandler(async (req, res) => {
  const { city, state, zip } = req.body;
  
  if (!city || !state || !zip) {
    const error = new Error('city, state, and zip are required');
    error.statusCode = 400;
    throw error;
  }
  
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
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
}));

// Get affiliate by slug
router.get('/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    logger.info(`Fetching affiliate with slug: ${slug}`);

    if (!pool) {
      logger.error('Database pool not available');
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    // Simple test query first
    logger.info('Testing basic query...');
    const testResult = await pool.query('SELECT COUNT(*) FROM affiliates');
    logger.info(`Total affiliates in database: ${testResult.rows[0].count}`);
    
    // Get affiliate data with phone and base location
    logger.info('Executing affiliate query...');
    const result = await pool.query(`
      SELECT 
        id,
        slug, 
        business_name, 
        application_status,
        phone,
        sms_phone,
        city,
        state,
        zip
      FROM affiliates 
      WHERE slug = $1
    `, [slug]);
    
    logger.info(`Query result: ${result.rowCount} rows found`);
    
    if (result.rows.length === 0) {
      logger.info(`No affiliate found with slug: ${slug}`);
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const affiliate = result.rows[0];
    logger.info(`Found affiliate: ${affiliate.business_name}`);
    // Format the response to match frontend expectations
    const formattedAffiliate = {
      id: affiliate.id,
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      application_status: affiliate.application_status,
      phone: affiliate.phone || affiliate.sms_phone, // Try phone first, fallback to sms_phone
      base_location: affiliate.city && affiliate.state ? {
        city: affiliate.city,
        state_name: affiliate.state,
        zip: affiliate.zip
      } : null
    };
    
    res.json({
      success: true,
      affiliate: formattedAffiliate
    });
    
  } catch (err) {
    logger.error('Error fetching affiliate by slug:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}));

// Get affiliate field by slug
router.get('/:slug/field/:field', asyncHandler(async (req, res) => {
  const { slug, field } = req.params;
  const allowedFields = [
    'id', 'slug', 'business_name', 'owner', 'email', 'phone', 'sms_phone', 'base_location', 'services', 'website_url', 'gbp_url', 'facebook_url', 'instagram_url', 'youtube_url', 'tiktok_url', 'application_status', 'has_insurance', 'source', 'notes', 'uploads', 'business_license', 'insurance_provider', 'insurance_expiry', 'service_radius_miles', 'operating_hours', 'emergency_contact', 'total_jobs', 'rating', 'review_count', 'created_at', 'updated_at', 'application_date', 'approved_date', 'last_activity'
  ];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field' });
  }
  try {

    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    // Use a safer approach with explicit field selection
    const fieldMap = {
      'id': 'id',
      'slug': 'slug',
      'business_name': 'business_name',
      'owner': 'owner',
      'email': 'email',
      'phone': 'phone',
      'sms_phone': 'sms_phone',
      'base_location': 'base_location',
      'services': 'services',
      'website_url': 'website_url',
      'gbp_url': 'gbp_url',
      'facebook_url': 'facebook_url',
      'instagram_url': 'instagram_url',
      'youtube_url': 'youtube_url',
      'tiktok_url': 'tiktok_url',
      'application_status': 'application_status',
      'has_insurance': 'has_insurance',
      'source': 'source',
      'notes': 'notes',
      'uploads': 'uploads',
      'business_license': 'business_license',
      'insurance_provider': 'insurance_provider',
      'insurance_expiry': 'insurance_expiry',
      'service_radius_miles': 'service_radius_miles',
      'operating_hours': 'operating_hours',
      'emergency_contact': 'emergency_contact',
      'total_jobs': 'total_jobs',
      'rating': 'rating',
      'review_count': 'review_count',
      'created_at': 'created_at',
      'updated_at': 'updated_at',
      'application_date': 'application_date',
      'approved_date': 'approved_date',
      'last_activity': 'last_activity'
    };
    
    const safeField = fieldMap[field];
    if (!safeField) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    
    const result = await pool.query(`SELECT ${safeField} FROM affiliates WHERE slug = $1 AND application_status = 'approved'`, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    res.json({ [field]: result.rows[0][safeField] });
  } catch (err) {
    logger.error('Error fetching affiliate field by slug:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// Get affiliate base location by slug
router.get('/:slug/base_location', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {

    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    const result = await pool.query(`
      SELECT 
        a.id AS affiliate_id,
        a.slug,
        a.business_name,
        addr.city,
        addr.state_code,
        addr.postal_code AS zip,
        addr.lat,
        addr.lng
      FROM affiliates a
      LEFT JOIN addresses addr ON addr.id = a.base_address_id
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
      zip: affiliate.zip,
      lat: affiliate.lat,
      lng: affiliate.lng
    });
  } catch (err) {
    logger.error('Error fetching affiliate base location:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// Get affiliate service areas by slug
router.get('/:slug/service_areas', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {

    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
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
    logger.error('Error fetching affiliate service areas:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));





module.exports = router;
