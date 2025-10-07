const { pool } = require('./database/pool');

async function checkReviews() {
  try {
    console.log('Checking reviews table...');
    
    // Check if table exists and has data
    const result = await pool.query(`
      SELECT review_type, COUNT(*) as count 
      FROM reputation.reviews 
      GROUP BY review_type
    `);
    
    console.log('Review types in database:', result.rows);
    
    // Check total count
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM reputation.reviews');
    console.log('Total reviews:', totalResult.rows[0].total);
    
    // Show sample data
    const sampleResult = await pool.query('SELECT id, review_type, business_slug, rating, title FROM reputation.reviews LIMIT 5');
    console.log('Sample reviews:', sampleResult.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error checking reviews:', err);
    process.exit(1);
  }
}

checkReviews();
