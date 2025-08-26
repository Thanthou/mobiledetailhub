const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../database/connection');

async function checkCitiesTable() {
  try {
    console.log('🔍 Checking cities table structure...');
    
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Get table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'cities' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await pool.query(structureQuery);
    console.log('\n📋 cities table structure:');
    console.log('Column Name | Data Type | Nullable | Default');
    console.log('------------|------------|----------|---------');
    
    structureResult.rows.forEach(row => {
      console.log(`${row.column_name.padEnd(12)} | ${row.data_type.padEnd(10)} | ${row.is_nullable.padEnd(8)} | ${row.column_default || 'NULL'}`);
    });
    
    // Check sample data
    const sampleQuery = 'SELECT * FROM cities LIMIT 1';
    const sampleResult = await pool.query(sampleQuery);
    
    if (sampleResult.rows.length > 0) {
      console.log('\n📊 Sample city record:');
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

checkCitiesTable();
