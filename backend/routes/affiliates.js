const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// POST endpoint for affiliate applications
router.post('/apply', async (req, res) => {
  try {
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
      uploads,
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
      categories,
      uploads: uploads ? `${uploads.length} files` : 'no files'
    });

    // Log the actual uploads data to see what's causing the JSON error
    if (uploads) {
      console.log('Raw uploads data:', JSON.stringify(uploads, null, 2));
    }

    // Validate required fields
    if (!legal_name || !primary_contact || !phone || !email || !base_location) {
      return res.status(400).json({ 
        error: 'Missing required fields: legal_name, primary_contact, phone, email, base_location' 
      });
    }

    // Sanitize and validate uploads field
    let sanitizedUploads = null;
    if (uploads && Array.isArray(uploads) && uploads.length > 0) {
      try {
        // Convert to a simple text array format to avoid JSONB parsing issues
        sanitizedUploads = uploads
          .filter(file => file && typeof file === 'object')
          .map(file => `${file.name || 'unknown'}|${file.size || 0}|${file.type || 'unknown'}`)
          .filter(filename => filename && filename !== 'unknown|0|unknown');
        
        console.log('Sanitized uploads (text array):', sanitizedUploads);
        
      } catch (error) {
        console.error('Error sanitizing uploads:', error);
        sanitizedUploads = null; // Fallback to null if sanitization fails
      }
    }

    // Generate slug from business name
    const slug = legal_name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    // Map categories to services JSONB
    const services = {
      auto: categories.includes('Auto Detailing'),
      boat: categories.includes('Boat Detailing'),
      rv: categories.includes('RV Detailing'),
      ppf: categories.includes('PPF Installation'),
      ceramic: categories.includes('Ceramic Coating'),
      paint_correction: categories.includes('Paint Correction')
    };

    // Format phone numbers
    const formattedPhone = phone.replace(/\D/g, '');
    const smsPhone = formattedPhone.length === 10 ? `+1${formattedPhone}` : null;

    // Insert new affiliate application
    const query = `
      INSERT INTO affiliates (
        slug, business_name, owner, phone, sms_phone, email, 
        base_location, services, website_url, gbp_url, 
        facebook_url, instagram_url, youtube_url, tiktok_url,
        has_insurance, source, notes, uploads, application_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id, slug, business_name, application_status
    `;

    const values = [
      slug,
      legal_name,
      primary_contact,
      formattedPhone,
      smsPhone,
      email,
      base_location,
      services,
      website_url || null,
      gbp_url || null,
      facebook_url || null,
      instagram_url || null,
      youtube_url || null,
      tiktok_url || null,
      has_insurance,
      source || null,
      notes || null,
      sanitizedUploads,
      'pending'
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      affiliate: result.rows[0]
    });

  } catch (err) {
    console.error('Error submitting affiliate application:', err);
    
    // Handle duplicate slug error
    if (err.code === '23505' && err.constraint === 'affiliates_slug_key') {
      return res.status(400).json({ 
        error: 'A business with this name already exists. Please contact support.' 
      });
    }
    
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

// Get all affiliate slugs for dev mode dropdown
router.get('/slugs', async (req, res) => {
  try {
    const result = await pool.query('SELECT slug, business_name, application_status FROM affiliates ORDER BY business_name');
    
    const affiliates = result.rows.map(row => ({
      slug: row.slug,
      name: row.business_name || row.slug,
      status: row.application_status
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
  

  
  try {
    // More flexible query: prioritize city+state match, zip is optional
    let query = 'SELECT DISTINCT a.slug FROM affiliates a JOIN affiliate_service_areas asa ON a.id = asa.affiliate_id WHERE LOWER(asa.city) = LOWER($1) AND LOWER(asa.state) = LOWER($2)';
    const params = [city, state];
    
    // Only add zip constraint if zip is provided AND the database has a zip for this location
    if (zip) {
      query += ` AND (asa.zip = $3 OR asa.zip IS NULL)`;
      params.push(zip);
    }
    

    
    const result = await pool.query(query, params);
    

    
    if (result.rows.length === 0) {
      // Let's also check what's actually in the database for debugging
      const debugQuery = 'SELECT asa.city, asa.state, asa.zip, a.slug FROM affiliate_service_areas asa JOIN affiliates a ON asa.affiliate_id = a.id WHERE asa.city ILIKE $1 OR asa.state ILIKE $2 LIMIT 5';
      const debugResult = await pool.query(debugQuery, [`%${city}%`, `%${state}%`]);

      
      return res.status(404).json({ 
        error: 'No affiliates found for this location',
        debug: {
          searchedFor: { city, state, zip },
          similarResults: debugResult.rows
        }
      });
    }
    
    // If we have a zip code and found results, try to update any missing zip codes
    if (zip && result.rows.length > 0) {
      try {
        await updateMissingZipCodes(city, state, zip);
      } catch (updateError) {
        // Zip code update failed (non-critical)
      }
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
    const updateResult = await updateMissingZipCodes(city, state, zip);
    
    res.json({ 
      success: true, 
      message: `Updated ${updateResult} zip code(s) for ${city}, ${state} to ${zip}`,
      updatedCount: updateResult
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
    const result = await pool.query('SELECT * FROM affiliates WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    res.json(result.rows[0]);
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
    const result = await pool.query(`SELECT ${field} FROM affiliates WHERE slug = $1`, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    res.json({ [field]: result.rows[0][field] });
  } catch (err) {
    console.error('Error fetching affiliate field by slug:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get affiliate service areas by slug
router.get('/:slug/service_areas', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(
      'SELECT services, base_location FROM affiliates WHERE slug = $1',
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

// Helper function to update missing zip codes
async function updateMissingZipCodes(city, state, zip) {
  try {
    // Update any affiliate_service_areas records that have the same city/state but null zip
    const updateQuery = `
      UPDATE affiliate_service_areas 
      SET zip = $1 
      WHERE LOWER(city) = LOWER($2) 
        AND LOWER(state) = LOWER($3) 
        AND zip IS NULL
    `;
    
    const updateResult = await pool.query(updateQuery, [zip, city, state]);
    
    if (updateResult.rowCount > 0) {
      // Zip codes updated successfully
    }
    
    return updateResult.rowCount;
  } catch (error) {
    console.error('Error updating zip codes:', error);
    throw error;
  }
}

module.exports = router;
