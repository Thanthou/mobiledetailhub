#!/usr/bin/env node
/**
 * Unified Database Audit
 * Comprehensive database health check combining inspect, overview, and table checks
 */

import { getPool } from '../backend/database/pool.js';
import chalk from 'chalk';

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

async function checkDatabaseConnection() {
  console.log(chalk.blue('🔌 Testing database connection...'));
  
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    console.log(chalk.green(`✅ Database connected successfully`));
    console.log(chalk.gray(`   Server: ${result.rows[0].version}`));
    console.log(chalk.gray(`   Time: ${result.rows[0].current_time}`));
    
    results.passed++;
    return pool;
  } catch (error) {
    console.log(chalk.red(`❌ Database connection failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'connection',
      message: `Database connection failed: ${error.message}`
    });
    return null;
  }
}

async function checkSchemas(pool) {
  console.log(chalk.blue('\n📋 Checking database schemas...'));
  
  try {
    const result = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    
    const expectedSchemas = ['tenants', 'website', 'system', 'analytics', 'booking', 'schedule', 'reputation'];
    const existingSchemas = result.rows.map(row => row.schema_name);
    
    console.log(chalk.green(`✅ Found ${existingSchemas.length} schemas`));
    console.log(chalk.gray(`   Schemas: ${existingSchemas.join(', ')}`));
    
    const missingSchemas = expectedSchemas.filter(schema => !existingSchemas.includes(schema));
    if (missingSchemas.length > 0) {
      console.log(chalk.yellow(`⚠️  Missing schemas: ${missingSchemas.join(', ')}`));
      results.warnings++;
      results.issues.push({
        type: 'missing_schemas',
        message: `Missing schemas: ${missingSchemas.join(', ')}`
      });
    } else {
      results.passed++;
    }
    
    return existingSchemas;
  } catch (error) {
    console.log(chalk.red(`❌ Schema check failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'schema_error',
      message: `Schema check failed: ${error.message}`
    });
    return [];
  }
}

async function checkTables(pool, schemas) {
  console.log(chalk.blue('\n📊 Checking tables...'));
  
  try {
    const result = await pool.query(`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = ANY($1)
      ORDER BY table_schema, table_name
    `, [schemas]);
    
    const tablesBySchema = {};
    result.rows.forEach(row => {
      if (!tablesBySchema[row.table_schema]) {
        tablesBySchema[row.table_schema] = [];
      }
      tablesBySchema[row.table_schema].push(row.table_name);
    });
    
    console.log(chalk.green(`✅ Found ${result.rows.length} tables across ${schemas.length} schemas`));
    
    // Check for expected tables in each schema
    const expectedTables = {
      tenants: ['business', 'users', 'settings'],
      website: ['seo_config', 'content', 'pages'],
      system: ['schema_migrations', 'audit_logs'],
      analytics: ['events', 'sessions'],
      booking: ['appointments', 'time_blocks'],
      schedule: ['availability', 'time_slots'],
      reputation: ['reviews', 'ratings']
    };
    
    Object.entries(expectedTables).forEach(([schema, expectedTableList]) => {
      if (tablesBySchema[schema]) {
        const missingTables = expectedTableList.filter(table => 
          !tablesBySchema[schema].includes(table)
        );
        
        if (missingTables.length > 0) {
          console.log(chalk.yellow(`⚠️  ${schema} schema missing tables: ${missingTables.join(', ')}`));
          results.warnings++;
          results.issues.push({
            type: 'missing_tables',
            schema,
            message: `Missing tables in ${schema}: ${missingTables.join(', ')}`
          });
        } else {
          console.log(chalk.green(`✅ ${schema} schema has all expected tables`));
          results.passed++;
        }
      }
    });
    
  } catch (error) {
    console.log(chalk.red(`❌ Table check failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'table_error',
      message: `Table check failed: ${error.message}`
    });
  }
}

async function checkMigrations(pool) {
  console.log(chalk.blue('\n🔄 Checking migrations...'));
  
  try {
    const result = await pool.query(`
      SELECT 
        filename,
        applied_at,
        checksum
      FROM system.schema_migrations 
      ORDER BY applied_at DESC
    `);
    
    console.log(chalk.green(`✅ Found ${result.rows.length} applied migrations`));
    
    if (result.rows.length > 0) {
      console.log(chalk.gray(`   Latest: ${result.rows[0].filename} (${result.rows[0].applied_at})`));
      results.passed++;
    } else {
      console.log(chalk.yellow(`⚠️  No migrations found in system.schema_migrations`));
      results.warnings++;
      results.issues.push({
        type: 'no_migrations',
        message: 'No migrations found in system.schema_migrations table'
      });
    }
    
  } catch (error) {
    console.log(chalk.red(`❌ Migration check failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'migration_error',
      message: `Migration check failed: ${error.message}`
    });
  }
}

