const { executeQuery } = require('./dbHelper');
const logger = require('./logger');

/**
 * Migration tracking utility for health checks
 * Manages schema version tracking and migration status
 */

class MigrationTracker {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the migration tracking system
   * Creates the schema_migrations table if it doesn't exist
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          version VARCHAR(50) NOT NULL UNIQUE,
          description TEXT,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          checksum VARCHAR(64),
          execution_time INTEGER
        )
      `);
      
      // Insert initial version if table is empty
      const countResult = await executeQuery('SELECT COUNT(*) FROM schema_migrations');
      if (parseInt(countResult.rows[0].count) === 0) {
        await this.recordMigration('1.0.0', 'Initial schema version');
      }
      
      this.initialized = true;
      logger.info('Migration tracking system initialized');
    } catch (error) {
      logger.error('Failed to initialize migration tracking:', { error: error.message });
      throw error;
    }
  }

  /**
   * Record a new migration
   * @param {string} version - Migration version (e.g., '1.0.1')
   * @param {string} description - Description of the migration
   * @param {string} checksum - Optional checksum of migration files
   * @param {number} executionTime - Optional execution time in milliseconds
   */
  async recordMigration(version, description, checksum = null, executionTime = null) {
    try {
      await executeQuery(`
        INSERT INTO schema_migrations (version, description, checksum, execution_time) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (version) DO UPDATE SET
          description = EXCLUDED.description,
          checksum = EXCLUDED.checksum,
          execution_time = EXCLUDED.execution_time,
          applied_at = CURRENT_TIMESTAMP
      `, [version, description, checksum, executionTime]);
      
      logger.info(`Migration recorded: ${version} - ${description}`);
    } catch (error) {
      logger.error(`Failed to record migration ${version}:`, { error: error.message });
      throw error;
    }
  }

  /**
   * Get the current schema version
   * @returns {Object|null} Current migration info or null
   */
  async getCurrentVersion() {
    try {
      const result = await executeQuery(`
        SELECT version, description, applied_at, checksum, execution_time
        FROM schema_migrations 
        ORDER BY applied_at DESC 
        LIMIT 1
      `);
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get current migration version:', { error: error.message });
      return null;
    }
  }

  /**
   * Get migration history
   * @param {number} limit - Maximum number of migrations to return
   * @returns {Array} Array of migration records
   */
  async getMigrationHistory(limit = 10) {
    try {
      const result = await executeQuery(`
        SELECT version, description, applied_at, checksum, execution_time
        FROM schema_migrations 
        ORDER BY applied_at DESC 
        LIMIT $1
      `, [limit]);
      
      return result.rows;
    } catch (error) {
      logger.error('Failed to get migration history:', { error: error.message });
      return [];
    }
  }

  /**
   * Check if a specific version has been applied
   * @param {string} version - Version to check
   * @returns {boolean} True if version exists
   */
  async hasVersion(version) {
    try {
      const result = await executeQuery(
        'SELECT COUNT(*) FROM schema_migrations WHERE version = $1',
        [version]
      );
      
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      logger.error(`Failed to check version ${version}:`, { error: error.message });
      return false;
    }
  }

  /**
   * Get migration status for health checks
   * @returns {Object} Migration status information
   */
  async getStatus() {
    try {
      const currentVersion = await this.getCurrentVersion();
      const totalMigrations = await executeQuery('SELECT COUNT(*) FROM schema_migrations');
      
      return {
        currentVersion: currentVersion?.version || 'unknown',
        totalMigrations: parseInt(totalMigrations.rows[0].count),
        lastApplied: currentVersion?.applied_at || null,
        isHealthy: !!currentVersion
      };
    } catch (error) {
      logger.error('Failed to get migration status:', { error: error.message });
      return {
        currentVersion: 'unknown',
        totalMigrations: 0,
        lastApplied: null,
        isHealthy: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const migrationTracker = new MigrationTracker();

module.exports = {
  MigrationTracker,
  migrationTracker
};
