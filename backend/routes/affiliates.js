const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Get all affiliate slugs for dev mode dropdown
router.get('/slugs', async (req, res) => {
  try {
    const result = await pool.query('SELECT slug, name, is_active FROM affiliates ORDER BY name');
    
    const affiliates = result.rows.map(row => ({
      slug: row.slug,
      name: row.name || row.slug
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
    'id', 'slug', 'name', 'email', 'phone', 'sms_phone', 'address', 'logo_url', 'website', 'description', 'service_areas', 'state_cities', 'is_active', 'created_at', 'updated_at'
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
      'SELECT service_areas FROM affiliates WHERE slug = $1',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    // Return the service_areas array or empty array if null
    const serviceAreas = result.rows[0].service_areas || [];
    res.json(serviceAreas);
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
