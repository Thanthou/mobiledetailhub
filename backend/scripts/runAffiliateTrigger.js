const fs = require('fs');
const path = require('path');

// Load environment variables first
const envPath = path.join(__dirname, '../.env');
console.log(`🔍 Looking for .env file at: ${envPath}`);
console.log(`🔍 Current directory: ${__dirname}`);

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found!');
  require('dotenv').config({ path: envPath });
} else {
  console.log('❌ .env file not found at expected location');
  // Try alternative locations
  const altPaths = [
    path.join(__dirname, '../../.env'),
    path.join(__dirname, '.env'),
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'backend/.env')
  ];
  
  for (const altPath of altPaths) {
    if (fs.existsSync(altPath)) {
      console.log(`✅ .env file found at: ${altPath}`);
      require('dotenv').config({ path: altPath });
      break;
    }
  }
}

// Now create the database connection after environment variables are loaded
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'MobileDetailHub'}`,
});

async function runScript(scriptName) {
  try {
    console.log(`\n🚀 Running ${scriptName}...`);
    
    const sqlPath = path.join(__dirname, scriptName);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // For PostgreSQL functions, we need to execute the entire SQL as one statement
    // since splitting by semicolons breaks dollar-quoted strings
    try {
      await pool.query(sql);
      console.log(`✅ ${scriptName} executed successfully`);
    } catch (error) {
      // Skip certain errors that are expected (like DROP TRIGGER IF EXISTS)
      if (error.message.includes('does not exist') || error.message.includes('already exists')) {
        console.log(`⚠️  ${scriptName}: ${error.message}`);
      } else {
        throw error;
      }
    }
    
    console.log(`\n🎉 ${scriptName} completed successfully!`);
    
  } catch (error) {
    console.error(`\n❌ Error running ${scriptName}:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🔧 Setting up Affiliate Approval Trigger System...\n');
    
    // Debug environment variables (without showing passwords)
    console.log('🔍 Environment check:');
    console.log(`   DB_HOST: ${process.env.DB_HOST || 'not set'}`);
    console.log(`   DB_PORT: ${process.env.DB_PORT || 'not set'}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME || 'not set'}`);
    console.log(`   DB_USER: ${process.env.DB_USER || 'not set'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***set***' : 'not set'}`);
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '***set***' : 'not set'}`);
    console.log('');
    
    // Test database connection first
    console.log('🔍 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!\n');
    
    // Run the trigger creation script
    await runScript('create_affiliate_approval_trigger.sql');
    
    // Run the backfill script
    await runScript('backfill_affiliate_service_areas.sql');
    
    console.log('\n🎯 All scripts completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Approve any pending affiliate applications');
    console.log('2. Check affiliate_service_areas table to verify data was populated');
    console.log('3. Test location lookup on your main site');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Make sure your .env file exists in the backend directory');
    console.error('2. Check that DB_PASSWORD or DATABASE_URL is set correctly');
    console.error('3. Verify your database is running and accessible');
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Received SIGINT, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Received SIGTERM, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

main();