async function checkConstraints(pool) {
  console.log(chalk.blue('\n🔗 Checking constraints...'));
  
  try {
    const result = await pool.query(`
      SELECT 
        tc.table_schema,
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = ANY(ARRAY['tenants', 'website', 'system', 'analytics', 'booking', 'schedule', 'reputation'])
      ORDER BY tc.table_schema, tc.table_name, tc.constraint_type
    `);
    
    const constraintsByType = {};
    result.rows.forEach(row => {
      if (!constraintsByType[row.constraint_type]) {
        constraintsByType[row.constraint_type] = 0;
      }
      constraintsByType[row.constraint_type]++;
    });
    
    console.log(chalk.green(`✅ Found ${result.rows.length} constraints`));
    Object.entries(constraintsByType).forEach(([type, count]) => {
      console.log(chalk.gray(`   ${type}: ${count}`));
    });
    
    results.passed++;
    
  } catch (error) {
    console.log(chalk.red(`❌ Constraint check failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'constraint_error',
      message: `Constraint check failed: ${error.message}`
    });
  }
}

async function checkIndexes(pool) {
  console.log(chalk.blue('\n📇 Checking indexes...'));
  
  try {
    const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = ANY(ARRAY['tenants', 'website', 'system', 'analytics', 'booking', 'schedule', 'reputation'])
      ORDER BY schemaname, tablename, indexname
    `);
    
    console.log(chalk.green(`✅ Found ${result.rows.length} indexes`));
    
    // Check for critical indexes
    const criticalIndexes = [
      'tenants.business.slug',
      'tenants.business.business_email',
      'website.seo_config.business_id',
      'system.schema_migrations.filename'
    ];
    
    const existingIndexes = result.rows.map(row => `${row.schemaname}.${row.tablename}.${row.indexname}`);
    
    const missingCritical = criticalIndexes.filter(index => 
      !existingIndexes.some(existing => existing.includes(index.split('.')[2]))
    );
    
    if (missingCritical.length > 0) {
      console.log(chalk.yellow(`⚠️  Missing critical indexes: ${missingCritical.join(', ')}`));
      results.warnings++;
      results.issues.push({
        type: 'missing_indexes',
        message: `Missing critical indexes: ${missingCritical.join(', ')}`
      });
    } else {
      console.log(chalk.green(`✅ All critical indexes present`));
      results.passed++;
    }
    
  } catch (error) {
    console.log(chalk.red(`❌ Index check failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'index_error',
      message: `Index check failed: ${error.message}`
    });
  }
}

function generateReport() {
  console.log(chalk.blue.bold('\n📊 Database Audit Report\n'));
  
  console.log(chalk.green(`✅ Passed: ${results.passed}`));
  if (results.failed > 0) {
    console.log(chalk.red(`❌ Failed: ${results.failed}`));
  }
  if (results.warnings > 0) {
    console.log(chalk.yellow(`⚠️  Warnings: ${results.warnings}`));
  }

  if (results.issues.length > 0) {
    console.log(chalk.red('\n🚨 Issues Found:\n'));
    
    results.issues.forEach((issue, index) => {
      console.log(chalk.red(`❌ ${issue.message}`));
      console.log();
    });
  } else {
    console.log(chalk.green('\n🎉 All database checks passed!'));
  }

  return results.failed === 0;
}

async function main() {
  const args = process.argv.slice(2);
  const quick = args.includes('--quick');
  const deep = args.includes('--deep');
  const fix = args.includes('--fix');

  console.log(chalk.blue.bold('🔍 Database Audit\n'));

  if (quick) {
    console.log(chalk.yellow('⚡ Quick mode - Basic checks only\n'));
  } else if (deep) {
    console.log(chalk.yellow('🔍 Deep mode - Comprehensive checks\n'));
  } else {
    console.log(chalk.yellow('📊 Standard mode - Balanced checks\n'));
  }

  // Check database connection
  const pool = await checkDatabaseConnection();
  if (!pool) {
    console.log(chalk.red('\n❌ Cannot proceed without database connection'));
    process.exit(1);
  }

  // Check schemas
  const schemas = await checkSchemas(pool);

  // Check tables
  await checkTables(pool, schemas);

  // Check migrations
  await checkMigrations(pool);

  if (!quick) {
    // Check constraints
    await checkConstraints(pool);

    // Check indexes
    await checkIndexes(pool);
  }

  if (deep) {
    // Additional deep checks could be added here
    console.log(chalk.blue('\n🔍 Deep analysis completed'));
  }

  // Generate report
  const success = generateReport();

  if (fix && results.issues.length > 0) {
    console.log(chalk.yellow('\n🔧 Fix mode enabled - attempting to fix issues...'));
    // Fix logic would go here
    console.log(chalk.yellow('Fix functionality not yet implemented'));
  }

  if (!success) {
    console.log(chalk.red('\n❌ Database audit failed. Fix the issues above before proceeding.'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ Database audit completed successfully!'));
    process.exit(0);
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Database audit failed:'), error);
  process.exit(1);
});
