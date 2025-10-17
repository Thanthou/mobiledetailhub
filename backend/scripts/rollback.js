#!/usr/bin/env node
/**
 * Migration Rollback Script
 * - Safely rolls back the last applied migration
 * - Uses rollback SQL from system.schema_migrations table
 * - Includes safety checks and confirmation prompts
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

async function getLastMigration() {
  try {
    const { rows } = await pool.query(`
      SELECT filename, applied_at, rollback_sql 
      FROM system.schema_migrations 
      ORDER BY applied_at DESC 
      LIMIT 1
    `);
    return rows[0] || null;
  } catch (error) {
    log(`❌ Failed to get last migration: ${error.message}`, 'red');
    throw error;
  }
}

async function rollbackMigration(filename, rollbackSql) {
  if (!rollbackSql) {
    throw new Error(`No rollback SQL available for migration: ${filename}`);
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    log(`🔄 Rolling back ${filename}...`, 'blue');
    await client.query(rollbackSql);
    
    await client.query('DELETE FROM system.schema_migrations WHERE filename = $1', [filename]);
    
    await client.query('COMMIT');
    log(`✅ Successfully rolled back ${filename}`, 'green');
    
  } catch (error) {
    await client.query('ROLLBACK');
    log(`❌ Failed to rollback ${filename}: ${error.message}`, 'red');
    throw error;
  } finally {
    client.release();
  }
}

async function confirmRollback(migration) {
  const rl = createReadlineInterface();
  
  return new Promise((resolve) => {
    log(`\n⚠️  WARNING: You are about to rollback migration:`, 'yellow');
    log(`   File: ${migration.filename}`, 'bold');
    log(`   Applied: ${migration.applied_at}`, 'bold');
    log(`\nRollback SQL:`, 'cyan');
    log(migration.rollback_sql, 'cyan');
    log(`\nThis action cannot be undone!`, 'red');
    
    rl.question('\nAre you sure you want to proceed? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function listRecentMigrations() {
  try {
    const { rows } = await pool.query(`
      SELECT filename, applied_at, rollback_sql IS NOT NULL as has_rollback
      FROM system.schema_migrations 
      ORDER BY applied_at DESC 
      LIMIT 10
    `);
    
    if (rows.length === 0) {
      log('📋 No migrations found', 'yellow');
      return;
    }
    
    log('\n📋 Recent Migrations:', 'bold');
    log('===================', 'bold');
    
    rows.forEach((migration, index) => {
      const status = migration.has_rollback ? '✅' : '❌';
      const marker = index === 0 ? ' (LATEST)' : '';
      log(`${status} ${migration.filename}${marker}`, migration.has_rollback ? 'green' : 'red');
      log(`   Applied: ${migration.applied_at}`, 'cyan');
    });
    
  } catch (error) {
    log(`❌ Failed to list migrations: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'rollback';

  try {
    if (command === 'list') {
      await listRecentMigrations();
      await pool.end();
      return;
    }

    if (command === 'rollback') {
      const lastMigration = await getLastMigration();
      
      if (!lastMigration) {
        log('📋 No migrations to rollback', 'yellow');
        await pool.end();
        return;
      }

      if (!lastMigration.rollback_sql) {
        log(`❌ No rollback SQL available for migration: ${lastMigration.filename}`, 'red');
        log('   This migration cannot be safely rolled back.', 'yellow');
        await pool.end();
        return;
      }

      const confirmed = await confirmRollback(lastMigration);
      
      if (!confirmed) {
        log('❌ Rollback cancelled by user', 'yellow');
        await pool.end();
        return;
      }

      await rollbackMigration(lastMigration.filename, lastMigration.rollback_sql);
      log('\n🎉 Rollback completed successfully!', 'green');
    }

    await pool.end();
    
  } catch (error) {
    log(`\n❌ Rollback failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log('\n\n⚠️  Rollback interrupted by user', 'yellow');
  await pool.end();
  process.exit(0);
});

main();
