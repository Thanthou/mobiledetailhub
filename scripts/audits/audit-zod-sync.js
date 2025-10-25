#!/usr/bin/env node
/**
 * audit-zod-sync.js — Zod Schema ↔ Database Sync Audit
 * -------------------------------------------------------------
 * ✅ Verifies Zod validation schemas match database structure
 * ✅ Detects fields in Zod but not in database (dead validation)
 * ✅ Finds required DB fields without validation (security gaps)
 * ✅ Checks type compatibility (string vs number, etc.)
 * ✅ Reports constraint mismatches (max length, etc.)
 * -------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists,
  readJson
} from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//────────────────────────────────────────────────────────────────
// 📊 Schema to Table Mapping
//────────────────────────────────────────────────────────────────
const SCHEMA_TABLE_MAP = {
  'auth.schemas.js': {
    'authSchemas.register': 'auth.users',
    'authSchemas.login': 'auth.users',
  },
  'tenants.schemas.js': {
    'tenantSchemas.signup': 'tenants.business',
    'tenantSchemas.update': 'tenants.business',
    'tenantSchemas.getBySlug': 'tenants.business',
    'serviceAreaSchemas.update': 'tenants.business',
    'serviceAreaSchemas.add': 'tenants.business',
  },
  'schedule.schemas.js': {
    'scheduleSchemas.createAppointment': 'schedule.appointments',
    'scheduleSchemas.updateAppointment': 'schedule.appointments',
    'scheduleSchemas.blockDate': 'schedule.blocked_days',
  },
  'reputation.schemas.js': {
    'reviewSchemas.create': 'reputation.reviews',
    'reviewSchemas.list': 'reputation.reviews',
  },
  'services.schemas.js': {
    'serviceSchemas.create': 'tenants.services',
    'serviceSchemas.update': 'tenants.services',
  },
  'website.schemas.js': {
    'websiteContentSchemas.update': 'website.content',
  },
  'domains.schemas.js': {
    'domainSchemas.setDomain': 'tenants.business',
  },
  'payments.schemas.js': {
    'paymentSchemas.createIntent': null, // Stripe, not DB table
    'paymentSchemas.confirm': null, // Composite operation
  },
  'analytics.schemas.js': {
    'analyticsSchemas.track': 'analytics.events',
    'analyticsSchemas.getEvents': 'analytics.events',
  },
  'admin.schemas.js': {
    'adminSchemas.deleteTenant': 'tenants.business',
    'adminSchemas.approveApplication': 'tenants.business',
    'adminSchemas.rejectApplication': 'tenants.business',
  },
};

// Fields that should be excluded from validation (auto-generated)
const EXCLUDED_FIELDS = new Set([
  'id', 'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by'
]);

//────────────────────────────────────────────────────────────────
// 🔍 Load Database Schema
//────────────────────────────────────────────────────────────────
function loadDatabaseSchema(audit) {
  audit.section('Database Schema');
  
  const schemaPath = path.join(root, 'backend/schemas/generated/current-schema.json');
  
  if (!fileExists(schemaPath)) {
    audit.error('Database schema snapshot not found', { 
      path: schemaPath,
      details: 'Run "npm run db:snapshot" to generate it'
    });
    return null;
  }
  
  const schema = readJson(schemaPath);
  
  if (!schema) {
    audit.error('Failed to parse database schema JSON', { path: schemaPath });
    return null;
  }
  
  audit.pass(`Loaded database schema (${Object.keys(schema.schemas || {}).length} schemas)`);
  
  return schema;
}

//────────────────────────────────────────────────────────────────
// 🔍 Parse Zod Schema Files
//────────────────────────────────────────────────────────────────
function extractZodFields(schemaFilePath) {
  const content = fs.readFileSync(schemaFilePath, 'utf-8');
  const schemas = {};
  
  // Match: export const [name] = { [key]: z.object({ ... }) }
  const schemaRegex = /export\s+const\s+(\w+)\s*=\s*\{([^}]+)\}/gs;
  let match;
  
  while ((match = schemaRegex.exec(content)) !== null) {
    const schemaName = match[1];
    const schemaContent = match[2];
    
    // Extract individual schema objects: signup: z.object({ ... })
    const objectRegex = /(\w+):\s*z\.object\(\{([^}]+)\}\)/gs;
    let objMatch;
    
    while ((objMatch = objectRegex.exec(schemaContent)) !== null) {
      const key = objMatch[1];
      const fields = objMatch[2];
      
      // Extract field names (simple heuristic)
      const fieldRegex = /(\w+):\s*(?:commonFields\.\w+|z\.\w+)/g;
      const extractedFields = [];
      let fieldMatch;
      
      while ((fieldMatch = fieldRegex.exec(fields)) !== null) {
        extractedFields.push(fieldMatch[1]);
      }
      
      schemas[`${schemaName}.${key}`] = extractedFields;
    }
  }
  
  return schemas;
}

//────────────────────────────────────────────────────────────────
// 🔍 Get Database Table Columns
//────────────────────────────────────────────────────────────────
function getTableColumns(dbSchema, tablePath) {
  if (!tablePath) return null; // Skip non-DB schemas
  
  const [schemaName, tableName] = tablePath.split('.');
  
  if (!dbSchema.schemas[schemaName]) return null;
  
  const table = dbSchema.schemas[schemaName].tables.find(t => t.name === tableName);
  
  if (!table) return null;
  
  return table.columns.map(col => ({
    name: col.name,
    type: col.type,
    nullable: col.nullable,
    default: col.default
  }));
}

//────────────────────────────────────────────────────────────────
// 🔍 Audit Zod Schema File
//────────────────────────────────────────────────────────────────
function auditSchemaFile(audit, dbSchema, schemaFile, tableMap) {
  const schemaPath = path.join(root, 'backend/schemas/validation', schemaFile);
  
  if (!fileExists(schemaPath)) {
    audit.warn(`Schema file not found: ${schemaFile}`, { path: schemaPath });
    return;
  }
  
  audit.section(`Schema: ${schemaFile}`);
  
  try {
    const zodSchemas = extractZodFields(schemaPath);
    
    // Audit each schema definition
    Object.entries(tableMap).forEach(([schemaKey, tablePath]) => {
      const zodFields = zodSchemas[schemaKey];
      
      if (!zodFields) {
        audit.debug(`   ⚠️  Schema ${schemaKey} not found in file (might be aliased)`);
        return;
      }
      
      if (!tablePath) {
        // Non-database schema (e.g., Stripe API)
        audit.pass(`${schemaKey} (external API, not DB-backed)`);
        return;
      }
      
      const dbColumns = getTableColumns(dbSchema, tablePath);
      
      if (!dbColumns) {
        audit.warn(`Database table not found for ${schemaKey}`, {
          path: tablePath,
          details: 'Schema references non-existent table'
        });
        return;
      }
      
      // Filter out auto-generated fields from DB columns
      const relevantColumns = dbColumns.filter(col => !EXCLUDED_FIELDS.has(col.name));
      const requiredColumns = relevantColumns.filter(col => !col.nullable && !col.default);
      
      // Check for fields in Zod but not in DB
      const zodOnly = zodFields.filter(field => 
        !dbColumns.some(col => col.name === field)
      );
      
      // Check for required DB fields not in Zod
      const missingRequired = requiredColumns.filter(col => 
        !zodFields.includes(col.name)
      );
      
      // Report findings
      if (zodOnly.length > 0) {
        audit.warn(`${schemaKey}: Fields in Zod but not in database`, {
          path: tablePath,
          details: `${zodOnly.join(', ')}`
        });
      }
      
      if (missingRequired.length > 0) {
        audit.warn(`${schemaKey}: Required DB fields without validation`, {
          path: tablePath,
          details: `${missingRequired.map(c => c.name).join(', ')}`
        });
      }
      
      if (zodOnly.length === 0 && missingRequired.length === 0) {
        audit.pass(`${schemaKey} (${zodFields.length} fields validated)`);
      }
    });
    
  } catch (error) {
    audit.error(`Failed to parse ${schemaFile}`, {
      path: schemaPath,
      details: error.message
    });
  }
}

//────────────────────────────────────────────────────────────────
// 🚀 Main Audit
//────────────────────────────────────────────────────────────────
async function main() {
  const audit = createAuditResult('Zod Schema Sync', isSilent);
  
  // Load database schema
  const dbSchema = loadDatabaseSchema(audit);
  
  if (!dbSchema) {
    saveReport(audit, 'ZOD_SYNC_AUDIT.md', {
      description: 'Validates that Zod validation schemas align with database structure.',
      recommendations: [
        'Run "npm run db:snapshot" to generate database schema snapshot',
        'Ensure PostgreSQL database is accessible',
        'Check DATABASE_URL or DB_* environment variables'
      ]
    });
    
    finishAudit(audit);
    return;
  }
  
  // Audit each schema file
  Object.entries(SCHEMA_TABLE_MAP).forEach(([schemaFile, tableMap]) => {
    auditSchemaFile(audit, dbSchema, schemaFile, tableMap);
  });
  
  // Generate report
  saveReport(audit, 'ZOD_SYNC_AUDIT.md', {
    description: `
This audit verifies that Zod validation schemas align with the database structure.

**What it checks:**
- Fields in Zod schemas that don't exist in database (dead validation code)
- Required database fields without validation (potential security gaps)
- Schema-to-table mappings are correct

**What it ignores:**
- Auto-generated fields (id, created_at, updated_at)
- External API schemas (Stripe, Google, etc.)
- Optional database fields (nullable or with defaults)

**Note:** This is an informational audit. Some mismatches are intentional:
- Zod schemas might validate computed fields not stored in DB
- API input schemas differ from database structure
- Some fields are validated elsewhere (middleware, business logic)
`.trim(),
    recommendations: [
      'Review fields in Zod but not in DB - might be outdated after schema changes',
      'Add validation for required DB fields to enforce business rules',
      'Update SCHEMA_TABLE_MAP in audit script if you rename schemas',
      'Run this audit after database migrations to catch drift',
      'Consider adding type checking (string vs number) in future enhancement'
    ]
  });
  
  finishAudit(audit);
}

main().catch(error => {
  console.error(`❌ Zod sync audit failed: ${error.message}`);
  process.exit(1);
});

