/**
 * Tests for schemaUtils.ts - Schema.org structured data generation
 */

import { describe, expect, it } from 'vitest';

import type { LocationPage, MainSiteConfig } from '@/shared/types/location';

import {
  generateAllSchemas,
  generateFAQSchema,
  generateLocationSchema,
  generateOrganizationSchema,
  generateSchemaImages,
  generateWebPageSchema,
  generateWebsiteSchema} from '../schemaUtils';

// Mock window.location for tests
const mockLocation = {
  host: 'example.com',
  protocol: 'https:',
  href: 'https://example.com'
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('generateSchemaImages', () => {
  it('should filter images by role and return URLs', () => {
    const locationData: Partial<LocationPage> = {
      images: [
        { url: '/hero1.jpg', alt: 'Hero 1', role: 'hero' },
        { url: '/hero2.jpg', alt: 'Hero 2', role: 'hero' },
        { url: '/gallery1.jpg', alt: 'Gallery 1', role: 'gallery' },
        { url: '/gallery2.jpg', alt: 'Gallery 2', role: 'gallery' }
      ]
    };

    const heroImages = generateSchemaImages(locationData as LocationPage, ['hero']);
    expect(heroImages).toEqual(['/hero1.jpg', '/hero2.jpg']);

    const galleryImages = generateSchemaImages(locationData as LocationPage, ['gallery']);
    expect(galleryImages).toEqual(['/gallery1.jpg', '/gallery2.jpg']);
  });

  it('should return empty array when no images match role', () => {
    const locationData: Partial<LocationPage> = {
      images: [
        { url: '/hero1.jpg', alt: 'Hero 1', role: 'hero' }
      ]
    };

    const galleryImages = generateSchemaImages(locationData as LocationPage, ['gallery']);
    expect(galleryImages).toEqual([]);
  });

  it('should return empty array when no images provided', () => {
    const locationData: Partial<LocationPage> = {};

    const images = generateSchemaImages(locationData as LocationPage, ['hero']);
    expect(images).toEqual([]);
  });
});

describe('generateLocationSchema', () => {
  const mockSiteConfig: MainSiteConfig = {
    brand: 'Test Brand',
    slug: 'test-brand',
    urlPath: '/',
    logo: { url: '/logo.png', alt: 'Test Brand Logo' },
    seo: {
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      canonicalPath: '/',
      keywords: ['mobile detailing', 'car wash']
    },
    hero: { h1: 'Professional Mobile Detailing' }
  };

  const mockLocationData: LocationPage = {
    city: 'Test City',
    stateCode: 'TC',
    postalCode: '12345',
    businessName: 'Test Business',
    phone: '555-1234',
    email: 'test@example.com',
    address: '123 Test St',
    serviceArea: {
      postalCodes: ['12345', '12346'],
      neighborhoods: ['Downtown', 'Uptown']
    },
    neighborhoods: ['Downtown', 'Uptown'],
    images: [
      { url: '/hero.jpg', alt: 'Hero Image', role: 'hero' }
    ],
    seo: {
      title: 'Mobile Detailing in Test City',
      description: 'Professional mobile detailing in Test City',
      canonicalPath: '/test-city-tc'
    },
    header: {
      businessName: 'Test Business',
      phone: '555-1234'
    }
  };

  it('should generate complete LocalBusiness schema', () => {
    const schema = generateLocationSchema(mockLocationData, mockSiteConfig);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe('Test Business');
    expect(schema.telephone).toBe('555-1234');
    expect(schema.email).toBe('test@example.com');
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '123 Test St',
      addressLocality: 'Test City',
      addressRegion: 'TC',
      postalCode: '12345'
    });
    expect(schema.areaServed).toEqual([
      'Test City',
      '12345',
      '12346',
      'Downtown, TC',
      'Uptown, TC'
    ]);
    expect(schema.image).toEqual(['/hero.jpg']);
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalData: LocationPage = {
      city: 'Test City',
      stateCode: 'TC',
      businessName: 'Test Business',
      seo: { title: 'Test', description: 'Test', canonicalPath: '/' },
      header: { businessName: 'Test Business' }
    };

    const schema = generateLocationSchema(minimalData, mockSiteConfig);

    expect(schema.name).toBe('Test Business');
    expect(schema.telephone).toBeUndefined();
    expect(schema.email).toBeUndefined();
    expect(schema.address).toBeUndefined();
    expect(schema.areaServed).toEqual(['Test City']);
  });
});

describe('generateOrganizationSchema', () => {
  const mockSiteConfig: MainSiteConfig = {
    brand: 'Test Brand',
    slug: 'test-brand',
    urlPath: '/',
    logo: { url: '/logo.png', alt: 'Test Brand Logo' },
    seo: {
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      canonicalPath: '/',
      keywords: ['mobile detailing', 'car wash']
    },
    hero: { h1: 'Professional Mobile Detailing' },
    contact: {
      email: 'contact@testbrand.com',
      phone: '555-1234'
    },
    socials: {
      facebook: 'https://facebook.com/testbrand',
      instagram: 'https://instagram.com/testbrand'
    }
  };

  it('should generate complete Organization schema', () => {
    const schema = generateOrganizationSchema(mockSiteConfig);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Test Brand');
    expect(schema.url).toBe('https://example.com/');
    expect(schema.logo).toBe('https://example.com/logo.png');
    expect(schema.description).toBe('Professional mobile detailing services');
    expect(schema.email).toBe('contact@testbrand.com');
    expect(schema.telephone).toBe('555-1234');
    expect(schema.sameAs).toEqual([
      'https://facebook.com/testbrand',
      'https://instagram.com/testbrand'
    ]);
  });

  it('should handle missing contact and social fields', () => {
    const minimalConfig: MainSiteConfig = {
      brand: 'Test Brand',
      slug: 'test-brand',
      urlPath: '/',
      logo: { url: '/logo.png', alt: 'Test Brand Logo' },
      seo: {
        title: 'Test Brand',
        description: 'Test description',
        canonicalPath: '/'
      },
      hero: { h1: 'Test Brand' }
    };

    const schema = generateOrganizationSchema(minimalConfig);

    expect(schema.name).toBe('Test Brand');
    expect(schema.email).toBeUndefined();
    expect(schema.telephone).toBeUndefined();
    expect(schema.sameAs).toBeUndefined();
  });
});

