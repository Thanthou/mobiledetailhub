// Load environment variables first
require('dotenv').config({ path: '../../.env' });

const { pool } = require('../pool');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

async function seedAffiliates() {
  // Debug environment variables
  logger.info('Environment check:');
  logger.info(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  logger.info(`DB_HOST: ${process.env.DB_HOST || 'Not set'}`);
  logger.info(`DB_USER: ${process.env.DB_USER || 'Not set'}`);
  logger.info(`DB_PASSWORD: ${process.env.DB_PASSWORD ? 'Set' : 'Not set'}`);
  logger.info(`DB_NAME: ${process.env.DB_NAME || 'Not set'}`);
  
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('Starting affiliate seeding process...');
    
    // Read and execute business seeds
    const businessSeedPath = path.join(__dirname, '../seeds/affiliate_businesses.sql');
    const businessSeedSQL = fs.readFileSync(businessSeedPath, 'utf8');
    
    logger.info('Executing business seeds...');
    await client.query(businessSeedSQL);
    logger.info('✅ Business seeds executed successfully');
    
    // Read and execute services seeds
    const servicesSeedPath = path.join(__dirname, '../seeds/affiliate_services.sql');
    const servicesSeedSQL = fs.readFileSync(servicesSeedPath, 'utf8');
    
    logger.info('Executing services seeds...');
    await client.query(servicesSeedSQL);
    logger.info('✅ Services seeds executed successfully');
    
    // Verify the data was inserted
    const businessCount = await client.query('SELECT COUNT(*) as count FROM affiliates.business');
    const servicesCount = await client.query('SELECT COUNT(*) as count FROM affiliates.services');
    
    logger.info(`✅ Seeding complete! Created ${businessCount.rows[0].count} businesses and ${servicesCount.rows[0].count} services`);
    
  } catch (error) {
    logger.error('Error during seeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeding if this script is executed directly
if (require.main === module) {
  seedAffiliates()
    .then(() => {
      logger.info('Affiliate seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Affiliate seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAffiliates };
