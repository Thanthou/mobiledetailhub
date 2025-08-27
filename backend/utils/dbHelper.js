const { getPool } = require('../database/connection');
const logger = require('./logger');

/**
 * Database helper utility with proper error handling and connection management
 */

// Helper function to execute database queries with automatic connection management
async function executeQuery(queryText, params = []) {
  try {
    const pool = await getPool();
    if (!pool) {
      throw new Error('No database connection available');
    }
    
    const result = await pool.query(queryText, params);
    return result;
  } catch (error) {
    logger.error('Database query error:', { error: error.message });
    throw error;
  }
}

// Helper function to execute database queries with transaction support
async function executeTransaction(queries) {
  let client = null;
  
  try {
    const pool = await getPool();
    if (!pool) {
      throw new Error('No database connection available');
    }
    
    client = await pool.connect();
    await client.query('BEGIN');
    
    const results = [];
    for (const { text, params = [] } of queries) {
      const result = await client.query(text, params);
      results.push(result);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        logger.error('Error rolling back transaction:', { error: rollbackError.message });
      }
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Helper function to check if database is connected
async function isConnected() {
  try {
    const pool = await getPool();
    if (!pool) {
      return false;
    }
    
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get connection status
async function getConnectionStatus() {
  try {
    const pool = await getPool();
    if (!pool) {
      return {
        connected: false,
        status: 'No connection pool available',
        totalCount: 0,
        idleCount: 0,
        waitingCount: 0
      };
    }
    
    const totalCount = pool.totalCount;
    const idleCount = pool.idleCount;
    const waitingCount = pool.waitingCount;
    
    return {
      connected: true,
      status: 'Connected',
      totalCount,
      idleCount,
      waitingCount
    };
  } catch (error) {
    return {
      connected: false,
      status: `Error: ${error.message}`,
      totalCount: 0,
      idleCount: 0,
      waitingCount: 0
    };
  }
}

// Helper function to safely close database connections
async function closeConnections() {
  try {
    const { closePool } = require('../database/connection');
    await closePool();
    logger.info('Database connections closed successfully');
  } catch (error) {
    logger.error('Error closing database connections:', { error: error.message });
  }
}

// Export helper functions
module.exports = {
  executeQuery,
  executeTransaction,
  isConnected,
  getConnectionStatus,
  closeConnections,
  getPool // Re-export for convenience
};
