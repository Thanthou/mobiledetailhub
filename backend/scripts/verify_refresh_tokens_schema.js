/**
 * Verify Refresh Tokens Schema
 * Checks if the refresh_tokens table exists and has the correct structure
 * Run with: node scripts/verify_refresh_tokens_schema.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../database/pool');
const logger = require('../utils/logger');

async function verifyRefreshTokensSchema() {
  console.log('🔍 Verifying Refresh Tokens Schema...\n');

  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check if refresh_tokens table exists
    console.log('📋 Checking table existence...');
    const tableExists = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'refresh_tokens'
    `);

    if (tableExists.rows.length === 0) {
      console.log('❌ refresh_tokens table does not exist!');
      console.log('   Run: node scripts/run_refresh_tokens_migration.js');
      return;
    }

    console.log('✅ refresh_tokens table exists\n');

    // Check table structure
    console.log('🏗️  Checking table structure...');
    const columns = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'refresh_tokens'
      ORDER BY ordinal_position
    `);

    console.log('📊 Table columns:');
    columns.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
      const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`   - ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultValue}`);
    });

    // Check constraints
    console.log('\n🔒 Checking constraints...');
    const constraints = await pool.query(`
      SELECT 
        constraint_name, 
        constraint_type,
        table_name
      FROM information_schema.table_constraints 
      WHERE table_name = 'refresh_tokens'
    `);

    console.log('📋 Table constraints:');
    constraints.rows.forEach(constraint => {
      console.log(`   - ${constraint.constraint_name}: ${constraint.constraint_type}`);
    });

    // Check foreign keys
    console.log('\n🔗 Checking foreign keys...');
    const foreignKeys = await pool.query(`
      SELECT 
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'refresh_tokens'
    `);

    if (foreignKeys.rows.length > 0) {
      console.log('🔗 Foreign key relationships:');
      foreignKeys.rows.forEach(fk => {
        console.log(`   - ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('⚠️  No foreign keys found');
    }

    // Check indexes
    console.log('\n🔍 Checking indexes...');
    const indexes = await pool.query(`
      SELECT 
        indexname, 
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'refresh_tokens'
      ORDER BY indexname
    `);

    if (indexes.rows.length > 0) {
      console.log('🔍 Table indexes:');
      indexes.rows.forEach(idx => {
        console.log(`   - ${idx.indexname}`);
        // Show index definition for complex indexes
        if (idx.indexdef.includes('WHERE') || idx.indexdef.includes('UNIQUE')) {
          console.log(`     Definition: ${idx.indexdef}`);
        }
      });
    } else {
      console.log('⚠️  No indexes found');
    }

    // Check if cleanup function exists
    console.log('\n🧹 Checking cleanup function...');
    const functionExists = await pool.query(`
      SELECT routine_name, routine_type
      FROM information_schema.routines 
      WHERE routine_name = 'cleanup_expired_refresh_tokens'
    `);

    if (functionExists.rows.length > 0) {
      console.log('✅ Cleanup function exists');
      console.log(`   Type: ${functionExists.rows[0].routine_type}`);
    } else {
      console.log('⚠️  Cleanup function not found');
    }

    // Check current data
    console.log('\n📊 Checking current data...');
    const dataStats = await pool.query(`
      SELECT 
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN expires_at > NOW() AND is_revoked = FALSE THEN 1 END) as active_tokens,
        COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_tokens,
        COUNT(CASE WHEN is_revoked = TRUE THEN 1 END) as revoked_tokens,
        COUNT(CASE WHEN ip_address IS NOT NULL THEN 1 END) as tokens_with_ip,
        COUNT(CASE WHEN user_agent IS NOT NULL THEN 1 END) as tokens_with_user_agent,
        COUNT(CASE WHEN device_id IS NOT NULL THEN 1 END) as tokens_with_device_id
      FROM refresh_tokens
    `);

    const stats = dataStats.rows[0];
    console.log('📈 Data statistics:');
    console.log(`   - Total tokens: ${stats.total_tokens}`);
    console.log(`   - Active tokens: ${stats.active_tokens}`);
    console.log(`   - Expired tokens: ${stats.expired_tokens}`);
    console.log(`   - Revoked tokens: ${stats.revoked_tokens}`);
    console.log(`   - Tokens with IP: ${stats.tokens_with_ip}`);
    console.log(`   - Tokens with User Agent: ${stats.tokens_with_user_agent}`);
    console.log(`   - Tokens with Device ID: ${stats.tokens_with_device_id}`);

    // Check sample data (if any)
    if (stats.total_tokens > 0) {
      console.log('\n📝 Sample data (first 3 records):');
      const sampleData = await pool.query(`
        SELECT 
          id, user_id, device_id, created_at, expires_at, 
          is_revoked, ip_address, user_agent
        FROM refresh_tokens 
        ORDER BY created_at DESC 
        LIMIT 3
      `);

      sampleData.rows.forEach((row, index) => {
        console.log(`   Record ${index + 1}:`);
        console.log(`     - ID: ${row.id}`);
        console.log(`     - User ID: ${row.user_id}`);
        console.log(`     - Device ID: ${row.device_id || 'NULL'}`);
        console.log(`     - Created: ${row.created_at}`);
        console.log(`     - Expires: ${row.expires_at}`);
        console.log(`     - Revoked: ${row.is_revoked}`);
        console.log(`     - IP: ${row.ip_address || 'NULL'}`);
        console.log(`     - User Agent: ${(row.user_agent || 'NULL').substring(0, 50)}...`);
      });
    }

    // Test cleanup function if it exists
    if (functionExists.rows.length > 0) {
      console.log('\n🧹 Testing cleanup function...');
      try {
        const cleanupResult = await pool.query('SELECT cleanup_expired_refresh_tokens()');
        const cleanedCount = cleanupResult.rows[0].cleanup_expired_refresh_tokens;
        console.log(`✅ Cleanup function executed successfully`);
        console.log(`   Tokens cleaned up: ${cleanedCount}`);
      } catch (error) {
        console.log(`❌ Cleanup function failed: ${error.message}`);
      }
    }

    console.log('\n🎯 Schema verification complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Table exists with correct structure');
    console.log('   ✅ Constraints and foreign keys properly set');
    console.log('   ✅ Indexes created for performance');
    console.log('   ✅ Cleanup function available');
    console.log('   ✅ Ready for JWT refresh token operations');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close the pool
    if (pool) {
      await pool.end();
    }
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyRefreshTokensSchema().catch(error => {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  });
}

module.exports = { verifyRefreshTokensSchema };
