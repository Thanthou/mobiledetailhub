require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  console.log('Admin check - req.user:', req.user); // Debug log
  
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = ADMIN_EMAILS.includes(email);

    // Create user with admin status if applicable
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, phone, is_admin, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, email, name, phone, is_admin, role, created_at',
      [email, hashedPassword, name, phone, isAdmin, isAdmin ? 'admin' : 'user']
    );

    // Generate JWT token with admin info
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email, isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    if (isAdmin) {
      console.log(`Created admin user: ${email}`);
    }

    res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        phone: result.rows[0].phone,
        is_admin: isAdmin
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    let isAdmin = user.is_admin || false;
    
    // Auto-promote to admin if email is in ADMIN_EMAILS list
    if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
      await pool.query('UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE id = $1', [user.id]);
      isAdmin = true;
      console.log(`Auto-promoted ${user.email} to admin`);
    }

    // Generate JWT token with admin info
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        is_admin: isAdmin
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User (Protected Route)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, phone, is_admin, created_at FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    let isAdmin = user.is_admin || false;
    
    // Auto-promote to admin if email is in ADMIN_EMAILS list
    if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
      await pool.query('UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE id = $1', [user.id]);
      isAdmin = true;
      console.log(`Auto-promoted ${user.email} to admin via /me endpoint`);
    }
    
    res.json({
      ...user,
      is_admin: isAdmin
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (Client-side token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin promotion endpoint (for development)
app.post('/api/auth/promote-admin', async (req, res) => {
  try {
    console.log('Environment variables check:');
    console.log('ADMIN_EMAILS:', process.env.ADMIN_EMAILS);
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('ADMIN')));
    
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    
    if (ADMIN_EMAILS.length === 0) {
      return res.status(400).json({ error: 'No ADMIN_EMAILS configured' });
    }
    
    // Update all users whose emails are in ADMIN_EMAILS to be admins
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE email = ANY($1) RETURNING id, email, name',
      [ADMIN_EMAILS]
    );
    
    console.log(`Promoted ${result.rowCount} users to admin:`, result.rows);
    
    res.json({
      success: true,
      message: `Promoted ${result.rowCount} users to admin`,
      promoted: result.rows
    });
  } catch (err) {
    console.error('Admin promotion error:', err);
    res.status(500).json({ error: 'Failed to promote users to admin' });
  }
});

// Admin Dashboard Routes
app.get('/admin', authenticateToken, requireAdmin, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Database Admin Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        textarea { width: 100%; height: 100px; font-family: monospace; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
        button:hover { background: #0056b3; }
        .result { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin: 10px 0; white-space: pre-wrap; font-family: monospace; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .tables { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0; }
        .table-btn { background: #28a745; }
        .table-btn:hover { background: #1e7e34; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Database Admin Dashboard</h1>
        
        <h3>Quick Actions</h3>
        <div class="tables">
          <button class="table-btn" onclick="showTables()">Show All Tables</button>
          <button class="table-btn" onclick="setupDatabase()">Setup Basic Database</button>
          <button class="table-btn" onclick="showUsers()">Show Users</button>
          <button class="table-btn" onclick="showMDHConfig()">Show MDH Config</button>
          <button class="table-btn" onclick="showServiceAreas()">Show Service Areas</button>
        </div>

        <h3>Custom SQL Query</h3>
        <textarea id="sqlQuery" placeholder="Enter your SQL query here...">SELECT * FROM users LIMIT 5;</textarea>
        <button onclick="runQuery()">Run Query</button>
        <button onclick="clearResult()">Clear Result</button>
        
        <div id="result"></div>
      </div>

      <script>
        async function runQuery() {
          const query = document.getElementById('sqlQuery').value;
          const resultDiv = document.getElementById('result');
          
          try {
            const response = await fetch('/admin/query', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              resultDiv.className = 'result success';
              resultDiv.textContent = JSON.stringify(data, null, 2);
            } else {
              resultDiv.className = 'result error';
              resultDiv.textContent = 'Error: ' + data.error;
            }
          } catch (error) {
            resultDiv.className = 'result error';
            resultDiv.textContent = 'Error: ' + error.message;
          }
        }

        async function showTables() {
          document.getElementById('sqlQuery').value = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';";
          runQuery();
        }

        async function setupDatabase() {
          const setupQuery = \`
            -- Create users table
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              name VARCHAR(255) NOT NULL,
              phone VARCHAR(50),
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            );

            -- Create mdh_config table
            CREATE TABLE IF NOT EXISTS mdh_config (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255),
              phone VARCHAR(50),
              sms_phone VARCHAR(50),
              logo_url TEXT,
              favicon_url TEXT,
              header_display VARCHAR(255) DEFAULT 'Mobile Detail Hub',
              tagline TEXT,
              facebook VARCHAR(255),
              instagram VARCHAR(255),
              tiktok VARCHAR(255),
              youtube VARCHAR(255),
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            );

            -- Insert basic data
            INSERT INTO mdh_config (header_display, tagline, phone, email) 
            VALUES ('Mobile Detail Hub', 'Find Mobile Detailing Near You', '+1-555-123-4567', 'info@mobiledetailhub.com')
            ON CONFLICT DO NOTHING;

            -- Create basic service_areas table
            CREATE TABLE IF NOT EXISTS service_areas (
              id SERIAL PRIMARY KEY,
              state VARCHAR(50),
              city VARCHAR(100),
              zip VARCHAR(20),
              created_at TIMESTAMP DEFAULT NOW()
            );

            -- Create basic businesses table
            CREATE TABLE IF NOT EXISTS businesses (
              id SERIAL PRIMARY KEY,
              slug VARCHAR(100) UNIQUE,
              name VARCHAR(255),
              email VARCHAR(255),
              phone VARCHAR(50),
              address TEXT,
              created_at TIMESTAMP DEFAULT NOW()
            );
          \`;
          
          document.getElementById('sqlQuery').value = setupQuery;
          runQuery();
        }

        async function showUsers() {
          document.getElementById('sqlQuery').value = "SELECT id, email, name, phone, created_at FROM users;";
          runQuery();
        }

        async function showMDHConfig() {
          document.getElementById('sqlQuery').value = "SELECT * FROM mdh_config;";
          runQuery();
        }

        async function showServiceAreas() {
          document.getElementById('sqlQuery').value = "SELECT * FROM service_areas;";
          runQuery();
        }

        function clearResult() {
          document.getElementById('result').textContent = '';
        }
      </script>
    </body>
    </html>
  `);
});

// Admin query endpoint
app.post('/admin/query', authenticateToken, requireAdmin, async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const result = await pool.query(query);
    res.json({
      success: true,
      rowCount: result.rowCount,
      rows: result.rows,
      fields: result.fields?.map(f => f.name) || []
    });
  } catch (err) {
    console.error('Admin query error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});