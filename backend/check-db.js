const { pool } = require('./database/pool');

async function checkDB() {
  try {
    const result = await pool.query('SELECT id, reviewer_name, reviewer_avatar_url FROM reputation.reviews WHERE id = 114');
    console.log('Review 114:');
    console.log('ID:', result.rows[0].id);
    console.log('Name:', result.rows[0].reviewer_name);
    console.log('Avatar URL:', result.rows[0].reviewer_avatar_url);
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

checkDB();
