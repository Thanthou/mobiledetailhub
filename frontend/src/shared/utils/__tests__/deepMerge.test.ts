/**
 * Tests for deep merge functionality
 */

import type { LocationPage, MainSiteConfig } from '@/shared/types/location';

import { 
  createMergedLocationData,
  DEFAULT_MERGE_OPTIONS as _DEFAULT_MERGE_OPTIONS, 
  validateMergedData} from '../deepMerge';

// Mock data for testing
const mockMainConfig: MainSiteConfig = {
  brand: 'Mobile Detail Hub',
  slug: 'site',
  urlPath: '/',
  logo: {
    url: '/icons/logo.webp',
    alt: 'Mobile Detail Hub Logo',
    darkUrl: '/icons/logo-dark.webp',
    lightUrl: '/icons/logo.webp'
  },
  seo: {
    title: 'Premium Mobile Detailing — Cars, Boats, RVs, & Aircraft',
    description: 'Company-operated mobile detailing. Paint correction, ceramic coating, PPF, and deep interior cleaning for cars, boats, and RVs.',
    keywords: ['mobile detailing', 'car detailing', 'boat detailing', 'RV detailing'],
    canonicalPath: '/',
    ogImage: '/images/hero/hero1.png',
    twitterImage: '/images/hero/hero1.png',
    robots: 'index,follow'
  },
  hero: {
    h1: 'Professional Mobile Detailing',
    sub: 'Mobile detailing for cars, boats, RVs, & aircraft.',
    images: [
      { 
        url: '/images/hero/hero1.png', 
        alt: 'Professional mobile detailing service in action',
        role: 'hero',
        width: 1920,
        height: 1080,
        priority: true
      }
    ]
  },
  reviews: {
    title: 'What Our Customers Say',
    subtitle: 'Don\'t just take our word for it. See what our satisfied customers have to say about our premium mobile detailing services.',
    ratingValue: '4.9',
    reviewCount: 112,
    source: 'Google'
  }
};

const mockLocationData: LocationPage = {
  slug: 'az-bullhead-city',
  city: 'Bullhead City',
  stateCode: 'AZ',
  state: 'Arizona',
  postalCode: '86442',
  latitude: 35.1359,
  longitude: -114.5286,
  urlPath: '/az/bullhead-city/',
  seo: {
    title: 'Mobile Detailing Bullhead City, AZ — Pro Car, Boat & RV Detailing',
    description: 'On-site car, boat, and RV detailing in Bullhead City, AZ. Paint correction, ceramic coating, interior deep cleans.',
    keywords: ['Bullhead City AZ', 'Colorado River'],
    canonicalPath: '/az/bullhead-city/',
    ogImage: '/images/locations/bullhead-city/hero1.png',
    twitterImage: '/images/locations/bullhead-city/hero1.png',
    robots: 'index,follow'
  },
  hero: {
    h1: 'Mobile Detailing in Bullhead City, AZ',
    sub: 'We come to you — desert-tested shine for cars, boats, RVs, & aircraft'
  },
  images: [
    {
      url: '/images/locations/bullhead-city/hero1.png',
      alt: 'Mobile car detailing in Bullhead City desert scene',
      caption: 'Desert-tested wash & protection in Bullhead City',
      role: 'hero',
      width: 1536,
      height: 1024,
      priority: true
    },
    {
      url: '/images/locations/bullhead-city/auto.png',
      alt: 'Detailing car in front of a mission style home in Bullhead City',
      caption: 'We come to your home — driveways & shade setups welcome',
      role: 'auto',
      width: 1024,
      height: 768,
      priority: false
    }
  ],
  faqs: [
    {
      id: 'hard-water-spots',
      q: 'Do you handle hard-water spots common in Bullhead City?',
      a: 'Yes. We pre-treat mineral deposits, measure paint safely, and finish with protection to reduce future spotting from sprinklers and river use.'
    }
  ],
  neighborhoods: ['Desert Foothills', 'Sunridge Estates'],
  landmarks: ['Colorado River', 'Laughlin Bridge'],
  localConditions: ['Desert dust & windblown sand', 'Intense UV/sun exposure']
};

