const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { authenticateToken } = require('../middleware/auth');
const { validateReviewSubmission, validateReviewUpdate } = require('../middleware/validation');
const logger = require('../utils/logger');

/**
 * GET /api/reviews
 * Get reviews with optional filtering
 * Query params: type, affiliate_id, business_slug, status, limit, offset
 */
router.get('/', async (req, res) => {
  try {
    const {
      type = 'mdh', // Default to MDH reviews
      affiliate_id,
      business_slug,
      status = 'approved',
      limit = 10,
      offset = 0,
      featured_only = false,
      verified_only = false
    } = req.query;

    let query = `
      SELECT 
        r.id,
        r.review_type,
        r.affiliate_id,
        r.business_slug,
        r.rating,
        r.title,
        r.content,
        r.reviewer_name,
        r.reviewer_avatar_url,
        r.review_source,
        r.is_verified,
        r.service_category,
        r.service_date,
        r.helpful_votes,
        r.total_votes,
        r.is_featured,
        r.created_at,
        r.published_at,
        b.business_name,
        b.slug as business_slug_actual
      FROM reputation.reviews r
      LEFT JOIN affiliates.business b ON r.affiliate_id = b.id
      WHERE r.review_type = $1 AND r.status = $2
    `;

    const queryParams = [type, status];
    let paramCount = 2;

    // Add additional filters
    if (affiliate_id) {
      query += ` AND r.affiliate_id = $${++paramCount}`;
      queryParams.push(affiliate_id);
    }

    if (business_slug) {
      query += ` AND r.business_slug = $${++paramCount}`;
      queryParams.push(business_slug);
    }

    if (featured_only === 'true') {
      query += ` AND r.is_featured = true`;
    }

    if (verified_only === 'true') {
      query += ` AND r.is_verified = true`;
    }

    // Add ordering and pagination
    query += ` ORDER BY r.is_featured DESC, r.rating DESC, r.created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM reputation.reviews r
      WHERE r.review_type = $1 AND r.status = $2
    `;
    const countParams = [type, status];
    let countParamCount = 2;

    if (affiliate_id) {
      countQuery += ` AND r.affiliate_id = $${++countParamCount}`;
      countParams.push(affiliate_id);
    }

    if (business_slug) {
      countQuery += ` AND r.business_slug = $${++countParamCount}`;
      countParams.push(business_slug);
    }

    if (featured_only === 'true') {
      countQuery += ` AND r.is_featured = true`;
    }

    if (verified_only === 'true') {
      countQuery += ` AND r.is_verified = true`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    logger.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/reviews/:id
 * Get a specific review by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        r.*,
        b.business_name,
        b.slug as business_slug_actual
      FROM reputation.reviews r
      LEFT JOIN affiliates.business b ON r.affiliate_id = b.id
      WHERE r.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    logger.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/reviews
 * Create a new review
 */
router.post('/', validateReviewSubmission, async (req, res) => {
  try {
    const {
      review_type,
      affiliate_id,
      business_slug,
      rating,
      title,
      content,
      reviewer_name,
      reviewer_email,
      reviewer_phone,
      reviewer_avatar_url,
      review_source = 'website',
      service_category,
      service_date,
      booking_id
    } = req.body;

    // Validate business exists for affiliate reviews
    if (review_type === 'affiliate' && affiliate_id) {
      const businessCheck = await pool.query(
        'SELECT id, slug FROM affiliates.business WHERE id = $1',
        [affiliate_id]
      );

      if (businessCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Affiliate business not found'
        });
      }

      // Ensure business_slug matches
      if (business_slug !== businessCheck.rows[0].slug) {
        return res.status(400).json({
          success: false,
          message: 'Business slug does not match affiliate ID'
        });
      }
    }

    const query = `
      INSERT INTO reputation.reviews (
        review_type, affiliate_id, business_slug, rating, title, content,
        reviewer_name, reviewer_email, reviewer_phone, reviewer_avatar_url,
        review_source, service_category, service_date, booking_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      review_type,
      affiliate_id || null,
      business_slug || null,
      rating,
      title || null,
      content,
      reviewer_name,
      reviewer_email || null,
      reviewer_phone || null,
      reviewer_avatar_url || null,
      review_source,
      service_category || null,
      service_date || null,
      booking_id || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Review submitted successfully'
    });

  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * PUT /api/reviews/:id
 * Update a review (admin only)
 */
router.put('/:id', authenticateToken, validateReviewUpdate, async (req, res) => {
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
        success: false,
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
        success: false,
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

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Review updated successfully'
    });

  } catch (error) {
    logger.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/reviews/:id/vote
 * Vote on a review (helpful/not helpful)
 */
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { vote_type, user_ip } = req.body; // vote_type: 'helpful' or 'not_helpful'

    if (!['helpful', 'not_helpful'].includes(vote_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Must be "helpful" or "not_helpful"'
      });
    }

    // Check if user has already voted (by IP for now)
    const existingVote = await pool.query(
      'SELECT id, vote_type FROM reputation.review_votes WHERE review_id = $1 AND voter_ip = $2',
      [id, user_ip]
    );

    if (existingVote.rows.length > 0) {
      // Update existing vote
      await pool.query(
        'UPDATE reputation.review_votes SET vote_type = $1, updated_at = CURRENT_TIMESTAMP WHERE review_id = $2 AND voter_ip = $3',
        [vote_type, id, user_ip]
      );
    } else {
      // Create new vote
      await pool.query(
        'INSERT INTO reputation.review_votes (review_id, vote_type, voter_ip) VALUES ($1, $2, $3)',
        [id, vote_type, user_ip]
      );
    }

    // Update review vote counts
    const voteCounts = await pool.query(`
      SELECT 
        COUNT(CASE WHEN vote_type = 'helpful' THEN 1 END) as helpful_votes,
        COUNT(*) as total_votes
      FROM reputation.review_votes 
      WHERE review_id = $1
    `, [id]);

    await pool.query(
      'UPDATE reputation.reviews SET helpful_votes = $1, total_votes = $2 WHERE id = $3',
      [voteCounts.rows[0].helpful_votes, voteCounts.rows[0].total_votes, id]
    );

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        helpful_votes: voteCounts.rows[0].helpful_votes,
        total_votes: voteCounts.rows[0].total_votes
      }
    });

  } catch (error) {
    logger.error('Error voting on review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
