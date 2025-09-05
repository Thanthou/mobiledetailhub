const { pool } = require('./database/pool');

async function checkReview() {
  try {
    const result = await pool.query('SELECT id, reviewer_name, reviewer_avatar_url FROM reputation.reviews WHERE id = 114');
    console.log('Review 114:', JSON.stringify(result.rows[0], null, 2));
    
    // Also check if the file exists
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'uploads/avatars/aaa_ddd_114_20250905013755.png');
    console.log('File exists:', fs.existsSync(filePath));
    console.log('File path:', filePath);
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

checkReview();
