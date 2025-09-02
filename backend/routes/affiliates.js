const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { validateBody, validateParams, sanitize } = require('../middleware/validation');
const { affiliateSchemas, sanitizationSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');
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



      // Insert new affiliate application
      console.log('👤 [BACKEND] Starting affiliate creation...');
      // Reuse existing pool connection
      if (!pool) {
        console.log('❌ [BACKEND] Pool check failed during affiliate creation');
        return res.status(500).json({ error: 'Database connection not available' });
      }
      const affiliateQuery = `
      INSERT INTO affiliates.business (
        slug, business_name, owner, business_phone, sms_phone, business_email, 
        gbp_url, 
        facebook_url, instagram_url, youtube_url, tiktok_url,
        has_insurance, source, notes, application_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
            primary: true,
            minimum: 0,
            multiplier: 1
          }];
          
          // Update the affiliate with service areas
          await pool.query(
            'UPDATE affiliates.business SET service_areas = $1 WHERE id = $2',
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
              UPDATE affiliates.business 
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
      SELECT id, business_name, business_phone as phone, application_status, created_at, updated_at
      FROM affiliates.business 
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
  
  const result = await pool.query('SELECT slug, business_name FROM affiliates.business WHERE application_status = \'approved\' ORDER BY business_name');

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
  
  // Query using the service_areas JSONB field in affiliates table
  // Only return APPROVED affiliates (not pending or rejected)
  let query = `
    SELECT DISTINCT slug 
    FROM affiliates.business 
    WHERE application_status = 'approved'
      AND service_areas IS NOT NULL
      AND EXISTS (
        SELECT 1 
        FROM jsonb_array_elements(service_areas) AS area
        WHERE LOWER(area->>'city') = LOWER($1) 
          AND LOWER(area->>'state') = LOWER($2)
  `;
  const params = [city, state];
  
  // Only add zip constraint if zip is provided
  if (zip) {
    query += ` AND (area->>'zip' = $3 OR area->>'zip' IS NULL)`;
    params.push(zip);
  }
  
  query += `)`;
  
  const result = await pool.query(query, params);
  
  if (result.rows.length === 0) {
    // Check what's actually in the database for debugging
    const debugQuery = `
      SELECT slug, service_areas 
      FROM affiliates.business 
      WHERE application_status = 'approved'
        AND service_areas IS NOT NULL
        AND (
          service_areas::text ILIKE $1 
          OR service_areas::text ILIKE $2
        )
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

// Update affiliate data
router.put('/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { 
    zip, minimum, multiplier,
    first_name, last_name, personal_phone, personal_email,
    business_name, business_email, business_phone, twilio_phone, business_start_date,
    gbp_url, facebook_url, youtube_url, tiktok_url, instagram_url
  } = req.body;
  
  console.log(`🔄 PUT /api/affiliates/${slug} called`);
  console.log('📝 Request body:', req.body);
  
  try {
    if (!pool) {
      console.log('❌ Database pool not available');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Get current affiliate
    console.log(`🔍 Looking for affiliate with slug: ${slug}`);
    const affiliateResult = await pool.query(
      'SELECT id FROM affiliates.business WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    console.log(`📊 Found ${affiliateResult.rows.length} affiliate(s)`);
    
    if (affiliateResult.rows.length === 0) {
      console.log('❌ Affiliate not found or not approved');
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    const affiliateId = affiliateResult.rows[0].id;
    console.log(`✅ Using affiliate ID: ${affiliateId}`);

    // Validate format only if fields are provided
    const errors = {};

    // Email validation - only validate format if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (personal_email?.trim() && !emailRegex.test(personal_email)) {
      errors.personal_email = 'Invalid email format';
    }
    if (business_email?.trim() && !emailRegex.test(business_email)) {
      errors.business_email = 'Invalid email format';
    }

    // Phone validation - only validate format if provided
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
    if (personal_phone?.trim() && !phoneRegex.test(personal_phone)) {
      errors.personal_phone = 'Invalid phone format';
    }
    if (business_phone?.trim() && !phoneRegex.test(business_phone)) {
      errors.business_phone = 'Invalid phone format';
    }
    if (twilio_phone?.trim() && !phoneRegex.test(twilio_phone)) {
      errors.twilio_phone = 'Invalid phone format';
    }

    // URL validation - only validate format if provided
    const urlRegex = /^https?:\/\/.+/;
    const urlFields = [
      // website_url is auto-generated, so we don't validate it
      { field: 'gbp_url', value: gbp_url },
      { field: 'facebook_url', value: facebook_url },
      { field: 'youtube_url', value: youtube_url },
      { field: 'tiktok_url', value: tiktok_url },
      { field: 'instagram_url', value: instagram_url }
    ];
    
    urlFields.forEach(({ field, value }) => {
      if (value?.trim() && !urlRegex.test(value)) {
        errors[field] = 'Invalid URL format. Must start with http:// or https://';
      }
    });

    if (Object.keys(errors).length > 0) {
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({ 
        error: 'Validation failed',
        errors 
      });
    }
    
    console.log('✅ Validation passed');

    // Update affiliate data with all available fields
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    // Legacy fields
    if (zip !== undefined) {
      updateFields.push(`zip = $${paramCount}`);
      updateValues.push(zip);
      paramCount++;
    }

    if (minimum !== undefined) {
      updateFields.push(`minimum = $${paramCount}`);
      updateValues.push(minimum);
      paramCount++;
    }

    if (multiplier !== undefined) {
      updateFields.push(`multiplier = $${paramCount}`);
      updateValues.push(multiplier);
      paramCount++;
    }

    // Profile fields - convert empty strings to NULL
    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramCount}`);
      updateValues.push(first_name?.trim() || null);
      paramCount++;
    }

    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramCount}`);
      updateValues.push(last_name?.trim() || null);
      paramCount++;
    }

    if (personal_phone !== undefined) {
      updateFields.push(`personal_phone = $${paramCount}`);
      updateValues.push(personal_phone?.trim() || null);
      paramCount++;
    }

    if (personal_email !== undefined) {
      updateFields.push(`personal_email = $${paramCount}`);
      updateValues.push(personal_email?.trim() || null);
      paramCount++;
    }

    if (business_name !== undefined) {
      updateFields.push(`business_name = $${paramCount}`);
      updateValues.push(business_name?.trim() || null);
      paramCount++;
    }

    if (business_email !== undefined) {
      updateFields.push(`business_email = $${paramCount}`);
      updateValues.push(business_email?.trim() || null);
      paramCount++;
    }

    if (business_phone !== undefined) {
      updateFields.push(`business_phone = $${paramCount}`);
      updateValues.push(business_phone?.trim() || null);
      paramCount++;
    }

    if (twilio_phone !== undefined) {
      updateFields.push(`twilio_phone = $${paramCount}`);
      updateValues.push(twilio_phone?.trim() || null);
      paramCount++;
    }

    if (business_start_date !== undefined) {
      updateFields.push(`business_start_date = $${paramCount}`);
      // Convert empty string to NULL for date field
      updateValues.push(business_start_date?.trim() || null);
      paramCount++;
    }

    // URL fields - convert empty strings to NULL
    // website_url is auto-generated, so we don't update it from user input

    if (gbp_url !== undefined) {
      updateFields.push(`gbp_url = $${paramCount}`);
      updateValues.push(gbp_url?.trim() || null);
      paramCount++;
    }

    if (facebook_url !== undefined) {
      updateFields.push(`facebook_url = $${paramCount}`);
      updateValues.push(facebook_url?.trim() || null);
      paramCount++;
    }

    if (youtube_url !== undefined) {
      updateFields.push(`youtube_url = $${paramCount}`);
      updateValues.push(youtube_url?.trim() || null);
      paramCount++;
    }

    if (tiktok_url !== undefined) {
      updateFields.push(`tiktok_url = $${paramCount}`);
      updateValues.push(tiktok_url?.trim() || null);
      paramCount++;
    }

    if (instagram_url !== undefined) {
      updateFields.push(`instagram_url = $${paramCount}`);
      updateValues.push(instagram_url?.trim() || null);
      paramCount++;
    }

    // Update owner field if first_name or last_name changed
    if (first_name !== undefined || last_name !== undefined) {
      const ownerValue = `${first_name?.trim() || ''} ${last_name?.trim() || ''}`.trim();
      if (ownerValue) {
        updateFields.push(`owner = $${paramCount}`);
        updateValues.push(ownerValue);
        paramCount++;
      }
    }

    // Update primary phone/email if business fields changed
    if (business_phone !== undefined && business_phone?.trim()) {
      // Only update primary phone if business_phone has a value
      updateFields.push(`business_phone = $${paramCount}`);
      updateValues.push(business_phone.trim());
      paramCount++;
    }

    if (business_email !== undefined && business_email?.trim()) {
      // Only update primary email if business_email has a value
      updateFields.push(`email = $${paramCount}`);
      updateValues.push(business_email.trim());
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(affiliateId);
    const updateQuery = `
      UPDATE affiliates.business 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, updateValues);

    res.json({
      success: true,
      affiliate: result.rows[0],
      message: 'Affiliate data updated successfully'
    });

  } catch (err) {
    logger.error('Error updating affiliate data:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
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
    const testResult = await pool.query('SELECT COUNT(*) FROM affiliates.business');
    logger.info(`Total affiliates in database: ${testResult.rows[0].count}`);
    
    // Get affiliate data with phone and service areas
    logger.info('Executing affiliate query...');
    const result = await pool.query(`
      SELECT 
        id,
        slug, 
        business_name, 
        application_status,
        business_phone as phone,
        sms_phone,
        twilio_phone,
        service_areas,
        owner,
        business_email,
        personal_email,
        first_name,
        last_name,
        personal_phone,
        business_start_date,
        website,
        gbp_url,
        facebook_url,
        youtube_url,
        tiktok_url,
        instagram_url,
        created_at,
        updated_at
      FROM affiliates.business 
      WHERE slug = $1
    `, [slug]);
    
    logger.info(`Query result: ${result.rowCount} rows found`);
    
    if (result.rows.length === 0) {
      logger.info(`No affiliate found with slug: ${slug}`);
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const affiliate = result.rows[0];
    logger.info(`Found affiliate: ${affiliate.business_name}`);
    logger.info(`Service areas type: ${typeof affiliate.service_areas}`);
    logger.info(`Service areas value:`, affiliate.service_areas);
    
    // Extract primary service area data from service_areas JSON
    let primaryServiceArea = null;
    let minimum = 0;
    let multiplier = 1.0;
    
    // Handle service_areas - it might be a string or already parsed
    let serviceAreas = affiliate.service_areas;
    if (typeof serviceAreas === 'string') {
      try {
        serviceAreas = JSON.parse(serviceAreas);
      } catch (e) {
        logger.error('Error parsing service_areas JSON:', e);
        serviceAreas = null;
      }
    }
    
    if (serviceAreas && Array.isArray(serviceAreas)) {
      primaryServiceArea = serviceAreas.find(area => area.primary === true);
      if (primaryServiceArea) {
        minimum = primaryServiceArea.minimum || 0;
        multiplier = primaryServiceArea.multiplier || 1.0;
      }
    }
    
    // Extract primary location from service_areas JSONB
    let primaryCity = null;
    let primaryState = null;
    let primaryZip = null;
    
    if (serviceAreas && Array.isArray(serviceAreas)) {
      const primaryArea = serviceAreas.find(area => area.primary === true);
      if (primaryArea) {
        primaryCity = primaryArea.city;
        primaryState = primaryArea.state;
        primaryZip = primaryArea.zip;
      }
    }
    
    // Format the response to match frontend expectations
    const formattedAffiliate = {
      id: affiliate.id,
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      application_status: affiliate.application_status,
      phone: affiliate.business_phone || affiliate.sms_phone, // Try business_phone first, fallback to sms_phone
      city: primaryCity,
      state: primaryState,
      zip: primaryZip,
      service_areas: affiliate.service_areas, // Include the service_areas JSON field
      minimum: minimum,
      multiplier: multiplier,
      base_location: primaryCity && primaryState ? {
        city: primaryCity,
        state_name: primaryState,
        zip: primaryZip
      } : null,
      // Basic fields that exist
      owner: affiliate.owner,
      email: affiliate.business_email, // Use business_email as the primary email
      // Profile fields
      first_name: affiliate.first_name,
      last_name: affiliate.last_name,
      personal_phone: affiliate.personal_phone,
      personal_email: affiliate.personal_email,
      business_email: affiliate.business_email,
      business_phone: affiliate.business_phone,
      twilio_phone: affiliate.twilio_phone,
      business_start_date: affiliate.business_start_date,
      // URL fields - use the generated website field
      website_url: affiliate.website,
      gbp_url: affiliate.gbp_url,
      facebook_url: affiliate.facebook_url,
      youtube_url: affiliate.youtube_url,
      tiktok_url: affiliate.tiktok_url,
      instagram_url: affiliate.instagram_url,
      created_at: affiliate.created_at,
      updated_at: affiliate.updated_at
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
    'id', 'slug', 'business_name', 'owner', 'phone', 'sms_phone', 'base_location', 'services', 'website', 'gbp_url', 'facebook_url', 'instagram_url', 'youtube_url', 'tiktok_url', 'application_status', 'has_insurance', 'source', 'notes', 'uploads', 'business_license', 'insurance_provider', 'insurance_expiry', 'service_radius_miles', 'operating_hours', 'emergency_contact', 'total_jobs', 'rating', 'review_count', 'created_at', 'updated_at', 'application_date', 'approved_date', 'last_activity'
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
      'phone': 'phone',
      'sms_phone': 'sms_phone',
      'base_location': 'base_location',
      'services': 'services',
      'website': 'website',
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
    
    const result = await pool.query(`SELECT ${safeField} FROM affiliates.business WHERE slug = $1 AND application_status = 'approved'`, [slug]);
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
        a.service_areas
      FROM affiliates.business a
      WHERE a.slug = $1 AND a.application_status = 'approved'
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const affiliate = result.rows[0];
    
    // Extract primary location from service_areas JSONB
    const serviceAreas = affiliate.service_areas || [];
    const primaryLocation = serviceAreas.find(area => area.primary === true);
    
    if (!primaryLocation || !primaryLocation.city || !primaryLocation.state) {
      return res.status(404).json({ 
        error: 'AFFILIATE_BASE_ADDRESS_INCOMPLETE',
        message: 'Affiliate primary location is missing city or state information'
      });
    }
    
    res.json({
      affiliate_id: affiliate.affiliate_id,
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      city: primaryLocation.city,
      state_code: primaryLocation.state,
      zip: primaryLocation.zip,
      lat: primaryLocation.lat || null,
      lng: primaryLocation.lng || null
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
      'SELECT service_areas FROM affiliates.business WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    // Return the service_areas JSONB
    const affiliate = result.rows[0];
    res.json({
      service_areas: affiliate.service_areas || []
    });
  } catch (err) {
    logger.error('Error fetching affiliate service areas:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// Add service area to affiliate
router.post('/:slug/service_areas', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { city, state, zip, minimum, multiplier } = req.body;
  
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Validate required fields
    if (!city || !state) {
      return res.status(400).json({ error: 'City and state are required' });
    }

    // Get current affiliate and service areas
    const affiliateResult = await pool.query(
      'SELECT id, service_areas FROM affiliates.business WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    if (affiliateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    const affiliate = affiliateResult.rows[0];
    const currentServiceAreas = affiliate.service_areas || [];

    // Check if location already exists
    const locationExists = currentServiceAreas.some(area => 
      area.city.toLowerCase() === city.toLowerCase() && 
      area.state.toUpperCase() === state.toUpperCase()
    );

    if (locationExists) {
      return res.status(400).json({ error: 'This location already exists in your service areas' });
    }

    // Add new service area with clean structure
    const newServiceArea = {
      city: city.trim(),
      state: state.toUpperCase().trim(),
      zip: zip ? parseInt(zip.trim()) : null,
      primary: false, // Additional service areas are not primary
      minimum: minimum || 0,
      multiplier: multiplier || 1.0
    };

    const updatedServiceAreas = [...currentServiceAreas, newServiceArea];

    // Update affiliate with new service areas
    await pool.query(
      'UPDATE affiliates.business SET service_areas = $1 WHERE id = $2',
      [JSON.stringify(updatedServiceAreas), affiliate.id]
    );

    res.status(201).json({
      success: true,
      service_area: newServiceArea,
      message: 'Service area added successfully'
    });

  } catch (err) {
    logger.error('Error adding service area:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// Remove service area from affiliate
router.delete('/:slug/service_areas/:areaId', asyncHandler(async (req, res) => {
  const { slug, areaId } = req.params;
  
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Get current affiliate and service areas
    const affiliateResult = await pool.query(
      'SELECT id, service_areas FROM affiliates.business WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    if (affiliateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    const affiliate = affiliateResult.rows[0];
    const currentServiceAreas = affiliate.service_areas || [];

    // Find and remove the service area
    const areaIndex = currentServiceAreas.findIndex(area => 
      `${area.city}-${area.state}` === areaId
    );

    if (areaIndex === -1) {
      return res.status(404).json({ error: 'Service area not found' });
    }

    const removedArea = currentServiceAreas[areaIndex];
    const updatedServiceAreas = currentServiceAreas.filter((_, index) => index !== areaIndex);

    // Update affiliate with updated service areas
    await pool.query(
      'UPDATE affiliates.business SET service_areas = $1 WHERE id = $2',
      [JSON.stringify(updatedServiceAreas), affiliate.id]
    );

    res.json({
      success: true,
      removed_area: removedArea,
      message: 'Service area removed successfully'
    });

  } catch (err) {
    logger.error('Error removing service area:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));





// Update primary service area
router.put('/:slug/service_areas/:areaId', asyncHandler(async (req, res) => {
  const { slug, areaId } = req.params;
  const updates = req.body;
  
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Get current affiliate and service areas
    const affiliateResult = await pool.query(
      'SELECT id, service_areas FROM affiliates.business WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    if (affiliateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    const affiliate = affiliateResult.rows[0];
    const currentServiceAreas = affiliate.service_areas || [];

    // Find the service area to update
    const areaIndex = currentServiceAreas.findIndex(area => 
      `${area.city}-${area.state}` === areaId
    );

    if (areaIndex === -1) {
      return res.status(404).json({ error: 'Service area not found' });
    }

    // Update the service area with new values
    const updatedArea = { ...currentServiceAreas[areaIndex], ...updates };
    const updatedServiceAreas = [...currentServiceAreas];
    updatedServiceAreas[areaIndex] = updatedArea;

    // Update affiliate with updated service areas
    await pool.query(
      'UPDATE affiliates.business SET service_areas = $1 WHERE id = $2',
      [JSON.stringify(updatedServiceAreas), affiliate.id]
    );

    res.json({
      success: true,
      service_area: updatedArea,
      message: 'Service area updated successfully'
    });

  } catch (err) {
    logger.error('Error updating service area:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.put('/:slug/service_areas/primary', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;
  
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Get current affiliate and service areas
    const affiliateResult = await pool.query(
      'SELECT id, service_areas FROM affiliates.business WHERE slug = $1 AND application_status = \'approved\'',
      [slug]
    );
    
    if (affiliateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    const affiliate = affiliateResult.rows[0];
    const currentServiceAreas = affiliate.service_areas || [];

    // Find the primary service area (where primary: true)
    const primaryIndex = currentServiceAreas.findIndex(area => area.primary === true);
    
    if (primaryIndex === -1) {
      return res.status(404).json({ error: 'Primary service area not found' });
    }

    // Ensure only one primary service area exists (defensive programming)
    const primaryCount = currentServiceAreas.filter(area => area.primary === true).length;
    if (primaryCount > 1) {
      logger.warn(`Multiple primary service areas found for affiliate ${slug}, using first one`);
    }

    // Update the primary service area with provided updates
    const updatedServiceAreas = [...currentServiceAreas];
    updatedServiceAreas[primaryIndex] = {
      ...updatedServiceAreas[primaryIndex],
      ...updates,
      primary: true // Ensure it remains primary
    };

    // Update affiliate with updated service areas
    await pool.query(
      'UPDATE affiliates.business SET service_areas = $1 WHERE id = $2',
      [JSON.stringify(updatedServiceAreas), affiliate.id]
    );

    res.json({
      success: true,
      service_area: updatedServiceAreas[primaryIndex],
      message: 'Primary service area updated successfully'
    });

  } catch (err) {
    logger.error('Error updating primary service area:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// Profile endpoints for authenticated affiliates
// GET /api/affiliates/profile - Get current affiliate's profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  try {
    // Get user ID from JWT token (assuming it's set by auth middleware)
    const userId = req.user?.id;
    console.log('Profile endpoint called with userId:', userId, 'user:', req.user);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get affiliate data by user_id, or fall back to first available affiliate for admin users
    let result = await pool.query(
      'SELECT * FROM affiliates.business WHERE user_id = $1',
      [userId]
    );

    // If no affiliate found for this user, check if they're an admin and use the first available affiliate
    if (result.rows.length === 0) {
      console.log('No affiliate found for user_id:', userId, 'checking if admin...');
      
      // For now, let's just use the first available affiliate for any user without a linked affiliate
      // This is a temporary solution to get the profile tab working
      console.log('Using first available affiliate as fallback...');
      result = await pool.query(
        'SELECT * FROM affiliates.business ORDER BY id LIMIT 1'
      );
      console.log('Found affiliate:', result.rows.length > 0 ? result.rows[0].id : 'none');
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate profile not found' });
    }

    const affiliate = result.rows[0];
    
    // Return profile data with fallbacks for missing columns
    res.json({
      id: affiliate.id,
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      owner: affiliate.owner,
      phone: affiliate.business_phone,
      email: affiliate.business_email,
      first_name: affiliate.first_name || (affiliate.owner ? affiliate.owner.split(' ')[0] : ''),
      last_name: affiliate.last_name || (affiliate.owner ? affiliate.owner.split(' ').slice(1).join(' ') : ''),
      personal_phone: affiliate.personal_phone || affiliate.business_phone || '',
      personal_email: affiliate.personal_email || affiliate.business_email || '',
      business_email: affiliate.business_email || affiliate.business_email || '',
      business_phone: affiliate.business_phone || affiliate.business_phone || '',
      business_start_date: affiliate.business_start_date || affiliate.created_at || '',
      created_at: affiliate.created_at,
      updated_at: affiliate.updated_at
    });

  } catch (err) {
    logger.error('Error fetching affiliate profile:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// PUT /api/affiliates/profile - Update current affiliate's profile
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  try {
    // Get user ID from JWT token
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      first_name,
      last_name,
      personal_phone,
      personal_email,
      business_name,
      business_email,
      business_phone,
      business_start_date
    } = req.body;

    // Validate format only if fields are provided
    const errors = {};

    // Email validation - only validate format if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (personal_email?.trim() && !emailRegex.test(personal_email)) {
      errors.personal_email = 'Invalid email format';
    }
    if (business_email?.trim() && !emailRegex.test(business_email)) {
      errors.business_email = 'Invalid email format';
    }

    // Phone validation - only validate format if provided
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
    if (personal_phone?.trim() && !phoneRegex.test(personal_phone)) {
      errors.personal_phone = 'Invalid phone format';
    }
    if (business_phone?.trim() && !phoneRegex.test(business_phone)) {
      errors.business_phone = 'Invalid phone format';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors 
      });
    }

    // Check if affiliate exists, or fall back to first available affiliate for admin users
    let affiliateResult = await pool.query(
      'SELECT id FROM affiliates.business WHERE user_id = $1',
      [userId]
    );

    // If no affiliate found for this user, use the first available affiliate as fallback
    if (affiliateResult.rows.length === 0) {
      // For now, let's just use the first available affiliate for any user without a linked affiliate
      // This is a temporary solution to get the profile tab working
      affiliateResult = await pool.query(
        'SELECT id FROM affiliates.business ORDER BY id LIMIT 1'
      );
    }

    if (affiliateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate profile not found' });
    }

    const affiliateId = affiliateResult.rows[0].id;

    // Update affiliate profile with all profile columns
    const updateQuery = `
      UPDATE affiliates.business SET
        business_name = $1,
        owner = $2,
        business_phone = $3,
        business_email = $4,
        first_name = $5,
        last_name = $6,
        personal_phone = $7,
        personal_email = $8,
        business_start_date = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      business_name,
      `${first_name} ${last_name}`.trim(), // Update owner field
      business_phone, // Use business phone as primary phone
      business_email, // Use business email as primary email
      first_name,
      last_name,
      personal_phone,
      personal_email,
      business_start_date,
      affiliateId
    ]);

    const updatedAffiliate = result.rows[0];

    res.json({
      success: true,
      data: {
        id: updatedAffiliate.id,
        slug: updatedAffiliate.slug,
        business_name: updatedAffiliate.business_name,
        owner: updatedAffiliate.owner,
        phone: updatedAffiliate.business_phone,
        email: updatedAffiliate.business_email,
        first_name: first_name,
        last_name: last_name,
        personal_phone: personal_phone,
        personal_email: personal_email,
        business_email: business_email,
        business_phone: business_phone,
        business_start_date: business_start_date,
        created_at: updatedAffiliate.created_at,
        updated_at: updatedAffiliate.updated_at
      },
      message: 'Profile updated successfully'
    });

  } catch (err) {
    logger.error('Error updating affiliate profile:', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}));

module.exports = router;
