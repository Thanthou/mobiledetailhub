#!/usr/bin/env node

/**
 * Migration Status Checker
 * 
 * Checks migration files and provides status without requiring database connection
 * 
 * Usage: node database/scripts/check-migrations.js
 */

const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../migrations');

/**
 * Parse migration filename to extract timestamp and description
 */
function parseMigrationFile(filename) {
  const match = filename.match(/^(\d{14})_(.+)\.sql$/);
  if (!match) {
    return null;
  }
  
  const [, timestamp, description] = match;
  return {
    filename,
    timestamp: parseInt(timestamp),
    description: description.replace(/_/g, ' '),
    date: new Date(
      timestamp.slice(0, 4), // year
      parseInt(timestamp.slice(4, 6)) - 1, // month (0-indexed)
      timestamp.slice(6, 8), // day
      timestamp.slice(8, 10), // hour
      timestamp.slice(10, 12), // minute
      timestamp.slice(12, 14) // second
    )
  };
}

/**
 * Check migration file format and content
 */
function checkMigrationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for header comment
  if (!content.includes('-- Migration:')) {
    issues.push('Missing migration header comment');
  }
  
  // Check for rollback instructions
  if (!content.includes('-- ROLLBACK:')) {
    issues.push('Missing rollback instructions');
  }
  
  // Check for SQL content
  const sqlLines = content.split('\n').filter(line => 
    line.trim() && 
    !line.trim().startsWith('--') && 
    !line.trim().startsWith('/*') &&
    !line.trim().startsWith('*')
  );
  
  if (sqlLines.length === 0) {
    issues.push('No SQL content found');
  }
  
  return {
    hasIssues: issues.length > 0,
    issues
  };
}

/**
 * Main function
 */
function main() {
  console.log('📊 Migration File Analysis\n');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('❌ Migrations directory not found:', migrationsDir);
    process.exit(1);
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (files.length === 0) {
    console.log('📁 No migration files found');
    return;
  }
  
  console.log(`Found ${files.length} migration files:\n`);
  
  let validCount = 0;
  let invalidCount = 0;
  
  files.forEach((filename, _index) => {
    const parsed = parseMigrationFile(filename);
    const filePath = path.join(migrationsDir, filename);
    const check = checkMigrationFile(filePath);
    
    if (!parsed) {
      console.log(`❌ ${filename}`);
      console.log(`   Invalid filename format (should be YYYYMMDD_HHMMSS_description.sql)`);
      invalidCount++;
      return;
    }
    
    if (check.hasIssues) {
      console.log(`⚠️  ${filename}`);
      console.log(`   Description: ${parsed.description}`);
      console.log(`   Date: ${parsed.date.toISOString()}`);
      console.log(`   Issues: ${check.issues.join(', ')}`);
      invalidCount++;
    } else {
      console.log(`✅ ${filename}`);
      console.log(`   Description: ${parsed.description}`);
      console.log(`   Date: ${parsed.date.toISOString()}`);
      validCount++;
    }
    
    console.log('');
  });
  
  // Check for duplicate timestamps
  const timestamps = files
    .map(f => parseMigrationFile(f))
    .filter(p => p)
    .map(p => p.timestamp);
  
  const duplicates = timestamps.filter((timestamp, index) => 
    timestamps.indexOf(timestamp) !== index
  );
  
  if (duplicates.length > 0) {
    console.log('⚠️  Duplicate timestamps found:');
    duplicates.forEach(timestamp => {
      const duplicateFiles = files.filter(f => {
        const parsed = parseMigrationFile(f);
        return parsed && parsed.timestamp === timestamp;
      });
      console.log(`   ${timestamp}: ${duplicateFiles.join(', ')}`);
    });
    console.log('');
  }
  
  // Summary
  console.log('📈 Summary:');
  console.log(`   Total files: ${files.length}`);
  console.log(`   Valid: ${validCount}`);
  console.log(`   Invalid: ${invalidCount}`);
  
  if (duplicates.length > 0) {
    console.log(`   Duplicate timestamps: ${duplicates.length}`);
  }
  
  if (invalidCount === 0 && duplicates.length === 0) {
    console.log('\n✨ All migration files are properly formatted!');
  } else {
    console.log('\n🔧 Some migration files need attention.');
  }
  
  // Migration naming convention reminder
  console.log('\n📝 Migration Naming Convention:');
  console.log('   Format: YYYYMMDD_HHMMSS_descriptive_name.sql');
  console.log('   Example: 20241220_143022_add_user_authentication.sql');
  console.log('   Requirements:');
  console.log('   - 14-digit timestamp (YYYYMMDDHHMMSS)');
  console.log('   - Underscore separator');
  console.log('   - Descriptive name in snake_case');
  console.log('   - .sql extension');
}

if (require.main === module) {
  main();
}

module.exports = {
  parseMigrationFile,
  checkMigrationFile
};
