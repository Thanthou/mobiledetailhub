#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkDependencies() {
  const client = await pool.connect();
  
  try {
    // Check for indexes on these columns
    const indexResult = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'affiliates' 
        AND tablename = 'affiliates'
        AND (indexdef ILIKE '%city%' OR indexdef ILIKE '%state%' OR indexdef ILIKE '%zip%')
    `);
    
    console.log('Indexes that reference location columns:');
    if (indexResult.rows.length === 0) {
      console.log('  No indexes found');
    } else {
      indexResult.rows.forEach(row => {
        console.log(`  • ${row.indexname}: ${row.indexdef}`);
      });
    }
    console.log('');

    // Check for constraints
    const constraintResult = await client.query(`
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'affiliates'
        AND tc.table_name = 'affiliates'
        AND kcu.column_name IN ('city', 'state', 'zip')
    `);
    
    console.log('Constraints on location columns:');
    if (constraintResult.rows.length === 0) {
      console.log('  No constraints found');
    } else {
      constraintResult.rows.forEach(row => {
        console.log(`  • ${row.constraint_name} (${row.constraint_type}) on ${row.column_name}`);
      });
    }
    console.log('');

    // Check for views that might reference these columns
    const viewResult = await client.query(`
      SELECT 
        viewname,
        definition
      FROM pg_views 
      WHERE schemaname = 'public'
        AND (definition ILIKE '%city%' OR definition ILIKE '%state%' OR definition ILIKE '%zip%')
    `);
    
    console.log('Views that might reference location columns:');
    if (viewResult.rows.length === 0) {
      console.log('  No views found');
    } else {
      viewResult.rows.forEach(row => {
        console.log(`  • ${row.viewname}`);
        // Show a snippet of the definition
        const snippet = row.definition.substring(0, 200) + '...';
        console.log(`    ${snippet}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDependencies();
