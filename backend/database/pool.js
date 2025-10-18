/**
 * Lazy, Non-Blocking PostgreSQL Pool
 * ----------------------------------
 * - Connects only when used
 * - Retries automatically on startup
 * - Keeps Render port open instantly
 */

import pkg from 'pg';
import { loadEnv } from '../config/env.js';
const { Pool } = pkg;

let pool = null;
let connecting = false;

/** Initialize pool only when needed */
export async function getPool() {
  if (pool) return pool;
  if (connecting) {
    await new Promise(r => setTimeout(r, 500));
    return pool;
  }

  connecting = true;
  const env = await loadEnv();

  if (!env.DATABASE_URL) {
    console.warn('⚠️  No DATABASE_URL — returning mock pool.');
    pool = {
      query: async () => { throw new Error('Database not configured'); },
      connect: async () => { throw new Error('Database not configured'); },
      end: async () => {}
    };
    return pool;
  }

  const config = {
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 25,
    min: 2,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: false,
    maxUses: 7500,
    statement_timeout: 30000,
    query_timeout: 30000
  };

  pool = new Pool(config);
  pool.on('error', err => console.error('⚠️  Idle client error:', err.message));

  // Background connection test (non-fatal)
  (async () => {
    for (let i = 1; i <= 5; i++) {
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('✅ Database connection established');
        break;
      } catch (err) {
        console.warn(`⏳ DB retry ${i}/5 failed: ${err.message}`);
        await new Promise(r => setTimeout(r, i * 2000));
      }
    }
  })();

  // Periodic health check (every 5 min)
  if (!global.__POOL_HEALTH_INTERVAL__) {
    global.__POOL_HEALTH_INTERVAL__ = setInterval(async () => {
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('✅ DB pool health OK');
      } catch (err) {
        console.warn('⚠️  DB pool health check failed:', err.message);
      }
    }, 5 * 60 * 1000);
  }

  connecting = false;
  return pool;
}

/** Optional manual check for monitoring routes */
export async function checkPoolHealth() {
  const p = await getPool();
  try {
    const client = await p.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    console.warn('⚠️  checkPoolHealth error:', err.message);
    return false;
  }
}

// --- Compatibility export for legacy imports ---
// This allows existing code to still use `import { pool } from './pool.js'`
// We use a lazy getter to avoid the "already declared" error
let _poolInstance = null;
export const pool = {
  async query(...args) {
    if (!_poolInstance) _poolInstance = await getPool();
    return _poolInstance.query(...args);
  },
  async connect() {
    if (!_poolInstance) _poolInstance = await getPool();
    return _poolInstance.connect();
  },
  async end() {
    if (!_poolInstance) _poolInstance = await getPool();
    return _poolInstance.end();
  }
};