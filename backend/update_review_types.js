const { pool } = require('./database/pool');

async function updateReviewTypes() {
  try {
    // Get tenant slug from command line args (REQUIRED for tenant isolation)
    const tenantSlug = process.argv[2];
    
    if (!tenantSlug) {
      console.error('Error: tenant slug is required');
      console.log('Usage: node update_review_types.js <tenant-slug>');
      console.log('Example: node update_review_types.js mobile-detailing');
      process.exit(1);
    }
    
    console.log(`Updating review types for tenant: ${tenantSlug}...\n`);
    
    const result = await pool.query(`
      UPDATE reputation.reviews 
      SET review_type = 'tenant' 
      WHERE review_type = 'affiliate' 
        AND tenant_slug = $1
    `, [tenantSlug]);
    
    console.log(`Updated ${result.rowCount} reviews from affiliate to tenant`);
    
    // Verify the update for this tenant only
    const verifyResult = await pool.query(`
      SELECT review_type, COUNT(*) as count 
      FROM reputation.reviews 
      WHERE tenant_slug = $1
      GROUP BY review_type
    `, [tenantSlug]);
    
    console.log('Current review types for this tenant:', verifyResult.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error updating review types:', err);
    process.exit(1);
  }
}

updateReviewTypes();
