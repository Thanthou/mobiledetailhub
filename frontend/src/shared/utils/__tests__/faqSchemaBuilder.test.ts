/**
 * Tests for faqSchemaBuilder.ts - FAQ Schema.org generation
 */

import { describe, expect,it } from 'vitest';

import type { LocationPage } from '@shared/types/location';

import {
  buildLocationFAQSchema,
  generateFAQSchemaManifest,
  validateFAQSchemaCompleteness} from '../faqSchemaBuilder';

const mockLocationData: LocationPage = {
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
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our services',
    items: [
      {
        id: '1',
        q: 'What services do you offer in Test City?',
        a: 'We offer comprehensive mobile detailing services including exterior wash, interior cleaning, and paint protection.'
      },
      {
        id: '2',
        q: 'How much does mobile detailing cost?',
        a: 'Pricing varies based on the size of your vehicle and services requested. Contact us for a free quote.'
      }
    ]
  }
};

const mockGeneralFAQs = [
  {
    id: '1',
    q: 'How do I book an appointment?',
    a: 'You can book online through our website or call us directly.'
  },
  {
    id: '2',
    q: 'What areas do you serve?',
    a: 'We serve the greater metropolitan area and surrounding suburbs.'
  }
];

describe('buildLocationFAQSchema', () => {
  it('should generate FAQPage schema from location data', () => {
    const schema = buildLocationFAQSchema(mockLocationData);

    expect(schema).not.toBeNull();
    expect(schema?.['@context']).toBe('https://schema.org');
    expect(schema?.['@type']).toBe('FAQPage');
    expect(schema?.mainEntity).toHaveLength(2);
    
    expect(schema?.mainEntity?.[0]).toEqual({
      '@type': 'Question',
      name: 'What services do you offer in Test City?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer comprehensive mobile detailing services including exterior wash, interior cleaning, and paint protection.'
      }
    });
  });

  it('should return null when no FAQ data is present', () => {
    const locationWithoutFAQ: LocationPage = {
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

    const schema = buildLocationFAQSchema(locationWithoutFAQ);
    expect(schema).toBeNull();
  });

  it('should return null when FAQ items array is empty', () => {
    const locationWithEmptyFAQ: LocationPage = {
      ...mockLocationData,
      faq: {
        title: 'FAQ',
        subtitle: 'Questions',
        items: []
      }
    };

    const schema = buildLocationFAQSchema(locationWithEmptyFAQ);
    expect(schema).toBeNull();
  });
});

describe('validateFAQSchemaCompleteness', () => {
  it('should validate complete FAQ data', () => {
    const result = validateFAQSchemaCompleteness([mockLocationData], mockGeneralFAQs);

    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it('should identify missing FAQ data', () => {
    const locationWithoutFAQ: LocationPage = {
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

    const result = validateFAQSchemaCompleteness([locationWithoutFAQ], mockGeneralFAQs);

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Test City has no FAQ data');
    expect(result.recommendations).toContain('Add FAQ data for Test City');
  });

  it('should identify locations with insufficient FAQ items', () => {
    const locationWithMinimalFAQ: LocationPage = {
      ...mockLocationData,
      faq: {
        title: 'FAQ',
        subtitle: 'Questions',
        items: [
          {
            id: '1',
            q: 'Only one question?',
            a: 'Only one answer.'
          }
        ]
      }
    };

    const result = validateFAQSchemaCompleteness([locationWithMinimalFAQ], mockGeneralFAQs);

    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('Test City has only 1 FAQ items (recommended: 3+)');
    expect(result.recommendations).toContain('Add more FAQ items for Test City');
  });

  it('should handle empty location data array', () => {
    const result = validateFAQSchemaCompleteness([], mockGeneralFAQs);

    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it('should handle empty general FAQs array', () => {
    const result = validateFAQSchemaCompleteness([mockLocationData], []);

    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });
});

describe('generateFAQSchemaManifest', () => {
  it('should generate complete manifest for locations with FAQ data', () => {
    const manifest = generateFAQSchemaManifest([mockLocationData], mockGeneralFAQs);

    expect(manifest.version).toBe('1.0');
    expect(manifest.generatedAt).toBeDefined();
    expect(manifest.mainSite.hasSchema).toBe(true);
    expect(manifest.mainSite.faqCount).toBe(2);
    expect(manifest.locations).toHaveLength(1);
    
    const locationManifest = manifest.locations[0];
    expect(locationManifest.city).toBe('Test City');
    expect(locationManifest.hasSchema).toBe(true);
    expect(locationManifest.faqCount).toBe(2);
  });

  it('should generate manifest for locations without FAQ data', () => {
    const locationWithoutFAQ: LocationPage = {
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

    const manifest = generateFAQSchemaManifest([locationWithoutFAQ], mockGeneralFAQs);

    expect(manifest.mainSite.hasSchema).toBe(true);
    expect(manifest.mainSite.faqCount).toBe(2);
    expect(manifest.locations).toHaveLength(1);
    
    const locationManifest = manifest.locations[0];
    expect(locationManifest.city).toBe('Test City');
    expect(locationManifest.hasSchema).toBe(false);
    expect(locationManifest.faqCount).toBe(0);
  });

  it('should handle mixed locations with and without FAQ data', () => {
    const locationWithoutFAQ: LocationPage = {
      city: 'Another City',
      stateCode: 'AC',
      businessName: 'Another Business',
      seo: {
        title: 'Mobile Detailing in Another City',
        description: 'Professional mobile detailing in Another City',
        canonicalPath: '/another-city-ac'
      },
      header: {
        businessName: 'Another Business'
      }
    };

    const manifest = generateFAQSchemaManifest([mockLocationData, locationWithoutFAQ], mockGeneralFAQs);

    expect(manifest.locations).toHaveLength(2);
    
    const testCityManifest = manifest.locations.find(l => l.city === 'Test City');
    expect(testCityManifest?.hasSchema).toBe(true);
    expect(testCityManifest?.faqCount).toBe(2);
    
    const anotherCityManifest = manifest.locations.find(l => l.city === 'Another City');
    expect(anotherCityManifest?.hasSchema).toBe(false);
    expect(anotherCityManifest?.faqCount).toBe(0);
  });

  it('should handle empty data arrays', () => {
    const manifest = generateFAQSchemaManifest([], []);

    expect(manifest.mainSite.hasSchema).toBe(false);
    expect(manifest.mainSite.faqCount).toBe(0);
    expect(manifest.locations).toHaveLength(0);
  });
});
