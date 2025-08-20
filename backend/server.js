require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working', timestamp: new Date().toISOString() });
});

// Test DB connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clients endpoint
app.get('/api/clients', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM clients LIMIT 1');
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'clients not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching clients:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Clients: get field
app.get('/api/clients/field/:field', async (req, res) => {
    const { field } = req.params;
    const allowedFields = [
      'id', 'user_id', 'address', 'preferences', 'created_at', 'updated_at'
    ];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    try {
      const result = await pool.query(`SELECT ${field} FROM clients LIMIT 1`);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json({ [field]: result.rows[0][field] });
    } catch (err) {
      console.error('Error fetching client field:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Businesses endpoint
app.get('/api/businesses', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM businesses LIMIT 1');
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'businesses not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Businesses: get field
app.get('/api/businesses/field/:field', async (req, res) => {
    const { field } = req.params;
    const allowedFields = [
      'id', 'slug', 'name', 'email', 'phone', 'sms_phone', 'address', 'domain', 'service_locations', 'state_cities', 'created_at', 'updated_at'
    ];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    try {
      const result = await pool.query(`SELECT ${field} FROM businesses LIMIT 1`);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.json({ [field]: result.rows[0][field] });
    } catch (err) {
      console.error('Error fetching business field:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Business lookup by location (city, state, zip) - MUST come before /:slug routes
app.get('/api/businesses/lookup', async (req, res) => {
  const { city, state, zip } = req.query;
  
  // Debug logging
  console.log('Location lookup request:', { city, state, zip });
  
  try {
    // More flexible query: prioritize city+state match, zip is optional
    let query = 'SELECT DISTINCT slug FROM business_area WHERE LOWER(city) = LOWER($1) AND LOWER(state) = LOWER($2)';
    const params = [city, state];
    
    // Only add zip constraint if zip is provided AND the database has a zip for this location
    if (zip) {
      query += ` AND (zip = $3 OR zip IS NULL)`;
      params.push(zip);
    }
    
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    
    const result = await pool.query(query, params);
    
    console.log('Query result:', result.rows);
    
    if (result.rows.length === 0) {
      // Let's also check what's actually in the database for debugging
      const debugQuery = 'SELECT * FROM business_area WHERE city ILIKE $1 OR state ILIKE $2 LIMIT 5';
      const debugResult = await pool.query(debugQuery, [`%${city}%`, `%${state}%`]);
      console.log('Debug query result:', debugResult.rows);
      
      return res.status(404).json({ 
        error: 'No businesses found for this location',
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
        console.log('Zip code update failed (non-critical):', updateError.message);
      }
    }
    
    // Return array of business slugs
    const slugs = result.rows.map(row => row.slug);
    res.json({ slugs, count: slugs.length });
    
  } catch (err) {
    console.error('Error looking up businesses by location:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to update missing zip codes
async function updateMissingZipCodes(city, state, zip) {
  try {
    // Update any business_area records that have the same city/state but null zip
    const updateQuery = `
      UPDATE business_area 
      SET zip = $1 
      WHERE LOWER(city) = LOWER($2) 
        AND LOWER(state) = LOWER($3) 
        AND zip IS NULL
    `;
    
    const updateResult = await pool.query(updateQuery, [zip, city, state]);
    
    if (updateResult.rowCount > 0) {
      console.log(`Updated ${updateResult.rowCount} zip code(s) for ${city}, ${state} to ${zip}`);
    }
    
    return updateResult.rowCount;
  } catch (error) {
    console.error('Error updating zip codes:', error);
    throw error;
  }
}

// Manual zip code update endpoint (for admin use)
app.post('/api/businesses/update-zip', async (req, res) => {
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

  app.get('/api/businesses/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
      const result = await pool.query('SELECT * FROM businesses WHERE slug = $1', [slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching business by slug:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/businesses/:slug/field/:field', async (req, res) => {
    const { slug, field } = req.params;
    const allowedFields = [
      'id', 'slug', 'name', 'email', 'phone', 'sms_phone', 'address', 'domain', 'service_locations', 'state_cities', 'created_at', 'updated_at'
    ];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    try {
      const result = await pool.query(`SELECT ${field} FROM businesses WHERE slug = $1`, [slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.json({ [field]: result.rows[0][field] });
    } catch (err) {
      console.error('Error fetching business field by slug:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

    // Affiliates endpoint
app.get('/api/affiliates', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM affiliates LIMIT 1');
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'affiliates not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching affiliates:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Affiliates: get field
app.get('/api/affiliates/field/:field', async (req, res) => {
    const { field } = req.params;
    const allowedFields = [
      'id', 'user_id', 'business_id', 'service_areas', 'onboarding_status', 'created_at', 'updated_at'
    ];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    try {
      const result = await pool.query(`SELECT ${field} FROM affiliates LIMIT 1`);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Affiliate not found' });
      }
      res.json({ [field]: result.rows[0][field] });
    } catch (err) {
      console.error('Error fetching affiliate field:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// MDH Config endpoint
app.get('/api/mdh-config', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mdh_config LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'MDH config not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching MDH config:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MDH Config: get field
app.get('/api/mdh-config/field/:field', async (req, res) => {
    const { field } = req.params;
    // Whitelist allowed fields
    const allowedFields = [
      'email', 'phone', 'sms_phone', 'logo_url', 'favicon_url',
      'facebook', 'instagram', 'tiktok', 'youtube', 'created_at', 'updated_at'
    ];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    try {
      const result = await pool.query(`SELECT ${field} FROM mdh_config LIMIT 1`);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Config not found' });
      }
      res.json({ [field]: result.rows[0][field] });
    } catch (err) {
      console.error('Error fetching config by field:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/api/service_areas', async (req, res) => {
  try {
    const result = await pool.query('SELECT state, city, zip FROM service_areas');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching service areas:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/businesses/:slug/business_area', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(
      'SELECT city, state FROM business_area WHERE slug = $1',
      [slug]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching business_area:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});