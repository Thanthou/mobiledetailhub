/**
 * Industry Template Registry
 * 
 * Maps industry types to their template data.
 * Updated to use new modular file structure (assets.json, content-defaults.json, seo-defaults.json)
 */

// Industry types enum
export const INDUSTRIES = [
  'mobile-detailing',
  'maid-service',
  'lawncare',
  'pet-grooming',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

// Base industry template structure
export interface IndustryTemplate {
  tenant: {
    brand: string | null;
    businessName: string | null;
    customBranding: boolean;
  };
  slug: string;
  urlPath: string;
  logo: {
    url: string;
    alt: string;
    darkUrl?: string;
    lightUrl?: string;
  };
  seo: {
    Title: string;
    subTitle: string;
    canonicalPath: string;
    OgImage?: string;
    TwitterImage?: string;
    robots?: string;
  };
  hero: {
    h1: string;
    subTitle: string;
    Images: Array<{
      url: string;
      alt: string;
      width?: number;
      height?: number;
      priority?: boolean;
    }>;
  };
  servicesGrid?: unknown[];
  [key: string]: unknown;
}

/**
 * Load industry template from modular loaders
 * All industries now use the new modular architecture
 * 
 * @param industry - Industry type
 * @returns Promise resolving to the industry template
 */
export async function getIndustryTemplate(
  industry: Industry
): Promise<IndustryTemplate> {
  try {
    // All industries now use modular loaders via index.ts
    let config;
    
    switch (industry) {
      case 'mobile-detailing': {
        const { loadMobileDetailingConfig } = await import('@/data/mobile-detailing');
        config = await loadMobileDetailingConfig();
        break;
      }
      case 'pet-grooming': {
        const { loadPetGroomingConfig } = await import('@/data/pet-grooming');
        config = await loadPetGroomingConfig();
        break;
      }
      case 'maid-service': {
        const { loadMaidServiceConfig } = await import('@/data/maid-service');
        config = await loadMaidServiceConfig();
        break;
      }
      case 'lawncare': {
        const { loadLawncareConfig } = await import('@/data/lawncare');
        config = await loadLawncareConfig();
        break;
      }
      default: {
        const unknownIndustry: string = industry;
        throw new Error(`Unknown industry: ${unknownIndustry}`);
      }
    }

    // Convert MainSiteConfig to IndustryTemplate format
    return {
      tenant: {
        brand: config.brand || null,
        businessName: null,
        customBranding: false,
      },
      slug: config.slug || 'site',
      urlPath: config.urlPath || '/',
      logo: config.logo,
      seo: {
        Title: config.seo.title,
        subTitle: config.seo.description,
        canonicalPath: config.seo.canonicalPath,
        OgImage: config.seo.ogImage,
        TwitterImage: config.seo.twitterImage,
        robots: config.seo.robots,
      },
      hero: {
        h1: config.hero.h1,
        subTitle: config.hero.sub || '',
        Images: config.hero.images || [],
      },
      servicesGrid: config.servicesGrid,
    };
  } catch (error) {
    console.error('Failed to load industry template:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const industryStr: string = industry;
    throw new Error(`Failed to load template for industry ${industryStr}: ${errorMsg}`);
  }
}

/**
 * Validate if a string is a valid industry
 * @param value - Value to check
 * @returns True if valid industry
 */
export function isValidIndustry(value: unknown): value is Industry {
  return typeof value === 'string' && INDUSTRIES.includes(value as Industry);
}
