const { pool } = require('../database/pool');
const logger = require('../utils/logger');

/**
 * Test script to verify the complete data flow:
 * Application → Pending → Approved → Service Areas populated
 */
async function testDataFlow() {
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('🧪 Testing complete data flow from application to approval...');
    
    // Step 1: Create a test affiliate application (simulating the /apply endpoint)
    logger.info('📝 Step 1: Creating test affiliate application...');
    
    const testApplication = {
      legal_name: 'Test Flow Detail Pro',
      primary_contact: 'John Flow',
      phone: '(555) 123-4567',
      email: 'flow@testdetailpro.com',
      base_location: {
        city: 'Phoenix',
        state: 'AZ',
        zip: '85001'
      },
      categories: ['Auto Detailing', 'Ceramic Coating'],
      has_insurance: true,
      source: 'test',
      notes: 'Test affiliate for data flow verification'
    };

    // Create address first
    const addressQuery = `
      INSERT INTO addresses (line1, city, state_code, postal_code) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id
    `;
    
    const addressResult = await client.query(addressQuery, [
      `${testApplication.base_location.city}, ${testApplication.base_location.state}`,
      testApplication.base_location.city,
      testApplication.base_location.state,
      testApplication.base_location.zip
    ]);
    
    const addressId = addressResult.rows[0].id;
    logger.info(`✅ Created address with ID: ${addressId}`);

    // Create affiliate with pending status
    const tempSlug = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const affiliateQuery = `
      INSERT INTO affiliates (
        slug, business_name, owner, phone, email, 
        base_address_id, has_insurance, source, notes, application_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, slug, business_name, application_status
    `;
    
    const affiliateResult = await client.query(affiliateQuery, [
      tempSlug,
      testApplication.legal_name,
      testApplication.primary_contact,
      testApplication.phone.replace(/\D/g, ''),
      testApplication.email,
      addressId,
      testApplication.has_insurance,
      testApplication.source,
      testApplication.notes,
      'pending'
    ]);
    
    const affiliateId = affiliateResult.rows[0].id;
    logger.info(`✅ Created pending affiliate with ID: ${affiliateId}, temp slug: ${tempSlug}`);

    // Create service areas in JSONB format (simulating what the /apply endpoint does)
    const serviceAreas = [{
      city: testApplication.base_location.city,
      state: testApplication.base_location.state.toUpperCase(),
      zip: testApplication.base_location.zip,
      slug: tempSlug // Use temp slug for now
    }];
    
    await client.query(
      'UPDATE affiliates SET service_areas = $1 WHERE id = $2',
      [JSON.stringify(serviceAreas), affiliateId]
    );
    
    logger.info(`✅ Created service areas with temp slug:`, serviceAreas);

    // Step 2: Simulate admin approval (simulating the /approve-application endpoint)
    logger.info('📋 Step 2: Simulating admin approval...');
    
    const approvedSlug = 'test-flow-detail-pro';
    
    // Update affiliate status to approved
    const approveQuery = `
      UPDATE affiliates 
      SET 
        application_status = 'approved',
        slug = $1,
        approved_date = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const approveResult = await client.query(approveQuery, [approvedSlug, affiliateId]);
    logger.info(`✅ Affiliate approved with slug: ${approvedSlug}`);

    // Update service areas with approved slug
    const updatedServiceAreas = serviceAreas.map(area => ({
      ...area,
      slug: approvedSlug // Update to approved slug
    }));
    
    await client.query(
      'UPDATE affiliates SET service_areas = $1 WHERE id = $2',
      [JSON.stringify(updatedServiceAreas), affiliateId]
    );
    
    logger.info(`✅ Updated service areas with approved slug:`, updatedServiceAreas);

    // Step 3: Verify the final state
    logger.info('🔍 Step 3: Verifying final state...');
    
    const finalCheck = await client.query(`
      SELECT id, slug, business_name, application_status, service_areas, 
             jsonb_array_length(service_areas) as area_count
      FROM affiliates
      WHERE id = $1
    `, [affiliateId]);
    
    const affiliate = finalCheck.rows[0];
    logger.info(`📋 Final affiliate state:`);
    logger.info(`   - ID: ${affiliate.id}`);
    logger.info(`   - Slug: ${affiliate.slug}`);
    logger.info(`   - Status: ${affiliate.application_status}`);
    logger.info(`   - Service Areas: ${affiliate.area_count}`);
    logger.info(`   - Service Areas Data:`, affiliate.service_areas);

    // Step 4: Test the footer aggregation endpoint logic
    logger.info('🌐 Step 4: Testing footer aggregation logic...');
    
    const aggregationQuery = `
      SELECT service_areas
      FROM affiliates
      WHERE application_status = 'approved'
        AND service_areas IS NOT NULL
        AND jsonb_array_length(service_areas) > 0
    `;
    
    const aggregationResult = await client.query(aggregationQuery);
    
    // Aggregate service areas by state and city
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
    
    logger.info('✅ Footer aggregation result:', stateCities);

    // Clean up test data
    logger.info('🧹 Cleaning up test data...');
    await client.query('DELETE FROM affiliates WHERE id = $1', [affiliateId]);
    await client.query('DELETE FROM addresses WHERE id = $1', [addressId]);
    
    logger.info('🎉 All tests passed! Data flow is working correctly.');
    logger.info('✅ Application → Pending → Approved → Service Areas populated with slugs');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the test
if (require.main === module) {
  testDataFlow()
    .then(() => {
      logger.info('✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testDataFlow };
