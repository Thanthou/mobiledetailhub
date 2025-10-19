import pg from 'pg';
import { createModuleLogger } from '../config/logger.js';

const { Pool } = pg;
const logger = createModuleLogger('database-pool');

let _pool = null;

/**
 * Get the database connection pool (lazy initialization)
 * @returns {Promise<pg.Pool>} Database pool instance
 */
export async function getPool() {
  if (_pool) {
    return _pool;
  }

  try {
    // Load environment variables
    const { loadEnv } = await import('../config/env.js');
    await loadEnv();

    const config = {
      connectionString: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    };

    // Remove undefined values
    Object.keys(config).forEach(key => {
      if (config[key] === undefined) {
        delete config[key];
      }
    });

    _pool = new Pool(config);

    // Test the connection
    const client = await _pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Database pool initialized successfully');
    
    // Background connection test (non-blocking)
    setImmediate(async () => {
      try {
        const testClient = await _pool.connect();
        await testClient.query('SELECT 1');
        testClient.release();
        logger.debug('Background connection test successful');
      } catch (error) {
        logger.warn('Background connection test failed:', error.message);
      }
    });

    return _pool;
  } catch (error) {
    logger.error('Failed to initialize database pool:', error);
    throw error;
  }
}

/**
 * Close the database pool
 */
export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    logger.info('Database pool closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});
