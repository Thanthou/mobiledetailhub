import { getPool } from '../database/pool.js';
import { asyncHandler } from './errorHandler.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('withTenant');

/**
 * Switch database schema for tenant-specific operations
 * @param {Object} tenant - The tenant object with id and slug
 */
async function switchToTenantSchema(tenant) {
  try {
    const pool = await getPool();
    await pool.query('SET search_path TO tenants, public');
    
    logger.info({
      event: 'schema_switched',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      schema: 'tenants'
    }, 'Switched to tenant schema');
  } catch (error) {
    logger.error({
      event: 'schema_switch_error',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      error: error.message
    }, 'Failed to switch to tenant schema');
    throw error;
  }
}

/**
 * withTenant Middleware
 * 
 * Provides tenant context to routes by:
 * 1. Looking up tenant by slug from URL params
 * 2. Looking up tenant by user_id for authenticated users
 * 3. Validating tenant exists and is approved
 * 4. Attaching tenant data to req.tenant
 * 5. Switching database schema to tenants schema
 * 
 * Usage:
 * - router.get('/:slug', withTenant, (req, res) => { ... })
 * - router.get('/user-data', authenticateToken, withTenant, (req, res) => { ... })
 */

/**
 * Get tenant by slug from URL parameters
 */
async function getTenantBySlug(slug) {
  const pool = await getPool();

  const query = `
    SELECT 
      b.id, b.slug, b.business_name, b.owner, b.first_name, b.last_name, b.user_id,
      b.application_status, b.business_start_date, b.business_phone, b.personal_phone,
      b.business_email, b.personal_email, b.twilio_phone, b.sms_phone, b.website,
      b.gbp_url, b.facebook_url, b.facebook_enabled, b.instagram_url, b.instagram_enabled, 
      b.tiktok_url, b.tiktok_enabled, b.youtube_url, b.youtube_enabled,
      b.source, b.notes, b.service_areas, b.application_date, b.approved_date,
      b.last_activity, b.created_at, b.updated_at, b.industry,
      c.hero_title, c.hero_subtitle, c.reviews_title, c.reviews_subtitle,
      c.faq_title, c.faq_subtitle, c.faq_items,
      c.seo_title, c.seo_description, c.seo_keywords, c.seo_og_image,
      c.seo_twitter_image, c.seo_canonical_path, c.seo_robots
    FROM tenants.business b
    LEFT JOIN website.content c ON b.id = c.business_id
    WHERE b.slug = $1 AND b.application_status = 'approved'
  `;

  const result = await pool.query(query, [slug]);

  if (result.rows.length === 0) {
    const error = new Error('Tenant not found or not approved');
    error.statusCode = 404;
    error.code = 'TENANT_NOT_FOUND';
    throw error;
  }

  const tenant = result.rows[0];

  // Parse service_areas JSON if it's a string
  if (typeof tenant.service_areas === 'string') {
    try {
      tenant.service_areas = JSON.parse(tenant.service_areas);
    } catch (parseError) {
      logger.error('Error parsing service_areas:', parseError);
      tenant.service_areas = [];
    }
  }

  return tenant;
}

/**
 * Get tenant by user_id for authenticated users
 */
async function getTenantByUserId(userId, isAdmin = false) {
  const pool = await getPool();

  let query;
  let params;

  if (isAdmin) {
    // For admin users, get the first available business or allow them to work without tenant context
    query = `
      SELECT 
        b.id, b.slug, b.business_name, b.owner, b.first_name, b.last_name, b.user_id,
        b.application_status, b.business_start_date, b.business_phone, b.personal_phone,
        b.business_email, b.personal_email, b.twilio_phone, b.sms_phone, b.website,
        b.gbp_url, b.facebook_url, b.facebook_enabled, b.instagram_url, b.instagram_enabled, 
      b.tiktok_url, b.tiktok_enabled, b.youtube_url, b.youtube_enabled,
        b.source, b.notes, b.service_areas, b.application_date, b.approved_date,
        b.last_activity, b.created_at, b.updated_at, b.industry,
        c.hero_title, c.hero_subtitle, c.reviews_title, c.reviews_subtitle,
        c.faq_title, c.faq_subtitle, c.faq_items,
        c.seo_title, c.seo_description, c.seo_keywords, c.seo_og_image,
        c.seo_twitter_image, c.seo_canonical_path, c.seo_robots
      FROM tenants.business b
      LEFT JOIN website.content c ON b.id = c.business_id
      WHERE b.application_status = 'approved'
      ORDER BY b.id LIMIT 1
    `;
    params = [];
  } else {
    // For regular users, get their specific business
    query = `
      SELECT 
        b.id, b.slug, b.business_name, b.owner, b.first_name, b.last_name, b.user_id,
        b.application_status, b.business_start_date, b.business_phone, b.personal_phone,
        b.business_email, b.personal_email, b.twilio_phone, b.sms_phone, b.website,
        b.gbp_url, b.facebook_url, b.facebook_enabled, b.instagram_url, b.instagram_enabled, 
      b.tiktok_url, b.tiktok_enabled, b.youtube_url, b.youtube_enabled,
        b.source, b.notes, b.service_areas, b.application_date, b.approved_date,
        b.last_activity, b.created_at, b.updated_at, b.industry,
        c.hero_title, c.hero_subtitle, c.reviews_title, c.reviews_subtitle,
        c.faq_title, c.faq_subtitle, c.faq_items,
        c.seo_title, c.seo_description, c.seo_keywords, c.seo_og_image,
        c.seo_twitter_image, c.seo_canonical_path, c.seo_robots
      FROM tenants.business b
      LEFT JOIN website.content c ON b.id = c.business_id
      WHERE b.user_id = $1 AND b.application_status = 'approved'
    `;
    params = [userId];
  }

  const result = await pool.query(query, params);

  if (result.rows.length === 0) {
    if (isAdmin) {
      const error = new Error('No approved tenants found in the system');
      error.statusCode = 404;
      error.code = 'NO_TENANTS_FOUND';
      throw error;
    } else {
      const error = new Error('No tenant business found for this user');
      error.statusCode = 404;
      error.code = 'USER_TENANT_NOT_FOUND';
      throw error;
    }
  }

  const tenant = result.rows[0];

  // Parse service_areas JSON if it's a string
  if (typeof tenant.service_areas === 'string') {
    try {
      tenant.service_areas = JSON.parse(tenant.service_areas);
    } catch (parseError) {
      logger.error('Error parsing service_areas:', parseError);
      tenant.service_areas = [];
    }
  }

  return tenant;
}

