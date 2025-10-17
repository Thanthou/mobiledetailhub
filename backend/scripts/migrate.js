#!/usr/bin/env node
/**
 * Migration Runner
 * - Tracks applied migrations in system.schema_migrations
 * - Runs new ones automatically in timestamp order
 * - Includes safety checks and rollback capabilities
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');

// ANSI color codes for pretty output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function ensureMigrationsTable() {
  try {
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS system;
    `);
    
    // Check if table exists and what structure it has
    const { rows } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'system' 
      AND table_name = 'schema_migrations'
    `);
    
    const hasFilename = rows.some(row => row.column_name === 'filename');
    
    if (rows.length === 0) {
      // Table doesn't exist, create it with new structure
      log('🔄 Creating new migrations table...', 'yellow');
      await pool.query(`
        CREATE TABLE system.schema_migrations (
          id SERIAL PRIMARY KEY,
          filename TEXT UNIQUE NOT NULL,
          applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          checksum TEXT,
          rollback_sql TEXT
        );
      `);
      
      // Create indexes
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_schema_migrations_filename 
        ON system.schema_migrations(filename);
      `);
      
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at 
        ON system.schema_migrations(applied_at);
      `);
    } else if (!hasFilename) {
      // Table exists but has old structure - let the migration handle it
      log('⚠️  Old migrations table detected - will be updated by migration', 'yellow');
    }
    
    log('✅ Migrations table ready', 'green');
  } catch (error) {
    log(`❌ Failed to create migrations table: ${error.message}`, 'red');
    throw error;
  }
}

async function getAppliedMigrations() {
  try {
    const { rows } = await pool.query('SELECT filename, checksum FROM system.schema_migrations ORDER BY applied_at');
    return rows;
  } catch (error) {
    log(`❌ Failed to get applied migrations: ${error.message}`, 'red');
    throw error;
  }
}

async function calculateChecksum(content) {
  const crypto = await import('crypto');
  return crypto.createHash('md5').update(content).digest('hex');
}

async function applyMigration(filename) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filePath}`);
  }

  const sql = fs.readFileSync(filePath, 'utf8');
  const checksum = await calculateChecksum(sql);
  
  // Check if migration was already applied with different content
  const { rows } = await pool.query('SELECT checksum FROM system.schema_migrations WHERE filename = $1', [filename]);
  if (rows.length > 0 && rows[0].checksum !== checksum) {
    log(`⚠️  Warning: Migration ${filename} was already applied with different content!`, 'yellow');
    log(`   Previous checksum: ${rows[0].checksum}`, 'yellow');
    log(`   Current checksum:  ${checksum}`, 'yellow');
    log(`   Skipping to prevent data corruption...`, 'yellow');
    return;
  }

  if (rows.length > 0) {
    log(`⏭️  Skipping ${filename} (already applied)`, 'cyan');
    return;
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    log(`🟢 Applying ${filename}...`, 'blue');
    await client.query(sql);
    
    // Extract rollback SQL if present (look for -- ROLLBACK: comment)
    const rollbackMatch = sql.match(/--\s*ROLLBACK:\s*([\s\S]*?)(?=\n--|\n$|$)/i);
    const rollbackSql = rollbackMatch ? rollbackMatch[1].trim() : null;
    
    // Check if we need to insert with version or without
    const { rows: tableInfo } = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'system' 
      AND table_name = 'schema_migrations'
      AND column_name = 'version'
    `);
    
    if (tableInfo.length > 0) {
      // Old table structure - insert with version
      const version = filename.replace('.sql', '').replace(/_/g, '-');
      await client.query(
        'INSERT INTO system.schema_migrations (version, filename, checksum, rollback_sql, description) VALUES ($1, $2, $3, $4, $5)',
        [version, filename, checksum, rollbackSql, `Migration: ${filename}`]
      );
    } else {
      // New table structure - insert without version
      await client.query(
        'INSERT INTO system.schema_migrations (filename, checksum, rollback_sql) VALUES ($1, $2, $3)',
        [filename, checksum, rollbackSql]
      );
    }
    
    await client.query('COMMIT');
    log(`✅ Applied ${filename}`, 'green');
    
  } catch (error) {
    await client.query('ROLLBACK');
    log(`❌ Failed to apply ${filename}: ${error.message}`, 'red');
    throw error;
  } finally {
    client.release();
  }
}

async function listMigrations() {
  const applied = await getAppliedMigrations();
  const all = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  log('\n📋 Migration Status:', 'bold');
  log('==================', 'bold');
  
  for (const file of all) {
    const appliedMigration = applied.find(m => m.filename === file);
    if (appliedMigration) {
      log(`✅ ${file} (applied ${appliedMigration.applied_at})`, 'green');
    } else {
      log(`⏳ ${file} (pending)`, 'yellow');
    }
  }
  
  const pending = all.filter(f => !applied.find(m => m.filename === f));
  log(`\n📊 Summary: ${applied.length} applied, ${pending.length} pending`, 'cyan');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';

  try {
    await ensureMigrationsTable();

    if (command === 'list') {
      await listMigrations();
      await pool.end();
      return;
    }

    if (command === 'migrate') {
      const applied = await getAppliedMigrations();
      const all = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort();

      const pending = all.filter(f => !applied.find(m => m.filename === f));
      
      if (!pending.length) {
        log('✅ No new migrations to apply.', 'green');
        await pool.end();
        return;
      }

      log(`🚀 Found ${pending.length} pending migration(s):`, 'bold');
      pending.forEach(file => log(`   - ${file}`, 'cyan'));

      for (const file of pending) {
        await applyMigration(file);
      }

      log('\n🎉 All migrations applied successfully!', 'green');
    }

    await pool.end();
    
  } catch (error) {
    log(`\n❌ Migration failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log('\n\n⚠️  Migration interrupted by user', 'yellow');
  await pool.end();
  process.exit(0);
});

main();
