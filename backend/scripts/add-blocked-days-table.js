const { pool } = require('../database/pool');
const fs = require('fs');
const path = require('path');

async function addBlockedDaysTable() {
  try {
    console.log('Adding blocked days table to existing schedule schema...');
    
    // Check if schedule schema exists
    const schemaCheck = await pool.query(`
      SELECT schema_name FROM information_schema.schemata 
      WHERE schema_name = 'schedule'
    `);
    
    if (schemaCheck.rows.length === 0) {
      console.log('❌ Schedule schema does not exist. Please run create-schedule-schema.js first.');
      process.exit(1);
    }
    
    console.log('✅ Schedule schema exists');
    
    // Check if blocked_days table already exists
    const tableCheck = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'schedule' AND table_name = 'blocked_days'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Blocked days table already exists');
      process.exit(0);
    }
    
    // Read and execute blocked_days.sql
    const blockedDaysSql = fs.readFileSync(
      path.join(__dirname, '../database/schemas/schedule/blocked_days.sql'), 
      'utf8'
    );
    await pool.query(blockedDaysSql);
    console.log('✅ Blocked days table created');
    
    console.log('🎉 Blocked days table added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding blocked days table:', error);
    process.exit(1);
  }
}

addBlockedDaysTable();
