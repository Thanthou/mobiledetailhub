const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createTestAffiliate() {
  try {
    console.log('🔧 Creating test affiliate...');
    
    // Check if affiliate already exists
    const checkQuery = "SELECT id FROM affiliates WHERE email = 'test@example.com'";
    const existing = await pool.query(checkQuery);
    
    if (existing.rows.length > 0) {
      console.log('✅ Test affiliate already exists with ID:', existing.rows[0].id);
      return existing.rows[0].id;
    }
    
    // Create test affiliate
    const insertQuery = `
      INSERT INTO affiliates (business_name, email, phone, address_json, service_radius_miles, active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    
    const testAffiliate = {
      business_name: 'Test Mobile Detail Pro',
      email: 'test@example.com',
      phone: '(555) 123-4567',
      address_json: { city: 'Test City', state: 'TS' },
      service_radius_miles: 25,
      active: true
    };
    
    const result = await pool.query(insertQuery, [
      testAffiliate.business_name,
      testAffiliate.email,
      testAffiliate.phone,
      JSON.stringify(testAffiliate.address_json),
      testAffiliate.service_radius_miles,
      testAffiliate.active
    ]);
    
    const affiliateId = result.rows[0].id;
    console.log('✅ Test affiliate created with ID:', affiliateId);
    return affiliateId;
    
  } catch (error) {
    console.error('❌ Error creating test affiliate:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

createTestAffiliate();
