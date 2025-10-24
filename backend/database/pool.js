import pg from 'pg';
import { createModuleLogger } from '../config/logger.js';
import { env } from '../config/env.async.js';

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

    // Use individual connection params (preferred method)
    const config = {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
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

    logger.debug('Database pool initialized successfully');
    
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
