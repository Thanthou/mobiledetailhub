#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkServiceAreas() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id,
        business_name,
        service_areas,
        jsonb_array_length(service_areas) as area_count
      FROM affiliates.affiliates 
      WHERE service_areas IS NOT NULL 
      ORDER BY id
      LIMIT 5
    `);
    
    console.log('Sample service_areas data:');
    result.rows.forEach((row, i) => {
      console.log(`\nAffiliate ${i+1} (${row.business_name}):`);
      console.log(`  Areas: ${row.area_count}`);
      console.log(`  Data:`, JSON.stringify(row.service_areas, null, 2));
    });
    
    // Check data patterns
    const patternResult = await client.query(`
      SELECT 
        jsonb_array_length(service_areas) as area_count,
        COUNT(*) as affiliate_count
      FROM affiliates.affiliates 
      WHERE service_areas IS NOT NULL
      GROUP BY jsonb_array_length(service_areas)
      ORDER BY area_count
    `);
    
    console.log('\nService areas distribution:');
    patternResult.rows.forEach(row => {
      console.log(`  ${row.area_count} areas: ${row.affiliate_count} affiliates`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkServiceAreas();
