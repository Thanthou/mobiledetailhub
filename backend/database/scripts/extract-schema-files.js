#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

/**
 * Extract Schema Files from Database
 * 
 * This script queries the database and generates CREATE TABLE statements
 * for tables that don't have schema files yet.
 */

async function extractTableDefinition(client, schemaName, tableName) {
  // Get columns
  const columnsResult = await client.query(`
    SELECT 
      column_name,
      data_type,
      character_maximum_length,
      numeric_precision,
      numeric_scale,
      is_nullable,
      column_default,
      ordinal_position
    FROM information_schema.columns 
    WHERE table_schema = $1 AND table_name = $2
    ORDER BY ordinal_position;
  `, [schemaName, tableName]);

  // Get primary key
  const pkResult = await client.query(`
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY' 
      AND tc.table_schema = $1 
      AND tc.table_name = $2
    ORDER BY kcu.ordinal_position;
  `, [schemaName, tableName]);

  // Get foreign keys
  const fkResult = await client.query(`
    SELECT 
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      tc.constraint_name
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = $1 
      AND tc.table_name = $2
    ORDER BY kcu.ordinal_position;
  `, [schemaName, tableName]);

  // Get indexes
  const indexResult = await client.query(`
    SELECT 
      indexname,
      indexdef
    FROM pg_indexes 
    WHERE schemaname = $1 AND tablename = $2
      AND indexname NOT LIKE '%_pkey'
    ORDER BY indexname;
  `, [schemaName, tableName]);

  // Build CREATE TABLE statement
  let sql = `-- ${schemaName}.${tableName} table definition\n\n`;
  sql += `CREATE TABLE IF NOT EXISTS ${schemaName}.${tableName} (\n`;

  // Add columns
  const columnDefs = columnsResult.rows.map(col => {
    let def = `  ${col.column_name} `;
    
    // Data type
    if (col.data_type === 'character varying') {
      def += `VARCHAR(${col.character_maximum_length})`;
    } else if (col.data_type === 'timestamp with time zone') {
      def += 'TIMESTAMPTZ';
    } else if (col.data_type === 'timestamp without time zone') {
      def += 'TIMESTAMP';
    } else if (col.data_type === 'time without time zone') {
      def += 'TIME';
    } else if (col.data_type === 'USER-DEFINED') {
      def += col.udt_name || 'TEXT';
    } else {
      def += col.data_type.toUpperCase();
      if (col.character_maximum_length) {
        def += `(${col.character_maximum_length})`;
      } else if (col.numeric_precision) {
        def += `(${col.numeric_precision}`;
        if (col.numeric_scale) {
          def += `,${col.numeric_scale}`;
        }
        def += ')';
      }
    }
    
    // Nullable
    if (col.is_nullable === 'NO') {
      def += ' NOT NULL';
    }
    
    // Default value
    if (col.column_default) {
      def += ` DEFAULT ${col.column_default}`;
    }
    
    return def;
  });

  sql += columnDefs.join(',\n');

  // Add primary key constraint
  if (pkResult.rows.length > 0) {
    const pkColumns = pkResult.rows.map(r => r.column_name).join(', ');
    sql += `,\n  PRIMARY KEY (${pkColumns})`;
  }

  sql += '\n);\n';

  // Add foreign key constraints
  if (fkResult.rows.length > 0) {
    sql += '\n-- Foreign Keys\n';
    fkResult.rows.forEach(fk => {
      sql += `ALTER TABLE ${schemaName}.${tableName}\n`;
      sql += `  ADD CONSTRAINT ${fk.constraint_name}\n`;
      sql += `  FOREIGN KEY (${fk.column_name})\n`;
      sql += `  REFERENCES ${fk.foreign_table_schema}.${fk.foreign_table_name}(${fk.foreign_column_name});\n\n`;
    });
  }

  // Add indexes
  if (indexResult.rows.length > 0) {
    sql += '-- Indexes\n';
    indexResult.rows.forEach(idx => {
      sql += `${idx.indexdef};\n`;
    });
    sql += '\n';
  }

  // Add helpful comment
  sql += `-- Table created: ${new Date().toISOString()}\n`;
  sql += `-- Extracted from database\n`;

  return sql;
}

async function extractSchemaFiles() {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  
  try {
    console.log('🔍 Extracting updated schema files from current database state...\n');
    
    // Tables to extract (updated schemas from this session)
    const tablesToExtract = [
      // Auth schema (migration 005)
      { schema: 'auth', table: 'users' },
      { schema: 'auth', table: 'login_attempts' },
      
      // System schema (migration 006)
      { schema: 'system', table: 'health_monitoring' },
      
      // Tenants schema (migration 004)
      { schema: 'tenants', table: 'business' },
      
      // Reputation schema (tier 1 feature - verify current state)
      { schema: 'reputation', table: 'reviews' },
      { schema: 'reputation', table: 'review_replies' },
      { schema: 'reputation', table: 'review_votes' },
      
      // Website schema (migration 007 - redesigned)
      { schema: 'website', table: 'content' }
    ];
    
    for (const { schema, table } of tablesToExtract) {
      console.log(`📝 Extracting ${schema}.${table}...`);
      
      const sql = await extractTableDefinition(client, schema, table);
      
      // Create directory if it doesn't exist
      const dir = path.join(__dirname, '../schemas', schema);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   Created directory: ${schema}/`);
      }
      
      // Write file (overwrites existing)
      const filePath = path.join(dir, `${table}.sql`);
      fs.writeFileSync(filePath, sql);
      console.log(`   ✅ Updated: schemas/${schema}/${table}.sql`);
    }
    
    console.log('\n✅ All schema files extracted successfully!\n');
    
  } catch (error) {
    console.error('❌ Error extracting schema files:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

extractSchemaFiles();

