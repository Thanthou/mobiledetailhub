#!/usr/bin/env node

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ThatSmartSite',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

/**
 * Quick Database Inspector
 * Usage:
 *   node db-quick-inspect.js           (default: level 2)
 *   node db-quick-inspect.js 1         (schemas only)
 *   node db-quick-inspect.js 2         (schemas + tables)
 *   node db-quick-inspect.js 3         (schemas + tables + columns)
 */

async function inspectDatabase(level = 2) {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  
  try {
    console.log(`\n🔍 Database: ${dbConfig.database}`);
    console.log('='.repeat(60));
    
    // LEVEL 1: Schemas only
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);
    
    console.log('\n📁 SCHEMAS:');
    schemasResult.rows.forEach(row => {
      console.log(`   • ${row.schema_name}`);
    });
    
    if (level < 2) {
      console.log('\n✅ Done!\n');
      return;
    }
    
    // LEVEL 2: Schemas + Tables
    const tablesResult = await client.query(`
      SELECT 
        schemaname,
        tablename
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schemaname, tablename;
    `);
    
    console.log('\n📋 TABLES BY SCHEMA:');
    let currentSchema = '';
    tablesResult.rows.forEach(row => {
      if (row.schemaname !== currentSchema) {
        currentSchema = row.schemaname;
        console.log(`\n   ${currentSchema}/`);
      }
      console.log(`      └─ ${row.tablename}`);
    });
    
    if (level < 3) {
      console.log('\n✅ Done!\n');
      return;
    }
    
    // LEVEL 3: Schemas + Tables + Columns
    console.log('\n🔧 COLUMNS BY TABLE:');
    console.log('='.repeat(60));
    
    for (const table of tablesResult.rows) {
      console.log(`\n   ${table.schemaname}.${table.tablename}`);
      
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
      `, [table.schemaname, table.tablename]);
      
      columnsResult.rows.forEach(col => {
        let type = col.data_type;
        if (col.character_maximum_length) {
          type += `(${col.character_maximum_length})`;
        }
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` = ${col.column_default.substring(0, 30)}` : '';
        
        console.log(`      • ${col.column_name}: ${type} ${nullable}${defaultVal}`);
      });
    }
    
    console.log('\n✅ Done!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

// Get level from command line argument
const level = parseInt(process.argv[2]) || 3;
if (![1, 2, 3].includes(level)) {
  console.error('Invalid level. Use 1, 2, or 3.');
  console.error('Usage:');
  console.error('  node db-quick-inspect.js     (default: level 2)');
  console.error('  node db-quick-inspect.js 1   (schemas only)');
  console.error('  node db-quick-inspect.js 2   (schemas + tables)');
  console.error('  node db-quick-inspect.js 3   (schemas + tables + columns)');
  process.exit(1);
}

inspectDatabase(level);

