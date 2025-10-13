/**
 * Tenant Onboarding Migration Runner
 * Runs the 3 migration files to add tenant onboarding tables
 * 
 * Usage: node backend/database/scripts/run-tenant-migrations.js
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('../pool');

const MIGRATIONS = [
  {
    file: '001_add_tenant_applications.sql',
    description: 'Add tenant_applications table'
  },
  {
    file: '002_add_subscriptions.sql',
    description: 'Add subscriptions table'
  },
  {
    file: '003_alter_business_add_subscription_fields.sql',
    description: 'Add subscription fields to business table'
  }
];

async function runMigrations() {
  console.log('🚀 Starting Tenant Onboarding Migrations...\n');

  let successCount = 0;
  let failCount = 0;

  for (const migration of MIGRATIONS) {
    try {
      console.log(`📝 Running: ${migration.file}`);
      console.log(`   ${migration.description}`);

      const sqlPath = path.join(__dirname, '../migrations', migration.file);
      const sql = fs.readFileSync(sqlPath, 'utf8');

      await pool.query(sql);

      console.log(`✅ Success: ${migration.file}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${migration.file}`);
      console.error(`   Error: ${error.message}\n`);
      failCount++;

      // Continue with other migrations even if one fails
      // (They use IF NOT EXISTS so they're idempotent)
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   Total: ${MIGRATIONS.length}`);

  if (failCount === 0) {
    console.log('\n🎉 All migrations completed successfully!');
  } else {
    console.log('\n⚠️  Some migrations failed. Check errors above.');
  }

  await pool.end();
}

// Execute migrations
runMigrations().catch((error) => {
  console.error('\n💥 Migration runner failed!');
  console.error('Error:', error.message);
  process.exit(1);
});

