/**
 * @fileoverview API routes for websiteContent
 * @version 1.0.0
 * @author That Smart Site
 */

import express from 'express';
import { getPool } from '../database/pool.js';
import { withTenantBySlug, getTenantBySlug } from '../middleware/withTenant.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createModuleLogger } from '../config/logger.js';
import { validateBody } from '../middleware/zodValidation.js';
import { websiteContentSchemas } from '../schemas/apiSchemas.js';
const router = express.Router();
const logger = createModuleLogger('routeName');


// Save website content for a tenant
router.put('/:slug', withTenantBySlug, validateBody(websiteContentSchemas.update), asyncHandler(async (req, res) => {
  const contentData = req.body;

  logger.info('💾 Saving website content for tenant:', req.tenant.slug);

  // Update or insert website content using the correct table: website.content
  const upsertQuery = `
    INSERT INTO website.content (
      business_id,
      hero_title, 
      hero_subtitle,
      services_title,
      services_subtitle,
      services_auto_description,
      services_marine_description,
      services_rv_description,
      services_ceramic_description,
      services_correction_description,
      services_ppf_description,
      reviews_title,
      reviews_subtitle,
      reviews_avg_rating,
      reviews_total_count,
      faq_title,
      faq_subtitle,
      faq_items,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW()
    )
    ON CONFLICT (business_id) 
    DO UPDATE SET
      hero_title = EXCLUDED.hero_title,
      hero_subtitle = EXCLUDED.hero_subtitle,
      services_title = EXCLUDED.services_title,
      services_subtitle = EXCLUDED.services_subtitle,
      services_auto_description = EXCLUDED.services_auto_description,
      services_marine_description = EXCLUDED.services_marine_description,
      services_rv_description = EXCLUDED.services_rv_description,
      services_ceramic_description = EXCLUDED.services_ceramic_description,
      services_correction_description = EXCLUDED.services_correction_description,
      services_ppf_description = EXCLUDED.services_ppf_description,
      reviews_title = EXCLUDED.reviews_title,
      reviews_subtitle = EXCLUDED.reviews_subtitle,
      reviews_avg_rating = EXCLUDED.reviews_avg_rating,
      reviews_total_count = EXCLUDED.reviews_total_count,
      faq_title = EXCLUDED.faq_title,
      faq_subtitle = EXCLUDED.faq_subtitle,
      faq_items = EXCLUDED.faq_items,
      updated_at = NOW()
    RETURNING *
  `;

  const values = [
    req.tenant.id,
    contentData.hero_title || '',
    contentData.hero_subtitle || '',
    contentData.services_title || '',
    contentData.services_subtitle || '',
    contentData.services_auto_description || '',
    contentData.services_marine_description || '',
    contentData.services_rv_description || '',
    contentData.services_ceramic_description || '',
    contentData.services_correction_description || '',
    contentData.services_ppf_description || '',
    contentData.reviews_title || '',
    contentData.reviews_subtitle || '',
    contentData.reviews_avg_rating || 0,
    contentData.reviews_total_count || 0,
    contentData.faq_title || '',
    contentData.faq_subtitle || '',
    JSON.stringify(contentData.faq_items || [])
  ];

  const result = await pool.query(upsertQuery, values);
  
  logger.info('✅ Website content saved successfully');

  res.json({ 
    success: true, 
    message: 'Website content saved successfully',
    content: result.rows[0]
  });
}));

// Get website content for a tenant
router.get('/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  let tenant;
  try {
    tenant = await getTenantBySlug(slug);
  } catch (e) {
    // In development, gracefully return default content if tenant missing
    if (env.NODE_ENV !== 'production') {
      return res.json({
        success: true,
        content: {
          hero_title: '',
          hero_subtitle: '',
          services_title: '',
          services_subtitle: '',
          services_auto_description: '',
          services_marine_description: '',
          services_rv_description: '',
          services_ceramic_description: '',
          services_correction_description: '',
          services_ppf_description: '',
          reviews_title: '',
          reviews_subtitle: '',
          reviews_avg_rating: 0,
          reviews_total_count: 0,
          faq_title: '',
          faq_subtitle: '',
          faq_items: []
        }
      });
    }
    throw e;
  }

  req.tenant = tenant;
  logger.info('🔍 Fetching website content for tenant:', req.tenant.slug);

  // Query from the correct table: website.content
  const contentResult = await pool.query(
    `SELECT * FROM website.content WHERE business_id = $1`, 
    [req.tenant.id]
  );
  
  logger.info('🔍 Query result:', {
    rowCount: contentResult.rows.length,
    tenant: req.tenant.slug
  });

  if (contentResult.rows.length === 0) {
    logger.info('🔍 No data found for tenant, returning defaults');
    // Return default content structure
    return res.json({
      success: true,
      content: {
        hero_title: '',
        hero_subtitle: '',
        services_title: '',
        services_subtitle: '',
        services_auto_description: '',
        services_marine_description: '',
        services_rv_description: '',
        services_ceramic_description: '',
        services_correction_description: '',
        services_ppf_description: '',
        reviews_title: '',
        reviews_subtitle: '',
        reviews_avg_rating: 0,
        reviews_total_count: 0,
        faq_title: '',
        faq_subtitle: '',
        faq_items: []
      }
    });
  }

  const content = contentResult.rows[0];

  const result = {
    success: true,
    content: {
      hero_title: content.hero_title || '',
      hero_subtitle: content.hero_subtitle || '',
      services_title: content.services_title || '',
      services_subtitle: content.services_subtitle || '',
      services_auto_description: content.services_auto_description || '',
      services_marine_description: content.services_marine_description || '',
      services_rv_description: content.services_rv_description || '',
      services_ceramic_description: content.services_ceramic_description || '',
      services_correction_description: content.services_correction_description || '',
      services_ppf_description: content.services_ppf_description || '',
      reviews_title: content.reviews_title || '',
      reviews_subtitle: content.reviews_subtitle || '',
      reviews_avg_rating: content.reviews_avg_rating || 0,
      reviews_total_count: content.reviews_total_count || 0,
      faq_title: content.faq_title || '',
      faq_subtitle: content.faq_subtitle || '',
      faq_items: content.faq_items || []
    }
  };

  res.json(result);
}));

// Get website content for main site (no tenant)
router.get('/main', (req, res) => {
  try {
    // For main site, we could use a special tenant ID or return default content
    // For now, let's return default content
    const result = {
      success: true,
      content: {
        hero_title: 'Professional Mobile Detailing Services',
        hero_subtitle: 'Bringing the shine to your doorstep',
        reviews_title: 'Customer Reviews',
        reviews_description: 'What our customers say about our services',
        reviews_avg_rating: 0,
        reviews_total_ratings: 0,
        faq_title: 'Frequently Asked Questions',
        faq_description: 'Common questions about our services',
        gallery_title: 'Our Gallery',
        gallery_description: 'See our work in action'
      }
    };

    res.json(result);
  } catch (error) {
    logger.error('Error fetching main site content:', error);
    res.status(500).json({ error: 'Failed to fetch main site content' });
  }
});

export default router;
