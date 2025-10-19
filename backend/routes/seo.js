import express from 'express';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { getPool } from '../database/pool.js';
import { robotsRoute, sitemapRoute, seoConfigRoute, previewRoute } from './seo';

/**
 * SEO Routes - Centralized SEO endpoint management
 * 
 * This module anchors Cursor's understanding of SEO backend functionality.
 * All SEO-related API endpoints should be defined here.
 */
const router = express.Router();

// Simple in-memory cache for sitemap responses
// Keyed by host; stores { xml: string, expiresAt: number }
const sitemapCache = new Map();
const ONE_HOUR_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS;

// Import the modular SEO routes
// TODO: Fix TypeScript
imports - these are .ts files in ./seo/ directory
//

// Use the modular routes
// router.use('/', robotsRoute);
// router.use('/', sitemapRoute);
// router.use('/api/seo', seoConfigRoute);
// router.use('/', previewRoute);

/**
 * GET /robots.txt
 * Generate tenant-specific robots.txt
 */
router.get('/robots.txt', asyncHandler((req, res) => {
  try {
    // Get tenant domain from request
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const domain = `${protocol}://${host}`;
    
    // Check if this is a preview domain
    const isPreview = host.includes('preview') || host.includes('localhost');
    
    // Generate robots.txt content
    let robotsContent;
    
    if (isPreview) {
      // Block all crawlers for preview domains
      robotsContent = `User-agent: *
Disallow: /
`;
    } else {
      // Allow indexing for live tenants, block preview routes
      robotsContent = `User-agent: *
Disallow: /preview
Disallow: /admin
Disallow: /api
Sitemap: ${domain}/sitemap.xml
`;
    }
    
    // Set appropriate headers
    res.set({
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    });
    
    res.send(robotsContent);
    
    logger.info(`Robots.txt served for ${host}`, {
      isPreview,
      domain
    });
    
  } catch (error) {
    logger.error('Error generating robots.txt:', error);
    
    // Fallback robots.txt (block everything)
    res.set('Content-Type', 'text/plain');
    res.send(`User-agent: *
Disallow: /
`);
  }
}));

/**
 * GET /sitemap.xml
 * Generate tenant-specific sitemap
 */
router.get('/sitemap.xml', asyncHandler(async (req, res) => {
  try {
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const domain = `${protocol}://${host}`;
    
    // Check if this is a preview domain
    const isPreview = host.includes('preview') || host.includes('localhost');

    // Check cache first (separate TTLs for preview vs live)
    const cacheEntry = sitemapCache.get(host);
    const now = Date.now();
    if (cacheEntry && cacheEntry.expiresAt > now) {
      res.set({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Client cache 1 hour
        'X-Sitemap-Cache': 'HIT'
      });
      return res.send(cacheEntry.xml);
    }
    
    if (isPreview) {
      // Return empty sitemap for preview domains
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      
      // Populate cache for preview domains with shorter TTL
      sitemapCache.set(host, {
        xml: emptySitemap,
        expiresAt: now + ONE_HOUR_MS
      });
      res.set({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Sitemap-Cache': 'MISS'
      });
      return res.send(emptySitemap);
    }
    
    // Get tenant information from database
    let tenantData = null;
    if (pool) {
      try {
        // Try to find tenant by domain or slug
        const result = await pool.query(`
          SELECT 
            b.id,
            b.slug,
            b.business_name,
            b.industry,
            b.service_areas,
            b.website_domain,
            b.approved_date,
            wc.services,
            wc.faqs
          FROM tenants.business b
          LEFT JOIN website.content wc ON b.id = wc.business_id
          WHERE b.website_domain = $1 
             OR $1 LIKE '%' || b.slug || '%'
             OR b.slug = $2
          ORDER BY b.approved_date DESC
          LIMIT 1
        `, [host, host.split('.')[0]]);
        
        if (result.rows.length > 0) {
          tenantData = result.rows[0];
        }
      } catch (dbError) {
        logger.warn('Database error while generating sitemap:', dbError.message);
      }
    }
    
    // Generate sitemap XML
    const urls = [];
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Add homepage
    urls.push({
      loc: domain,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    });
    
    // Add services page
    urls.push({
      loc: `${domain}/services`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    });
    
    // Add reviews page
    urls.push({
      loc: `${domain}/reviews`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    });
    
    // Add FAQ page
    urls.push({
      loc: `${domain}/faq`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    });
    
    // Add contact page
    urls.push({
      loc: `${domain}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    });
    
    // Add location pages if tenant has service areas
    if (tenantData && tenantData.service_areas) {
      try {
        const serviceAreas = typeof tenantData.service_areas === 'string' 
          ? JSON.parse(tenantData.service_areas) 
          : tenantData.service_areas;
        
        if (Array.isArray(serviceAreas)) {
          serviceAreas.forEach(area => {
            if (area.city && area.state) {
              const citySlug = area.city.toLowerCase().replace(/\s+/g, '-');
              const stateSlug = area.state.toLowerCase().replace(/\s+/g, '-');
              urls.push({
                loc: `${domain}/${citySlug}-${stateSlug}`,
                lastmod: currentDate,
                changefreq: 'monthly',
                priority: '0.7'
              });
            }
          });
        }
      } catch (parseError) {
        logger.warn('Error parsing service areas for sitemap:', parseError.message);
      }
    }
    
    // Generate XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Cache live sitemaps for 24 hours by host
    sitemapCache.set(host, {
      xml: sitemapXml,
      expiresAt: now + TWENTY_FOUR_HOURS_MS
    });
    res.set({
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Client cache 1 hour
      'X-Sitemap-Cache': 'MISS'
    });
    res.send(sitemapXml);
    
    logger.info(`Sitemap served for ${host}`, {
      urlCount: urls.length,
      hasTenantData: !!tenantData
    });
    
  } catch (error) {
    logger.error('Error generating sitemap:', error);
    
    // Fallback empty sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    
    res.set('Content-Type', 'application/xml');
    res.send(fallbackSitemap);
  }
}));

export default router;
