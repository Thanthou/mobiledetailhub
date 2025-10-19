const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function resetReputationData() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Clearing existing reputation data...');
    
    // Clear data in reverse order of dependencies
    await client.query('DELETE FROM reputation.review_votes');
    console.log('✅ Cleared review_votes');
    
    await client.query('DELETE FROM reputation.review_replies');
    console.log('✅ Cleared review_replies');
    
    await client.query('DELETE FROM reputation.reviews');
    console.log('✅ Cleared reviews');
    
    console.log('🌱 Re-seeding reputation data...');
    
    // Read and execute the seed file
    const fs = require('fs');
    const path = require('path');
    const seedFile = fs.readFileSync(path.join(__dirname, '../seeds/reputation_reviews.sql'), 'utf8');
    
    await client.query(seedFile);
    console.log('✅ Re-seeded reputation data');
    
    console.log('🎉 Reputation data reset complete!');
    
  } catch (error) {
    console.error('❌ Error resetting reputation data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetReputationData().catch(console.error);
