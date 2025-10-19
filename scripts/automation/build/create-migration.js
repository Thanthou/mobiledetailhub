#!/usr/bin/env node

/**
 * Migration Template Generator
 * 
 * Creates migration files with proper templates for common patterns
 * 
 * Usage: node database/scripts/create-migration.js <type> <description>
 * Types: table, column, index, data, constraint
 */

const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../migrations');

/**
 * Generate migration filename with timestamp
 */
function generateMigrationName(description) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const slug = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
  
  return `${timestamp}_${slug}.sql`;
}

/**
 * Generate table creation template
 */
function generateTableTemplate(description, tableName) {
  return `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Create ${tableName} table
CREATE TABLE ${tableName} (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
-- CREATE INDEX idx_${tableName}_created_at ON ${tableName}(created_at);

-- ROLLBACK:
-- DROP TABLE IF EXISTS ${tableName};
`;
}

/**
 * Generate column addition template
 */
function generateColumnTemplate(description, tableName, columnName, columnType) {
  return `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Add ${columnName} column to ${tableName}
ALTER TABLE ${tableName} 
ADD COLUMN ${columnName} ${columnType};

-- Add index if needed
-- CREATE INDEX idx_${tableName}_${columnName} ON ${tableName}(${columnName});

-- ROLLBACK:
-- ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName};
`;
}

/**
 * Generate index creation template
 */
function generateIndexTemplate(description, tableName, indexName, columns) {
  return `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Create index on ${tableName}
CREATE INDEX ${indexName} ON ${tableName}(${columns});

-- ROLLBACK:
-- DROP INDEX IF EXISTS ${indexName};
`;
}

/**
 * Generate data migration template
 */
function generateDataTemplate(description) {
  return `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Data migration
-- Example: UPDATE table_name SET column_name = 'new_value' WHERE condition;

-- ROLLBACK:
-- UPDATE table_name SET column_name = 'old_value' WHERE condition;
`;
}

/**
 * Generate constraint template
 */
function generateConstraintTemplate(description, tableName, constraintName, constraintType) {
  return `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Add constraint to ${tableName}
ALTER TABLE ${tableName} 
ADD CONSTRAINT ${constraintName} ${constraintType};

-- ROLLBACK:
-- ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};
`;
}

/**
 * Generate generic template
 */
function generateGenericTemplate(description) {
  return `-- Migration: ${description}
-- Created: ${new Date().toISOString()}

-- Add your migration SQL here
-- Example:
-- CREATE TABLE example_table (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Remember to include rollback instructions in comments
-- ROLLBACK:
-- DROP TABLE IF EXISTS example_table;
`;
}

/**
 * Main function
 */
function main() {
  const type = process.argv[2];
  const description = process.argv[3];
  const tableName = process.argv[4];
  const additional = process.argv[5];

  if (!type || !description) {
    console.log('Migration Template Generator\n');
    console.log('Usage:');
    console.log('  node create-migration.js table "create users table" users');
    console.log('  node create-migration.js column "add phone to users" users phone VARCHAR(20)');
    console.log('  node create-migration.js index "add email index" users idx_users_email email');
    console.log('  node create-migration.js data "migrate user data"');
    console.log('  node create-migration.js constraint "add unique email" users uk_users_email "UNIQUE (email)"');
    console.log('  node create-migration.js generic "custom migration"');
    process.exit(1);
  }

  const filename = generateMigrationName(description);
  const filePath = path.join(migrationsDir, filename);

  let template;

  switch (type) {
    case 'table':
      if (!tableName) {
        console.error('❌ Table name required for table migration');
        process.exit(1);
      }
      template = generateTableTemplate(description, tableName);
      break;
    
    case 'column':
      if (!tableName || !additional) {
        console.error('❌ Table name and column type required for column migration');
        process.exit(1);
      }
      template = generateColumnTemplate(description, tableName, additional, process.argv[6] || 'VARCHAR(255)');
      break;
    
    case 'index':
      if (!tableName || !additional) {
        console.error('❌ Table name and index name required for index migration');
        process.exit(1);
      }
      template = generateIndexTemplate(description, tableName, additional, process.argv[6] || 'id');
      break;
    
    case 'data':
      template = generateDataTemplate(description);
      break;
    
    case 'constraint':
      if (!tableName || !additional) {
        console.error('❌ Table name and constraint name required for constraint migration');
        process.exit(1);
      }
      template = generateConstraintTemplate(description, tableName, additional, process.argv[6] || 'CHECK (id > 0)');
      break;
    
    case 'generic':
    default:
      template = generateGenericTemplate(description);
      break;
  }

  // Ensure migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  // Write the migration file
  fs.writeFileSync(filePath, template);
  
  console.log(`✅ Created migration: ${filename}`);
  console.log(`   Path: ${filePath}`);
  console.log(`   Type: ${type}`);
  console.log(`   Description: ${description}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  generateMigrationName,
  generateTableTemplate,
  generateColumnTemplate,
  generateIndexTemplate,
  generateDataTemplate,
  generateConstraintTemplate,
  generateGenericTemplate
};
