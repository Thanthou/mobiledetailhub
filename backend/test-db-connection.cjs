const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres', // Try connecting to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres', // Try common default password
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function testConnection() {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await client.query('SELECT version()');
    console.log('✅ Database connected:', result.rows[0].version);
    
    // Check current schema
    const schemaResult = await client.query('SELECT current_schema()');
    console.log('✅ Current schema:', schemaResult.rows[0].current_schema);
    
    // List available schemas
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    console.log('✅ Available schemas:', schemasResult.rows.map(r => r.schema_name));
    
    // Test creating a table in public schema
    await client.query('SET search_path TO public');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      )
    `);
    console.log('✅ Test table created in public schema');
    
    // Clean up
    await client.query('DROP TABLE IF EXISTS test_table');
    console.log('✅ Test table cleaned up');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
