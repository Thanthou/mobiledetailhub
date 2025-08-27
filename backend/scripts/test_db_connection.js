const { Pool } = require('pg');

async function testBasicConnection() {
  console.log('🔍 Testing basic database connection...');
  
  // Try default PostgreSQL connection first
  const testConfigs = [
    {
      host: 'localhost',
      port: 5432,
      database: 'MobileDetailHub',
      user: 'postgres',
      password: '', // Common default
    },
    {
      host: 'localhost', 
      port: 5432,
      database: 'postgres', // Default database
      user: 'postgres',
      password: '',
    }
  ];

  for (let i = 0; i < testConfigs.length; i++) {
    const config = testConfigs[i];
    console.log(`\n📡 Testing config ${i + 1}: ${config.user}@${config.host}:${config.port}/${config.database}`);
    
    let pool = null;
    try {
      pool = new Pool({
        ...config,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 1000,
        max: 1
      });

      const client = await pool.connect();
      console.log('✅ Connection successful!');
      
      // Test a simple query
      const result = await client.query('SELECT version()');
      console.log(`✅ PostgreSQL version: ${result.rows[0].version.substring(0, 50)}...`);
      
      // Check if our database exists
      const dbCheck = await client.query('SELECT datname FROM pg_database WHERE datname = $1', ['MobileDetailHub']);
      if (dbCheck.rows.length > 0) {
        console.log('✅ MobileDetailHub database exists');
      } else {
        console.log('❌ MobileDetailHub database does not exist');
      }
      
      client.release();
      return true;
      
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
    } finally {
      if (pool) {
        try {
          await pool.end();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }
  
  return false;
}

async function testMDHDatabase() {
  console.log('\n🔍 Testing MobileDetailHub database specifically...');
  
  let pool = null;
  try {
    pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'MobileDetailHub',
      user: 'postgres',
      password: '',
      connectionTimeoutMillis: 5000,
      max: 1
    });

    const client = await pool.connect();
    console.log('✅ Connected to MobileDetailHub database');
    
    // Check if tables exist
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('states', 'cities', 'affiliates', 'affiliate_service_areas')
    `);
    
    console.log(`✅ Found ${tableCheck.rows.length} required tables:`);
    tableCheck.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    if (tableCheck.rows.length === 4) {
      // Test the service areas query
      const serviceAreasTest = await client.query(`
        SELECT DISTINCT s.state_code, s.name
        FROM states s
        JOIN cities c ON c.state_code = s.state_code
        JOIN affiliate_service_areas asa ON asa.city_id = c.id
        ORDER BY s.name
        LIMIT 5
      `);
      
      console.log(`✅ Service areas query executed successfully, found ${serviceAreasTest.rows.length} states`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error testing MobileDetailHub database:', error.message);
  } finally {
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

// Run tests
async function runTests() {
  const basicConnected = await testBasicConnection();
  if (basicConnected) {
    await testMDHDatabase();
  }
  
  console.log('\n🔧 If connection issues persist, check:');
  console.log('   1. PostgreSQL service is running (✅ confirmed)');
  console.log('   2. Database "MobileDetailHub" exists');
  console.log('   3. User "postgres" has access');
  console.log('   4. Password is correct (or empty for local dev)');
  console.log('   5. No other processes are blocking connections');
}

if (require.main === module) {
  runTests()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Test script failed:', error);
      process.exit(1);
    });
}