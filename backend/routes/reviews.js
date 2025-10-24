import express from 'express';
import { getPool } from '../database/pool.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseFormatter.js';
import { validateBody, validateQuery } from '../middleware/zodValidation.js';
import { reviewSchemas } from '../schemas/apiSchemas.js';
import { env } from '../config/env.async.js';

const router = express.Router();

/**
 * GET /api/reviews
 * Get reviews with optional filtering
 * Query params: tenant_slug, limit, offset
 */
router.get('/', validateQuery(reviewSchemas.list), async (req, res) => {
  logger.info('Reviews GET route hit with query:', req.query);
  try {
    const pool = await getPool();
    const {
      tenant_slug,
      limit = 10,
      offset = 0
    } = req.query;

    let query = `
      SELECT 
        r.id,
        r.tenant_slug,
        r.customer_name,
        r.rating,
        r.comment,
        r.reviewer_url,
        r.vehicle_type,
        r.paint_correction,
        r.ceramic_coating,
        r.paint_protection_film,
        r.source,
        r.avatar_filename,
        r.created_at,
        r.updated_at,
        r.published_at
      FROM reputation.reviews r
    `;

    const queryParams = [];
    let paramCount = 0;

    // Add tenant filter if provided
    if (tenant_slug) {
      query += ` WHERE r.tenant_slug = $${++paramCount}`;
      queryParams.push(tenant_slug);
    }

    // Add ordering and pagination
    query += ` ORDER BY r.rating DESC, r.created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM reputation.reviews r`;
    const countParams = [];
    let countParamCount = 0;

    if (tenant_slug) {
      countQuery += ` WHERE r.tenant_slug = $${++countParamCount}`;
      countParams.push(tenant_slug);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return sendSuccess(res, 'Reviews retrieved successfully', {
      reviews: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    logger.error('Error fetching reviews:', error);
    return sendError(res, 'Failed to fetch reviews', error.message, 500);
  }
});

/**
 * GET /api/reviews/:id
 * Get a specific review by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const { id } = req.params;

    const query = `
      SELECT 
        r.id,
        r.tenant_slug,
        r.customer_name,
        r.rating,
        r.comment,
        r.reviewer_url,
        r.vehicle_type,
        r.paint_correction,
        r.ceramic_coating,
        r.paint_protection_film,
        r.source,
        r.avatar_filename,
        r.status,
        r.created_at,
        r.updated_at,
        r.published_at
      FROM reputation.reviews r
      WHERE r.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return sendError(res, 'Review not found', null, 404);
    }

    sendSuccess(res, 'Review retrieved successfully', result.rows[0]);

  } catch (error) {
    logger.error('Error fetching review:', error);
    sendError(res, 'Failed to fetch review', error.message, 500);
  }
});

/**
 * POST /api/reviews
 * Create a new review
 */
router.post('/', validateBody(reviewSchemas.create), async (req, res) => {
  try {
    const pool = await getPool();
    const {
      tenant_slug,
      customer_name,
      rating,
      comment,
      reviewer_url,
      vehicle_type,
      paint_correction = false,
      ceramic_coating = false,
      paint_protection_film = false,
      source = 'website',
      avatar_filename
    } = req.body;

    // Validate tenant exists
    if (tenant_slug) {
      const tenantCheck = await pool.query(
        'SELECT slug FROM tenants.business WHERE slug = $1',
        [tenant_slug]
      );

      if (tenantCheck.rows.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Tenant not found'
        });
      }
    }

    const query = `
      INSERT INTO reputation.reviews (
        tenant_slug, customer_name, rating, comment, reviewer_url, vehicle_type,
        paint_correction, ceramic_coating, paint_protection_film, source, avatar_filename
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      tenant_slug,
      customer_name,
      rating,
      comment,
      reviewer_url || null,
      vehicle_type || null,
      paint_correction,
      ceramic_coating,
      paint_protection_film,
      source,
      avatar_filename || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      status: 'success',
      data: result.rows[0],
      message: 'Review submitted successfully'
    });

  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create review',
      error: env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * PUT /api/reviews/:id
 * Update a review (admin only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if review exists
    const existingReview = await pool.query(
      'SELECT id FROM reputation.reviews WHERE id = $1',
      [id]
    );

    if (existingReview.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = $${++paramCount}`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields to update'
      });
    }

    values.push(id);
    const query = `
      UPDATE reputation.reviews 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    sendSuccess(res, 'Review updated successfully', result.rows[0]);

  } catch (error) {
    logger.error('Error updating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update review',
      error: env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/reviews/:id
 * Delete a review (admin only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM reputation.reviews WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    sendSuccess(res, 'Review deleted successfully');

  } catch (error) {
    logger.error('Error deleting review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete review',
      error: env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});


export default router;
