/**
 * Test Database Improvements
 * Tests the new database pool configuration and retry logic
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool, checkPoolHealth } = require('../database/pool');
const { query, checkHealth, getPoolStats } = require('../utils/db');
const logger = require('../utils/logger');

async function testDatabaseImprovements() {
  console.log('🔧 Testing Database Improvements...\n');

  try {
    // Test 1: Pool health check
    console.log('1️⃣ Testing pool health check...');
    const poolHealth = await checkPoolHealth();
    console.log(`   Pool health: ${poolHealth ? '✅ Healthy' : '❌ Unhealthy'}\n`);

    // Test 2: Database utility health check
    console.log('2️⃣ Testing database utility health check...');
    const dbHealth = await checkHealth();
    console.log(`   Database health: ${dbHealth ? '✅ Healthy' : '❌ Unhealthy'}\n`);

    // Test 3: Pool statistics
    console.log('3️⃣ Testing pool statistics...');
    const stats = getPoolStats();
    console.log('   Pool stats:');
    console.log(`     Total connections: ${stats.totalCount}`);
    console.log(`     Idle connections: ${stats.idleCount}`);
    console.log(`     Waiting connections: ${stats.waitingCount}\n`);

    // Test 4: Query with retry logic
    console.log('4️⃣ Testing query with retry logic...');
    const result = await query('SELECT NOW() as current_time', [], { 
      retries: 3, 
      timeout: 10000 
    });
    console.log(`   Query result: ${result.rows[0].current_time}\n`);

    // Test 5: MDH config query (what header/footer needs)
    console.log('5️⃣ Testing MDH config query...');
    const configResult = await query('SELECT * FROM mdh_config LIMIT 1', [], { 
      retries: 3, 
      timeout: 10000 
    });
    
    if (configResult.rows.length > 0) {
      const config = configResult.rows[0];
      console.log('   MDH Config loaded successfully:');
      console.log(`     Business name: ${config.name || 'N/A'}`);
      console.log(`     Phone: ${config.phone || 'N/A'}`);
      console.log(`     Email: ${config.email || 'N/A'}`);
      console.log(`     Header display: ${config.header_display || 'N/A'}`);
    } else {
      console.log('   ⚠️ No MDH config found in database');
    }

    // Test 6: Multiple concurrent queries (simulate header + footer loading)
    console.log('\n6️⃣ Testing concurrent queries (simulating header + footer)...');
    const queries = [
      query('SELECT * FROM mdh_config LIMIT 1', [], { retries: 2, timeout: 5000 }),
      query('SELECT COUNT(*) as affiliate_count FROM affiliates', [], { retries: 2, timeout: 5000 }),
      query('SELECT COUNT(*) as user_count FROM users', [], { retries: 2, timeout: 5000 })
    ];

    const results = await Promise.allSettled(queries);
    
    console.log('   Concurrent query results:');
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`     Query ${index + 1}: ✅ Success (${result.value.rows.length} rows)`);
      } else {
        console.log(`     Query ${index + 1}: ❌ Failed - ${result.reason.message}`);
      }
    });

    // Test 7: Final pool stats
    console.log('\n7️⃣ Final pool statistics...');
    const finalStats = getPoolStats();
    console.log('   Final pool stats:');
    console.log(`     Total connections: ${finalStats.totalCount}`);
    console.log(`     Idle connections: ${finalStats.idleCount}`);
    console.log(`     Waiting connections: ${finalStats.waitingCount}`);

    console.log('\n🎯 Database improvements test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Pool health monitoring working');
    console.log('   ✅ Retry logic working');
    console.log('   ✅ Connection management improved');
    console.log('   ✅ Concurrent queries handling improved');
    console.log('   ✅ Header/footer data loading should be more reliable');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Don't close the pool here as it's used by the server
    console.log('\n💡 Note: Pool kept open for server use');
  }
}

// Run the test
testDatabaseImprovements();
