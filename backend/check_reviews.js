const { pool } = require('./database/pool');

async function checkReviews() {
  try {
    // Get tenant slug from command line args or use default
    const tenantSlug = process.argv[2] || 'mobile-detailing';
    
    console.log(`Checking reviews for tenant: ${tenantSlug}...\n`);
    
    // Check if table exists and has data for this tenant
    const result = await pool.query(`
      SELECT review_type, COUNT(*) as count 
      FROM reputation.reviews 
      WHERE tenant_slug = $1
      GROUP BY review_type
    `, [tenantSlug]);
    
    console.log('Review types in database:', result.rows);
    
    // Check total count for this tenant
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM reputation.reviews WHERE tenant_slug = $1',
      [tenantSlug]
    );
    console.log('Total reviews:', totalResult.rows[0]?.total || 0);
    
    // Show sample data for this tenant
    const sampleResult = await pool.query(
      'SELECT id, review_type, business_slug, rating, title FROM reputation.reviews WHERE tenant_slug = $1 LIMIT 5',
      [tenantSlug]
    );
    console.log('Sample reviews:', sampleResult.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error checking reviews:', err);
    process.exit(1);
  }
}

checkReviews();
