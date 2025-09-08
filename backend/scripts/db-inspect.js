#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function inspectDatabase() {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  
  try {
    console.log('🔍 Complete Database Inspection\n');
    console.log('=' .repeat(60));
    
    // Get all schemas
    console.log('\n📁 SCHEMAS:');
    console.log('-'.repeat(40));
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);
    
    schemasResult.rows.forEach(row => {
      console.log(`   • ${row.schema_name}`);
    });
    
    // Get all tables with their schemas
    console.log('\n📋 TABLES BY SCHEMA:');
    console.log('-'.repeat(40));
    const tablesResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        tableowner
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schemaname, tablename;
    `);
    
    let currentSchema = '';
    tablesResult.rows.forEach(row => {
      if (row.schemaname !== currentSchema) {
        currentSchema = row.schemaname;
        console.log(`\n   📂 ${currentSchema}:`);
      }
      console.log(`      • ${row.tablename} (owner: ${row.tableowner})`);
    });
    
    // Get detailed column information for each table
    console.log('\n🔧 DETAILED TABLE STRUCTURES:');
    console.log('=' .repeat(60));
    
    for (const table of tablesResult.rows) {
      console.log(`\n📋 ${table.schemaname}.${table.tablename}`);
      console.log('-'.repeat(50));
      
      // Get columns
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale,
          ordinal_position
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
      `, [table.schemaname, table.tablename]);
      
      if (columnsResult.rows.length === 0) {
        console.log('   (No columns found)');
        continue;
      }
      
      console.log('   Columns:');
      columnsResult.rows.forEach(col => {
        let typeInfo = col.data_type;
        if (col.character_maximum_length) {
          typeInfo += `(${col.character_maximum_length})`;
        } else if (col.numeric_precision) {
          typeInfo += `(${col.numeric_precision}`;
          if (col.numeric_scale) typeInfo += `,${col.numeric_scale}`;
          typeInfo += ')';
        }
        
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        console.log(`      ${col.ordinal_position}. ${col.column_name}: ${typeInfo} ${nullable}${defaultVal}`);
      });
      
      // Get primary keys
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
      `, [table.schemaname, table.tablename]);
      
      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => row.column_name).join(', ');
        console.log(`   Primary Key: ${pkColumns}`);
      }
      
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
      `, [table.schemaname, table.tablename]);
      
      if (fkResult.rows.length > 0) {
        console.log('   Foreign Keys:');
        fkResult.rows.forEach(fk => {
          console.log(`      ${fk.column_name} -> ${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      }
      
      // Get indexes
      const indexResult = await client.query(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE schemaname = $1 AND tablename = $2
        ORDER BY indexname;
      `, [table.schemaname, table.tablename]);
      
      if (indexResult.rows.length > 0) {
        console.log('   Indexes:');
        indexResult.rows.forEach(idx => {
          console.log(`      ${idx.indexname}: ${idx.indexdef}`);
        });
      }
      
      // Get row count
      const countResult = await client.query(`
        SELECT COUNT(*) as row_count 
        FROM ${table.schemaname}.${table.tablename};
      `);
      console.log(`   Row Count: ${countResult.rows[0].row_count}`);
    }
    
    // Get sequences
    console.log('\n🔢 SEQUENCES:');
    console.log('-'.repeat(40));
    try {
      const sequencesResult = await client.query(`
        SELECT 
          schemaname,
          sequencename,
          data_type,
          start_value,
          maximum_value,
          increment
        FROM pg_sequences 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY schemaname, sequencename;
      `);
      
      if (sequencesResult.rows.length === 0) {
        console.log('   (No sequences found)');
      } else {
        sequencesResult.rows.forEach(seq => {
          console.log(`   ${seq.schemaname}.${seq.sequencename}: ${seq.data_type} (${seq.start_value} to ${seq.maximum_value}, +${seq.increment})`);
        });
      }
    } catch (seqError) {
      console.log('   (Sequences not available or error querying sequences)');
      console.log(`   Error: ${seqError.message}`);
    }
    
    // Get functions/procedures
    console.log('\n⚙️  FUNCTIONS & PROCEDURES:');
    console.log('-'.repeat(40));
    const functionsResult = await client.query(`
      SELECT 
        n.nspname as schema_name,
        p.proname as function_name,
        pg_get_function_result(p.oid) as return_type,
        pg_get_function_arguments(p.oid) as arguments
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY n.nspname, p.proname;
    `);
    
    if (functionsResult.rows.length === 0) {
      console.log('   (No functions found)');
    } else {
      functionsResult.rows.forEach(func => {
        console.log(`   ${func.schema_name}.${func.function_name}(${func.arguments}) -> ${func.return_type}`);
      });
    }
    
    console.log('\n✅ Database inspection complete!');
    
  } catch (error) {
    console.error('❌ Error during inspection:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

inspectDatabase();
