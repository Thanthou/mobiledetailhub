const { Pool } = require('pg');
const retry = require('retry');
const { getEnv } = require('../utils/envValidator');
const logger = require('../utils/logger');

// Circuit breaker configuration
const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5,        // Number of failures before opening circuit
  recoveryTimeout: 30000,     // Time to wait before attempting recovery (30s)
  monitoringPeriod: 60000,    // Time window for failure counting (1min)
};

// Circuit breaker state
let circuitBreaker = {
  state: 'CLOSED',            // CLOSED, OPEN, HALF_OPEN
  failureCount: 0,
  lastFailureTime: null,
  lastSuccessTime: null,
  nextAttemptTime: null,
};

// Connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL || `postgresql://${getEnv('DB_USER', 'postgres')}:${getEnv('DB_PASSWORD', '')}@${getEnv('DB_HOST', 'localhost')}:${getEnv('DB_PORT', '5432')}/${getEnv('DB_NAME', 'MobileDetailHub')}`,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
};

// Create the connection pool
let pool = null;
let isConnecting = false;

// Circuit breaker state management
function updateCircuitBreaker(success) {
  const now = Date.now();
  
  if (success) {
    // Reset on success
    circuitBreaker.state = 'CLOSED';
    circuitBreaker.failureCount = 0;
    circuitBreaker.lastSuccessTime = now;
    circuitBreaker.lastFailureTime = null;
    circuitBreaker.nextAttemptTime = null;
    logger.info('Circuit breaker reset to CLOSED state');
  } else {
    // Increment failure count
    circuitBreaker.failureCount++;
    circuitBreaker.lastFailureTime = now;
    
    // Check if we should open the circuit
    if (circuitBreaker.failureCount >= CIRCUIT_BREAKER_CONFIG.failureThreshold) {
      circuitBreaker.state = 'OPEN';
      circuitBreaker.nextAttemptTime = now + CIRCUIT_BREAKER_CONFIG.recoveryTimeout;
      logger.warn(`Circuit breaker opened after ${circuitBreaker.failureCount} failures. Next attempt at ${new Date(circuitBreaker.nextAttemptTime).toISOString()}`);
    }
  }
}

function canAttemptConnection() {
  const now = Date.now();
  
  switch (circuitBreaker.state) {
    case 'CLOSED':
      return true;
    
    case 'OPEN':
      if (now >= circuitBreaker.nextAttemptTime) {
        circuitBreaker.state = 'HALF_OPEN';
        logger.info('Circuit breaker moved to HALF_OPEN state');
        return true;
      }
      return false;
    
    case 'HALF_OPEN':
      return true;
    
    default:
      return false;
  }
}

function getCircuitBreakerStatus() {
  return {
    state: circuitBreaker.state,
    failureCount: circuitBreaker.failureCount,
    lastFailureTime: circuitBreaker.lastFailureTime,
    lastSuccessTime: circuitBreaker.lastSuccessTime,
    nextAttemptTime: circuitBreaker.nextAttemptTime,
    isHealthy: circuitBreaker.state === 'CLOSED' || circuitBreaker.state === 'HALF_OPEN',
    canConnect: canAttemptConnection(),
  };
}

// Function to create a new pool
function createPool() {
  try {
    const newPool = new Pool(poolConfig);
    
    // Handle pool errors gracefully
    newPool.on('error', (err) => {
      logger.error('Unexpected error on idle client:', { error: err.message });
      // Don't exit the process, just log the error
      // The pool will automatically remove the failed client
    });

    // Handle connect events
    newPool.on('connect', (client) => {
      logger.db('New client connected to database');
    });

    // Handle remove events
    newPool.on('remove', (client) => {
      logger.debug('Client removed from database pool');
    });

    return newPool;
  } catch (error) {
    logger.error('Failed to create database pool:', { error: error.message });
    return null;
  }
}

// Function to test database connectivity
async function testConnection(poolInstance) {
  try {
    const result = await poolInstance.query('SELECT NOW()');
    logger.db('Database connection test successful', { timestamp: result.rows[0].now });
    return true;
  } catch (error) {
    logger.error('Database connection test failed', { error: error.message });
    return false;
  }
}

