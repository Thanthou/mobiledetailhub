import express from 'express';
import logger from '../utils/logger';
import { pool } from '../database/pool';import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Tenant PWA Manifest Generator
 * Generates tenant-specific manifest.json for "Add to Home Screen"
 */
const router = express.Router();
;

/**
 * GET /:slug/manifest.json
 * Generate tenant-specific PWA manifest
 */
router.get('/:slug/manifest.json', async (req, res) => {
  try {
    const { slug } = req.params;

    // Fetch tenant business info
    const query = `
      SELECT 
        business_name,
        slug,
        industry
      FROM tenants.business
      WHERE slug = $1 AND application_status = 'approved'
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Tenant not found'
      });
    }

    const tenant = result.rows[0];
    
    // Use default theme colors (could be customizable in future)
    const themeColor = '#ea580c'; // Orange-600 default
    const backgroundColor = '#1c1917'; // Stone-900
    
    // Generate tenant-specific manifest
    const manifest = {
      name: `${tenant.business_name} - Dashboard`,
      short_name: tenant.business_name,
      description: `Manage your ${tenant.business_name} website and business`,
      start_url: `/${slug}/dashboard`,
      display: 'standalone',
      background_color: backgroundColor,
      theme_color: themeColor,
      orientation: 'portrait-primary',
      scope: `/${slug}/`,
      lang: 'en',
      categories: ['business', 'productivity'],
      icons: [
        {
          src: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenant.industry}/icons/favicon.svg`,
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenant.industry}/icons/favicon-192.webp`,
          sizes: '192x192',
          type: 'image/webp',
          purpose: 'any'
        },
        {
          src: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenant.industry}/icons/favicon-512.webp`,
          sizes: '512x512',
          type: 'image/webp',
          purpose: 'any'
        }
      ],
      shortcuts: [
        {
          name: 'Dashboard',
          short_name: 'Dashboard',
          description: 'Open your dashboard',
          url: `/${slug}/dashboard`,
          icons: [{ src: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenant.industry}/icons/favicon.svg`, sizes: '96x96' }]
        },
        {
          name: 'View Website',
          short_name: 'Website',
          description: 'View your live website',
          url: `/${slug}`,
          icons: [{ src: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenant.industry}/icons/favicon.svg`, sizes: '96x96' }]
        }
      ]
    };

    // Set correct content type
    res.setHeader('Content-Type', 'application/manifest+json');
    res.json(manifest);

  } catch (error) {
    logger.error('Error generating tenant manifest:', error);
    res.status(500).json({
      error: 'Failed to generate manifest',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;



