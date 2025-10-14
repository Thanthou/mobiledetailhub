/**
 * Tenant PWA Manifest Generator
 * Generates tenant-specific manifest.json for "Add to Home Screen"
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const logger = require('../utils/logger');

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
        name,
        slug,
        industry,
        primary_color,
        logo_url
      FROM tenants.business
      WHERE slug = $1 AND status = 'active'
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Tenant not found'
      });
    }

    const tenant = result.rows[0];
    
    // Get primary color or use default
    const themeColor = tenant.primary_color || '#ea580c'; // Orange-600 default
    const backgroundColor = '#1c1917'; // Stone-900
    
    // Generate tenant-specific manifest
    const manifest = {
      name: `${tenant.name} - Dashboard`,
      short_name: tenant.name,
      description: `Manage your ${tenant.name} website and business`,
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
          src: tenant.logo_url || '/shared/icons/default-dashboard-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: tenant.logo_url || '/shared/icons/default-dashboard-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: tenant.logo_url || '/shared/icons/default-dashboard-icon-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      shortcuts: [
        {
          name: 'Dashboard',
          short_name: 'Dashboard',
          description: 'Open your dashboard',
          url: `/${slug}/dashboard`,
          icons: [{ src: '/shared/icons/dashboard-shortcut.png', sizes: '96x96' }]
        },
        {
          name: 'View Website',
          short_name: 'Website',
          description: 'View your live website',
          url: `/${slug}`,
          icons: [{ src: '/shared/icons/website-shortcut.png', sizes: '96x96' }]
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

module.exports = router;

