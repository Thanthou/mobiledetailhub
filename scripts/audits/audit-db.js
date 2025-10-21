#!/usr/bin/env node
/**
 * Unified Database Audit
 * Comprehensive database health check combining inspect, overview, and table checks
 * 
 * Uses generated schema snapshot (backend/schemas/current-schema.json) if available.
 * Run 'npm run migrate' or 'npm run db:snapshot' to generate/update the snapshot.
 */

import { getPool } from '../../backend/database/pool.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  readJson
} from './shared/audit-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotPath = path.join(__dirname, '../../backend/schemas/current-schema.json');

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

/**
 * Load expected tables from schema snapshot
 * Returns null if snapshot doesn't exist
 */
function loadExpectedTablesFromSnapshot(audit) {
  const snapshot = readJson(snapshotPath);
  
  if (!snapshot) {
    return null;
  }
  
  try {
    const expectedTables = {};
    
    // Convert snapshot format to expectedTables format
    for (const [schemaName, schemaData] of Object.entries(snapshot.schemas)) {
      expectedTables[schemaName] = schemaData.tables.map(t => t.name);
    }
    
    return expectedTables;
  } catch (error) {
    audit.warn(`Failed to parse schema snapshot: ${error.message}`);
    return null;
  }
}

async function checkDatabaseConnection(audit) {
  audit.section('Database Connection');
  
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    audit.pass('Database connected successfully');
    audit.debug(`  Server: ${result.rows[0].version.split(',')[0]}`);
    audit.debug(`  Time: ${result.rows[0].current_time}`);
    
    return pool;
  } catch (error) {
    audit.error(`Database connection failed: ${error.message}`, {
      details: 'Check DATABASE_URL and ensure PostgreSQL is running'
    });
    return null;
  }
}

async function checkSchemas(audit, pool) {
  audit.section('Database Schemas');
  
  try {
    const result = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    
    const expectedSchemas = ['tenants', 'auth', 'website', 'system', 'analytics', 'booking', 'schedule', 'reputation', 'customers'];
    const existingSchemas = result.rows.map(row => row.schema_name);
    
    audit.pass(`Found ${existingSchemas.length} schemas`);
    audit.debug(`  Schemas: ${existingSchemas.join(', ')}`);
    
    const missingSchemas = expectedSchemas.filter(schema => !existingSchemas.includes(schema));
    if (missingSchemas.length > 0) {
      audit.warn(`Missing schemas: ${missingSchemas.join(', ')}`, {
        details: 'Run migrations to create missing schemas'
      });
    } else {
      audit.pass('All expected schemas present');
    }
    
    return existingSchemas;
  } catch (error) {
    audit.error(`Schema check failed: ${error.message}`);
    return [];
  }
}

async function checkTables(audit, pool, schemas) {
  audit.section('Database Tables');
  
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
    
    audit.pass(`Found ${result.rows.length} tables across ${schemas.length} schemas`);
    
    // Load expected tables from snapshot or use fallback
    let expectedTables = loadExpectedTablesFromSnapshot(audit);
    
    if (!expectedTables) {
      audit.warn('No schema snapshot found - using minimal validation', {
        details: 'Run: npm run db:snapshot to generate snapshot'
      });
      
      expectedTables = {
        tenants: ['business'],
        auth: ['users'],
        system: ['schema_migrations'],
      };
    }
    
    // Check each schema for missing tables
    let allTablesPresent = true;
    Object.entries(expectedTables).forEach(([schema, expectedTableList]) => {
      if (tablesBySchema[schema]) {
        const missingTables = expectedTableList.filter(table => 
          !tablesBySchema[schema].includes(table)
        );
        
        if (missingTables.length > 0) {
          audit.error(`${schema} schema missing tables: ${missingTables.join(', ')}`, {
            path: `database/${schema}`,
            details: 'Run migrations to create missing tables'
          });
          allTablesPresent = false;
        } else {
          audit.pass(`${schema} schema has all expected tables`);
        }
      } else {
        audit.error(`Schema ${schema} not found in database`);
        allTablesPresent = false;
      }
    });
    
    if (allTablesPresent) {
      audit.pass('All expected tables present');
    }
    
  } catch (error) {
    audit.error(`Table check failed: ${error.message}`);
  }
}

