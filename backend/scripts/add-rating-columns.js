const { pool } = require('../database/pool');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running migration: add_rating_columns_to_business');
    
    const sql = fs.readFileSync(path.join(__dirname, '../database/migrations/add_rating_columns_to_business.sql'), 'utf8');
    
    await pool.query(sql);
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
