/**
 * Website Content Validation Schemas
 * 
 * Validation rules for website content management:
 * - Hero sections
 * - Service descriptions
 * - FAQ items
 * - Page content
 */

import { z } from 'zod';

/**
 * Website Content API Schemas
 */
export const websiteContentSchemas = {
  // PUT /api/website-content/:slug
  update: z.object({
    hero_title: z.string().max(255).optional(),
    hero_subtitle: z.string().max(500).optional(),
    services_title: z.string().max(255).optional(),
    services_subtitle: z.string().max(500).optional(),
    services_auto_description: z.string().max(2000).optional(),
    services_marine_description: z.string().max(2000).optional(),
    services_rv_description: z.string().max(2000).optional(),
    services_ceramic_description: z.string().max(2000).optional(),
    services_correction_description: z.string().max(2000).optional(),
    services_ppf_description: z.string().max(2000).optional(),
    reviews_title: z.string().max(255).optional(),
    reviews_subtitle: z.string().max(500).optional(),
    reviews_avg_rating: z.number().min(0).max(5).optional(),
    reviews_total_count: z.number().int().min(0).optional(),
    faq_title: z.string().max(255).optional(),
    faq_subtitle: z.string().max(500).optional(),
    faq_items: z.array(z.object({
      question: z.string().max(500),
      answer: z.string().max(2000)
    })).optional()
  })
};

