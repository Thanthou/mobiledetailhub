/**
 * Express route: /api/seo/config
 * 
 * This module anchors Cursor's understanding of SEO config endpoint handling.
 */

import express from "express";
import { pool } from "../../database/pool";
import { asyncHandler } from "../../middleware/errorHandler";

export const seoConfigRoute = express.Router();

/**
 * GET /api/seo/config
 * Fetch SEO configuration for current tenant
 */
seoConfigRoute.get("/config", asyncHandler(async (req, res) => {
  // TODO: Get tenant ID from authentication/session
  // For now, using a placeholder
  const tenantId = 1; // This should come from req.user or session
  
  const { rows } = await pool.query(`
    SELECT 
      id,
      business_id,
      meta_title,
      meta_description,
      keywords,
      og_image,
      twitter_image,
      canonical_path,
      robots_directive,
      jsonld_overrides,
      analytics_config,
      created_at,
      updated_at
    FROM website.seo_config 
    WHERE business_id = $1
  `, [tenantId]);
  
  if (rows.length === 0) {
    // Return default config if none exists
    return res.json({
      business_id: tenantId,
      meta_title: '',
      meta_description: '',
      keywords: [],
      og_image: '',
      twitter_image: '',
      canonical_path: '/',
      robots_directive: 'index,follow',
      jsonld_overrides: {},
      analytics_config: {}
    });
  }
  
  res.json(rows[0]);
}));

/**
 * POST /api/seo/config
 * Update SEO configuration for current tenant
 */
seoConfigRoute.post("/config", asyncHandler(async (req, res) => {
  // TODO: Get tenant ID from authentication/session
  const tenantId = 1; // This should come from req.user or session
  
  const {
    meta_title,
    meta_description,
    keywords,
    og_image,
    twitter_image,
    canonical_path,
    robots_directive,
    jsonld_overrides,
    analytics_config
  } = req.body;
  
  const { rows } = await pool.query(`
    INSERT INTO website.seo_config (
      business_id,
      meta_title,
      meta_description,
      keywords,
      og_image,
      twitter_image,
      canonical_path,
      robots_directive,
      jsonld_overrides,
      analytics_config,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    ON CONFLICT (business_id) 
    DO UPDATE SET
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      keywords = EXCLUDED.keywords,
      og_image = EXCLUDED.og_image,
      twitter_image = EXCLUDED.twitter_image,
      canonical_path = EXCLUDED.canonical_path,
      robots_directive = EXCLUDED.robots_directive,
      jsonld_overrides = EXCLUDED.jsonld_overrides,
      analytics_config = EXCLUDED.analytics_config,
      updated_at = NOW()
    RETURNING *
  `, [
    tenantId,
    meta_title,
    meta_description,
    keywords,
    og_image,
    twitter_image,
    canonical_path,
    robots_directive,
    jsonld_overrides,
    analytics_config
  ]);
  
  res.json({
    success: true,
    data: rows[0]
  });
}));
