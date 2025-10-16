import { pool } from '../database/pool.js';
import logger from './logger.js';

/**
 * Database initialization - minimal version
 * 
 * The actual database schemas are managed through SQL files in:
 * - backend/database/schemas/ (schema definitions)
 * - backend/database/migrations/ (migrations)
 * 
 * To initialize or reset the database, use:
 * - node backend/database/scripts/init_database.js (full reset)
 * - node backend/database/scripts/run-tenant-migrations.js (run migrations)
 */

/**
 * Setup database - ensures connection is valid
 * Actual schema setup is handled by SQL files in database/schemas/
 */
async function setupDatabase() {
  try {
    if (!pool) {
      logger.error('Cannot setup database: no database connection available');
      return;
    }

    // Verify database connection works
    await pool.query('SELECT 1');
    logger.info('Database connection verified');
    
    // Note: Schema creation is handled by SQL files in database/schemas/
    // This function is kept for backward compatibility but does minimal work
    
  } catch (err) {
    logger.error('Error during database setup:', { error: err.message });
    throw err;
  }
}

export {
  setupDatabase
};
