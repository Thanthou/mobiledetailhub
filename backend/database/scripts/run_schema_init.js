const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

async function runSchemaInit() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Reading init_schema.sql...');
    const sqlFile = path.join(__dirname, 'init_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Executing schema initialization...');
    await pool.query(sql);
    
    console.log('✅ Schema v3 initialization completed successfully!');
    console.log('All tables have been dropped and recreated with normalized structure.');
    
  } catch (error) {
    console.error('❌ Error running schema initialization:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSchemaInit();
