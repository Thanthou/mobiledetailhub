const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkAffiliates() {
  try {
    console.log('🔍 Checking affiliates in database...');
    const result = await pool.query('SELECT id, business_name, email FROM affiliates ORDER BY id');
    
    console.log('✅ Affiliates found:', result.rows.length);
    result.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Name: ${row.business_name}, Email: ${row.email}`);
    });
    
    if (result.rows.length === 0) {
      console.log('⚠️  No affiliates found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking affiliates:', error.message);
  } finally {
    await pool.end();
  }
}

checkAffiliates();
