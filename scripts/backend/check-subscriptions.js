#!/usr/bin/env node
/**
 * Check subscriptions table structure
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function checkSubscriptions() {
  try {
    console.log('🔍 Checking subscriptions table structure...\n');
    
    // Check table structure
    const { rows } = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'tenants' 
      AND table_name = 'subscriptions'
      ORDER BY ordinal_position
    `);
    
    console.log('Subscriptions table columns:');
    rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check existing data
    const { rows: dataRows } = await pool.query(`
      SELECT * FROM tenants.subscriptions LIMIT 3
    `);
    
    console.log('\nExisting subscriptions:');
    console.log(dataRows.length ? dataRows : 'No subscriptions found');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSubscriptions();

