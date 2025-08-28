/**
 * Database Utility with Retry Logic and Connection Management
 * Provides robust database operations with automatic retries and connection handling
 */

const { pool } = require('../database/pool');
const logger = require('./logger');

/**
 * Execute a database query with retry logic and connection management
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Query result
 */
const query = async (query, params = [], options = {}) => {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 30000,
    client = null
  } = options;

  let attempt = 0;
  let lastError;

  while (attempt < retries) {
    try {
      // Use provided client or get from pool
      const dbClient = client || pool;
      
      // Execute query with timeout
      const result = await Promise.race([
        dbClient.query(query, params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), timeout)
        )
      ]);

      // Log successful query (debug level)
      logger.debug('Database query executed successfully', {
        query: query.substring(0, 100) + '...',
        params: params.length,
        rows: result.rows.length
      });

      return result;

    } catch (error) {
      attempt++;
      lastError = error;

      // Log error details
      logger.warn(`Database query attempt ${attempt} failed`, {
        error: error.message,
        code: error.code,
        query: query.substring(0, 100) + '...',
        attempt,
        retries
      });

      // Don't retry on certain errors
      if (error.code === '23505' || // Unique violation
          error.code === '23514' || // Check violation
          error.code === '42P01') { // Undefined table
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt >= retries) {
        logger.error('Database query failed after all retries', {
          error: error.message,
          code: error.code,
          query: query.substring(0, 100) + '...',
          attempts: attempt
        });
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Execute a transaction with automatic rollback on error
 * @param {Function} callback - Transaction callback function
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back due to error:', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Check database connection health
 * @returns {Promise<boolean>} True if healthy, false otherwise
 */
const checkHealth = async () => {
  try {
    const result = await query('SELECT 1 as health_check', [], { retries: 1, timeout: 5000 });
    return result.rows[0]?.health_check === 1;
  } catch (error) {
    logger.error('Database health check failed:', { error: error.message });
    return false;
  }
};

/**
 * Get database pool statistics
 * @returns {Object} Pool statistics
 */
const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
};

/**
 * Close database pool gracefully
 * @returns {Promise<void>}
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed successfully');
  } catch (error) {
    logger.error('Error closing database pool:', { error: error.message });
  }
};

module.exports = {
  query,
  transaction,
  checkHealth,
  getPoolStats,
  closePool,
  pool // Export pool for direct access when needed
};
