const { getPool } = require('../database/connection');

async function addTestServiceAreas() {
  const pool = await getPool();
  
  if (!pool) {
    console.log('❌ Database connection not available');
    process.exit(1);
  }

  try {
    console.log('📍 Adding test cities and service areas...');

    // Add some test cities
    const cityResult = await pool.query(`
      INSERT INTO cities (name, state_code) 
      VALUES 
        ('Phoenix', 'AZ'),
        ('Tucson', 'AZ'),
        ('Las Vegas', 'NV'),
        ('Miami', 'FL'),
        ('Orlando', 'FL')
      ON CONFLICT (name, state_code) DO NOTHING
      RETURNING id, name, state_code
    `);

    console.log(`✅ Added ${cityResult.rows.length} cities`);

    // Add a test affiliate if none exists
    const affiliateCheck = await pool.query('SELECT COUNT(*) FROM affiliates');
    const affiliateCount = parseInt(affiliateCheck.rows[0].count);
    
    let affiliateId;
    if (affiliateCount === 0) {
      const affiliateResult = await pool.query(`
        INSERT INTO affiliates (slug, business_name, owner, phone, email, application_status)
        VALUES ('test-detailing', 'Test Detailing Co', 'Test Owner', '(555) 123-4567', 'test@example.com', 'approved')
        RETURNING id
      `);
      affiliateId = affiliateResult.rows[0].id;
      console.log(`✅ Added test affiliate with ID: ${affiliateId}`);
    } else {
      const existingAffiliate = await pool.query('SELECT id FROM affiliates LIMIT 1');
      affiliateId = existingAffiliate.rows[0].id;
      console.log(`✅ Using existing affiliate with ID: ${affiliateId}`);
    }

    // Get all city IDs for service areas
    const cities = await pool.query('SELECT id FROM cities LIMIT 5');
    
    // Add service areas for the affiliate
    for (const city of cities.rows) {
      await pool.query(`
        INSERT INTO affiliate_service_areas (affiliate_id, city_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [affiliateId, city.id]);
    }

    console.log(`✅ Added service areas for ${cities.rows.length} cities`);

    // Verify the data
    const verifyResult = await pool.query(`
      SELECT DISTINCT s.state_code, s.name, COUNT(asa.id) as service_area_count
      FROM states s
      JOIN cities c ON c.state_code = s.state_code
      JOIN affiliate_service_areas asa ON asa.city_id = c.id
      GROUP BY s.state_code, s.name
      ORDER BY s.name
    `);

    console.log('\n📊 Current service areas:');
    verifyResult.rows.forEach(row => {
      console.log(`   ${row.name} (${row.state_code}): ${row.service_area_count} areas`);
    });

    console.log('\n✅ Test data setup complete!');
    
  } catch (error) {
    console.error('❌ Error adding test service areas:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  addTestServiceAreas()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addTestServiceAreas };
