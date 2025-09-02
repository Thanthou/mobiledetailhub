#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkAffiliatesSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking affiliates schema...');
    console.log('');

    // Check all tables in affiliates schema
    const tables = await client.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'affiliates'
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in affiliates schema:');
    if (tables.rows.length === 0) {
      console.log('   No tables found');
    } else {
      tables.rows.forEach(row => {
        console.log(`   • ${row.table_name} (${row.table_type})`);
      });
    }

    // Check all views in affiliates schema
    const views = await client.query(`
      SELECT 
        viewname
      FROM pg_views 
      WHERE schemaname = 'affiliates'
      ORDER BY viewname
    `);
    
    console.log('\n📋 Views in affiliates schema:');
    if (views.rows.length === 0) {
      console.log('   No views found');
    } else {
      views.rows.forEach(row => {
        console.log(`   • ${row.viewname}`);
      });
    }

    // Check all sequences in affiliates schema
    const sequences = await client.query(`
      SELECT 
        sequence_name
      FROM information_schema.sequences 
      WHERE sequence_schema = 'affiliates'
      ORDER BY sequence_name
    `);
    
    console.log('\n📋 Sequences in affiliates schema:');
    if (sequences.rows.length === 0) {
      console.log('   No sequences found');
    } else {
      sequences.rows.forEach(row => {
        console.log(`   • ${row.sequence_name}`);
      });
    }

    // Check if tiers table exists anywhere
    const tiersCheck = await client.query(`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_name = 'tiers'
      ORDER BY table_schema, table_name
    `);
    
    console.log('\n🔍 Tiers table search:');
    if (tiersCheck.rows.length === 0) {
      console.log('   ✅ No tiers table found anywhere');
    } else {
      tiersCheck.rows.forEach(row => {
        console.log(`   • ${row.table_schema}.${row.table_name} (${row.table_type})`);
      });
    }

    // Check if service_tiers table exists
    const serviceTiersCheck = await client.query(`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_name = 'service_tiers'
      ORDER BY table_schema, table_name
    `);
    
    console.log('\n🔍 Service_tiers table search:');
    if (serviceTiersCheck.rows.length === 0) {
      console.log('   ❌ No service_tiers table found');
    } else {
      serviceTiersCheck.rows.forEach(row => {
        console.log(`   • ${row.table_schema}.${row.table_name} (${row.table_type})`);
      });
    }

    // Summary
    console.log('\n📝 Summary:');
    console.log(`   • Tables in affiliates schema: ${tables.rows.length}`);
    console.log(`   • Views in affiliates schema: ${views.rows.length}`);
    console.log(`   • Sequences in affiliates schema: ${sequences.rows.length}`);
    console.log(`   • Tiers tables found: ${tiersCheck.rows.length}`);
    console.log(`   • Service_tiers tables found: ${serviceTiersCheck.rows.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAffiliatesSchema();
