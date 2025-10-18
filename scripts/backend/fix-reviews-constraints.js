const { pool } = require('./database/pool');

async function fixReviewsConstraints() {
  try {
    console.log('Dropping old foreign key constraints...');
    
    // Drop old constraints
    await pool.query('ALTER TABLE reputation.reviews DROP CONSTRAINT IF EXISTS fk_reviews_affiliate_id;');
    await pool.query('ALTER TABLE reputation.reviews DROP CONSTRAINT IF EXISTS fk_reviews_business_slug;');
    
    console.log('Adding new foreign key constraints...');
    
    // Add new constraints pointing to tenants.business
    await pool.query('ALTER TABLE reputation.reviews ADD CONSTRAINT fk_reviews_affiliate_id FOREIGN KEY (affiliate_id) REFERENCES tenants.business(id) ON DELETE CASCADE;');
    await pool.query('ALTER TABLE reputation.reviews ADD CONSTRAINT fk_reviews_business_slug FOREIGN KEY (business_slug) REFERENCES tenants.business(slug) ON DELETE CASCADE;');
    
    console.log('Foreign key constraints updated successfully!');
    
  } catch (error) {
    console.error('Error updating constraints:', error.message);
  } finally {
    await pool.end();
  }
}

fixReviewsConstraints();
