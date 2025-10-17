#!/usr/bin/env node
/**
 * Fix version column constraint
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

async function fixVersionColumn() {
  try {
    console.log('🔧 Fixing version column constraint...');
    
    // Make version column nullable
    await pool.query(`
      ALTER TABLE system.schema_migrations 
      ALTER COLUMN version DROP NOT NULL;
    `);
    
    console.log('✅ Version column is now nullable');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixVersionColumn();