/**
 * Middleware to get tenant by slug from URL parameters
 */
const withTenantBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  if (!slug) {
    const error = new Error('Tenant slug is required');
    error.statusCode = 400;
    error.code = 'MISSING_SLUG';
    throw error;
  }

  const tenant = await getTenantBySlug(slug);
  req.tenant = tenant;
  
  // Switch to tenant schema for subsequent operations
  await switchToTenantSchema(tenant);
  
  next();
});

/**
 * Middleware to get tenant by user_id (requires authentication)
 */
const withTenantByUser = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.userId) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    error.code = 'AUTHENTICATION_REQUIRED';
    throw error;
  }

  const isAdmin = req.user.isAdmin || false;
  const tenant = await getTenantByUserId(req.user.userId, isAdmin);
  req.tenant = tenant;
  
  // Switch to tenant schema for subsequent operations
  await switchToTenantSchema(tenant);
  
  next();
});

/**
 * Flexible middleware that tries slug first, then user_id
 * Useful for routes that might be called with either approach
 */
const withTenant = asyncHandler(async (req, res, next) => {
  // Try slug first if available
  if (req.params.slug) {
    try {
      const tenant = await getTenantBySlug(req.params.slug);
      req.tenant = tenant;
      await switchToTenantSchema(tenant);
      return next();
    } catch (error) {
      // If slug lookup fails and we have a user, try user lookup
      if (req.user && req.user.userId) {
        const isAdmin = req.user.isAdmin || false;
        const tenant = await getTenantByUserId(req.user.userId, isAdmin);
        req.tenant = tenant;
        await switchToTenantSchema(tenant);
        return next();
      }
      // Otherwise, re-throw the slug error
      throw error;
    }
  }

  // Try user_id if no slug
  if (req.user && req.user.userId) {
    const isAdmin = req.user.isAdmin || false;
    const tenant = await getTenantByUserId(req.user.userId, isAdmin);
    req.tenant = tenant;
    await switchToTenantSchema(tenant);
    return next();
  }

  // No slug or user available
  const error = new Error('Tenant slug or authentication required');
  error.statusCode = 400;
  error.code = 'MISSING_TENANT_CONTEXT';
  throw error;
});

/**
 * Middleware to validate tenant exists (lightweight check)
 * Only checks existence, doesn't load full tenant data
 */
const validateTenantExists = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  if (!slug) {
    const error = new Error('Tenant slug is required');
    error.statusCode = 400;
    error.code = 'MISSING_SLUG';
    throw error;
  }

  const pool = await getPool();
  const result = await pool.query(
    'SELECT id, slug, business_name FROM tenants.business WHERE slug = $1 AND application_status = $2',
    [slug, 'approved']
  );

  if (result.rows.length === 0) {
    const error = new Error('Tenant not found or not approved');
    error.statusCode = 404;
    error.code = 'TENANT_NOT_FOUND';
    throw error;
  }

  req.tenant = {
    id: result.rows[0].id,
    slug: result.rows[0].slug,
    business_name: result.rows[0].business_name
  };

  next();
});

export {
  withTenantBySlug,
  withTenantByUser,
  withTenant,
  validateTenantExists,
  getTenantBySlug,
  getTenantByUserId
};
