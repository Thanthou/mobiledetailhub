const { Pool } = require('pg');

// Simple migration script without full environment setup
async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mobiledetailhub'
  });

  try {
    console.log('Running migration: add_rating_columns_to_business');
    
    const sql = `
      ALTER TABLE tenants.business 
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1),
      ADD COLUMN IF NOT EXISTS total_review_count INTEGER;
      
      COMMENT ON COLUMN tenants.business.average_rating IS 'Average rating scraped from Google Business Profile (1.0-5.0)';
      COMMENT ON COLUMN tenants.business.total_review_count IS 'Total number of reviews scraped from Google Business Profile';
    `;
    
    await pool.query(sql);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
