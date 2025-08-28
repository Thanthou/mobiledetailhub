const { pool } = require('../database/pool');
const logger = require('./logger');

/**
 * Process service areas for an approved affiliate
 * Creates the two key relationships:
 * 1. Affiliate ↔ City (affiliate_service_areas)
 * 2. City ↔ SEO Slug (service_area_slugs)
 * 
 * Uses transaction-safe pattern as specified:
 * - BEGIN transaction
 * - Update affiliate status
 * - Insert affiliate_service_areas rows
 * - Create service_area_slugs entries
 * - COMMIT transaction
 */
async function processAffiliateServiceAreas(affiliateId, serviceAreas) {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  if (!serviceAreas || !Array.isArray(serviceAreas) || serviceAreas.length === 0) {
    logger.warn(`No service areas provided for affiliate ${affiliateId}`);
    return { processed: 0, errors: [] };
  }

  const client = await pool.connect();
  const errors = [];
  let processed = 0;

  try {
    await client.query('BEGIN');

    // Extract city IDs from the service areas
    const cityIds = [];
    for (const area of serviceAreas) {
      try {
        const { city, state, zip } = area;
        
        if (!city || !state) {
          logger.warn(`Skipping service area with missing city or state: ${JSON.stringify(area)}`);
          continue;
        }

        // Get the city ID from cities table
        const cityResult = await client.query(
          'SELECT id, city_slug FROM cities WHERE name = $1 AND state_code = $2',
          [city, state.toUpperCase()]
        );

        if (cityResult.rows.length === 0) {
          logger.warn(`City not found: ${city}, ${state.toUpperCase()}`);
          errors.push({ area, error: 'City not found in database' });
          continue;
        }

        const cityId = cityResult.rows[0].id;
        cityIds.push(cityId);

        // Insert affiliate service area mapping (who serves where)
        await client.query(
          'INSERT INTO affiliate_service_areas (affiliate_id, city_id, zip) VALUES ($1, $2, $3) ON CONFLICT (affiliate_id, city_id, zip) DO NOTHING',
          [affiliateId, cityId, zip || null]
        );

        // Create SEO slug for the service area (city ↔ public URL)
        const citySlug = cityResult.rows[0].city_slug;
        const slug = `${state.toLowerCase()}/${citySlug}`;
        await client.query(
          'INSERT INTO service_area_slugs (slug, city_id) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING',
          [slug, cityId]
        );

        processed++;
        logger.debug(`Processed service area: ${city}, ${state} for affiliate ${affiliateId}`);

      } catch (error) {
        logger.error(`Error processing service area ${JSON.stringify(area)}:`, error);
        errors.push({ area, error: error.message });
      }
    }

    // Log summary of processed areas
    if (cityIds.length > 0) {
      logger.info(`Successfully processed ${processed} service areas for affiliate ${affiliateId} covering ${cityIds.length} cities`);
    }

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Transaction failed for affiliate ${affiliateId}:`, error);
    throw error;
  } finally {
    client.release();
  }

  return { processed, errors, cityIds: cityIds.length };
}

/**
 * Get all service areas for MDH (cities/states where approved affiliates serve)
 */
async function getMDHServiceAreas() {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  const query = `
    SELECT DISTINCT 
      s.state_code, 
      s.name AS state_name, 
      c.id AS city_id, 
      c.name AS city_name,
      c.city_slug
    FROM affiliate_service_areas asa
    JOIN affiliates a ON a.id = asa.affiliate_id
    JOIN cities c ON c.id = asa.city_id
    JOIN states s ON s.state_code = c.state_code
    WHERE a.application_status = 'approved'
    ORDER BY s.state_code, c.name
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get affiliates serving a specific city (for directory pages)
 */
async function getAffiliatesForCity(slug) {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  const query = `
    SELECT 
      a.slug AS affiliate_slug,
      a.business_name,
      c.name AS city,
      c.state_code,
      c.city_slug
    FROM service_area_slugs sas
    JOIN cities c ON c.id = sas.city_id
    JOIN affiliate_service_areas asa ON asa.city_id = c.id
    JOIN affiliates a ON a.id = asa.affiliate_id
    WHERE sas.slug = $1
      AND a.application_status = 'approved'
    ORDER BY a.business_name
  `;

  const result = await pool.query(query, [slug]);
  return result.rows;
}

module.exports = {
  processAffiliateServiceAreas,
  getMDHServiceAreas,
  getAffiliatesForCity
};
