/**
 * Tests for siteUtils.ts - Site utility functions
 */

import { describe, expect, it } from 'vitest';

import type { MainSiteConfig } from '@/shared/types/location';

import { formatSEO,getAbsoluteUrl } from '../siteUtils';

// Mock window.location for tests
const mockLocation = {
  host: 'example.com',
  protocol: 'https:',
  href: 'https://example.com'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('getAbsoluteUrl', () => {
  beforeEach(() => {
    // Reset window.location mock
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });
  });

  it('should convert relative URL to absolute URL', () => {
    const result = getAbsoluteUrl('/services');
    expect(result).toBe('https://example.com/services');
  });

  it('should handle root path', () => {
    const result = getAbsoluteUrl('/');
    expect(result).toBe('https://example.com/');
  });

  it('should handle paths without leading slash', () => {
    const result = getAbsoluteUrl('services');
    expect(result).toBe('https://example.com/services');
  });

  it('should handle empty string', () => {
    const result = getAbsoluteUrl('');
    expect(result).toBe('https://example.com/');
  });

  it('should handle different protocols', () => {
    Object.defineProperty(window, 'location', {
      value: { ...mockLocation, protocol: 'http:' },
      writable: true
    });

    const result = getAbsoluteUrl('/test');
    expect(result).toBe('http://example.com/test');
  });

  it('should handle different hosts', () => {
    Object.defineProperty(window, 'location', {
      value: { ...mockLocation, host: 'subdomain.example.com' },
      writable: true
    });

    const result = getAbsoluteUrl('/test');
    expect(result).toBe('https://subdomain.example.com/test');
  });

  it('should handle complex paths', () => {
    const result = getAbsoluteUrl('/api/v1/data?param=value');
    expect(result).toBe('https://example.com/api/v1/data?param=value');
  });
});

describe('formatSEO', () => {
  const mockSiteConfig: MainSiteConfig = {
    brand: 'Test Brand',
    slug: 'test-brand',
    urlPath: '/',
    logo: { url: '/logo.png', alt: 'Test Brand Logo' },
    seo: {
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      canonicalPath: '/',
      keywords: ['mobile detailing', 'car wash', 'auto detailing']
    },
    hero: { h1: 'Professional Mobile Detailing' }
  };

  it('should format SEO data correctly', () => {
    const result = formatSEO(mockSiteConfig);

    expect(result).toEqual({
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      keywords: 'mobile detailing, car wash, auto detailing',
      canonicalUrl: 'https://example.com/',
      ogTitle: 'Test Brand - Mobile Detailing',
      ogDescription: 'Professional mobile detailing services',
      ogUrl: 'https://example.com/',
      ogImage: undefined,
      twitterTitle: 'Test Brand - Mobile Detailing',
      twitterDescription: 'Professional mobile detailing services',
      twitterImage: undefined
    });
  });

  it('should handle missing keywords', () => {
    const configWithoutKeywords: MainSiteConfig = {
      ...mockSiteConfig,
      seo: {
        ...mockSiteConfig.seo,
        keywords: undefined
      }
    };

    const result = formatSEO(configWithoutKeywords);

    expect(result.keywords).toBeUndefined();
  });

  it('should handle empty keywords array', () => {
    const configWithEmptyKeywords: MainSiteConfig = {
      ...mockSiteConfig,
      seo: {
        ...mockSiteConfig.seo,
        keywords: []
      }
    };

    const result = formatSEO(configWithEmptyKeywords);

    expect(result.keywords).toBeUndefined();
  });

  it('should handle single keyword', () => {
    const configWithSingleKeyword: MainSiteConfig = {
      ...mockSiteConfig,
      seo: {
        ...mockSiteConfig.seo,
        keywords: ['mobile detailing']
      }
    };

    const result = formatSEO(configWithSingleKeyword);

    expect(result.keywords).toBe('mobile detailing');
  });

  it('should handle ogImage and twitterImage', () => {
    const configWithImages: MainSiteConfig = {
      ...mockSiteConfig,
      seo: {
        ...mockSiteConfig.seo,
        ogImage: '/og-image.jpg',
        twitterImage: '/twitter-image.jpg'
      }
    };

    const result = formatSEO(configWithImages);

    expect(result.ogImage).toBe('https://example.com/og-image.jpg');
    expect(result.twitterImage).toBe('https://example.com/twitter-image.jpg');
  });

  it('should handle different canonical paths', () => {
    const configWithPath: MainSiteConfig = {
      ...mockSiteConfig,
      seo: {
        ...mockSiteConfig.seo,
        canonicalPath: '/services'
      }
    };

    const result = formatSEO(configWithPath);

    expect(result.canonicalUrl).toBe('https://example.com/services');
    expect(result.ogUrl).toBe('https://example.com/services');
  });

  it('should handle complex canonical paths', () => {
    const configWithComplexPath: MainSiteConfig = {
      ...mockSiteConfig,
      seo: {
        ...mockSiteConfig.seo,
        canonicalPath: '/api/v1/data?param=value'
      }
    };

    const result = formatSEO(configWithComplexPath);

    expect(result.canonicalUrl).toBe('https://example.com/api/v1/data?param=value');
    expect(result.ogUrl).toBe('https://example.com/api/v1/data?param=value');
  });

  it('should handle missing seo object', () => {
    const configWithoutSEO: MainSiteConfig = {
      ...mockSiteConfig,
      seo: undefined as any
    };

    const result = formatSEO(configWithoutSEO);

    expect(result.title).toBeUndefined();
    expect(result.description).toBeUndefined();
    expect(result.keywords).toBeUndefined();
    expect(result.canonicalUrl).toBe('https://example.com/');
    expect(result.ogTitle).toBeUndefined();
    expect(result.ogDescription).toBeUndefined();
    expect(result.ogUrl).toBe('https://example.com/');
    expect(result.ogImage).toBeUndefined();
    expect(result.twitterTitle).toBeUndefined();
    expect(result.twitterDescription).toBeUndefined();
    expect(result.twitterImage).toBeUndefined();
  });
});
