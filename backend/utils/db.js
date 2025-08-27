const pool = require('../database/pool');

/**
 * Execute a query with optional timeout
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters (optional)
 * @param {Object} options - Options including timeoutMs
 * @param {number} options.timeoutMs - Timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Query result
 */
async function query(text, params = [], { timeoutMs = 5000 } = {}) {
  // Create timeout promise
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs)
  );

  // Race the query against the timeout
  try {
    return await Promise.race([
      pool.query(text, params),
      timeoutPromise
    ]);
  } catch (error) {
    // If it's a timeout error, make it clear
    if (error.message.includes('Query timeout')) {
      error.code = 'QUERY_TIMEOUT';
    }
    throw error;
  }
}

module.exports = {
  query
};