async function checkMigrations(audit, pool) {
  audit.section('Database Migrations');
  
  try {
    const result = await pool.query(`
      SELECT 
        filename,
        applied_at,
        checksum
      FROM system.schema_migrations 
      ORDER BY applied_at DESC
      LIMIT 5
    `);
    
    if (result.rows.length === 0) {
      audit.warn('No migrations found in system.schema_migrations', {
        details: 'Run migrations to initialize database'
      });
    } else {
      audit.pass(`Found ${result.rows.length} recent migrations`);
      audit.debug(`  Latest: ${result.rows[0].filename}`);
      audit.debug(`  Applied: ${result.rows[0].applied_at}`);
    }
    
  } catch (error) {
    audit.error(`Migration check failed: ${error.message}`, {
      details: 'Ensure system.schema_migrations table exists'
    });
  }
}

async function checkConstraints(audit, pool) {
  audit.section('Database Constraints');
  
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
      WHERE tc.table_schema = ANY(ARRAY['tenants', 'auth', 'website', 'system', 'analytics', 'booking', 'schedule', 'reputation', 'customers'])
      ORDER BY tc.table_schema, tc.table_name, tc.constraint_type
    `);
    
    const constraintsByType = {};
    result.rows.forEach(row => {
      if (!constraintsByType[row.constraint_type]) {
        constraintsByType[row.constraint_type] = 0;
      }
      constraintsByType[row.constraint_type]++;
    });
    
    audit.pass(`Found ${result.rows.length} constraints`);
    Object.entries(constraintsByType).forEach(([type, count]) => {
      audit.debug(`  ${type}: ${count}`);
    });
    
  } catch (error) {
    audit.error(`Constraint check failed: ${error.message}`);
  }
}

async function checkIndexes(audit, pool) {
  audit.section('Database Indexes');
  
  try {
    const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = ANY(ARRAY['tenants', 'auth', 'website', 'system', 'analytics', 'booking', 'schedule', 'reputation', 'customers'])
      ORDER BY schemaname, tablename, indexname
    `);
    
    audit.pass(`Found ${result.rows.length} indexes`);
    
    // Check for critical indexes
    const criticalIndexes = [
      { schema: 'tenants', table: 'business', column: 'slug' },
      { schema: 'tenants', table: 'business', column: 'business_email' },
      { schema: 'auth', table: 'users', column: 'email' },
      { schema: 'system', table: 'schema_migrations', column: 'filename' },
    ];
    
    const existingIndexDefs = result.rows.map(row => row.indexdef.toLowerCase());
    
    criticalIndexes.forEach(idx => {
      const hasIndex = existingIndexDefs.some(def => 
        def.includes(idx.table) && def.includes(idx.column)
      );
      
      if (!hasIndex) {
        audit.warn(`Missing index on ${idx.schema}.${idx.table}.${idx.column}`, {
          details: 'Consider adding index for query performance'
        });
      }
    });
    
  } catch (error) {
    audit.error(`Index check failed: ${error.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const quick = args.includes('--quick');
  const deep = args.includes('--deep');

  const audit = createAuditResult('Database', isSilent);

  // Check database connection
  const pool = await checkDatabaseConnection(audit);
  if (!pool) {
    audit.error('Cannot proceed without database connection');
    
    saveReport(audit, 'DATABASE_AUDIT.md', {
      description: 'Validates database structure, connectivity, and integrity.',
      recommendations: [
        'Verify DATABASE_URL is correct',
        'Ensure PostgreSQL is running',
        'Run migrations to create missing schemas/tables',
        'Add indexes on frequently queried columns',
        'Review constraint violations'
      ]
    });
    
    finishAudit(audit);
    return;
  }

  // Check schemas
  const schemas = await checkSchemas(audit, pool);

  // Check tables
  await checkTables(audit, pool, schemas);

  // Check migrations
  await checkMigrations(audit, pool);

  if (!quick) {
    // Check constraints
    await checkConstraints(audit, pool);

    // Check indexes
    await checkIndexes(audit, pool);
  }

  if (deep) {
    audit.debug('Deep analysis completed');
  }

  // Generate report
  saveReport(audit, 'DATABASE_AUDIT.md', {
    description: 'Validates database structure, connectivity, and integrity.',
    recommendations: [
      'Run migrations before deployment',
      'Ensure all expected schemas and tables exist',
      'Add indexes on frequently queried columns for performance',
      'Review and fix any constraint violations',
      'Keep schema snapshot updated: npm run db:snapshot'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

main().catch(error => {
  console.error(`❌ Database audit failed: ${error.message}`);
  process.exit(1);
});
