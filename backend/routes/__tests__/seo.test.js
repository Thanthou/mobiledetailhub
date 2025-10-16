/**
 * Tests for SEO routes - robots.txt and sitemap.xml generation
 */

/* eslint-env jest */
/* global jest, describe, it, expect, beforeEach */

const request = require('supertest');
const express = require('express');

// Mock the database pool
const mockPool = {
  query: jest.fn()
};

// Mock the logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock the database pool module
jest.mock('../../database/pool', () => ({
  pool: mockPool
}));

// Mock the logger module
jest.mock('../../utils/logger', () => mockLogger);

// Mock the error handler
jest.mock('../../middleware/errorHandler', () => ({
  asyncHandler: (fn) => (req, res, next) => {
    try {
      return fn(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}));

// Import the SEO routes after mocking
const seoRoutes = require('../seo');

describe('SEO Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/', seoRoutes);
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset mock implementations
    mockPool.query.mockResolvedValue({ rows: [] });
  });

  describe('GET /robots.txt', () => {
    it('should return robots.txt for preview domains', async () => {
      const response = await request(app)
        .get('/robots.txt')
        .set('host', 'preview.example.com')
        .expect(200);

      expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
      expect(response.headers['cache-control']).toBe('public, max-age=86400');
      expect(response.text).toContain('User-agent: *');
      expect(response.text).toContain('Disallow: /');
      expect(response.text).not.toContain('Sitemap:');
    });

    it('should return robots.txt for localhost', async () => {
      const response = await request(app)
        .get('/robots.txt')
        .set('host', 'localhost:3000')
        .expect(200);

      expect(response.text).toContain('User-agent: *');
      expect(response.text).toContain('Disallow: /');
    });

    it('should return robots.txt for live domains', async () => {
      const response = await request(app)
        .get('/robots.txt')
        .set('host', 'example.com')
        .expect(200);

      expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
      expect(response.headers['cache-control']).toBe('public, max-age=86400');
      expect(response.text).toContain('User-agent: *');
      expect(response.text).toContain('Disallow: /preview');
      expect(response.text).toContain('Disallow: /admin');
      expect(response.text).toContain('Disallow: /api');
      expect(response.text).toContain('Sitemap: http://example.com/sitemap.xml');
    });

    it('should handle HTTPS protocol', async () => {
      const response = await request(app)
        .get('/robots.txt')
        .set('host', 'example.com')
        .set('x-forwarded-proto', 'https')
        .expect(200);

      expect(response.text).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('should handle errors gracefully', async () => {
      // Mock an error in the route handler
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Force an error by making the route throw
      const errorApp = express();
      errorApp.get('/robots.txt', (_req, _res) => {
        throw new Error('Test error');
      });

      const response = await request(errorApp)
        .get('/robots.txt')
        .set('host', 'example.com')
        .expect(200);

      expect(response.text).toContain('User-agent: *');
      expect(response.text).toContain('Disallow: /');

      console.error = originalConsoleError;
    });
  });

  describe('GET /sitemap.xml', () => {
    it('should return empty sitemap for preview domains', async () => {
      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'preview.example.com')
        .expect(200);

      expect(response.headers['content-type']).toBe('application/xml; charset=utf-8');
      expect(response.headers['cache-control']).toBe('public, max-age=3600');
      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(response.text).toContain('</urlset>');
      expect(response.text).not.toContain('<url>');
    });

    it('should return empty sitemap for localhost', async () => {
      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'localhost:3000')
        .expect(200);

      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('<urlset');
      expect(response.text).not.toContain('<url>');
    });

    it('should generate sitemap for live domains without tenant data', async () => {
      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .expect(200);

      expect(response.headers['content-type']).toBe('application/xml; charset=utf-8');
      expect(response.headers['cache-control']).toBe('public, max-age=3600');
      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      
      // Should contain basic pages
      expect(response.text).toContain('<loc>http://example.com</loc>');
      expect(response.text).toContain('<loc>http://example.com/services</loc>');
      expect(response.text).toContain('<loc>http://example.com/reviews</loc>');
      expect(response.text).toContain('<loc>http://example.com/faq</loc>');
      expect(response.text).toContain('<loc>http://example.com/contact</loc>');
    });

    it('should generate sitemap with location pages for tenant with service areas', async () => {
      const mockTenantData = {
        id: 1,
        slug: 'test-business',
        business_name: 'Test Business',
        industry: 'mobile-detailing',
        service_areas: JSON.stringify([
          { city: 'Test City', state: 'TC' },
          { city: 'Another City', state: 'AC' }
        ]),
        website_domain: 'example.com',
        approved_date: new Date().toISOString()
      };

      mockPool.query.mockResolvedValue({ rows: [mockTenantData] });

      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .expect(200);

      expect(response.text).toContain('<loc>http://example.com/test-city-tc</loc>');
      expect(response.text).toContain('<loc>http://example.com/another-city-ac</loc>');
    });

    it('should handle database errors gracefully', async () => {
      mockPool.query.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .expect(200);

      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(response.text).toContain('</urlset>');
      expect(response.text).not.toContain('<url>');
    });

    it('should handle malformed service areas data', async () => {
      const mockTenantData = {
        id: 1,
        slug: 'test-business',
        business_name: 'Test Business',
        industry: 'mobile-detailing',
        service_areas: 'invalid-json',
        website_domain: 'example.com',
        approved_date: new Date().toISOString()
      };

      mockPool.query.mockResolvedValue({ rows: [mockTenantData] });

      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .expect(200);

      // Should still generate basic pages without location pages
      expect(response.text).toContain('<loc>http://example.com</loc>');
      expect(response.text).toContain('<loc>http://example.com/services</loc>');
      expect(response.text).not.toContain('test-city-tc');
    });

    it('should handle HTTPS protocol', async () => {
      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .set('x-forwarded-proto', 'https')
        .expect(200);

      expect(response.text).toContain('<loc>https://example.com</loc>');
    });

    it('should include proper XML structure and attributes', async () => {
      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .expect(200);

      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      
      // Check for proper URL structure
      expect(response.text).toContain('<url>');
      expect(response.text).toContain('<loc>');
      expect(response.text).toContain('<lastmod>');
      expect(response.text).toContain('<changefreq>');
      expect(response.text).toContain('<priority>');
      expect(response.text).toContain('</url>');
      expect(response.text).toContain('</urlset>');
    });

    it('should set proper cache headers', async () => {
      const response = await request(app)
        .get('/sitemap.xml')
        .set('host', 'example.com')
        .expect(200);

      expect(response.headers['cache-control']).toBe('public, max-age=3600');
    });
  });
});
