/**
 * Domain Service
 * Handles custom domain operations for tenants
 * 
 * Features:
 * - Domain lookup and resolution
 * - Domain assignment and removal
 * - Domain verification status tracking
 * - SSL status management
 */

import { getPool } from '../database/pool.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('domainService');

/**
 * Get tenant record by custom domain
 * @param {string} domain - The custom domain name
 * @returns {Promise<object|null>} Tenant record or null if not found
 */
export async function getTenantByDomain(domain) {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT * FROM tenants.business WHERE custom_domain = $1`,
      [domain.toLowerCase()]
    );
    
    logger.info({
      event: 'domain_lookup',
      domain: domain.toLowerCase(),
      found: !!rows[0]
    }, 'Domain lookup performed');
    
    return rows[0] || null;
  } catch (error) {
    logger.error({
      event: 'domain_lookup_error',
      domain,
      error: error.message
    }, 'Failed to lookup domain');
    throw error;
  }
}

/**
 * Assign a custom domain to a tenant
 * Marks verification and SSL as pending until validated
 * @param {string|number} tenantId - The tenant ID
 * @param {string} customDomain - The custom domain to assign
 * @returns {Promise<object>} Updated tenant record
 */
export async function setTenantDomain(tenantId, customDomain) {
  try {
    // Validate domain format
    if (!isValidDomain(customDomain)) {
      throw new Error('Invalid domain format');
    }

    const pool = await getPool();
    const { rows } = await pool.query(
      `
      UPDATE tenants.business
      SET custom_domain = $1,
          domain_verified = FALSE,
          ssl_enabled = FALSE,
          domain_added_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
      [customDomain.toLowerCase(), tenantId]
    );

    if (rows.length === 0) {
      throw new Error('Tenant not found');
    }

    logger.info({
      event: 'domain_assigned',
      tenantId,
      customDomain: customDomain.toLowerCase()
    }, 'Custom domain assigned to tenant');

    return rows[0];
  } catch (error) {
    logger.error({
      event: 'domain_assignment_error',
      tenantId,
      customDomain,
      error: error.message
    }, 'Failed to assign custom domain');
    throw error;
  }
}

/**
 * Remove a custom domain from tenant
 * @param {string|number} tenantId - The tenant ID
 * @returns {Promise<object>} Updated tenant record
 */
export async function removeTenantDomain(tenantId) {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      UPDATE tenants.business
      SET custom_domain = NULL,
          domain_verified = FALSE,
          ssl_enabled = FALSE
      WHERE id = $1
      RETURNING *;
      `,
      [tenantId]
    );

    if (rows.length === 0) {
      throw new Error('Tenant not found');
    }

    logger.info({
      event: 'domain_removed',
      tenantId
    }, 'Custom domain removed from tenant');

    return rows[0];
  } catch (error) {
    logger.error({
      event: 'domain_removal_error',
      tenantId,
      error: error.message
    }, 'Failed to remove custom domain');
    throw error;
  }
}

/**
 * Get domain verification & SSL status for a tenant
 * @param {string|number} tenantId - The tenant ID
 * @returns {Promise<object|null>} Domain status or null if tenant not found
 */
export async function getDomainStatus(tenantId) {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      SELECT 
        custom_domain, 
        domain_verified, 
        ssl_enabled, 
        domain_added_at,
        slug
      FROM tenants.business
      WHERE id = $1;
      `,
      [tenantId]
    );

    const status = rows[0] || null;
    
    logger.info({
      event: 'domain_status_requested',
      tenantId,
      hasCustomDomain: !!status?.custom_domain
    }, 'Domain status requested');

    return status;
  } catch (error) {
    logger.error({
      event: 'domain_status_error',
      tenantId,
      error: error.message
    }, 'Failed to get domain status');
    throw error;
  }
}

/**
 * Update domain verification status
 * @param {string|number} tenantId - The tenant ID
 * @param {boolean} verified - Whether domain is verified
 * @returns {Promise<object>} Updated tenant record
 */
export async function updateDomainVerification(tenantId, verified) {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      UPDATE tenants.business
      SET domain_verified = $1
      WHERE id = $2
      RETURNING *;
      `,
      [verified, tenantId]
    );

    if (rows.length === 0) {
      throw new Error('Tenant not found');
    }

    logger.info({
      event: 'domain_verification_updated',
      tenantId,
      verified
    }, 'Domain verification status updated');

    return rows[0];
  } catch (error) {
    logger.error({
      event: 'domain_verification_error',
      tenantId,
      verified,
      error: error.message
    }, 'Failed to update domain verification');
    throw error;
  }
}

/**
 * Update SSL status for a tenant's custom domain
 * @param {string|number} tenantId - The tenant ID
 * @param {boolean} sslEnabled - Whether SSL is enabled
 * @returns {Promise<object>} Updated tenant record
 */
export async function updateSSLStatus(tenantId, sslEnabled) {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      UPDATE tenants.business
      SET ssl_enabled = $1
      WHERE id = $2
      RETURNING *;
      `,
      [sslEnabled, tenantId]
    );

    if (rows.length === 0) {
      throw new Error('Tenant not found');
    }

    logger.info({
      event: 'ssl_status_updated',
      tenantId,
      sslEnabled
    }, 'SSL status updated');

    return rows[0];
  } catch (error) {
    logger.error({
      event: 'ssl_status_error',
      tenantId,
      sslEnabled,
      error: error.message
    }, 'Failed to update SSL status');
    throw error;
  }
}

/**
 * Check if a domain is already in use by another tenant
 * @param {string} domain - The domain to check
 * @param {string|number} excludeTenantId - Tenant ID to exclude from check
 * @returns {Promise<boolean>} True if domain is available
 */
export async function isDomainAvailable(domain, excludeTenantId = null) {
  try {
    const pool = await getPool();
    let query = 'SELECT id FROM tenants.business WHERE custom_domain = $1';
    let params = [domain.toLowerCase()];

    if (excludeTenantId) {
      query += ' AND id != $2';
      params.push(excludeTenantId);
    }

    const { rows } = await pool.query(query, params);
    const isAvailable = rows.length === 0;

    logger.info({
      event: 'domain_availability_check',
      domain: domain.toLowerCase(),
      isAvailable,
      excludeTenantId
    }, 'Domain availability checked');

    return isAvailable;
  } catch (error) {
    logger.error({
      event: 'domain_availability_error',
      domain,
      error: error.message
    }, 'Failed to check domain availability');
    throw error;
  }
}

/**
 * Validate domain format
 * @param {string} domain - The domain to validate
 * @returns {boolean} True if valid domain format
 */
function isValidDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return domainRegex.test(domain) && domain.length <= 253;
}
