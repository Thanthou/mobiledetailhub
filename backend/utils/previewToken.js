/**
 * Preview Token Utilities
 * 
 * Separate JWT utilities for preview tokens, isolated from user authentication.
 * Preview tokens are short-lived (7 days) and contain minimal business info
 * for sales demos.
 */

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const logger = require('./logger');

// Preview token configuration
const PREVIEW_AUD = 'mdh-previews';
const PREVIEW_ISS = 'mdh-backend';
const PREVIEW_EXP = '1h';
const PREVIEW_VERSION = 1;

/**
 * Sign a preview token with business information
 * @param {Object} payload - Business preview data
 * @param {string} payload.businessName - Business name
 * @param {string} payload.phone - Business phone
 * @param {string} payload.city - City
 * @param {string} payload.state - State (2-letter code)
 * @param {string} payload.industry - Industry type
 * @returns {string} Signed JWT token
 */
function signPreview(payload) {
  try {
    const tokenPayload = {
      v: PREVIEW_VERSION,
      // Optional tenant binding for isolation; when provided, restricts token usage to that tenant
      tenantId: payload.tenantId || null,
      businessName: payload.businessName,
      phone: payload.phone,
      city: payload.city,
      state: payload.state,
      industry: payload.industry,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: PREVIEW_EXP,
      algorithm: 'HS256',
      issuer: PREVIEW_ISS,
      audience: PREVIEW_AUD,
    });

    logger.info('Preview token signed', {
      industry: payload.industry,
      businessName: payload.businessName.substring(0, 20), // Truncate for logging
    });

    return token;
  } catch (error) {
    logger.error('Failed to sign preview token', { error: error.message });
    throw new Error('Failed to create preview token');
  }
}

/**
 * Verify and decode a preview token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyPreview(token, expectedTenantId = null) {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: PREVIEW_ISS,
      audience: PREVIEW_AUD,
    });

    // Validate version
    if (decoded.v !== PREVIEW_VERSION) {
      throw new Error('Invalid token version');
    }

    // Enforce tenant isolation if expected is provided and token is bound
    if (expectedTenantId && decoded.tenantId && decoded.tenantId !== expectedTenantId) {
      throw new Error('Invalid preview context');
    }

    logger.info('Preview token verified', {
      industry: decoded.industry,
    });

    return {
      businessName: decoded.businessName,
      phone: decoded.phone,
      city: decoded.city,
      state: decoded.state,
      industry: decoded.industry,
      tenantId: decoded.tenantId || null,
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Preview token expired');
      throw new Error('Preview link has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid preview token', { error: error.message });
      throw new Error('Invalid preview link');
    }
    logger.error('Failed to verify preview token', { error: error.message });
    throw new Error('Failed to verify preview link');
  }
}

module.exports = {
  signPreview,
  verifyPreview,
};

