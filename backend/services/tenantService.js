/**
 * Tenant Service
 * Handles tenant database operations and caching
 */

import { getPool } from '../database/pool.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('tenantService');

/**
 * Get tenant by slug
 * @param {string} slug - The tenant slug
 * @returns {Object|null} - Tenant object or null
 */
export async function getTenantBySlug(slug) {
  if (!slug || typeof slug !== 'string') {
    logger.warn({ slug }, 'Invalid slug provided to getTenantBySlug');
    return null;
  }

  const pool = await getPool();
  
  try {
    const query = `
      SELECT 
        b.id,
        b.slug,
        b.business_name,
        b.industry,
        b.application_status,
        b.created_at,
        b.updated_at,
        b.business_email,
        b.business_phone,
        b.personal_email,
        b.personal_phone,
        b.owner,
        b.first_name,
        b.last_name,
        b.service_areas,
        b.facebook_url,
        b.instagram_url,
        b.youtube_url,
        b.tiktok_url,
        b.gbp_url,
        b.facebook_enabled,
        b.instagram_enabled,
        b.youtube_enabled,
        b.tiktok_enabled
      FROM tenants.business b
      WHERE b.slug = $1 
        AND b.application_status = 'approved'
      LIMIT 1
    `;
    
    const result = await pool.query(query, [slug]);
    
    if (result.rows.length === 0) {
      logger.info({ slug }, 'Tenant not found or inactive');
      return null;
    }
    
    const tenant = result.rows[0];
    
    logger.info({
      tenantId: tenant.id,
      slug: tenant.slug,
      businessName: tenant.business_name,
      industry: tenant.industry,
      subscriptionStatus: tenant.subscription_status
    }, 'Tenant retrieved successfully');
    
    return tenant;
    
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      slug
    }, 'Error retrieving tenant by slug');
    
    throw error;
  }
}

/**
 * Get tenant by ID
 * @param {number} id - The tenant ID
 * @returns {Object|null} - Tenant object or null
 */
export async function getTenantById(id) {
  if (!id || typeof id !== 'number') {
    logger.warn({ id }, 'Invalid ID provided to getTenantById');
    return null;
  }

  const pool = await getPool();
  
  try {
    const query = `
      SELECT 
        b.id,
        b.slug,
        b.business_name,
        b.industry,
        b.application_status,
        b.created_at,
        b.updated_at,
        b.business_email,
        b.business_phone,
        b.owner,
        b.first_name,
        b.last_name
      FROM tenants.business b
      WHERE b.id = $1 
        AND b.application_status = 'approved'
      LIMIT 1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      logger.info({ id }, 'Tenant not found or inactive');
      return null;
    }
    
    const tenant = result.rows[0];
    
    logger.info({
      tenantId: tenant.id,
      slug: tenant.slug,
      businessName: tenant.business_name
    }, 'Tenant retrieved by ID successfully');
    
    return tenant;
    
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      id
    }, 'Error retrieving tenant by ID');
    
    throw error;
  }
}

/**
 * Get tenant website content
 * @param {string} slug - The tenant slug
 * @returns {Object|null} - Website content or null
 */
export async function getTenantWebsiteContent(slug) {
  if (!slug || typeof slug !== 'string') {
    logger.warn({ slug }, 'Invalid slug provided to getTenantWebsiteContent');
    return null;
  }

  const pool = await getPool();
  
  try {
    const query = `
      SELECT 
        wc.id,
        wc.tenant_id,
        wc.content_type,
        wc.content_data,
        wc.is_published,
        wc.created_at,
        wc.updated_at
      FROM website.content wc
      JOIN tenants.business b ON wc.tenant_id = b.id
      WHERE b.slug = $1 
        AND b.application_status = 'approved'
        AND wc.is_published = true
      ORDER BY wc.content_type, wc.created_at DESC
    `;
    
    const result = await pool.query(query, [slug]);
    
    if (result.rows.length === 0) {
      logger.info({ slug }, 'No website content found for tenant');
      return null;
    }
    
    // Group content by type
    const content = {};
    result.rows.forEach(row => {
      if (!content[row.content_type]) {
        content[row.content_type] = [];
      }
      content[row.content_type].push({
        id: row.id,
        data: row.content_data,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    });
    
    logger.info({
      slug,
      contentTypes: Object.keys(content).length,
      totalItems: result.rows.length
    }, 'Tenant website content retrieved successfully');
    
    return content;
    
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      slug
    }, 'Error retrieving tenant website content');
    
    throw error;
  }
}

/**
 * Update tenant business data by slug
 * @param {string} slug - The tenant slug
 * @param {Object} updateData - The data to update
 * @returns {Object} - Updated tenant object
 */
export async function updateTenantBySlug(slug, updateData) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug provided');
  }

  if (!updateData || typeof updateData !== 'object') {
    throw new Error('No valid fields to update');
  }

  const pool = await getPool();
  
  try {
    // Build dynamic UPDATE query based on provided fields
    const allowedFields = [
      'business_name', 'business_email', 'business_phone',
      'personal_email', 'personal_phone', 
      'first_name', 'last_name',
      'business_start_date',
      'facebook_url', 'instagram_url', 'youtube_url', 'tiktok_url', 'gbp_url',
      'facebook_enabled', 'instagram_enabled', 'youtube_enabled', 'tiktok_enabled'
    ];
    // Note: 'website' is a generated column, cannot be updated directly
    
    const updates = [];
    const values = [];
    let paramCount = 0;
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
      }
    }
    
    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    // Add slug as final parameter
    paramCount++;
    values.push(slug);
    
    const query = `
      UPDATE tenants.business
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE slug = $${paramCount} AND application_status = 'approved'
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('Tenant not found or not approved');
    }
    
    const updatedTenant = result.rows[0];
    
    logger.info({
      slug,
      updatedFields: Object.keys(updateData),
      tenantId: updatedTenant.id
    }, 'Tenant updated successfully');
    
    return updatedTenant;
    
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      slug,
      updateData: Object.keys(updateData)
    }, 'Error updating tenant by slug');
    
    throw error;
  }
}

/**
 * Validate tenant slug format
 * @param {string} slug - The slug to validate
 * @returns {boolean} - Whether the slug is valid
 */
export function validateTenantSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Slug should be 3-50 characters, alphanumeric and hyphens only
  const slugRegex = /^[a-z0-9-]{3,50}$/;
  return slugRegex.test(slug);
}

/**
 * Get all active tenants (for admin purposes)
 * @param {Object} options - Query options
 * @returns {Array} - Array of tenant objects
 */
export async function getAllActiveTenants(options = {}) {
  const { limit = 100, offset = 0, industry = null } = options;
  
  const pool = await getPool();
  
  try {
    let query = `
      SELECT 
        b.id,
        b.slug,
        b.business_name,
        b.industry,
        b.application_status,
        b.created_at,
        b.updated_at,
        b.business_email,
        b.business_phone,
        b.owner,
        b.first_name,
        b.last_name
      FROM tenants.business b
      WHERE b.application_status = 'approved'
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (industry) {
      paramCount++;
      query += ` AND t.industry = $${paramCount}`;
      params.push(industry);
    }
    
    query += ` ORDER BY t.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    logger.info({
      count: result.rows.length,
      limit,
      offset,
      industry
    }, 'Active tenants retrieved successfully');
    
    return result.rows;
    
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      options
    }, 'Error retrieving active tenants');
    
    throw error;
  }
}

export default {
  getTenantBySlug,
  getTenantById,
  getTenantWebsiteContent,
  updateTenantBySlug,
  validateTenantSlug,
  getAllActiveTenants
};