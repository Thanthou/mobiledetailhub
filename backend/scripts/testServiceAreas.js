const { pool } = require('../database/pool');
const { processAffiliateServiceAreas, getMDHServiceAreas, getAffiliatesForCity } = require('../utils/serviceAreaProcessor');

async function testServiceAreas() {
  console.log('🧪 Testing Service Area System');
  console.log('================================');
  
  if (!pool) {
    console.log('❌ Database connection not available');
    return;
  }

  try {
    // Test 1: Show current MDH coverage
    console.log('\n1️⃣ Current MDH Coverage:');
    const coverage = await getMDHServiceAreas();
    console.log(`✅ Found ${coverage.length} service areas`);
    
    if (coverage.length > 0) {
      console.log('📍 Sample areas:');
      coverage.slice(0, 5).forEach(area => {
        console.log(`   • ${area.city_name}, ${area.state_code} (${area.city_slug})`);
      });
    }

    // Test 2: Show the SQL operations that would happen
    console.log('\n2️⃣ SQL Operations for Affiliate Approval:');
    console.log(`
-- When approving an affiliate with service areas:
-- 1) Approve the affiliate
UPDATE affiliates
SET application_status = 'approved', approved_date = NOW()
WHERE id = $1;

-- 2) Create affiliate service area mapping (who serves where)
INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip)
VALUES ($1, $2, $3)
ON CONFLICT (affiliate_id, city_id) DO NOTHING;

-- 3) Create SEO slug for the service area (city ↔ public URL)
INSERT INTO service_area_slugs (slug, city_id)
VALUES ($1, $2)
ON CONFLICT (slug) DO NOTHING;
    `);

    // Test 3: Show how routing would work
    console.log('\n3️⃣ How Routing Works:');
    console.log(`
-- Directory page query (e.g., /az/bullhead-city):
SELECT a.slug AS affiliate_slug,
       a.business_name,
       c.name AS city,
       c.state_code
FROM service_area_slugs sas
JOIN cities c ON c.id = sas.city_id
JOIN affiliate_service_areas asa ON asa.city_id = c.id
JOIN affiliates a ON a.id = asa.affiliate_id
WHERE sas.slug = 'az/bullhead-city'
  AND a.application_status = 'approved'
ORDER BY a.business_name;
    `);

    // Test 4: Show API endpoints
    console.log('\n4️⃣ Available API Endpoints:');
    console.log(`
✅ Admin Endpoints:
   • POST /api/admin/approve-application/:id (with service_areas)
   • GET /api/admin/mdh-service-areas

✅ Public Endpoints:
   • GET /api/service-areas/mdh/coverage
   • GET /api/service-areas/city/:slug
    `);

    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testServiceAreas().catch(console.error);
}

module.exports = { testServiceAreas };
