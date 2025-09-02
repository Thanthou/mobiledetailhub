#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkTiersDependencies() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking tiers table dependencies...');
    console.log('');

    // Check for views that depend on tiers table
    const viewDependencies = await client.query(`
      SELECT 
        schemaname,
        viewname,
        definition
      FROM pg_views 
      WHERE definition ILIKE '%tiers%'
        AND schemaname IN ('public', 'affiliates')
    `);
    
    console.log('📋 Views that reference tiers table:');
    if (viewDependencies.rows.length === 0) {
      console.log('   No views found');
    } else {
      viewDependencies.rows.forEach(row => {
        console.log(`   • ${row.schemaname}.${row.viewname}`);
        // Show a snippet of the definition
        const snippet = row.definition.substring(0, 200) + '...';
        console.log(`     ${snippet}`);
      });
    }

    // Check for other objects that might depend on tiers
    const objectDependencies = await client.query(`
      SELECT 
        n.nspname as schema_name,
        c.relname as object_name,
        c.relkind as object_type,
        pg_get_userbyid(c.relowner) as owner
      FROM pg_depend d
      JOIN pg_class c ON d.refobjid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE d.refobjid = (
        SELECT oid 
        FROM pg_class 
        WHERE relname = 'tiers' 
          AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'affiliates')
      )
      AND c.relkind IN ('v', 'm', 'S') -- views, materialized views, sequences
    `);
    
    console.log('\n🔗 Other objects depending on tiers table:');
    if (objectDependencies.rows.length === 0) {
      console.log('   No other dependencies found');
    } else {
      objectDependencies.rows.forEach(row => {
        const typeMap = {
          'v': 'VIEW',
          'm': 'MATERIALIZED VIEW', 
          'S': 'SEQUENCE'
        };
        console.log(`   • ${row.schema_name}.${row.object_name} (${typeMap[row.object_type] || row.object_type})`);
      });
    }

    // Check if there's a public.tiers view
    const publicTiersView = await client.query(`
      SELECT 
        viewname,
        definition
      FROM pg_views 
      WHERE schemaname = 'public' 
        AND viewname = 'tiers'
    `);
    
    console.log('\n📋 Public tiers view:');
    if (publicTiersView.rows.length === 0) {
      console.log('   No public.tiers view found');
    } else {
      console.log('   ✅ public.tiers view exists');
      console.log('   Definition:', publicTiersView.rows[0].definition);
    }

    // Check for any functions or triggers that might reference tiers
    const functionDependencies = await client.query(`
      SELECT 
        n.nspname as schema_name,
        p.proname as function_name,
        pg_get_function_result(p.oid) as return_type
      FROM pg_depend d
      JOIN pg_proc p ON d.objid = p.oid
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE d.refobjid = (
        SELECT oid 
        FROM pg_class 
        WHERE relname = 'tiers' 
          AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'affiliates')
      )
    `);
    
    console.log('\n🔧 Functions depending on tiers table:');
    if (functionDependencies.rows.length === 0) {
      console.log('   No function dependencies found');
    } else {
      functionDependencies.rows.forEach(row => {
        console.log(`   • ${row.schema_name}.${row.function_name} (${row.return_type})`);
      });
    }

    // Summary
    console.log('\n📝 Summary:');
    console.log(`   • Views depending on tiers: ${viewDependencies.rows.length}`);
    console.log(`   • Other objects depending on tiers: ${objectDependencies.rows.length}`);
    console.log(`   • Functions depending on tiers: ${functionDependencies.rows.length}`);
    
    if (viewDependencies.rows.length > 0 || objectDependencies.rows.length > 0 || functionDependencies.rows.length > 0) {
      console.log('\n💡 To drop the tiers table, you need to:');
      console.log('   1. Drop all dependent views first');
      console.log('   2. Drop any dependent functions/triggers');
      console.log('   3. Then drop the tiers table');
    } else {
      console.log('\n✅ No dependencies found - tiers table can be dropped safely');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTiersDependencies();
