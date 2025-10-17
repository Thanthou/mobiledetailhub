/**
 * Google OAuth Routes
 * Handles Google Business Profile OAuth flow for reviews integration
 */

import express from 'express';
import { google } from 'googleapis';
import { pool } from '../database/pool.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createModuleLogger } from '../config/logger.js';

const router = express.Router();
const logger = createModuleLogger('googleAuth');

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);

// Scopes for Google Business Profile access
const SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
  'https://www.googleapis.com/auth/plus.business.manage'
];

/**
 * GET /api/google/auth
 * Initiates Google OAuth flow by redirecting to Google's consent screen
 */
router.get('/auth', asyncHandler(async (req, res) => {
  try {
    // Generate the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Request refresh token
      scope: SCOPES,
      prompt: 'consent', // Force consent screen to get refresh token
      state: req.query.tenantId || 'default' // Optional: pass tenant ID for context
    });

    logger.info('Generated Google OAuth URL', { 
      authUrl: authUrl.substring(0, 100) + '...',
      tenantId: req.query.tenantId 
    });

    // Redirect to Google's consent screen
    res.redirect(authUrl);

  } catch (error) {
    logger.error('Error generating OAuth URL', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Google OAuth flow',
      error: error.message
    });
  }
}));

/**
 * GET /api/google/oauth/callback
 * Handles the OAuth callback from Google and exchanges code for tokens
 */
router.get('/oauth/callback', asyncHandler(async (req, res) => {
  const { code, state, error } = req.query;

  try {
    // Check for OAuth errors
    if (error) {
      logger.error('Google OAuth error', { error, state });
      return res.status(400).json({
        success: false,
        message: 'Google OAuth authorization failed',
        error: error
      });
    }

    // Check for authorization code
    if (!code) {
      logger.error('Missing authorization code', { query: req.query });
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    logger.info('Received OAuth callback', { 
      code: code.substring(0, 10) + '...',
      state,
      hasCode: !!code
    });

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    logger.info('✅ Tokens received from Google', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      tokenType: tokens.token_type,
      expiresIn: tokens.expiry_date ? new Date(tokens.expiry_date) : 'No expiry'
    });

    // Store tokens in database
    const tenantId = state || 'default';
    await storeOAuthTokens(tenantId, tokens);

    // Return success response
    res.json({
      success: true,
      message: '✅ Google Business Profile connected successfully!',
      data: {
        tenantId,
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      }
    });

  } catch (error) {
    logger.error('Error exchanging OAuth code for tokens', { 
      error: error.message,
      code: code ? code.substring(0, 10) + '...' : 'none'
    });

    res.status(500).json({
      success: false,
      message: 'Failed to exchange authorization code for tokens',
      error: error.message
    });
  }
}));

/**
 * Store OAuth tokens in database
 * @param {string} tenantId - Tenant identifier
 * @param {Object} tokens - OAuth tokens from Google
 */
async function storeOAuthTokens(tenantId, tokens) {
  if (!pool) {
    logger.warn('Database not available, storing tokens in memory only');
    return;
  }

  try {
    // Create oauth_tokens table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oauth_tokens (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(255) NOT NULL,
        access_token TEXT,
        refresh_token TEXT NOT NULL,
        token_type VARCHAR(50),
        expiry_date TIMESTAMP,
        scope TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(tenant_id)
      )
    `);

    // Insert or update tokens
    await pool.query(`
      INSERT INTO oauth_tokens (
        tenant_id, access_token, refresh_token, token_type, 
        expiry_date, scope, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (tenant_id) 
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        token_type = EXCLUDED.token_type,
        expiry_date = EXCLUDED.expiry_date,
        scope = EXCLUDED.scope,
        updated_at = NOW()
    `, [
      tenantId,
      tokens.access_token,
      tokens.refresh_token,
      tokens.token_type,
      tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      tokens.scope
    ]);

    logger.info('OAuth tokens stored successfully', { tenantId });

  } catch (error) {
    logger.error('Error storing OAuth tokens', { 
      error: error.message,
      tenantId 
    });
    throw error;
  }
}

/**
 * GET /api/google/tokens/:tenantId
 * Retrieve stored OAuth tokens for a tenant
 */
router.get('/tokens/:tenantId', asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  try {
    if (!pool) {
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    const result = await pool.query(
      'SELECT access_token, refresh_token, token_type, expiry_date, scope, updated_at FROM oauth_tokens WHERE tenant_id = $1',
      [tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No OAuth tokens found for this tenant'
      });
    }

    const tokens = result.rows[0];
    res.json({
      success: true,
      data: {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        tokenType: tokens.token_type,
        expiresAt: tokens.expiry_date,
        scope: tokens.scope,
        lastUpdated: tokens.updated_at
      }
    });

  } catch (error) {
    logger.error('Error retrieving OAuth tokens', { 
      error: error.message,
      tenantId 
    });

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve OAuth tokens',
      error: error.message
    });
  }
}));

export default router;