describe('Deep Merge Functionality', () => {
  describe('createMergedLocationData', () => {
    it('should merge main config with location data', () => {
      const merged = createMergedLocationData(mockMainConfig, mockLocationData);
      
      // Location-specific fields should be preserved
      expect(merged.slug).toBe('az-bullhead-city');
      expect(merged.city).toBe('Bullhead City');
      expect(merged.stateCode).toBe('AZ');
      
      // SEO should be merged (location overrides main)
      expect(merged.seo.title).toBe('Mobile Detailing Bullhead City, AZ — Pro Car, Boat & RV Detailing');
      expect(merged.seo.description).toBe('On-site car, boat, and RV detailing in Bullhead City, AZ. Paint correction, ceramic coating, interior deep cleans.');
      
      // Keywords should be concatenated
      expect(merged.seo.keywords).toEqual([
        'mobile detailing', 'car detailing', 'boat detailing', 'RV detailing',
        'Bullhead City AZ', 'Colorado River'
      ]);
      
      // Hero should be merged
      expect(merged.hero.h1).toBe('Mobile Detailing in Bullhead City, AZ');
      expect(merged.hero.sub).toBe('We come to you — desert-tested shine for cars, boats, RVs, & aircraft');
      
      // Images should be deduplicated (location images + main images)
      expect(merged.images).toHaveLength(2);
      expect(merged.images[0].role).toBe('hero');
      expect(merged.images[1].role).toBe('auto');
    });

    it('should handle array deduplication correctly', () => {
      const locationWithDuplicateImages: LocationPage = {
        ...mockLocationData,
        images: [
          {
            url: '/images/locations/bullhead-city/hero1.png',
            alt: 'Duplicate hero image',
            role: 'hero',
            width: 1536,
            height: 1024,
            priority: true
          },
          {
            url: '/images/locations/bullhead-city/hero1.png',
            alt: 'Same image again',
            role: 'hero',
            width: 1536,
            height: 1024,
            priority: true
          }
        ]
      };

      const merged = createMergedLocationData(mockMainConfig, locationWithDuplicateImages);
      
      // Should deduplicate based on role + url
      const heroImages = merged.images?.filter(img => img.role === 'hero') || [];
      expect(heroImages).toHaveLength(1);
      expect(heroImages[0].alt).toBe('Duplicate hero image');
    });

    it('should handle FAQ deduplication', () => {
      const locationWithDuplicateFAQs: LocationPage = {
        ...mockLocationData,
        faqs: [
          {
            id: 'hard-water-spots',
            q: 'Do you handle hard-water spots common in Bullhead City?',
            a: 'Yes. We pre-treat mineral deposits.'
          },
          {
            id: 'hard-water-spots',
            q: 'Do you handle hard-water spots common in Bullhead City?',
            a: 'Different answer'
          }
        ]
      };

      const merged = createMergedLocationData(mockMainConfig, locationWithDuplicateFAQs);
      
      // Should deduplicate based on ID
      expect(merged.faqs).toHaveLength(1);
      expect(merged.faqs[0].a).toBe('Yes. We pre-treat mineral deposits.');
    });
  });

  describe('validateMergedData', () => {
    it('should validate merged data correctly', () => {
      const merged = createMergedLocationData(mockMainConfig, mockLocationData);
      const validation = validateMergedData(merged);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompleteData = {
        ...mockLocationData,
        slug: '', // Empty slug should be invalid
        city: '' // Empty city
      };
      
      const validation = validateMergedData(incompleteData as LocationPage);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors.some(error => error.includes('city'))).toBe(true);
    });
  });

  describe('custom merge options', () => {
    it('should respect custom merge options', () => {
      const customOptions = {
        arrayMergeStrategy: 'replace' as const,
        replaceKeys: ['keywords'],
        concatKeys: [] // Remove keywords from concat keys
      };

      const merged = createMergedLocationData(mockMainConfig, mockLocationData, customOptions);
      
      // Keywords should be replaced, not concatenated
      expect(merged.seo.keywords).toEqual(['Bullhead City AZ', 'Colorado River']);
    });
  });
});

describe('Edge Cases', () => {
  it('should handle null/undefined values gracefully', () => {
    const emptyMain: MainSiteConfig = {} as MainSiteConfig;
    const emptyLocation: LocationPage = {} as LocationPage;
    
    const merged = createMergedLocationData(emptyMain, emptyLocation);
    
    expect(merged).toBeDefined();
    expect(typeof merged).toBe('object');
  });

  it('should handle deeply nested objects', () => {
    const complexMain: MainSiteConfig = {
      ...mockMainConfig,
      seo: {
        ...mockMainConfig.seo,
        keywords: ['main1', 'main2']
      }
    };

    const complexLocation: LocationPage = {
      ...mockLocationData,
      seo: {
        ...mockLocationData.seo,
        keywords: ['location1', 'location2']
      }
    };

    const merged = createMergedLocationData(complexMain, complexLocation);
    
    // Should concatenate keywords from nested seo objects
    expect(merged.seo.keywords).toEqual(['main1', 'main2', 'location1', 'location2']);
  });
});
