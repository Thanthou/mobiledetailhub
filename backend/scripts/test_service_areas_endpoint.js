const pool = require('../database/pool');

async function testServiceAreasEndpoint() {
  console.log('🔍 Testing service areas endpoint logic...');
  
  try {
    const pool = await getPool();
    if (!pool) {
      console.log('❌ Database connection not available');
      return;
    }
    
    console.log('✅ Database connection established');
    
    // Test the exact query from the endpoint
    const result = await pool.query(`
      SELECT DISTINCT s.state_code, s.name
      FROM states s
      JOIN cities c ON c.state_code = s.state_code
      JOIN affiliate_service_areas asa ON asa.city_id = c.id
      ORDER BY s.name
    `);
    
    console.log(`✅ Query executed successfully`);
    console.log(`📊 Found ${result.rows.length} states with service areas:`);
    
    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        console.log(`   - ${row.name} (${row.state_code})`);
      });
    } else {
      console.log('   No states found - this is likely why the endpoint returns empty results');
      
      // Check if we have any data at all
      const statesCount = await pool.query('SELECT COUNT(*) FROM states');
      const citiesCount = await pool.query('SELECT COUNT(*) FROM cities'); 
      const affiliatesCount = await pool.query('SELECT COUNT(*) FROM affiliates');
      const serviceAreasCount = await pool.query('SELECT COUNT(*) FROM affiliate_service_areas');
      
      console.log('\n📈 Database table counts:');
      console.log(`   States: ${statesCount.rows[0].count}`);
      console.log(`   Cities: ${citiesCount.rows[0].count}`);
      console.log(`   Affiliates: ${affiliatesCount.rows[0].count}`);
      console.log(`   Service Areas: ${serviceAreasCount.rows[0].count}`);
      
      if (serviceAreasCount.rows[0].count === '0') {
        console.log('\n💡 No service areas found. Run the add_test_service_areas.js script to add test data.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
    console.error('Full error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run if called directly
if (require.main === module) {
  testServiceAreasEndpoint()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { testServiceAreasEndpoint };
