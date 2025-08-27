const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create a single global pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Set up error handling once
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client:', { error: err.message });
});

// Export the pool directly
module.exports = pool;