describe('generateWebsiteSchema', () => {
  const mockSiteConfig: MainSiteConfig = {
    brand: 'Test Brand',
    slug: 'test-brand',
    urlPath: '/',
    logo: { url: '/logo.png', alt: 'Test Brand Logo' },
    seo: {
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      canonicalPath: '/'
    },
    hero: { h1: 'Professional Mobile Detailing' }
  };

  it('should generate Website schema with search action', () => {
    const schema = generateWebsiteSchema(mockSiteConfig);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.url).toBe('https://example.com/');
    expect(schema.name).toBe('Test Brand');
    expect(schema.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: 'https://example.com/search?q={query}',
      'query-input': 'required name=query'
    });
  });
});

describe('generateWebPageSchema', () => {
  const mockSiteConfig: MainSiteConfig = {
    brand: 'Test Brand',
    slug: 'test-brand',
    urlPath: '/',
    logo: { url: '/logo.png', alt: 'Test Brand Logo' },
    seo: {
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      canonicalPath: '/'
    },
    hero: { h1: 'Professional Mobile Detailing' }
  };

  const mockLocationData: LocationPage = {
    city: 'Test City',
    stateCode: 'TC',
    businessName: 'Test Business',
    seo: {
      title: 'Mobile Detailing in Test City',
      description: 'Professional mobile detailing in Test City',
      canonicalPath: '/test-city-tc',
      keywords: ['mobile detailing', 'test city']
    },
    header: {
      businessName: 'Test Business'
    }
  };

  it('should generate WebPage schema for home page', () => {
    const schema = generateWebPageSchema(mockSiteConfig, mockSiteConfig, 'home');

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
    expect(schema.url).toBe('https://example.com/');
    expect(schema.name).toBe('Test Brand - Mobile Detailing');
    expect(schema.description).toBe('Professional mobile detailing services');
    expect(schema.isPartOf).toEqual({
      '@type': 'WebSite',
      name: 'Test Brand',
      url: 'https://example.com'
    });
  });

  it('should generate WebPage schema for location page', () => {
    const schema = generateWebPageSchema(mockLocationData, mockSiteConfig, 'location');

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
    expect(schema.url).toBe('https://example.com/test-city-tc');
    expect(schema.name).toBe('Mobile Detailing in Test City');
    expect(schema.description).toBe('Professional mobile detailing in Test City');
    expect(schema.keywords).toBe('mobile detailing, test city');
    expect(schema.about).toEqual({
      '@type': 'LocalBusiness',
      name: 'Test Business',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Test City',
        addressRegion: 'TC',
        postalCode: undefined
      }
    });
  });
});

describe('generateFAQSchema', () => {
  it('should generate FAQPage schema from FAQ items', () => {
    const faqs = [
      { id: '1', q: 'What services do you offer?', a: 'We offer mobile detailing services.' },
      { id: '2', q: 'How much does it cost?', a: 'Pricing varies by service type.' }
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'What services do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer mobile detailing services.'
      }
    });
  });

  it('should handle empty FAQ array', () => {
    const schema = generateFAQSchema([]);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toEqual([]);
  });
});

describe('generateAllSchemas', () => {
  const mockSiteConfig: MainSiteConfig = {
    brand: 'Test Brand',
    slug: 'test-brand',
    urlPath: '/',
    logo: { url: '/logo.png', alt: 'Test Brand Logo' },
    seo: {
      title: 'Test Brand - Mobile Detailing',
      description: 'Professional mobile detailing services',
      canonicalPath: '/'
    },
    hero: { h1: 'Professional Mobile Detailing' }
  };

  it('should generate all schemas for home page', () => {
    const schemas = generateAllSchemas(mockSiteConfig, mockSiteConfig, 'home');

    expect(schemas).toHaveLength(3);
    expect(schemas[0]['@type']).toBe('Organization');
    expect(schemas[1]['@type']).toBe('WebSite');
    expect(schemas[2]['@type']).toBe('WebPage');
  });

  it('should include FAQ schema when provided', () => {
    const faqs = [
      { id: '1', q: 'Test question?', a: 'Test answer.' }
    ];

    const schemas = generateAllSchemas(mockSiteConfig, mockSiteConfig, 'home', faqs);

    expect(schemas).toHaveLength(4);
    expect(schemas[3]['@type']).toBe('FAQPage');
  });

  it('should generate schemas for location page', () => {
    const locationData: LocationPage = {
      city: 'Test City',
      stateCode: 'TC',
      businessName: 'Test Business',
      seo: {
        title: 'Mobile Detailing in Test City',
        description: 'Professional mobile detailing in Test City',
        canonicalPath: '/test-city-tc'
      },
      header: {
        businessName: 'Test Business'
      }
    };

    const schemas = generateAllSchemas(locationData, mockSiteConfig, 'location');

    expect(schemas).toHaveLength(1);
    expect(schemas[0]['@type']).toBe('WebPage');
  });
});
