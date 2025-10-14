const { pool } = require('../database/pool');
const logger = require('./logger');

/**
 * Process service areas for an approved tenant
 * In the new schema, service areas are stored as JSONB directly in the business table
 * This function validates and updates the service_areas field
 */
async function processTenantServiceAreas(tenantId, serviceAreas) {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  if (!serviceAreas || !Array.isArray(serviceAreas) || serviceAreas.length === 0) {
    logger.warn(`No service areas provided for tenant ${tenantId}`);
    return { processed: 0, errors: [] };
  }

  const client = await pool.connect();
  const errors = [];
  let processed = 0;
  const validatedAreas = [];

  try {
    await client.query('BEGIN');

    // Validate service areas
    for (const area of serviceAreas) {
      try {
        const { city, state, zip } = area;
        
        if (!city || !state) {
          logger.warn(`Skipping service area with missing city or state: ${JSON.stringify(area)}`);
          errors.push({ area, error: 'Missing city or state' });
          continue;
        }

        // Validate and normalize the service area
        const validatedArea = {
          city: city.trim(),
          state: state.toUpperCase().trim(),
          zip: zip ? zip.trim() : null
        };

        validatedAreas.push(validatedArea);
        processed++;
        logger.debug(`Validated service area: ${city}, ${state} for tenant ${tenantId}`);

      } catch (error) {
        logger.error(`Error validating service area ${JSON.stringify(area)}:`, error);
        errors.push({ area, error: error.message });
      }
    }

    // Update the business record with validated service areas
    if (validatedAreas.length > 0) {
      await client.query(
        'UPDATE tenants.business SET service_areas = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [JSON.stringify(validatedAreas), tenantId]
      );
      
      logger.info(`Successfully updated ${processed} service areas for tenant ${tenantId}`);
    }

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Transaction failed for tenant ${tenantId}:`, error);
    throw error;
  } finally {
    client.release();
  }

  return { processed, errors, validatedAreasCount: validatedAreas.length };
}

/**
 * Get all service areas for the platform (cities/states where approved tenants serve)
 */
async function getPlatformServiceAreas() {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  const query = `
    SELECT DISTINCT 
      JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' as state_code,
      JSONB_ARRAY_ELEMENTS(a.service_areas)->>'city' as city_name
    FROM tenants.business a
    WHERE a.approved_date IS NOT NULL 
      AND a.service_areas IS NOT NULL
      AND JSONB_ARRAY_LENGTH(a.service_areas) > 0
    ORDER BY state_code, city_name
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get tenants serving a specific city (for directory pages)
 */
async function getTenantsForCity(slug) {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  const query = `
    SELECT 
      a.slug AS tenant_slug,
      a.business_name,
      JSONB_ARRAY_ELEMENTS(a.service_areas)->>'city' as city,
      JSONB_ARRAY_ELEMENTS(a.service_areas)->>'state' as state_code
    FROM tenants.business a
    WHERE a.approved_date IS NOT NULL 
      AND a.service_areas IS NOT NULL
      AND JSONB_ARRAY_LENGTH(a.service_areas) > 0
      AND EXISTS (
        SELECT 1 
        FROM JSONB_ARRAY_ELEMENTS(a.service_areas) as area
        WHERE area->>'city' = $1 OR area->>'state' = $1
      )
    ORDER BY a.business_name
  `;

  const result = await pool.query(query, [slug]);
  return result.rows;
}

module.exports = {
  processTenantServiceAreas,
  getPlatformServiceAreas,
  getTenantsForCity,
  // Legacy exports for backward compatibility
  processAffiliateServiceAreas: processTenantServiceAreas,
  getMDHServiceAreas: getPlatformServiceAreas,
  getAffiliatesForCity: getTenantsForCity
};
