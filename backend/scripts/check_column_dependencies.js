#!/usr/bin/env node

/**
 * Check Column Dependencies
 * 
 * This script identifies what database objects depend on the city and state_code
 * columns in the affiliate_service_areas table before we can drop them.
 * 
 * Usage: node check_column_dependencies.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Pool } = require('pg');

async function checkDependencies() {
  let pool = null;
  
  try {
    console.log('🔍 Checking dependencies on affiliate_service_areas.city and state_code columns...');
    
    // Connect to database
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log('✅ Database connection established');
    
    // Check for views that depend on these columns
    console.log('\n📋 Checking views...');
    const viewsCheck = await pool.query(`
      SELECT 
        v.table_name as view_name,
        v.view_definition
      FROM information_schema.views v
      WHERE v.table_schema = 'public'
      AND v.view_definition LIKE '%affiliate_service_areas%'
      AND (v.view_definition LIKE '%city%' OR v.view_definition LIKE '%state_code%')
    `);
    
    if (viewsCheck.rows.length > 0) {
      console.log('⚠️  Found views that depend on city/state_code:');
      viewsCheck.rows.forEach(view => {
        console.log(`  - ${view.view_name}`);
      });
    } else {
      console.log('✅ No views found that depend on city/state_code');
    }
    
    // Check for triggers
    console.log('\n🔧 Checking triggers...');
    const triggersCheck = await pool.query(`
      SELECT 
        t.trigger_name,
        t.event_manipulation,
        t.action_statement
      FROM information_schema.triggers t
      WHERE t.trigger_schema = 'public'
      AND t.event_object_table = 'affiliate_service_areas'
    `);
    
    if (triggersCheck.rows.length > 0) {
      console.log('⚠️  Found triggers on affiliate_service_areas:');
      triggersCheck.rows.forEach(trigger => {
        console.log(`  - ${trigger.trigger_name} (${trigger.event_manipulation})`);
      });
    } else {
      console.log('✅ No triggers found on affiliate_service_areas');
    }
    
    // Check for functions that might reference these columns
    console.log('\n⚙️  Checking functions...');
    const functionsCheck = await pool.query(`
      SELECT 
        r.routine_name,
        r.routine_type
      FROM information_schema.routines r
      WHERE r.routine_schema = 'public'
      AND r.routine_definition LIKE '%affiliate_service_areas%'
      AND (r.routine_definition LIKE '%city%' OR r.routine_definition LIKE '%state_code%')
    `);
    
    if (functionsCheck.rows.length > 0) {
      console.log('⚠️  Found functions that might reference city/state_code:');
      functionsCheck.rows.forEach(func => {
        console.log(`  - ${func.routine_name} (${func.routine_type})`);
      });
    } else {
      console.log('✅ No functions found that reference city/state_code');
    }
    
    // Check for foreign key constraints
    console.log('\n🔗 Checking foreign key constraints...');
    const fkCheck = await pool.query(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'affiliate_service_areas'
    `);
    
    if (fkCheck.rows.length > 0) {
      console.log('⚠️  Found foreign key constraints:');
      fkCheck.rows.forEach(fk => {
        console.log(`  - ${fk.constraint_name}: ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('✅ No foreign key constraints found');
    }
    
    // Check for indexes
    console.log('\n📊 Checking indexes...');
    const indexesCheck = await pool.query(`
      SELECT 
        i.indexname,
        i.indexdef
      FROM pg_indexes i
      WHERE i.tablename = 'affiliate_service_areas'
      AND (i.indexdef LIKE '%city%' OR i.indexdef LIKE '%state_code%')
    `);
    
    if (indexesCheck.rows.length > 0) {
      console.log('⚠️  Found indexes that include city/state_code:');
      indexesCheck.rows.forEach(index => {
        console.log(`  - ${index.indexname}`);
      });
    } else {
      console.log('✅ No indexes found that include city/state_code');
    }
    
    console.log('\n🎉 Dependency check completed!');
    
  } catch (error) {
    console.error('❌ Dependency check failed:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  checkDependencies()
    .then(() => {
      console.log('✅ Dependency check completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Dependency check failed:', error.message);
      process.exit(1);
    });
}

module.exports = { checkDependencies };
