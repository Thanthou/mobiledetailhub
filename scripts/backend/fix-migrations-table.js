#!/usr/bin/env node
/**
 * Fix migrations table structure
 * This script fixes the old migrations table to work with the new system
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
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

async function fixMigrationsTable() {
  try {
    console.log('🔧 Fixing migrations table structure...');
    
    // Check if table exists
    const { rows } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'system' 
      AND table_name = 'schema_migrations'
    `);
    
    if (rows.length === 0) {
      console.log('✅ No migrations table found - will be created by migration system');
      return;
    }
    
    const hasFilename = rows.some(row => row.column_name === 'filename');
    
    if (hasFilename) {
      console.log('✅ Migrations table already has new structure');
      return;
    }
    
    console.log('🔄 Updating old migrations table...');
    
    // Make version column nullable
    await pool.query(`
      ALTER TABLE system.schema_migrations 
      ALTER COLUMN version DROP NOT NULL;
    `);
    
    // Add new columns
    await pool.query(`
      ALTER TABLE system.schema_migrations 
      ADD COLUMN IF NOT EXISTS filename TEXT,
      ADD COLUMN IF NOT EXISTS checksum TEXT,
      ADD COLUMN IF NOT EXISTS rollback_sql TEXT;
    `);
    
    // Migrate existing data
    await pool.query(`
      UPDATE system.schema_migrations 
      SET filename = version || '_migration.sql'
      WHERE filename IS NULL AND version IS NOT NULL;
    `);
    
    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_schema_migrations_filename 
      ON system.schema_migrations(filename);
    `);
    
    console.log('✅ Migrations table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to fix migrations table:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

fixMigrationsTable();
