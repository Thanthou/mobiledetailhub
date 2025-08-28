const { pool } = require('../database/pool');
const logger = require('../utils/logger');

/**
 * Test the new footer service areas endpoint logic
 */
async function testFooterEndpoint() {
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('Testing footer service areas query...');
    
    // Test the query that the endpoint will use
    const result = await client.query(`
      SELECT id, slug, service_areas
      FROM affiliates 
      WHERE application_status = 'approved' 
        AND service_areas IS NOT NULL
        AND JSONB_ARRAY_LENGTH(service_areas) > 0
    `);
    
    logger.info(`Found ${result.rowCount} affiliates with service areas`);
    
    // Process the data like the endpoint does
    const serviceAreasMap = {};
    
    result.rows.forEach(affiliate => {
      logger.info(`Processing affiliate ${affiliate.slug}:`, affiliate.service_areas);
      
      if (affiliate.service_areas && Array.isArray(affiliate.service_areas)) {
        affiliate.service_areas.forEach(area => {
          const state = area.state?.toUpperCase();
          const city = area.city;
          const slug = affiliate.slug;
          
          logger.info(`  Area: ${city}, ${state} -> ${slug}`);
          
          if (state && city && slug) {
            if (!serviceAreasMap[state]) {
              serviceAreasMap[state] = {};
            }
            if (!serviceAreasMap[state][city]) {
              serviceAreasMap[state][city] = [];
            }
            // Add slug if not already present
            if (!serviceAreasMap[state][city].includes(slug)) {
              serviceAreasMap[state][city].push(slug);
            }
          }
        });
      }
    });
    
    logger.info('Final service areas map:');
    logger.info(JSON.stringify(serviceAreasMap, null, 2));
    
    logger.info(`✅ Processed service areas for ${Object.keys(serviceAreasMap).length} states`);
    
  } catch (error) {
    logger.error('❌ Error testing footer endpoint:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  testFooterEndpoint()
    .then(() => {
      logger.info('✅ Footer endpoint test completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Footer endpoint test failed:', error);
      process.exit(1);
    });
}

module.exports = { testFooterEndpoint };
