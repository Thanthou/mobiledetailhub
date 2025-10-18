#!/usr/bin/env node
/**
 * Debug migrations table structure
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

async function debugTable() {
  try {
    console.log('🔍 Debugging migrations table...');
    
    // Check table structure
    const { rows } = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'system' 
      AND table_name = 'schema_migrations'
      ORDER BY ordinal_position
    `);
    
    console.log('Table structure:');
    rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check existing data
    const { rows: dataRows } = await pool.query(`
      SELECT * FROM system.schema_migrations LIMIT 3
    `);
    
    console.log('\nExisting data:');
    console.log(dataRows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

debugTable();
