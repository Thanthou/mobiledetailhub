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