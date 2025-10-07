const { pool } = require('../database/pool');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running migration: add_google_maps_url_column');
    
    const sql = fs.readFileSync(path.join(__dirname, '../database/migrations/add_google_maps_url_column.sql'), 'utf8');
    
    await pool.query(sql);
    
    console.log('Migration completed successfully');
    console.log('Added google_maps_url column to tenants.business table');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
