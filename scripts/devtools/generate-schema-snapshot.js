#!/usr/bin/env node

/**
 * Generate Database Schema Snapshot
 * 
 * Queries the current database structure and generates a JSON snapshot.
 * This snapshot is used by audit scripts for validation without querying the DB.
 * 
 * Usage:
 *   node scripts/devtools/generate-schema-snapshot.js
 *   npm run db:snapshot (if added to package.json)
 * 
 * Output:
 *   backend/schemas/current-schema.json
 */

import dotenv from 'dotenv';
import { getPool } from '../../backend/database/pool.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Explicitly load .env from project root
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../..');
const outputPath = join(rootDir, 'backend/schemas/current-schema.json');

async function generateSnapshot() {
  console.log(chalk.blue.bold('📸 Generating Database Schema Snapshot\n'));
  
  let pool;
  try {
    pool = await getPool();
    console.log(chalk.green('✅ Connected to database'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to connect to database:'), error.message);
    process.exit(1);
  }
  
  const snapshot = {
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    database_version: null,
    schemas: {}
  };
  
  try {
    // Get database version
    const versionResult = await pool.query('SELECT version()');
    snapshot.database_version = versionResult.rows[0].version;
    console.log(chalk.gray(`   Database: ${snapshot.database_version.split(',')[0]}`));
    
    // Get all non-system schemas
    console.log(chalk.blue('\n📋 Querying schemas...'));
    const schemasResult = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    
    const schemas = schemasResult.rows.map(row => row.schema_name);
    console.log(chalk.green(`✅ Found ${schemas.length} schemas: ${schemas.join(', ')}`));
    
    // For each schema, get tables, columns, indexes, and constraints
    for (const schemaName of schemas) {
      console.log(chalk.blue(`\n📊 Processing schema: ${chalk.cyan(schemaName)}`));
      
      snapshot.schemas[schemaName] = {
        tables: []
      };
      
      // Get tables in this schema
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `, [schemaName]);
      
      console.log(chalk.gray(`   Tables: ${tablesResult.rows.length}`));
      
      // For each table, get detailed info
      for (const tableRow of tablesResult.rows) {
        const tableName = tableRow.table_name;
        
        // Get columns
        const columnsResult = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2
          ORDER BY ordinal_position
        `, [schemaName, tableName]);
        
        // Get indexes
        const indexesResult = await pool.query(`
          SELECT indexname, indexdef
          FROM pg_indexes
          WHERE schemaname = $1 AND tablename = $2
          ORDER BY indexname
        `, [schemaName, tableName]);
        
        // Get constraints
        const constraintsResult = await pool.query(`
          SELECT 
            tc.constraint_name,
            tc.constraint_type,
            STRING_AGG(kcu.column_name, ', ') as columns
          FROM information_schema.table_constraints tc
          LEFT JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          WHERE tc.table_schema = $1 AND tc.table_name = $2
          GROUP BY tc.constraint_name, tc.constraint_type
          ORDER BY tc.constraint_type, tc.constraint_name
        `, [schemaName, tableName]);
        
        // Build table info
        const tableInfo = {
          name: tableName,
          columns: columnsResult.rows.map(col => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES',
            default: col.column_default
          })),
          indexes: indexesResult.rows.map(idx => ({
            name: idx.indexname,
            definition: idx.indexdef
          })),
          constraints: constraintsResult.rows.map(con => ({
            name: con.constraint_name,
            type: con.constraint_type,
            columns: con.columns
          }))
        };
        
        snapshot.schemas[schemaName].tables.push(tableInfo);
      }
      
      console.log(chalk.green(`   ✅ Processed ${tablesResult.rows.length} tables`));
    }
    
    // Create output directory if it doesn't exist
    mkdirSync(dirname(outputPath), { recursive: true });
    
    // Write snapshot to file
    writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), 'utf-8');
    
    console.log(chalk.green.bold('\n✅ Schema snapshot generated successfully!'));
    console.log(chalk.gray(`   Location: ${outputPath}`));
    console.log(chalk.gray(`   Schemas: ${schemas.length}`));
    console.log(chalk.gray(`   Total tables: ${Object.values(snapshot.schemas).reduce((sum, s) => sum + s.tables.length, 0)}`));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to generate snapshot:'), error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the generator
generateSnapshot().catch(error => {
  console.error(chalk.red('❌ Snapshot generation failed:'), error);
  process.exit(1);
});

