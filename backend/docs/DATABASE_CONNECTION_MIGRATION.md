# Database Connection Simplification Guide

## Overview

The database connection system has been simplified to use a single global PostgreSQL pool instead of complex retry logic and connection managers.

## Key Changes

### 1. **Simplified Architecture**
- ❌ **Before**: Complex connection manager with circuit breaker and retry logic
- ✅ **After**: Single `pg.Pool` instance with simple error handling

### 2. **Removed Complex Features**
- Removed circuit breaker pattern
- Removed exponential backoff retry logic
- Removed connection state management
- Removed `waitForConnection()` helper

### 3. **Direct Pool Usage**
- Single pool configured from `DATABASE_URL`
- Direct `pool.query()` calls
- Simple error logging with `pool.on('error')`

## Migration Steps

### Step 1: Update Import Statements

**Before:**
```javascript
const { getPool, waitForConnection } = require('../database/connection');
```

**After:**
```javascript
const pool = require('../database/pool');
```

### Step 2: Update Database Operations

**Before:**
```javascript
const pool = await getPool();
if (!pool) {
  throw new Error('No database connection available');
}
const result = await pool.query('SELECT * FROM users');
```

**After:**
```javascript
// Direct pool usage - no async setup needed
const result = await pool.query('SELECT * FROM users');
```

### Step 3: Handle Connection Errors

**Before:**
```javascript
try {
  const pool = await getPool();
  const result = await pool.query('SELECT * FROM users');
  return result;
} catch (error) {
  console.error('Database error:', error);
  // Complex retry and circuit breaker logic
}
```

**After:**
```javascript
try {
  const result = await pool.query('SELECT * FROM users');
  return result;
} catch (error) {
  console.error('Database error:', error);
  // Simple error handling - let pg pool handle reconnection
  throw error;
}
```

## Simple Pool Configuration

The pool is configured in `backend/database/pool.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Simple error logging
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client:', { error: err.message });
});

module.exports = pool;
```

## Available Helper Functions

Helper functions in `backend/utils/dbHelper.js` still work but now use the simple pool directly:

- `executeQuery(queryText, params)` - Single query execution
- `executeTransaction(queries)` - Transaction handling  
- `isConnected()` - Simple connectivity check
- `getConnectionStatus()` - Pool status (totalCount, idleCount, waitingCount)

## Configuration

Pool configuration is simple and uses PostgreSQL's built-in connection management:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Single connection string
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 10000  // Timeout new connections after 10s
});
```

## Health Check Endpoints

Simplified health check endpoints:

- `GET /api/health/live` - Process liveness (always returns 200)
- `GET /api/health/ready` - Database readiness with 250ms timeout  
- `GET /api/health` - Comprehensive health with query timing
- `GET /api/health/db-status` - Simple pool status

## Error Handling Best Practices

1. **Use direct pool queries** - No need to check availability first
2. **Let PostgreSQL handle reconnection** - Built-in connection management
3. **Fast server startup** - Database ping with 1s timeout on boot
4. **Fail fast on setup errors** - Exit if database setup fails
5. **Simple error responses** - Log and return appropriate HTTP status codes

## Example Migration

**Before (Complex):**
```javascript
const { getPool, waitForConnection } = require('../database/connection');

router.get('/users', async (req, res) => {
  try {
    const pool = await getPool();
    if (!pool) {
      throw new Error('No database connection available');
    }
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**After (Simple):**
```javascript
const pool = require('../database/pool');

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

Test the simplified connection system:

1. **Start the application** - Should ping database and exit if unavailable
2. **Check health endpoints** - `/ready` should respond in under 250ms  
3. **Database failures** - Pool automatically handles reconnection
4. **Graceful shutdown** - Pool closes cleanly with `pool.end()`

## Benefits of Simple Approach

- **Faster startup** - Single database ping instead of complex retry logic
- **Less complexity** - No circuit breakers or connection managers to debug
- **PostgreSQL-native** - Uses battle-tested `pg` pool connection management
- **Predictable** - Fail fast on startup, let pool handle runtime reconnection