// Function to establish database connection with circuit breaker protection
async function establishConnection() {
  // Check circuit breaker state first
  if (!canAttemptConnection()) {
    const waitTime = Math.ceil((circuitBreaker.nextAttemptTime - Date.now()) / 1000);
    logger.warn(`Circuit breaker is OPEN. Connection attempts blocked for ${waitTime}s`);
    return null;
  }

  if (isConnecting) {
    logger.debug('Database connection already in progress, waiting...');
    return null;
  }

  isConnecting = true;
  
  try {
    // Create new pool
    const newPool = createPool();
    if (!newPool) {
      throw new Error('Failed to create database pool');
    }

    // Test the connection
    const isConnected = await testConnection(newPool);
    if (!isConnected) {
      throw new Error('Database connection test failed');
    }

    // Success - set the global pool and update circuit breaker
    pool = newPool;
    isConnecting = false;
    updateCircuitBreaker(true);
    logger.db('Database connection established successfully');
    return pool;

  } catch (error) {
    isConnecting = false;
    updateCircuitBreaker(false);
    logger.error('Database connection failed:', { error: error.message });
    return null;
  }
}

// Function to get the current pool (with connection establishment if needed)
async function getPool() {
  if (pool) {
    // Test if the pool is still working
    try {
      await pool.query('SELECT 1');
      return pool;
    } catch (error) {
      logger.warn('Pool connection test failed, reconnecting...');
      pool = null;
    }
  }
  
  // If no pool or pool failed, establish new connection
  return await establishConnection();
}

/**
 * Wait for database connection to be established with retry logic and circuit breaker
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds (default: 30000)
 * @returns {Promise<Pool>} Database pool when connection is ready
 */
async function waitForConnection(maxWaitTime = 30000) {
  // Check circuit breaker first
  if (!canAttemptConnection()) {
    const waitTime = Math.ceil((circuitBreaker.nextAttemptTime - Date.now()) / 1000);
    throw new Error(`Circuit breaker is OPEN. Connection attempts blocked for ${waitTime}s`);
  }

  const operation = retry.operation({
    retries: 3, // Reduced retries since circuit breaker handles backoff
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 5000,
    randomize: true,
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        if (pool && !isConnecting) {
          // Test the connection
          await pool.query('SELECT 1');
          resolve(pool);
          return;
        }
        
        // If no pool or pool failed, try to establish connection
        if (!pool && !isConnecting) {
          const newPool = await establishConnection();
          if (newPool) {
            resolve(newPool);
            return;
          }
        }
        
        // If we're still connecting, wait a bit
        if (isConnecting) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // If we haven't resolved yet, this attempt failed
        throw new Error('Connection attempt failed');
        
      } catch (error) {
        logger.warn(`Database connection attempt ${currentAttempt} failed:`, { error: error.message });
        
        if (operation.retry(error)) {
          logger.info(`Retrying database connection... (attempt ${currentAttempt + 1})`);
          return;
        }
        
        reject(operation.mainError());
      }
    });
  });
}

// Function to gracefully close the pool
async function closePool() {
  if (pool) {
    try {
      logger.info('Closing database pool...');
      
      // Wait for all active queries to complete
      await pool.end();
      
      logger.db('Database pool closed gracefully');
    } catch (error) {
      logger.error('Error closing database pool:', { error: error.message });
      throw error;
    } finally {
      pool = null;
      isConnecting = false;
    }
  }
}

// Initialize connection on module load
establishConnection();

// Export the pool getter function and utility functions
module.exports = {
  getPool,
  waitForConnection,
  closePool,
  testConnection,
  establishConnection,
  getCircuitBreakerStatus,
  getConnectionHealth: () => ({
    connected: !!pool,
    circuitBreaker: getCircuitBreakerStatus(),
    isReady: pool && circuitBreaker.state !== 'OPEN'
  })
};

// For backward compatibility, also export a direct pool reference
// This will be updated once the connection is established
Object.defineProperty(module.exports, 'pool', {
  get: function() {
    return pool;
  }
});
