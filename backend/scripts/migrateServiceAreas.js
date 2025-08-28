const { pool } = require('../database/pool');
const logger = require('../utils/logger');

/**
 * Migration script to update affiliate_service_areas and service_area_slugs tables
 * to use the new normalized schema with city_id foreign keys
 */
async function migrateServiceAreas() {
  if (!pool) {
    logger.error('Database connection not available');
    process.exit(1);
  }

  const client = await pool.connect();
  
  try {
    logger.info('Starting service areas migration...');
    await client.query('BEGIN');

    // Step 1: Create new tables with correct schema
    logger.info('Creating new normalized tables...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate_service_areas_new (
        id           SERIAL PRIMARY KEY,
        affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
        city_id      INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        zip          VARCHAR(20),
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uq_aff_sa_new UNIQUE (affiliate_id, city_id, zip)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS service_area_slugs_new (
        id         SERIAL PRIMARY KEY,
        slug       VARCHAR(255) NOT NULL UNIQUE,
        city_id    INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Step 2: Migrate existing affiliate_service_areas data
    logger.info('Migrating affiliate_service_areas data...');
    
    const migrateAffiliateAreas = await client.query(`
      INSERT INTO affiliate_service_areas_new (affiliate_id, city_id, zip, created_at)
      SELECT 
        asa.affiliate_id,
        c.id as city_id,
        asa.zip,
        asa.created_at
      FROM affiliate_service_areas asa
      JOIN cities c ON c.name = asa.city AND c.state_code = asa.state_code
      ON CONFLICT (affiliate_id, city_id, zip) DO NOTHING
    `);
    
    logger.info(`Migrated ${migrateAffiliateAreas.rowCount} affiliate service area records`);

    // Step 3: Migrate existing service_area_slugs data
    logger.info('Migrating service_area_slugs data...');
    
    const migrateSlugs = await client.query(`
      INSERT INTO service_area_slugs_new (slug, city_id, created_at)
      SELECT 
        CONCAT(LOWER(sas.state_code), '/', c.city_slug) as slug,
        c.id as city_id,
        sas.created_at
      FROM service_area_slugs sas
      JOIN cities c ON c.name = sas.city AND c.state_code = sas.state_code
      ON CONFLICT (slug) DO NOTHING
    `);
    
    logger.info(`Migrated ${migrateSlugs.rowCount} service area slug records`);

    // Step 4: Verify migration integrity
    logger.info('Verifying migration integrity...');
    
    const oldAffiliateCount = await client.query('SELECT COUNT(*) FROM affiliate_service_areas');
    const newAffiliateCount = await client.query('SELECT COUNT(*) FROM affiliate_service_areas_new');
    
    const oldSlugCount = await client.query('SELECT COUNT(*) FROM service_area_slugs');
    const newSlugCount = await client.query('SELECT COUNT(*) FROM service_area_slugs_new');
    
    logger.info(`Affiliate service areas: ${oldAffiliateCount.rows[0].count} → ${newAffiliateCount.rows[0].count}`);
    logger.info(`Service area slugs: ${oldSlugCount.rows[0].count} → ${newSlugCount.rows[0].count}`);

    // Step 5: Replace old tables with new ones
    logger.info('Replacing old tables with new normalized ones...');
    
    await client.query('DROP TABLE IF EXISTS affiliate_service_areas CASCADE');
    await client.query('DROP TABLE IF EXISTS service_area_slugs CASCADE');
    
    await client.query('ALTER TABLE affiliate_service_areas_new RENAME TO affiliate_service_areas');
    await client.query('ALTER TABLE service_area_slugs_new RENAME TO service_area_slugs');
    
    // Step 6: Recreate indexes and constraints
    logger.info('Recreating indexes and constraints...');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_affiliate_service_areas_affiliate_id 
      ON affiliate_service_areas(affiliate_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_affiliate_service_areas_city_id 
      ON affiliate_service_areas(city_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_service_area_slugs_city_id 
      ON service_area_slugs(city_id)
    `);

    await client.query('COMMIT');
    logger.info('✅ Service areas migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateServiceAreas()
    .then(() => {
      logger.info('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateServiceAreas };
