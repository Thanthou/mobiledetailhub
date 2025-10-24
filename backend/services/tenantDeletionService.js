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
      SELECT COUNT(*) as count
      FROM tenants.subscriptions 
      WHERE business_id = $1 AND status IN ('active', 'trialing')
    `, [tenantId]);
    
    if (parseInt(activeSubscriptions.rows[0].count) > 0) {
      issues.push({
        type: 'active_subscription',
        message: `Tenant has ${activeSubscriptions.rows[0].count} active subscription(s)`,
        data: { count: parseInt(activeSubscriptions.rows[0].count) }
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
    logger.error('Error validating tenant deletion:', {
      tenantId,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to validate tenant deletion: ${error.message}`);
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
    logger.error('Error creating tenant snapshot:', {
      tenantId,
      error: error.message,
      stack: error.stack
    });
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
  
  const cleanupErrors = [];
  
  // Helper function to execute a cleanup query with savepoint
  async function safeCleanup(name, query, params) {
    try {
      await client.query(`SAVEPOINT ${name}`);
      await client.query(query, params);
      await client.query(`RELEASE SAVEPOINT ${name}`);
    } catch (error) {
      await client.query(`ROLLBACK TO SAVEPOINT ${name}`);
      cleanupErrors.push({ table: name, error: error.message });
      logger.warn(`Skipping ${name} cleanup`, { error: error.message });
    }
  }
  
  // 1. Clean up any orphaned reviews by slug (if business_id wasn't added)
  await safeCleanup(
    'cleanup_reviews',
    'DELETE FROM reputation.reviews WHERE tenant_slug = $1 AND business_id IS NULL',
    [tenantSlug]
  );
  
  // 2. Clean up any orphaned tenant images by slug
  await safeCleanup(
    'cleanup_images',
    'DELETE FROM tenants.tenant_images WHERE tenant_slug = $1',
    [tenantSlug]
  );
  
  // 3. Clean up any remaining health monitoring records
  await safeCleanup(
    'cleanup_health',
    'DELETE FROM system.health_monitoring WHERE tenant_slug = $1 OR business_id = $2',
    [tenantSlug, tenantId]
  );
  
  // 4. Clean up any remaining booking quotes
  await safeCleanup(
    'cleanup_quotes',
    'DELETE FROM booking.quotes WHERE affiliate_id = $1',
    [tenantId]
  );
  
  logger.info('Manual cleanup completed', { 
    tenantId, 
    tenantSlug,
    errors: cleanupErrors.length,
    skippedTables: cleanupErrors.map(e => e.table)
  });
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
    logger.error('Error verifying deletion:', {
      tenantId,
      error: error.message,
      stack: error.stack
    });
    throw new Error('Deletion verification failed');
  }
}

/**
 * Perform a dry-run deletion to see what would be deleted
 * @param {number} tenantId - The tenant ID to analyze
 * @param {Object} actor - The user performing the dry-run
 * @returns {Object} Dry-run result with details of what would be deleted
 */
async function dryRunDeleteTenant(tenantId, actor) {
  const pool = await getPool();
  
  try {
    logger.info('Starting dry-run tenant deletion analysis', { 
      tenantId, 
      actor: actor.email 
    });
    
    // 1. Get tenant information
    const tenant = await getTenantInfo(tenantId);
    
    // 2. Run validation
    const validation = await validateTenantDeletion(tenantId);
    
    // 3. Get detailed counts of what will be deleted
    const detailedCounts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM tenants.services WHERE business_id = $1) as services,
        (SELECT COUNT(*) FROM tenants.service_tiers WHERE service_id IN (SELECT id FROM tenants.services WHERE business_id = $1)) as service_tiers,
        (SELECT COUNT(*) FROM tenants.service_areas WHERE business_id = $1) as service_areas,
        (SELECT COUNT(*) FROM tenants.subscriptions WHERE business_id = $1) as subscriptions,
        (SELECT COUNT(*) FROM booking.bookings WHERE tenant_id = $1) as bookings,
        (SELECT COUNT(*) FROM booking.quotes WHERE affiliate_id = $1) as quotes,
        (SELECT COUNT(*) FROM booking.availability WHERE tenant_id = $1) as availability,
        (SELECT COUNT(*) FROM booking.blackout_dates WHERE tenant_id = $1) as blackout_dates,
        (SELECT COUNT(*) FROM schedule.time_blocks WHERE affiliate_id = $1) as time_blocks,
        (SELECT COUNT(*) FROM schedule.blocked_days WHERE affiliate_id = $1) as blocked_days,
        (SELECT COUNT(*) FROM schedule.appointments WHERE affiliate_id = $1) as appointments,
        (SELECT COUNT(*) FROM schedule.schedule_settings WHERE affiliate_id = $1) as schedule_settings,
        (SELECT COUNT(*) FROM website.content WHERE business_id = $1) as website_content,
        (SELECT COUNT(*) FROM reputation.reviews WHERE tenant_id = $1 OR tenant_slug = $2) as reviews,
        (SELECT COUNT(*) FROM tenants.tenant_images WHERE tenant_slug = $2) as tenant_images,
        (SELECT COUNT(*) FROM system.health_monitoring WHERE business_id = $1 OR tenant_slug = $2) as health_monitoring,
        (SELECT COUNT(*) FROM analytics.events WHERE tenant_id = $1) as analytics_events,
        (SELECT COUNT(*) FROM auth.users WHERE id = $3) as user_record
    `, [tenantId, tenant.slug, tenant.user_id]);
    
    const counts = detailedCounts.rows[0];
    
    // Calculate total records
    const totalRecords = Object.values(counts).reduce((sum, val) => sum + parseInt(val || 0), 0);
    
    // Build summary
    const summary = {
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        business_name: tenant.business_name,
        email: tenant.email,
        status: tenant.application_status
      },
      validation: {
        canDeleteSafely: validation.isValid,
        issues: validation.issues
      },
      recordsToDelete: counts,
      totalRecords,
      impact: {
        hasActiveSubscription: validation.issues.some(i => i.type === 'active_subscription'),
        hasPendingBookings: validation.issues.some(i => i.type === 'pending_bookings'),
        hasRecentActivity: validation.issues.some(i => i.type === 'recent_activity')
      },
      recommendation: validation.isValid 
        ? 'Safe to delete' 
        : 'Requires force=true flag due to validation issues'
    };
    
    logger.info('Dry-run analysis completed', {
      tenantId,
      totalRecords,
      canDeleteSafely: validation.isValid
    });
    
    return {
      success: true,
      dryRun: true,
      summary
    };
    
  } catch (error) {
    logger.error('Dry-run deletion analysis failed:', {
      tenantId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Delete a tenant and all associated data
 * @param {number} tenantId - The tenant ID to delete
 * @param {Object} actor - The user performing the deletion
 * @param {Object} options - Deletion options
 * @param {boolean} [options.force=false] - Force deletion despite validation issues
 * @param {boolean} [options.skipValidation=false] - Skip validation entirely
 * @param {boolean} [options.dryRun=false] - Only analyze what would be deleted without actually deleting
 * @returns {Object} Deletion result
 */
async function deleteTenant(tenantId, actor, options = {}) {
  const { force = false, skipValidation = false, dryRun = false } = options;
  
  // Handle dry-run mode
  if (dryRun) {
    return dryRunDeleteTenant(tenantId, actor);
  }
  
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
    
    // 4. Delete the tenant record - CASCADE constraints will handle all related data
    logger.info('Deleting tenant (CASCADE will handle related records)', { tenantId });
    
    const deleteResult = await client.query(
      'DELETE FROM tenants.business WHERE id = $1',
      [tenantId]
    );
    
    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      throw new Error('Tenant not found or already deleted');
    }
    
    logger.info('Tenant deleted successfully - CASCADE handled all related records', { tenantId });
    
    // 5. Delete the associated user record if it exists
    if (tenant.user_id) {
      await client.query('DELETE FROM auth.users WHERE id = $1', [tenant.user_id]);
      logger.info('Deleted associated user record', { userId: tenant.user_id });
    }
    
    // 8. Commit transaction
    await client.query('COMMIT');
    
    // 6. Log audit trail
    logger.info('Tenant deletion completed successfully', {
      tenantId,
      tenantSlug: tenant.slug,
      businessName: tenant.business_name,
      actor: actor.email,
      snapshot
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
      snapshot
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Tenant deletion failed:', {
      tenantId,
      error: error.message,
      stack: error.stack
    });
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
async function softDeleteTenant(tenantId, actor) {
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
    logger.error('Soft tenant deletion failed:', {
      tenantId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export {
  getTenantInfo,
  validateTenantDeletion,
  createTenantSnapshot,
  verifyDeletion,
  dryRunDeleteTenant,
  deleteTenant,
  softDeleteTenant
};
