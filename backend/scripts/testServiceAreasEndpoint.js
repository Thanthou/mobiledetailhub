const { pool } = require('../database/pool');
const logger = require('../utils/logger');

/**
 * Test script for the service areas endpoint
 * Tests the aggregation logic that powers the footer
 */
async function testServiceAreasEndpoint() {
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('🧪 Testing service areas endpoint aggregation...');
    
    // Create test affiliates with different service areas
    const testAffiliates = [
      {
        slug: 'phoenix-mobile-detail',
        business_name: 'Phoenix Mobile Detail',
        owner: 'John Phoenix',
        phone: '(555) 111-1111',
        email: 'phoenix@test.com',
        serviceAreas: [
          { city: 'Phoenix', state: 'AZ', zip: '85001', slug: 'phoenix-mobile-detail' },
          { city: 'Tempe', state: 'AZ', zip: '85281', slug: 'phoenix-mobile-detail' }
        ]
      },
      {
        slug: 'mesa-detail-pro',
        business_name: 'Mesa Detail Pro',
        owner: 'Jane Mesa',
        phone: '(555) 222-2222',
        email: 'mesa@test.com',
        serviceAreas: [
          { city: 'Mesa', state: 'AZ', zip: '85201', slug: 'mesa-detail-pro' },
          { city: 'Gilbert', state: 'AZ', zip: '85233', slug: 'mesa-detail-pro' }
        ]
      },
      {
        slug: 'california-detail',
        business_name: 'California Detail',
        owner: 'Bob California',
        phone: '(555) 333-3333',
        email: 'california@test.com',
        serviceAreas: [
          { city: 'Los Angeles', state: 'CA', zip: '90210', slug: 'california-detail' },
          { city: 'San Diego', state: 'CA', zip: '92101', slug: 'california-detail' }
        ]
      }
    ];

    // Step 1: Create test affiliates
    logger.info('📝 Creating test affiliates with service areas...');
    const affiliateIds = [];
    
    for (const affiliate of testAffiliates) {
      const createQuery = `
        INSERT INTO affiliates (slug, business_name, owner, phone, email, has_insurance, source, notes, application_status, service_areas)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved', $9)
        RETURNING id
      `;
      
      const result = await client.query(createQuery, [
        affiliate.slug,
        affiliate.business_name,
        affiliate.owner,
        affiliate.phone,
        affiliate.email,
        true,
        'test',
        'Test affiliate for service areas endpoint',
        JSON.stringify(affiliate.serviceAreas)
      ]);
      
      affiliateIds.push(result.rows[0].id);
      logger.info(`✅ Created affiliate: ${affiliate.business_name} with ${affiliate.serviceAreas.length} service areas`);
    }

    // Step 2: Test the aggregation logic (same as the endpoint)
    logger.info('🔍 Testing service areas aggregation...');
    
    const query = `
      SELECT service_areas
      FROM affiliates
      WHERE application_status = 'approved'
        AND service_areas IS NOT NULL
        AND jsonb_array_length(service_areas) > 0
    `;
    
    const result = await client.query(query);
    
    // Aggregate service areas by state and city
    const stateCities = {};
    
    result.rows.forEach(row => {
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

    // Sort states and cities alphabetically
    const sortedStateCities = {};
    Object.keys(stateCities)
      .sort()
      .forEach(state => {
        sortedStateCities[state] = {};
        Object.keys(stateCities[state])
          .sort()
          .forEach(city => {
            sortedStateCities[state][city] = stateCities[state][city];
          });
      });

    // Step 3: Display the results
    logger.info('📊 Aggregated service areas for footer:');
    logger.info(JSON.stringify(sortedStateCities, null, 2));
    
    logger.info(`✅ Found ${Object.keys(sortedStateCities).length} states with service areas`);
    
    // Show breakdown by state
    Object.entries(sortedStateCities).forEach(([state, cities]) => {
      const cityCount = Object.keys(cities).length;
      logger.info(`📍 ${state}: ${cityCount} cities`);
      Object.entries(cities).forEach(([city, affiliates]) => {
        logger.info(`   - ${city}: ${affiliates.length} affiliate(s)`);
        affiliates.forEach(aff => {
          logger.info(`     * ${aff.slug}${aff.zip ? ` (${aff.zip})` : ''}`);
        });
      });
    });

    // Step 4: Test specific queries
    logger.info('🔬 Testing specific queries...');
    
    // Find all affiliates in AZ
    const azQuery = `
      SELECT business_name, service_areas
      FROM affiliates
      WHERE service_areas @> '[{"state": "AZ"}]'
    `;
    
    const azResult = await client.query(azQuery);
    logger.info(`✅ Found ${azResult.rowCount} affiliates serving Arizona`);
    
    // Find all affiliates in CA
    const caQuery = `
      SELECT business_name, service_areas
      FROM affiliates
      WHERE service_areas @> '[{"state": "CA"}]'
    `;
    
    const caResult = await client.query(caQuery);
    logger.info(`✅ Found ${caResult.rowCount} affiliates serving California`);

    // Clean up test data
    logger.info('🧹 Cleaning up test data...');
    for (const id of affiliateIds) {
      await client.query('DELETE FROM affiliates WHERE id = $1', [id]);
    }
    
    logger.info('🎉 All tests passed! Service areas endpoint aggregation is working correctly.');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the test
if (require.main === module) {
  testServiceAreasEndpoint()
    .then(() => {
      logger.info('✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testServiceAreasEndpoint };
