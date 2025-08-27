#!/usr/bin/env node

/**
 * Refresh Tokens Migration Runner
 * Runs the database migration to create the refresh_tokens table
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../database/pool');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

/**
 * Parse SQL content into individual statements
 * Handles multi-line statements and function definitions properly
 */
function parseSQLStatements(sqlContent) {
  const statements = [];
  let currentStatement = '';
  let inFunction = false;
  let braceCount = 0;
  
  const lines = sqlContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('--')) {
      continue;
    }
    
    // Check if we're entering a function definition
    if (trimmedLine.includes('CREATE OR REPLACE FUNCTION') || trimmedLine.includes('CREATE FUNCTION')) {
      inFunction = true;
      braceCount = 0;
    }
    
    // Count braces in function definitions
    if (inFunction) {
      braceCount += (trimmedLine.match(/\{/g) || []).length;
      braceCount -= (trimmedLine.match(/\}/g) || []).length;
    }
    
    // Add line to current statement
    currentStatement += line + '\n';
    
    // Check if statement is complete
    if (trimmedLine.endsWith(';') && !inFunction) {
      // Regular statement
      statements.push(currentStatement.trim());
      currentStatement = '';
    } else if (inFunction && braceCount === 0 && trimmedLine.includes('$$')) {
      // Function definition complete
      statements.push(currentStatement.trim());
      currentStatement = '';
      inFunction = false;
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  // Filter out empty statements and clean up
  return statements
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
}

async function runMigration() {
  console.log('🚀 Starting Refresh Tokens Migration...\n');
  
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT 1');
    
    console.log('✅ Database connection established');
    
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'add_refresh_tokens_table.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    
    console.log('📖 SQL migration file loaded');
    
    // Parse SQL statements more intelligently
    const statements = parseSQLStatements(sqlContent);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty or comment-only statements
      if (!statement || statement.startsWith('--')) {
        continue;
      }
      
      try {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
        
        // Execute the statement
        await pool.query(statement);
        
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        // Handle specific errors gracefully
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
        } else {
          console.log(`❌ Statement ${i + 1} failed: ${error.message}`);
          throw error;
        }
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
    // Verify the table was created
    console.log('\n🔍 Verifying migration...');
    
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'refresh_tokens'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ refresh_tokens table exists');
      
      // Check table structure
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'refresh_tokens'
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Table structure:');
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
      
      // Check indexes
      const indexes = await pool.query(`
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'refresh_tokens'
      `);
      
      if (indexes.rows.length > 0) {
        console.log('\n🔗 Indexes created:');
        indexes.rows.forEach(idx => {
          console.log(`   - ${idx.indexname}`);
        });
      }
      
    } else {
      throw new Error('❌ refresh_tokens table was not created');
    }
    
    // Check if cleanup function exists
    const functionCheck = await pool.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_name = 'cleanup_expired_refresh_tokens'
    `);
    
    if (functionCheck.rows.length > 0) {
      console.log('✅ Cleanup function exists');
    } else {
      console.log('⚠️  Cleanup function not found (this is optional)');
    }
    
    console.log('\n🎯 Migration verification complete!');
    console.log('🚀 Your JWT security system is ready to use.');
    
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    
    if (error.message.includes('relation "refresh_tokens" already exists')) {
      console.log('\n💡 The refresh_tokens table already exists.');
      console.log('   You can skip this migration or drop the table first.');
    }
    
    process.exit(1);
  } finally {
    // Close the pool
    if (pool) {
      await pool.end();
    }
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration().catch(error => {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runMigration };
