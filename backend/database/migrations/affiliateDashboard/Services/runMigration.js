// Load environment variables from backend root
const backendRoot = require('path').resolve(__dirname, '../../../../');
const envPath = require('path').join(backendRoot, '.env');
console.log('🔍 Backend root:', backendRoot);
console.log('🔍 Looking for .env at:', envPath);
require('dotenv').config({ path: envPath });

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Debug: Show what we're connecting to
console.log('🔍 Environment check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

// Database connection configuration - use same as main backend
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration(migrationFile) {
  try {
    console.log(`🚀 Starting migration: ${migrationFile}`);
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'migrations', migrationFile);
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration file not found: ${sqlPath}`);
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`📖 Read SQL file: ${migrationFile}`);
    
    // Execute the SQL
    console.log(`⚡ Executing migration...`);
    await pool.query(sql);
    
    console.log(`✅ Migration completed successfully: ${migrationFile}`);
    
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationFile}`);
    console.error('Error details:', error.message);
    throw error;
  }
}

async function runSeed(seedFile) {
  try {
    console.log(`🌱 Starting seed: ${seedFile}`);
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'seeds', seedFile);
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Seed file not found: ${sqlPath}`);
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`📖 Read seed file: ${seedFile}`);
    
    // Execute the SQL
    console.log(`⚡ Executing seed...`);
    await pool.query(sql);
    
    console.log(`✅ Seed completed successfully: ${seedFile}`);
    
  } catch (error) {
    console.error(`❌ Seed failed: ${seedFile}`);
    console.error('Error details:', error.message);
    throw error;
  }
}

async function main() {
  const command = process.argv[2];
  const file = process.argv[3];
  
  try {
    if (command === 'migrate' && file) {
      await runMigration(file);
    } else if (command === 'seed' && file) {
      await runSeed(file);
    } else if (command === 'setup') {
      // Run all migrations and seeds in order
      console.log('🚀 Setting up complete database structure...');
      
      // Run migrations
      await runMigration('vehicles.sql');
      await runMigration('categories.sql');
      await runMigration('services.sql');
      await runMigration('tiers.sql');
      
      // Run seeds
      await runSeed('vehicles.sql');
      await runSeed('categories.sql');
      
      console.log('🎉 Database setup completed successfully!');
    } else {
      console.log('Usage:');
      console.log('  node runMigration.js migrate <filename>  - Run a migration file');
      console.log('  node runMigration.js seed <filename>     - Run a seed file');
      console.log('  node runMigration.js setup               - Run all migrations and seeds');
      console.log('');
      console.log('Examples:');
      console.log('  node runMigration.js migrate vehicles.sql');
      console.log('  node runMigration.js seed vehicles.sql');
      console.log('  node runMigration.js setup');
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
