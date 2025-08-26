const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../database/connection');

async function checkAffiliatesData() {
  try {
    console.log('🔍 Checking affiliates table data...');
    
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Check total count
    const countQuery = 'SELECT COUNT(*) FROM affiliates';
    const countResult = await pool.query(countQuery);
    console.log(`📊 Total affiliates in database: ${countResult.rows[0].count}`);
    
    if (parseInt(countResult.rows[0].count) === 0) {
      console.log('❌ No affiliates found in database');
      return;
    }
    
    // Get all affiliates
    const allQuery = 'SELECT id, business_name, owner, email, application_status, slug, created_at FROM affiliates ORDER BY created_at DESC';
    const allResult = await pool.query(allQuery);
    
    console.log('\n📋 All affiliates in database:');
    allResult.rows.forEach((affiliate, index) => {
      console.log(`\n${index + 1}. ID: ${affiliate.id}`);
      console.log(`   Business: ${affiliate.business_name}`);
      console.log(`   Owner: ${affiliate.owner}`);
      console.log(`   Email: ${affiliate.email}`);
      console.log(`   Status: ${affiliate.application_status}`);
      console.log(`   Slug: ${affiliate.slug}`);
      console.log(`   Created: ${affiliate.created_at}`);
    });
    
    // Check the exact query being used by admin route
    console.log('\n🔍 Testing the exact admin query:');
    const adminQuery = `
      SELECT 
        a.id, a.owner as name, a.email, 'affiliate' as role, a.created_at,
        a.business_name, a.application_status, a.slug
      FROM affiliates a
      ORDER BY a.created_at DESC
    `;
    
    console.log('Query:', adminQuery);
    const adminResult = await pool.query(adminQuery);
    console.log(`Result count: ${adminResult.rowCount}`);
    
    if (adminResult.rowCount > 0) {
      console.log('✅ Admin query found affiliates');
      console.log('Sample result:', adminResult.rows[0]);
    } else {
      console.log('❌ Admin query found no affiliates');
    }
    
  } catch (err) {
    console.error('💥 Error checking affiliates:', err);
  } finally {
    await pool.end();
  }
}

checkAffiliatesData();
