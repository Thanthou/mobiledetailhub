const { pool } = require('../database/pool');
const fs = require('fs');
const path = require('path');

async function createScheduleSchema() {
  try {
    console.log('Creating schedule schema...');
    
    // Create schema
    await pool.query('CREATE SCHEMA IF NOT EXISTS schedule;');
    console.log('✅ Schema created');
    
    // Read and execute appointments.sql
    const appointmentsSql = fs.readFileSync(
      path.join(__dirname, '../database/schemas/schedule/appointments.sql'), 
      'utf8'
    );
    await pool.query(appointmentsSql);
    console.log('✅ Appointments table created');
    
    // Read and execute time_blocks.sql
    const timeBlocksSql = fs.readFileSync(
      path.join(__dirname, '../database/schemas/schedule/time_blocks.sql'), 
      'utf8'
    );
    await pool.query(timeBlocksSql);
    console.log('✅ Time blocks table created');
    
    // Read and execute schedule_settings.sql
    const scheduleSettingsSql = fs.readFileSync(
      path.join(__dirname, '../database/schemas/schedule/schedule_settings.sql'), 
      'utf8'
    );
    await pool.query(scheduleSettingsSql);
    console.log('✅ Schedule settings table created');
    
    // Read and execute blocked_days.sql
    const blockedDaysSql = fs.readFileSync(
      path.join(__dirname, '../database/schemas/schedule/blocked_days.sql'), 
      'utf8'
    );
    await pool.query(blockedDaysSql);
    console.log('✅ Blocked days table created');
    
    // Insert default schedule settings for existing affiliates
    const insertSettingsQuery = `
      INSERT INTO schedule.schedule_settings (affiliate_id)
      SELECT id FROM tenants.business
      WHERE id NOT IN (SELECT affiliate_id FROM schedule.schedule_settings)
      ON CONFLICT (affiliate_id) DO NOTHING;
    `;
    await pool.query(insertSettingsQuery);
    console.log('✅ Default schedule settings created for existing affiliates');
    
    console.log('🎉 Schedule schema creation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating schedule schema:', error);
    process.exit(1);
  }
}

createScheduleSchema();
