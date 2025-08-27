const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../database/pool');

async function checkAffiliatesTable() {
  try {
    console.log('🔍 Checking affiliates table structure...');
    
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Get table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'affiliates' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await pool.query(structureQuery);
    console.log('\n📋 Affiliates table structure:');
    console.log('Column Name | Data Type | Nullable | Default');
    console.log('------------|------------|----------|---------');
    
    structureResult.rows.forEach(row => {
      console.log(`${row.column_name.padEnd(12)} | ${row.data_type.padEnd(10)} | ${row.is_nullable.padEnd(8)} | ${row.column_default || 'NULL'}`);
    });
    
    // Check if base_location column exists
    const baseLocationExists = structureResult.rows.some(row => row.column_name === 'base_location');
    console.log(`\n🔍 base_location column exists: ${baseLocationExists ? 'YES' : 'NO'}`);
    
    if (!baseLocationExists) {
      console.log('\n❌ The base_location column is missing!');
      console.log('This explains why affiliate applications are failing.');
      
      // Check what location-related columns exist
      const locationColumns = structureResult.rows.filter(row => 
        row.column_name.includes('location') || 
        row.column_name.includes('address') ||
        row.column_name.includes('city') ||
        row.column_name.includes('state') ||
        row.column_name.includes('zip')
      );
      
      if (locationColumns.length > 0) {
        console.log('\n📍 Found these location-related columns:');
        locationColumns.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type})`);
        });
      }
    }
    
    // Check sample data
    const sampleQuery = 'SELECT * FROM affiliates LIMIT 1';
    const sampleResult = await pool.query(sampleQuery);
    
    if (sampleResult.rows.length > 0) {
      console.log('\n📊 Sample affiliate record:');
      const sample = sampleResult.rows[0];
      Object.keys(sample).forEach(key => {
        console.log(`  ${key}: ${sample[key]}`);
      });
    }
    
  } catch (err) {
    console.error('💥 Error checking table:', err);
  } finally {
    await pool.end();
  }
}

checkAffiliatesTable();
