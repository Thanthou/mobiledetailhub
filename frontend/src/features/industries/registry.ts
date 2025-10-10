/**
 * Industry Template Registry
 * 
 * Maps industry types to their template data (site.json).
 * This registry is non-breaking: it simply reads existing JSON files
 * and provides type-safe access for preview and rendering.
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
// This matches the structure in site.json files
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
  servicesGrid?: unknown[]; // Services vary by industry
  [key: string]: unknown; // Allow additional fields
}

/**
 * Load industry template from site.json
 * @param industry - Industry type
 * @returns Promise resolving to the industry template
 */
export async function getIndustryTemplate(
  industry: Industry
): Promise<IndustryTemplate> {
  try {
    let template: IndustryTemplate;

    switch (industry) {
      case 'mobile-detailing':
        template = (await import(
          '@/data/mobile-detailing/site.json'
        )) as unknown as IndustryTemplate;
        break;
      case 'maid-service':
        template = (await import(
          '@/data/maid-service/site.json'
        )) as unknown as IndustryTemplate;
        break;
      case 'lawncare':
        template = (await import(
          '@/data/lawncare/site.json'
        )) as unknown as IndustryTemplate;
        break;
      case 'pet-grooming':
        template = (await import(
          '@/data/pet-grooming/site.json'
        )) as unknown as IndustryTemplate;
        break;
      default:
        throw new Error(`Unknown industry: ${industry}`);
    }

    return template;
  } catch (error) {
    console.error('Failed to load industry template:', error);
    throw new Error(`Failed to load template for industry: ${industry}`);
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

