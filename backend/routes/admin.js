const express = require('express');
const router = express.Router();
const pool = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin Dashboard Routes
router.get('/', authenticateToken, requireAdmin, (req, res) => {
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
          <button class="table-btn" onclick="showUsers()">Show Users</button>
          <button class="table-btn" onclick="showMDHConfig()">Show MDH Config</button>
          <button class="table-btn" onclick="showServiceAreas()">Show Service Areas</button>
          <button class="table-btn" onclick="showAffiliates()">Show Affiliates</button>
          <button class="table-btn" onclick="showPendingSlugs()">Pending Slugs</button>
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

        async function showAffiliates() {
          document.getElementById('sqlQuery').value = "SELECT * FROM affiliates;";
          runQuery();
        }

        async function showPendingSlugs() {
          document.getElementById('sqlQuery').value = "SELECT id, business_name, owner, email, application_status, created_at FROM affiliates WHERE slug IS NULL ORDER BY created_at DESC;";
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
router.post('/query', authenticateToken, requireAdmin, async (req, res) => {
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

// Get affiliates without slugs for admin review
router.get('/affiliates/pending-slugs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, business_name, owner, email, application_status, created_at 
      FROM affiliates 
      WHERE slug IS NULL 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      affiliates: result.rows
    });
    
  } catch (err) {
    console.error('Error fetching affiliates without slugs:', err);
    res.status(500).json({ error: 'Failed to fetch affiliates' });
  }
});

// Admin endpoint to set affiliate slug
router.put('/affiliates/:id/slug', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { slug } = req.body;
    
    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }
    
    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' });
    }
    
    // Check if slug already exists
    const existingSlug = await pool.query(
      'SELECT id FROM affiliates WHERE slug = $1 AND id != $2',
      [slug, id]
    );
    
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    
    // Update the affiliate with the new slug
    const result = await pool.query(
      'UPDATE affiliates SET slug = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, slug, business_name',
      [slug, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    res.json({
      success: true,
      message: 'Slug updated successfully',
      affiliate: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error updating affiliate slug:', err);
    res.status(500).json({ error: 'Failed to update slug' });
  }
});

module.exports = router;
