/**
 * Tenant Deletion Service
 * 
 * Provides a centralized, safe way to delete tenants and all associated data.
 * Uses foreign key cascades where possible and manual cleanup for edge cases.
 */

import { getPool } from '../database/pool.js';
import { logger } from '../config/logger.js';

/**
 * Get tenant information before deletion for audit purposes
 * @param {number} tenantId - The tenant ID to lookup
 * @returns {Object} Tenant information
 */
async function getTenantInfo(tenantId) {
  const pool = await getPool();
  
  const query = `
    SELECT 
      id, slug, business_name, business_email as email, 
      user_id, application_status, created_at, updated_at
    FROM tenants.business 
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [tenantId]);
  
  if (result.rows.length === 0) {
    throw new Error('Tenant not found');
  }
  
  return result.rows[0];
}

/**
 * Validate that tenant can be safely deleted
 * @param {number} tenantId - The tenant ID to validate
 * @returns {Object} Validation result with any blocking issues
 */
async function validateTenantDeletion(tenantId) {
  const pool = await getPool();
  const issues = [];
  
  try {
    // Check for active subscriptions
    const activeSubscriptions = await pool.query(`
      SELECT id, plan_name, status, current_period_end
      FROM tenants.subscriptions 
      WHERE business_id = $1 AND status IN ('active', 'trialing')
    `, [tenantId]);
    
    if (activeSubscriptions.rows.length > 0) {
      issues.push({
        type: 'active_subscription',
        message: `Tenant has active subscription: ${activeSubscriptions.rows[0].plan_name}`,
        data: activeSubscriptions.rows[0]
      });
    }
    
    // Check for pending bookings
    const pendingBookings = await pool.query(`
      SELECT COUNT(*) as count
      FROM booking.bookings 
      WHERE tenant_id = $1 AND status IN ('pending', 'confirmed')
    `, [tenantId]);
    
    if (parseInt(pendingBookings.rows[0].count) > 0) {
      issues.push({
        type: 'pending_bookings',
        message: `Tenant has ${pendingBookings.rows[0].count} pending bookings`,
        data: { count: parseInt(pendingBookings.rows[0].count) }
      });
    }
    
    // Check for recent activity (last 30 days)
    const recentActivity = await pool.query(`
      SELECT COUNT(*) as count
      FROM booking.bookings 
      WHERE tenant_id = $1 AND created_at > NOW() - INTERVAL '30 days'
    `, [tenantId]);
    
    if (parseInt(recentActivity.rows[0].count) > 0) {
      issues.push({
        type: 'recent_activity',
        message: `Tenant has ${recentActivity.rows[0].count} recent bookings (last 30 days)`,
        data: { count: parseInt(recentActivity.rows[0].count) }
      });
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
    
  } catch (error) {
    logger.error('Error validating tenant deletion:', error);
    throw new Error('Failed to validate tenant deletion');
  }
}

/**
 * Create a snapshot of tenant data for audit purposes
 * @param {number} tenantId - The tenant ID to snapshot
 * @returns {Object} Snapshot of tenant data
 */
async function createTenantSnapshot(tenantId) {
  const pool = await getPool();
  
  try {
    // Get tenant basic info
    const tenant = await getTenantInfo(tenantId);
    
    // Get associated data counts
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM tenants.services WHERE business_id = $1) as services_count,
        (SELECT COUNT(*) FROM tenants.service_areas WHERE business_id = $1) as service_areas_count,
        (SELECT COUNT(*) FROM booking.bookings WHERE tenant_id = $1) as bookings_count,
        (SELECT COUNT(*) FROM tenants.subscriptions WHERE business_id = $1) as subscriptions_count
    `, [tenantId]);
    
    return {
      tenant,
      counts: counts.rows[0],
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    logger.error('Error creating tenant snapshot:', error);
    throw new Error('Failed to create tenant snapshot');
  }
}

/**
 * Handle manual cleanup for tables that don't have proper foreign keys
 * @param {Object} client - Database client (within transaction)
 * @param {number} tenantId - The tenant ID
 * @param {string} tenantSlug - The tenant slug
 */
async function performManualCleanup(client, tenantId, tenantSlug) {
  logger.info('Performing manual cleanup for tenant deletion', { tenantId, tenantSlug });
  
  try {
    // Clean up any remaining references that don't have proper foreign keys
    // This is a safety net for edge cases
    
    // 1. Clean up any orphaned reviews by slug (if business_id wasn't added)
    await client.query(`
      DELETE FROM reputation.reviews 
      WHERE tenant_slug = $1 AND business_id IS NULL
    `, [tenantSlug]);
    
    // 2. Clean up any orphaned tenant images by slug
    await client.query(`
      DELETE FROM tenants.tenant_images 
      WHERE tenant_slug = $1
    `, [tenantSlug]);
    
    // 3. Clean up any remaining health monitoring records
    await client.query(`
      DELETE FROM system.health_monitoring 
      WHERE tenant_slug = $1 OR business_id = $2
    `, [tenantSlug, tenantId]);
    
    // 4. Clean up any remaining booking quotes
    await client.query(`
      DELETE FROM booking.quotes 
      WHERE affiliate_id = $1
    `, [tenantId]);
    
    logger.info('Manual cleanup completed successfully', { tenantId, tenantSlug });
    
  } catch (error) {
    logger.error('Error during manual cleanup:', error);
    throw new Error('Manual cleanup failed');
  }
}

