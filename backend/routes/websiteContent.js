const express = require('express');
const { pool } = require('../database/pool');
const router = express.Router();

// Save website content for a tenant
router.put('/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    const contentData = req.body;

    console.log('💾 Saving website content for tenant:', tenantSlug);

    // Update or insert website content using the correct table: website.content
    const upsertQuery = `
      INSERT INTO website.content (
        tenant_slug,
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
        faq_content,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW()
      )
      ON CONFLICT (tenant_slug) 
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
        faq_content = EXCLUDED.faq_content,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      tenantSlug,
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
      JSON.stringify(contentData.faq_content || [])
    ];

    const result = await pool.query(upsertQuery, values);
    
    console.log('✅ Website content saved successfully');

    res.json({ 
      success: true, 
      message: 'Website content saved successfully',
      content: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving website content:', error);
    res.status(500).json({ error: 'Failed to save website content' });
  }
});

// Get website content for a tenant
router.get('/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    
    console.log('🔍 Fetching website content for tenant:', tenantSlug);

    // Query from the correct table: website.content joined with tenants.business
    const contentResult = await pool.query(
      `SELECT wc.* FROM website.content wc
       JOIN tenants.business tb ON wc.business_id = tb.id
       WHERE tb.slug = $1`, 
      [tenantSlug]
    );
    
    console.log('🔍 Query result:', {
      rowCount: contentResult.rows.length,
      tenant: tenantSlug
    });

    if (contentResult.rows.length === 0) {
      console.log('🔍 No data found for tenant, returning defaults');
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
          faq_content: []
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
        faq_content: content.faq_content || []
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching website content:', error);
    res.status(500).json({ error: 'Failed to fetch website content' });
  }
});

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
    console.error('Error fetching main site content:', error);
    res.status(500).json({ error: 'Failed to fetch main site content' });
  }
});

module.exports = router;
