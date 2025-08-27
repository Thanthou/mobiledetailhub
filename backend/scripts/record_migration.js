#!/usr/bin/env node

/**
 * Utility script to record database migrations
 * Usage: node scripts/record_migration.js <version> <description> [checksum] [execution_time_ms]
 * 
 * Example: node scripts/record_migration.js "1.0.1" "Add user preferences table" "abc123" 1500
 */

const { migrationTracker } = require('../utils/migrationTracker');
const logger = require('../utils/logger');

async function recordMigration() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: node scripts/record_migration.js <version> <description> [checksum] [execution_time_ms]');
    console.error('Example: node scripts/record_migration.js "1.0.1" "Add user preferences table"');
    process.exit(1);
  }
  
  const [version, description, checksum, executionTime] = args;
  
  try {
    console.log('🔄 Recording migration...');
    console.log(`Version: ${version}`);
    console.log(`Description: ${description}`);
    if (checksum) console.log(`Checksum: ${checksum}`);
    if (executionTime) console.log(`Execution time: ${executionTime}ms`);
    
    await migrationTracker.initialize();
    await migrationTracker.recordMigration(version, description, checksum, executionTime ? parseInt(executionTime) : null);
    
    console.log('✅ Migration recorded successfully!');
    
    // Show current status
    const status = await migrationTracker.getStatus();
    console.log('\n📊 Current migration status:');
    console.log(`Current version: ${status.currentVersion}`);
    console.log(`Total migrations: ${status.totalMigrations}`);
    console.log(`Last applied: ${status.lastApplied}`);
    
  } catch (error) {
    console.error('❌ Failed to record migration:', error.message);
    logger.error('Failed to record migration via script:', { 
      version, 
      description, 
      error: error.message 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  recordMigration();
}

module.exports = { recordMigration };
