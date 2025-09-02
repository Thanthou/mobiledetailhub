#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function checkSchemas() {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking existing schemas...\n');
    
    const result = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);
    
    console.log('📁 Existing schemas:');
    result.rows.forEach(row => {
      console.log(`   • ${row.schema_name}`);
    });
    
    console.log(`\n📊 Total schemas: ${result.rows.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchemas();
