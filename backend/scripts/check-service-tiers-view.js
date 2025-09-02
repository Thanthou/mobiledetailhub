#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkServiceTiersView() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking public.service_tiers view...');
    console.log('');

    // Get the full definition of the public.service_tiers view
    const viewDefinition = await client.query(`
      SELECT 
        viewname,
        definition
      FROM pg_views 
      WHERE schemaname = 'public' 
        AND viewname = 'service_tiers'
    `);
    
    if (viewDefinition.rows.length === 0) {
      console.log('❌ public.service_tiers view not found');
      return;
    }

    console.log('📋 public.service_tiers view definition:');
    console.log(viewDefinition.rows[0].definition);
    console.log('');

    // Check if the view actually references the tiers table
    const definition = viewDefinition.rows[0].definition;
    if (definition.includes('affiliates.tiers')) {
      console.log('⚠️  View references affiliates.tiers table');
    } else {
      console.log('✅ View does NOT reference affiliates.tiers table');
    }

    // Test the view to see if it works
    try {
      const viewTest = await client.query('SELECT COUNT(*) as count FROM public.service_tiers');
      console.log(`✅ View works: ${viewTest.rows[0].count} records accessible`);
    } catch (error) {
      console.log(`❌ View error: ${error.message}`);
    }

    // Check what the view actually returns
    const sampleData = await client.query('SELECT * FROM public.service_tiers LIMIT 3');
    console.log('\n📋 Sample data from public.service_tiers view:');
    sampleData.rows.forEach((row, i) => {
      console.log(`  Record ${i+1}:`, JSON.stringify(row, null, 2));
    });

    // Check if there's a service_tiers table in affiliates schema
    const serviceTiersTable = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'service_tiers'
    `);
    
    console.log(`\n📊 affiliates.service_tiers table exists: ${serviceTiersTable.rows[0].count > 0 ? 'YES' : 'NO'}`);
    
    if (serviceTiersTable.rows[0].count > 0) {
      const tableData = await client.query('SELECT COUNT(*) as count FROM affiliates.service_tiers');
      console.log(`📊 affiliates.service_tiers record count: ${tableData.rows[0].count}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkServiceTiersView();
