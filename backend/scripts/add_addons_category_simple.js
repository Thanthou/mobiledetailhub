const { pool } = require('../database/pool');

async function addAddonsCategory() {
  try {
    console.log('🔄 Adding Addons category...');
    
    const result = await pool.query(
      'INSERT INTO service_categories (name, description, base_duration_min) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING RETURNING id',
      ['Addons', 'Additional services and add-ons', 30]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Addons category added with ID:', result.rows[0].id);
    } else {
      console.log('ℹ️ Addons category already exists');
    }
    
    // Verify it was added
    const verify = await pool.query('SELECT * FROM service_categories WHERE name = $1', ['Addons']);
    console.log('📋 Verification:', verify.rows[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addAddonsCategory();
