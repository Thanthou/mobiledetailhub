const { pool } = require('./database/pool');

async function updateReviewTypes() {
  try {
    console.log('Updating review types from affiliate to tenant...');
    
    const result = await pool.query(`
      UPDATE reputation.reviews 
      SET review_type = 'tenant' 
      WHERE review_type = 'affiliate'
    `);
    
    console.log(`Updated ${result.rowCount} reviews from affiliate to tenant`);
    
    // Verify the update
    const verifyResult = await pool.query(`
      SELECT review_type, COUNT(*) as count 
      FROM reputation.reviews 
      GROUP BY review_type
    `);
    
    console.log('Current review types:', verifyResult.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error updating review types:', err);
    process.exit(1);
  }
}

updateReviewTypes();