/**
 * Verify that all tenant data has been properly deleted
 * @param {Object} client - Database client (within transaction)
 * @param {number} tenantId - The tenant ID
 * @returns {Object} Verification result
 */
async function verifyDeletion(client, tenantId) {
  try {
    const checks = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM tenants.business WHERE id = $1) as business_exists,
        (SELECT COUNT(*) FROM tenants.services WHERE business_id = $1) as services_remaining,
        (SELECT COUNT(*) FROM booking.bookings WHERE tenant_id = $1) as bookings_remaining,
        (SELECT COUNT(*) FROM tenants.subscriptions WHERE business_id = $1) as subscriptions_remaining
    `, [tenantId]);
    
    const result = checks.rows[0];
    const hasOrphans = parseInt(result.services_remaining) > 0 || 
                      parseInt(result.bookings_remaining) > 0 || 
                      parseInt(result.subscriptions_remaining) > 0;
    
    return {
      businessDeleted: parseInt(result.business_exists) === 0,
      hasOrphans,
      orphanCounts: {
        services: parseInt(result.services_remaining),
        bookings: parseInt(result.bookings_remaining),
        subscriptions: parseInt(result.subscriptions_remaining)
      }
    };
    
  } catch (error) {
    logger.error('Error verifying deletion:', error);
    throw new Error('Deletion verification failed');
  }
}

/**
 * Delete a tenant and all associated data
 * @param {number} tenantId - The tenant ID to delete
 * @param {Object} actor - The user performing the deletion
 * @param {Object} options - Deletion options
 * @returns {Object} Deletion result
 */
export async function deleteTenant(tenantId, actor, options = {}) {
  const { force = false, skipValidation = false } = options;
  
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    logger.info('Starting tenant deletion process', { 
      tenantId, 
      actor: actor.email,
      force,
      skipValidation 
    });
    
    // 1. Get tenant information
    const tenant = await getTenantInfo(tenantId);
    
    // 2. Create snapshot for audit
    const snapshot = await createTenantSnapshot(tenantId);
    
    // 3. Validate deletion (unless skipped)
    if (!skipValidation) {
      const validation = await validateTenantDeletion(tenantId);
      
      if (!validation.isValid && !force) {
        await client.query('ROLLBACK');
        return {
          success: false,
          error: 'Validation failed',
          issues: validation.issues,
          tenant: tenant
        };
      }
      
      if (!validation.isValid && force) {
        logger.warn('Force deletion with validation issues', {
          tenantId,
          issues: validation.issues
        });
      }
    }
    
    // 4. Perform manual cleanup for edge cases
    await performManualCleanup(client, tenantId, tenant.slug);
    
    // 5. Delete the tenant record (this will cascade to all related records)
    const deleteResult = await client.query(
      'DELETE FROM tenants.business WHERE id = $1',
      [tenantId]
    );
    
    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      throw new Error('Tenant not found or already deleted');
    }
    
    // 6. Delete the associated user record if it exists
    if (tenant.user_id) {
      await client.query('DELETE FROM auth.users WHERE id = $1', [tenant.user_id]);
      logger.info('Deleted associated user record', { userId: tenant.user_id });
    }
    
    // 7. Verify deletion
    const verification = await verifyDeletion(client, tenantId);
    
    if (!verification.businessDeleted) {
      throw new Error('Tenant deletion verification failed - business record still exists');
    }
    
    if (verification.hasOrphans) {
      logger.warn('Orphaned records detected after deletion', {
        tenantId,
        orphans: verification.orphanCounts
      });
    }
    
    // 8. Commit transaction
    await client.query('COMMIT');
    
    // 9. Log audit trail
    logger.info('Tenant deletion completed successfully', {
      tenantId,
      tenantSlug: tenant.slug,
      businessName: tenant.business_name,
      actor: actor.email,
      snapshot,
      verification
    });
    
    return {
      success: true,
      message: `Tenant "${tenant.business_name}" deleted successfully`,
      deletedTenant: {
        id: tenantId,
        slug: tenant.slug,
        business_name: tenant.business_name,
        email: tenant.email
      },
      snapshot,
      verification
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Tenant deletion failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Soft delete a tenant (mark as deleted but keep data)
 * @param {number} tenantId - The tenant ID to soft delete
 * @param {Object} actor - The user performing the deletion
 * @returns {Object} Soft deletion result
 */
export async function softDeleteTenant(tenantId, actor) {
  const pool = await getPool();
  
  try {
    // Add a deleted_at timestamp and mark as inactive
    const result = await pool.query(`
      UPDATE tenants.business 
      SET 
        application_status = 'deleted',
        updated_at = CURRENT_TIMESTAMP,
        last_activity = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, slug, business_name, business_email
    `, [tenantId]);
    
    if (result.rows.length === 0) {
      throw new Error('Tenant not found');
    }
    
    const tenant = result.rows[0];
    
    logger.info('Tenant soft deleted successfully', {
      tenantId,
      tenantSlug: tenant.slug,
      businessName: tenant.business_name,
      actor: actor.email
    });
    
    return {
      success: true,
      message: `Tenant "${tenant.business_name}" marked as deleted`,
      deletedTenant: tenant
    };
    
  } catch (error) {
    logger.error('Soft tenant deletion failed:', error);
    throw error;
  }
}

export {
  getTenantInfo,
  validateTenantDeletion,
  createTenantSnapshot,
  verifyDeletion
};
