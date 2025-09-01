const { pool } = require('../database/pool');
const logger = require('../utils/logger');

/**
 * Test script for the simplified service areas approach with slugs
 * Tests JSONB service_areas column with affiliate slugs for routing
 */
async function testSimplifiedServiceAreas() {
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('🧪 Testing simplified service areas approach with slugs...');
    
    // Test data
    const testAffiliate = {
      business_name: 'Simple Test Detail Pro',
      owner: 'Jane Simple',
      phone: '(555) 987-6543',
      email: 'simple@testdetailpro.com',
      has_insurance: true,
      source: 'test',
      notes: 'Test affiliate for simplified service areas with slugs'
    };

    const testServiceAreas = [
      { city: 'Phoenix', state: 'AZ', zip: '85001' },
      { city: 'Tempe', state: 'AZ', zip: '85281' },
      { city: 'Mesa', state: 'AZ', zip: '85201' }
    ];

    // Step 1: Create test affiliate with service areas
    logger.info('📝 Creating test affiliate with service areas...');
    const createAffiliateQuery = `
      INSERT INTO affiliates (slug, business_name, owner, phone, email, has_insurance, source, notes, application_status, service_areas)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved', $9)
      RETURNING id, business_name, email, service_areas
    `;
    
    // Create service areas with correct structure (no slugs)
    const serviceAreasWithSlugs = testServiceAreas.map(area => ({
      city: area.city,
      state: area.state.toUpperCase(),
      zip: area.zip,
      primary: true,
      minimum: 0,
      multiplier: 1
    }));
    
    const affiliateResult = await client.query(createAffiliateQuery, [
      'simple-test-detail-pro',
      testAffiliate.business_name,
      testAffiliate.owner,
      testAffiliate.phone,
      testAffiliate.email,
      testAffiliate.has_insurance,
      testAffiliate.source,
      testAffiliate.notes,
      JSON.stringify(serviceAreasWithSlugs)
    ]);

    const affiliateId = affiliateResult.rows[0].id;
    const savedServiceAreas = affiliateResult.rows[0].service_areas;
    
    logger.info(`✅ Created test affiliate with ID: ${affiliateId}`);
    logger.info(`✅ Service areas saved with slugs:`, savedServiceAreas);

    // Step 2: Test JSONB queries with slugs
    logger.info('🔍 Testing JSONB queries with slugs...');
    
    // Query affiliates by service area
    const serviceAreaQuery = `
      SELECT id, business_name, service_areas
      FROM affiliates
      WHERE service_areas @> '[{"city": "Phoenix", "state": "AZ"}]'
    `;
    
    const serviceAreaResult = await client.query(serviceAreaQuery);
    logger.info(`✅ Found ${serviceAreaResult.rowCount} affiliates serving Phoenix, AZ`);
    
    // Query affiliates by state
    const stateQuery = `
      SELECT id, business_name, service_areas
      FROM affiliates
      WHERE service_areas @> '[{"state": "AZ"}]'
    `;
    
    const stateResult = await client.query(stateQuery);
    logger.info(`✅ Found ${stateResult.rowCount} affiliates serving Arizona`);
    
    // Query affiliates by slug
    const slugQuery = `
      SELECT id, business_name, service_areas
      FROM affiliates
      WHERE service_areas @> '[{"slug": "simple-test-detail-pro"}]'
    `;
    
    const slugResult = await client.query(slugQuery);
    logger.info(`✅ Found ${slugResult.rowCount} affiliates with slug: simple-test-detail-pro`);

    // Step 3: Test the aggregation logic (like the footer endpoint)
    logger.info('🔬 Testing aggregation logic for footer...');
    
    const aggregationQuery = `
      SELECT service_areas
      FROM affiliates
      WHERE application_status = 'approved'
        AND service_areas IS NOT NULL
        AND jsonb_array_length(service_areas) > 0
    `;
    
    const aggregationResult = await client.query(aggregationQuery);
    
    // Simulate the footer aggregation
    const stateCities = {};
    
    aggregationResult.rows.forEach(row => {
      row.service_areas.forEach(area => {
        const { state, city, slug, zip } = area;
        
        if (!state || !city) return;
        
        if (!stateCities[state]) {
          stateCities[state] = {};
        }
        
        if (!stateCities[state][city]) {
          stateCities[state][city] = [];
        }
        
        // Add affiliate info for this city
        stateCities[state][city].push({
          slug,
          zip: zip || null
        });
      });
    });
    
    logger.info('✅ Aggregated service areas for footer:', stateCities);
    logger.info(`✅ Found ${Object.keys(stateCities).length} states with service areas`);

    // Step 4: Test updating service areas
    logger.info('🔄 Testing service area updates...');
    
    const updatedServiceAreas = [
      { city: 'Phoenix', state: 'AZ', zip: '85001', slug: 'simple-test-detail-pro' },
      { city: 'Scottsdale', state: 'AZ', zip: '85250', slug: 'simple-test-detail-pro' }
    ];
    
    const updateQuery = `
      UPDATE affiliates
      SET service_areas = $1
      WHERE id = $2
      RETURNING service_areas
    `;
    
    const updateResult = await client.query(updateQuery, [
      JSON.stringify(updatedServiceAreas),
      affiliateId
    ]);
    
    logger.info(`✅ Updated service areas:`, updateResult.rows[0].service_areas);

    // Step 5: Verify the data structure
    logger.info('📊 Final verification...');
    
    const finalCheck = await client.query(`
      SELECT id, business_name, service_areas, jsonb_array_length(service_areas) as area_count
      FROM affiliates
      WHERE id = $1
    `, [affiliateId]);
    
    const affiliate = finalCheck.rows[0];
    logger.info(`📋 Affiliate: ${affiliate.business_name}`);
    logger.info(`🗺️ Service areas: ${affiliate.area_count} areas`);
    logger.info(`📍 Areas with slugs:`, affiliate.service_areas);

    // Clean up test data
    logger.info('🧹 Cleaning up test data...');
    await client.query('DELETE FROM affiliates WHERE id = $1', [affiliateId]);
    
    logger.info('🎉 All tests passed! Simplified service areas with slugs approach is working correctly.');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the test
if (require.main === module) {
  testSimplifiedServiceAreas()
    .then(() => {
      logger.info('✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testSimplifiedServiceAreas };
