/**
 * Preview Routes
 * 
 * API endpoints for generating and verifying preview tokens.
 * Used by sales team to create demo sites for prospects.
 */

const express = require('express');
const { z } = require('zod');
const router = express.Router();
const { signPreview, verifyPreview } = require('../utils/previewToken');
const logger = require('../utils/logger');

// Validation schema for preview payload
const PreviewPayloadSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  phone: z.string().min(7, 'Phone number must be at least 7 characters').max(20),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  state: z.string().length(2, 'State must be 2 characters').regex(/^[A-Z]{2}$/, 'State must be uppercase'),
  industry: z.enum(['mobile-detailing', 'maid-service', 'lawncare', 'pet-grooming'], {
    errorMap: () => ({ message: 'Invalid industry type' }),
  }),
});

/**
 * POST /api/previews
 * Generate a signed preview token
 * 
 * Body: { businessName, phone, industry }
 * Returns: { url, token }
 */
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validation = PreviewPayloadSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const payload = validation.data;

    // Sign the token
    const token = signPreview(payload);

    // Build preview URL (frontend will handle the route)
    const previewUrl = `/preview?t=${token}`;

    logger.info('Preview created', {
      industry: payload.industry,
      businessName: payload.businessName.substring(0, 20),
    });

    res.json({
      success: true,
      url: previewUrl,
      token,
      expiresIn: '7 days',
    });
  } catch (error) {
    logger.error('Failed to create preview', { error: error.message });
    res.status(500).json({
      error: 'Failed to create preview',
      message: 'An error occurred while generating the preview link',
    });
  }
});

/**
 * GET /api/preview/verify?t=<token>
 * Verify a preview token and return the payload
 * 
 * Query: { t: token }
 * Returns: { businessName, phone, industry }
 */
router.get('/verify', async (req, res) => {
  try {
    const { t: token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Preview token is required',
      });
    }

    // Verify and decode the token
    const payload = verifyPreview(token);

    res.json({
      success: true,
      payload,
    });
  } catch (error) {
    logger.warn('Preview verification failed', { error: error.message });
    
    // Return user-friendly error messages
    const statusCode = error.message.includes('expired') ? 410 : 400;
    
    res.status(statusCode).json({
      error: 'Verification failed',
      message: error.message,
    });
  }
});

module.exports = router;

