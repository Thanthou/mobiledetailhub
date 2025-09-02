#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkTiersUsage() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking tiers table usage...');
    console.log('');

    // Check if tiers table exists and has data
    const tiersData = await client.query(`
      SELECT COUNT(*) as count
      FROM affiliates.tiers
    `);
    
    console.log(`📊 Tiers table record count: ${tiersData.rows[0].count}`);
    
    if (tiersData.rows[0].count > 0) {
      // Show sample data
      const sampleData = await client.query(`
        SELECT *
        FROM affiliates.tiers
        LIMIT 5
      `);
      
      console.log('\n📋 Sample tiers data:');
      sampleData.rows.forEach((row, i) => {
        console.log(`  Tier ${i+1}:`, JSON.stringify(row, null, 2));
      });
    } else {
      console.log('   ✅ Tiers table is empty');
    }

    // Check for foreign key references to tiers
    const fkReferences = await client.query(`
      SELECT 
        tc.table_schema,
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_schema = 'affiliates'
        AND ccu.table_name = 'tiers'
    `);
    
    console.log('\n🔗 Foreign key references TO tiers table:');
    if (fkReferences.rows.length === 0) {
      console.log('   No foreign key references found');
    } else {
      fkReferences.rows.forEach(row => {
        console.log(`   • ${row.table_schema}.${row.table_name}.${row.column_name} → ${row.foreign_table_schema}.${row.foreign_table_name}.${row.foreign_column_name}`);
      });
    }

    // Check for foreign key references FROM tiers
    const fkFromTiers = await client.query(`
      SELECT 
        tc.table_schema,
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'affiliates'
        AND tc.table_name = 'tiers'
    `);
    
    console.log('\n🔗 Foreign key references FROM tiers table:');
    if (fkFromTiers.rows.length === 0) {
      console.log('   No foreign key references found');
    } else {
      fkFromTiers.rows.forEach(row => {
        console.log(`   • ${row.table_schema}.${row.table_name}.${row.column_name} → ${row.foreign_table_schema}.${row.foreign_table_name}.${row.foreign_column_name}`);
      });
    }

    // Check table structure
    const tableStructure = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'tiers'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Tiers table structure:');
    tableStructure.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = row.column_default ? ` DEFAULT ${row.column_default}` : '';
      console.log(`   • ${row.column_name}: ${row.data_type} (${nullable})${defaultVal}`);
    });

    // Check if there are any indexes on tiers
    const indexes = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'affiliates' 
        AND tablename = 'tiers'
    `);
    
    console.log('\n📇 Indexes on tiers table:');
    if (indexes.rows.length === 0) {
      console.log('   No indexes found');
    } else {
      indexes.rows.forEach(row => {
        console.log(`   • ${row.indexname}: ${row.indexdef}`);
      });
    }

    // Summary
    console.log('\n📝 Summary:');
    if (tiersData.rows[0].count === 0) {
      console.log('   ✅ Tiers table is empty and appears unused');
      console.log('   💡 Consider dropping this table if it\'s not needed');
    } else {
      console.log('   ⚠️  Tiers table contains data');
      console.log('   💡 Review if this data is still needed');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTiersUsage();
