#!/usr/bin/env node

/**
 * Database Migration Manager
 * 
 * Manages database migrations with proper naming conventions and tracking
 * 
 * Usage:
 *   node database/scripts/migrate.js status          # Show migration status
 *   node database/scripts/migrate.js up              # Run all pending migrations
 *   node database/scripts/migrate.js down            # Rollback last migration
 *   node database/scripts/migrate.js create <name>   # Create new migration
 *   node database/scripts/migrate.js reset           # Reset all migrations
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbConfig);
const migrationsDir = path.join(__dirname, '../migrations');

/**
 * Migration naming convention:
 * YYYYMMDD_HHMMSS_descriptive_name.sql
 * Example: 20241220_143022_add_user_authentication.sql
 */
function generateMigrationName(description) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const slug = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
  
  return `${timestamp}_${slug}.sql`;
}

/**
 * Get all migration files sorted by timestamp
 */
function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }
  
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

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
    description: description.replace(/_/g, ' ')
  };
}

/**
 * Initialize migration tracking table
 */
async function initializeMigrationTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        checksum VARCHAR(64),
        execution_time INTEGER,
        filename VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    
    console.log('✅ Migration tracking table initialized');
  } catch (error) {
    console.error('❌ Failed to initialize migration table:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get applied migrations from database
 */
async function getAppliedMigrations() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT version, description, applied_at, checksum, filename
      FROM schema_migrations 
      ORDER BY applied_at ASC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('❌ Failed to get applied migrations:', error.message);
    return [];
  } finally {
    client.release();
  }
}

/**
 * Calculate file checksum
 */
function calculateChecksum(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Show migration status
 */
async function showStatus() {
  console.log('📊 Migration Status\n');
  
  await initializeMigrationTable();
  
  const migrationFiles = getMigrationFiles();
  const appliedMigrations = await getAppliedMigrations();
  
  const appliedFilenames = new Set(appliedMigrations.map(m => m.filename));
  
  console.log('Migration Files:');
  migrationFiles.forEach(file => {
    const parsed = parseMigrationFile(file);
    if (!parsed) {
      console.log(`  ❌ ${file} (invalid format)`);
      return;
    }
    
    const isApplied = appliedFilenames.has(file);
    const status = isApplied ? '✅' : '⏳';
    console.log(`  ${status} ${file} - ${parsed.description}`);
  });
  
  console.log(`\nTotal: ${migrationFiles.length} files, ${appliedMigrations.length} applied`);
  
  const pending = migrationFiles.filter(f => !appliedFilenames.has(f));
  if (pending.length > 0) {
    console.log(`\n⏳ Pending migrations: ${pending.length}`);
    pending.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('\n✅ All migrations are up to date');
  }
}

/**
 * Run pending migrations
 */
async function runMigrations() {
  console.log('🚀 Running pending migrations...\n');
  
  await initializeMigrationTable();
  
  const migrationFiles = getMigrationFiles();
  const appliedMigrations = await getAppliedMigrations();
  const appliedFilenames = new Set(appliedMigrations.map(m => m.filename));
  
  const pending = migrationFiles.filter(f => !appliedFilenames.has(f));
  
  if (pending.length === 0) {
    console.log('✅ No pending migrations');
    return;
  }
  
  for (const filename of pending) {
    await runMigration(filename);
  }
  
  console.log(`\n✨ Completed ${pending.length} migrations`);
}

/**
 * Run a single migration
 */
async function runMigration(filename) {
  const client = await pool.connect();
  const startTime = Date.now();
  
  try {
    console.log(`🔄 Running: ${filename}`);
    
    const migrationPath = path.join(migrationsDir, filename);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const checksum = calculateChecksum(migrationPath);
    
    // Run the migration
    await client.query(sql);
    
    const executionTime = Date.now() - startTime;
    const parsed = parseMigrationFile(filename);
    
    // Record the migration
    await client.query(`
      INSERT INTO schema_migrations (version, description, checksum, execution_time, filename)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      parsed.timestamp.toString(),
      parsed.description,
      checksum,
      executionTime,
      filename
    ]);
    
    console.log(`  ✅ Completed in ${executionTime}ms`);
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Rollback last migration
 */
async function rollbackMigration() {
  console.log('⏪ Rolling back last migration...\n');
  
  const client = await pool.connect();
  try {
    // Get the last applied migration
    const result = await client.query(`
      SELECT filename, description 
      FROM schema_migrations 
      ORDER BY applied_at DESC 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No migrations to rollback');
      return;
    }
    
    const { filename, description } = result.rows[0];
    console.log(`🔄 Rolling back: ${filename} - ${description}`);
    
    // Note: This is a simple implementation
    // In production, you'd want to implement proper rollback logic
    console.log('⚠️  Rollback not implemented - manual intervention required');
    console.log(`   Migration: ${filename}`);
    console.log(`   Description: ${description}`);
    
  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Create a new migration file
 */
function createMigration(description) {
  const filename = generateMigrationName(description);
  const filePath = path.join(migrationsDir, filename);
  
  const template = `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Add your migration SQL here
-- Example:
-- CREATE TABLE example_table (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Remember to include rollback instructions in comments
-- ROLLBACK:
-- DROP TABLE IF EXISTS example_table;
`;

  fs.writeFileSync(filePath, template);
  console.log(`✅ Created migration: ${filename}`);
  console.log(`   Path: ${filePath}`);
}

/**
 * Reset all migrations (DANGEROUS - for development only)
 */
async function resetMigrations() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot reset migrations in production');
    return;
  }
  
  console.log('⚠️  Resetting all migrations (development only)...\n');
  
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM schema_migrations');
    console.log('✅ Migration history cleared');
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  try {
    switch (command) {
      case 'status':
        await showStatus();
        break;
      case 'up':
        await runMigrations();
        break;
      case 'down':
        await rollbackMigration();
        break;
      case 'create':
        if (!arg) {
          console.error('❌ Please provide a migration description');
          console.log('Usage: node migrate.js create "add user authentication"');
          process.exit(1);
        }
        createMigration(arg);
        break;
      case 'reset':
        await resetMigrations();
        break;
      default:
        console.log('Database Migration Manager\n');
        console.log('Usage:');
        console.log('  node migrate.js status          # Show migration status');
        console.log('  node migrate.js up              # Run all pending migrations');
        console.log('  node migrate.js down            # Rollback last migration');
        console.log('  node migrate.js create <name>   # Create new migration');
        console.log('  node migrate.js reset           # Reset all migrations');
        break;
    }
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateMigrationName,
  getMigrationFiles,
  parseMigrationFile,
  runMigration,
  showStatus
};
