const { Pool } = require('pg');
const logger = require('../utils/logger');
const { env } = require('../src/shared/env');

// Create a single global pool instance with improved configuration
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Connection pool settings
  max: 25,                    // Increased from 20 to handle more concurrent requests
  min: 2,                     // Keep at least 2 connections ready
  idleTimeoutMillis: 60000,   // Increased idle timeout to 1 minute
  connectionTimeoutMillis: 15000,  // Increased connection timeout to 15 seconds
  
  // Better connection management
  allowExitOnIdle: false,     // Don't exit when idle
  maxUses: 7500,             // Recycle connections after 7500 queries (prevents memory leaks)
  
  // Statement timeout (prevents long-running queries from blocking)
  statement_timeout: 30000,   // 30 seconds
  query_timeout: 30000        // 30 seconds
});

// Enhanced error handling
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client:', { 
    error: err.message, 
    code: err.code,
    stack: err.stack 
  });
});

// Connection acquired event
pool.on('acquire', (client) => {
  logger.debug('Client acquired from pool');
});

// Connection released event
pool.on('release', (client) => {
  logger.debug('Client released back to pool');
});

// Connection connect event
pool.on('connect', (client) => {
  logger.debug('New client connected to database');
});

// Health check function
const checkPoolHealth = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    logger.debug('Database pool health check passed');
    return true;
  } catch (error) {
    logger.error('Database pool health check failed:', { error: error.message });
    return false;
  }
};

// Periodic health check every 5 minutes
setInterval(checkPoolHealth, 5 * 60 * 1000);

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down database pool gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down database pool gracefully...');
  await pool.end();
  process.exit(0);
});

// Export the pool and health check function
module.exports = { pool, checkPoolHealth };
