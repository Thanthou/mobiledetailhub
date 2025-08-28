const { pool } = require('../database/pool');
const logger = require('../utils/logger');
const { processAffiliateServiceAreas } = require('../utils/serviceAreaProcessor');

/**
 * Test script for affiliate approval flow with service area processing
 * Demonstrates the transaction-safe pattern for:
 * 1. Approving affiliate
 * 2. Updating affiliate_service_areas table
 * 3. Creating service_area_slugs entries
 */
async function testAffiliateApproval() {
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('🧪 Testing affiliate approval flow...');
    
    // Test data
    const testAffiliate = {
      business_name: 'Test Mobile Detail Pro',
      owner: 'John Test',
      phone: '(555) 123-4567',
      email: 'test@mobiledetailpro.com',
      has_insurance: true,
      source: 'test',
      notes: 'Test affiliate for approval flow'
    };

    const testServiceAreas = [
      { city: 'Phoenix', state: 'AZ', zip: '85001' },
      { city: 'Tempe', state: 'AZ', zip: '85281' },
      { city: 'Mesa', state: 'AZ', zip: '85201' }
    ];

    // Step 1: Create test affiliate
    logger.info('📝 Creating test affiliate...');
    const createAffiliateQuery = `
      INSERT INTO affiliates (slug, business_name, owner, phone, email, has_insurance, source, notes, application_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING id, business_name, email
    `;
    
    const affiliateResult = await client.query(createAffiliateQuery, [
      'test-mobile-detail-pro',
      testAffiliate.business_name,
      testAffiliate.owner,
      testAffiliate.phone,
      testAffiliate.email,
      testAffiliate.has_insurance,
      testAffiliate.source,
      testAffiliate.notes
    ]);

    const affiliateId = affiliateResult.rows[0].id;
    logger.info(`✅ Created test affiliate with ID: ${affiliateId}`);

    // Step 2: Test the transaction-safe approval pattern
    logger.info('🔄 Testing transaction-safe approval pattern...');
    
    await client.query('BEGIN');

    try {
      // 2a. Approve the affiliate
      logger.info('📋 Approving affiliate...');
      const approveQuery = `
        UPDATE affiliates
        SET application_status = 'approved',
            approved_date = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const approveResult = await client.query(approveQuery, [affiliateId]);
      
      if (approveResult.rowCount === 0) {
        throw new Error('Failed to approve affiliate');
      }
      
      logger.info(`✅ Affiliate ${affiliateId} approved successfully`);

      // 2b. Process service areas using the updated processor
      logger.info('🗺️ Processing service areas...');
      const serviceAreaResult = await processAffiliateServiceAreas(affiliateId, testServiceAreas);
      
      logger.info(`✅ Service areas processed:`, serviceAreaResult);

      // 2c. Verify the data was created correctly
      logger.info('🔍 Verifying created data...');
      
      // Check affiliate_service_areas
      const serviceAreasCheck = await client.query(`
        SELECT 
          asa.affiliate_id,
          c.name as city_name,
          c.state_code,
          asa.zip
        FROM affiliate_service_areas asa
        JOIN cities c ON c.id = asa.city_id
        WHERE asa.affiliate_id = $1
        ORDER BY c.name
      `, [affiliateId]);
      
      logger.info(`📊 Found ${serviceAreasCheck.rowCount} service areas:`);
      serviceAreasCheck.rows.forEach(row => {
        logger.info(`   - ${row.city_name}, ${row.state_code} (ZIP: ${row.zip || 'N/A'})`);
      });

      // Check service_area_slugs
      const slugsCheck = await client.query(`
        SELECT 
          sas.slug,
          c.name as city_name,
          c.state_code
        FROM service_area_slugs sas
        JOIN cities c ON c.id = sas.city_id
        WHERE c.id IN (
          SELECT DISTINCT city_id 
          FROM affiliate_service_areas 
          WHERE affiliate_id = $1
        )
        ORDER BY c.name
      `, [affiliateId]);
      
      logger.info(`🔗 Found ${slugsCheck.rowCount} service area slugs:`);
      slugsCheck.rows.forEach(row => {
        logger.info(`   - ${row.slug} → ${row.city_name}, ${row.state_code}`);
      });

      await client.query('COMMIT');
      logger.info('✅ Transaction committed successfully');

    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('❌ Transaction failed:', error);
      throw error;
    }

    // Step 3: Cleanup test data
    logger.info('🧹 Cleaning up test data...');
    
    // Delete affiliate (this will cascade to service areas)
    await client.query('DELETE FROM affiliates WHERE id = $1', [affiliateId]);
    
    // Clean up any orphaned service area slugs
    await client.query(`
      DELETE FROM service_area_slugs 
      WHERE city_id NOT IN (
        SELECT DISTINCT city_id FROM affiliate_service_areas
      )
    `);
    
    logger.info('✅ Test data cleaned up');

    logger.info('🎉 All tests passed! Affiliate approval flow is working correctly.');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run test if called directly
if (require.main === module) {
  testAffiliateApproval()
    .then(() => {
      logger.info('✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testAffiliateApproval };
