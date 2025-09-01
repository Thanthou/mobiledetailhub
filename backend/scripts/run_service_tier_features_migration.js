const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running service_tier_features migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../database/migrations/affiliateDashboard/Services/migrations/create_service_tier_features.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Service tier features migration completed successfully!');
    
    // Verify the table was created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'service_tier_features'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ service_tier_features table created successfully');
    } else {
      console.log('❌ service_tier_features table was not created');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
