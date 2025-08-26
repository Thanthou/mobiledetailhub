const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./database/connection');

async function setupJPSAffiliate() {
  try {
    console.log('🔧 Setting up JPS affiliate database structure...');
    
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // First, ensure we have the required states
    console.log('🏛️ Ensuring required states exist...');
    await pool.query(`
      INSERT INTO states (state_code, name) VALUES 
        ('NY', 'New York'),
        ('CA', 'California'),
        ('TX', 'Texas')
      ON CONFLICT (state_code) DO NOTHING
    `);
    console.log('✅ States ensured');
    
    // Check if JPS affiliate exists
    const affiliateResult = await pool.query('SELECT * FROM affiliates WHERE slug = $1', ['jps']);
    
    if (affiliateResult.rows.length === 0) {
      console.log('❌ JPS affiliate not found - cannot proceed');
      return;
    }
    
    const affiliate = affiliateResult.rows[0];
    console.log(`✅ JPS affiliate found: ${affiliate.business_name}`);
    
    // Check if base_address_id is set
    if (!affiliate.base_address_id) {
      console.log('📍 Creating base address for JPS affiliate...');
      
      // Create a base address for JPS (assuming they're in New York)
      const addressResult = await pool.query(`
        INSERT INTO addresses (line1, city, state_code, postal_code, lat, lng) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id
      `, [
        'JPS Auto Detail',
        'New York',
        'NY',
        '10001',
        40.7505,
        -73.9934
      ]);
      
      const addressId = addressResult.rows[0].id;
      console.log(`✅ Created address with ID: ${addressId}`);
      
      // Update the affiliate with the base_address_id
      await pool.query(`
        UPDATE affiliates 
        SET base_address_id = $1 
        WHERE id = $2
      `, [addressId, affiliate.id]);
      
      console.log('✅ Updated affiliate with base_address_id');
      
      // Update the affiliate variable for the rest of the function
      affiliate.base_address_id = addressId;
    } else {
      console.log(`📍 Base address already exists: ${affiliate.base_address_id}`);
    }
    
    // Ensure the city exists in cities table
    console.log('🏙️ Ensuring city exists in cities table...');
    const cityResult = await pool.query(`
      INSERT INTO cities (name, city_slug, state_code) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (name, state_code) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [
      'New York',
      'new-york',
      'NY'
    ]);
    
    const cityId = cityResult.rows[0].id;
    console.log(`✅ City ID: ${cityId}`);
    
    // Check if affiliate_service_areas table exists
    console.log('🔍 Checking affiliate_service_areas table structure...');
    try {
      const tableCheck = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'affiliate_service_areas'
        ORDER BY ordinal_position
      `);
      
      if (tableCheck.rows.length === 0) {
        console.log('❌ affiliate_service_areas table does not exist');
        console.log('💡 You may need to run the schema_init.sql script first');
        return;
      }
      
      console.log('✅ affiliate_service_areas table exists');
      console.log('📋 Columns:');
      tableCheck.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`);
      });
      
      // Check if service area already exists
      const serviceAreaCheck = await pool.query(`
        SELECT * FROM affiliate_service_areas 
        WHERE affiliate_id = $1 AND city = $2
      `, [affiliate.id, 'New York']);
      
      if (serviceAreaCheck.rows.length === 0) {
        console.log('📍 Creating service area for JPS affiliate...');
        
        // Insert service area
        await pool.query(`
          INSERT INTO affiliate_service_areas (affiliate_id, city, state_code, zip) 
          VALUES ($1, $2, $3, $4)
        `, [affiliate.id, 'New York', 'NY', '10001']);
        
        console.log('✅ Service area created');
      } else {
        console.log('✅ Service area already exists');
      }
      
    } catch (err) {
      console.error('❌ Error with affiliate_service_areas table:', err.message);
      console.log('💡 You may need to run the schema_init.sql script first');
    }
    
    // Test the new affiliate route query
    console.log('\n🔍 Testing the new affiliate route query...');
    const testQuery = `
      SELECT 
        a.*,
        addr.city,
        addr.state_code,
        s.name AS state_name,
        addr.postal_code AS zip,
        addr.lat,
        addr.lng
      FROM affiliates a
      LEFT JOIN addresses addr ON addr.id = a.base_address_id
      LEFT JOIN states s ON s.state_code = addr.state_code
      WHERE a.slug = $1
    `;
    
    const result = await pool.query(testQuery, ['jps']);
    
    if (result.rows.length > 0) {
      const affiliate = result.rows[0];
      console.log('✅ New query structure works!');
      console.log(`📋 Business: ${affiliate.business_name}`);
      console.log(`🏙️ City: ${affiliate.city}`);
      console.log(`🏛️ State: ${affiliate.state_code} (${affiliate.state_name})`);
      console.log(`📮 ZIP: ${affiliate.zip}`);
      console.log(`🌍 Coordinates: ${affiliate.lat}, ${affiliate.lng}`);
    }
    
    console.log('\n🎉 JPS affiliate setup completed!');
    console.log('🔗 You can now test the affiliate route with: /api/affiliates/jps');
    
  } catch (err) {
    console.error('💥 Error setting up JPS affiliate:', err);
  } finally {
    await pool.end();
  }
}

setupJPSAffiliate();
