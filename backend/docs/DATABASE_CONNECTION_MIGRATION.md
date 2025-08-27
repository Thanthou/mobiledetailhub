# Database Connection Migration Guide

## Overview

The database connection system has been updated to provide better error handling, automatic retry logic, and graceful degradation instead of harsh `process.exit()` calls.

## Key Changes

### 1. **Removed Harsh Error Handling**
- ❌ **Before**: `process.exit(-1)` on connection errors
- ✅ **After**: Graceful error handling with retry logic

### 2. **Added Retry Logic**
- Automatic retry with exponential backoff
- Configurable retry attempts (default: 5)
- Maximum delay cap (default: 30 seconds)

### 3. **Improved Connection Management**
- Connection pool health monitoring
- Automatic reconnection on failures
- Graceful shutdown handling

## Migration Steps

### Step 1: Update Import Statements

**Before:**
```javascript
const pool = require('../database/connection');
```

**After:**
```javascript
const { getPool } = require('../database/connection');
// OR use the helper utilities
const { executeQuery, isConnected } = require('../utils/dbHelper');
```

### Step 2: Update Database Operations

**Before:**
```javascript
// Direct pool usage
const result = await pool.query('SELECT * FROM users');
```

**After (Option 1 - Using getPool):**
```javascript
const pool = await getPool();
if (!pool) {
  throw new Error('No database connection available');
}
const result = await pool.query('SELECT * FROM users');
```

**After (Option 2 - Using Helper Utilities):**
```javascript
const { executeQuery } = require('../utils/dbHelper');
const result = await executeQuery('SELECT * FROM users');
```

### Step 3: Handle Connection Errors

**Before:**
```javascript
try {
  const result = await pool.query('SELECT * FROM users');
  return result;
} catch (error) {
  console.error('Database error:', error);
  // Application might crash due to process.exit(-1)
}
```

**After:**
```javascript
try {
  const result = await executeQuery('SELECT * FROM users');
  return result;
} catch (error) {
  if (error.message === 'No database connection available') {
    // Handle gracefully - maybe return cached data or show user-friendly message
    return { error: 'Service temporarily unavailable' };
  }
  console.error('Database error:', error);
  throw error;
}
```

## New Helper Functions

### `executeQuery(queryText, params)`
Executes a single query with automatic connection management.

```javascript
const { executeQuery } = require('../utils/dbHelper');

try {
  const result = await executeQuery('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0];
} catch (error) {
  console.error('Query failed:', error);
  throw error;
}
```

### `executeTransaction(queries)`
Executes multiple queries in a transaction.

```javascript
const { executeTransaction } = require('../utils/dbHelper');

const queries = [
  { text: 'INSERT INTO users (name, email) VALUES ($1, $2)', params: ['John', 'john@example.com'] },
  { text: 'INSERT INTO profiles (user_id, bio) VALUES ($1, $2)', params: [userId, 'New user'] }
];

try {
  const results = await executeTransaction(queries);
  return results;
} catch (error) {
  console.error('Transaction failed:', error);
  throw error;
}
```

### `isConnected()`
Checks if the database is currently connected.

```javascript
const { isConnected } = require('../utils/dbHelper');

if (await isConnected()) {
  // Proceed with database operations
} else {
  // Handle disconnected state
}
```

### `getConnectionStatus()`
Gets detailed connection pool status.

```javascript
const { getConnectionStatus } = require('../utils/dbHelper');

const status = await getConnectionStatus();
console.log(`Pool: ${status.totalCount} total, ${status.idleCount} idle, ${status.waitingCount} waiting`);
```

## Configuration

The retry logic can be configured in `backend/database/connection.js`:

```javascript
const RETRY_CONFIG = {
  maxRetries: 5,           // Maximum retry attempts
  retryDelay: 1000,        // Initial delay (1 second)
  backoffMultiplier: 2,    // Exponential backoff multiplier
  maxDelay: 30000          // Maximum delay cap (30 seconds)
};
```

## Health Check Endpoints

New health check endpoints provide detailed database status:

- `GET /api/health` - Comprehensive health information
- `GET /api/health/db-status` - Database connection status only
- `GET /api/health/test-db` - Simple database test

## Backward Compatibility

The old `pool` export is still available for backward compatibility, but it's recommended to migrate to the new pattern for better error handling.

## Error Handling Best Practices

1. **Always check connection availability** before executing queries
2. **Use helper functions** for common database operations
3. **Implement graceful degradation** when database is unavailable
4. **Log errors appropriately** without crashing the application
5. **Handle connection failures** with user-friendly error messages

## Example Migration

**Before:**
```javascript
const pool = require('../database/connection');

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**After:**
```javascript
const { executeQuery } = require('../utils/dbHelper');

router.get('/users', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    if (error.message === 'No database connection available') {
      res.status(503).json({ error: 'Service temporarily unavailable' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
```

## Testing

Test the new connection system:

1. **Start the application** and verify it connects to the database
2. **Stop the database** and verify the application continues running
3. **Restart the database** and verify automatic reconnection
4. **Check health endpoints** for connection status information

## Support

If you encounter issues during migration:

1. Check the console logs for connection status
2. Use the health check endpoints to diagnose issues
3. Verify environment variables are correctly set
4. Check the database server is running and accessible
