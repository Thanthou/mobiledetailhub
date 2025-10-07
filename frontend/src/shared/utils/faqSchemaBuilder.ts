/**
 * Build-time FAQ schema generation utilities
 * Generates FAQPage JSON-LD schemas for all pages at build time
 */

import { generateFAQSchema, convertFAQItemsToSchemaFormat } from './schemaUtils';
import type { LocationPage } from '@/shared/types/location';
import type { FAQItem } from '@/features/faq/types';

/**
 * Build FAQ schema for a location page
 */
export function buildLocationFAQSchema(locationData: LocationPage): Record<string, unknown> | null {
  if (!locationData.faqs || locationData.faqs.length === 0) {
    return null;
  }

  return generateFAQSchema(locationData.faqs);
}

/**
 * Build FAQ schema for the main site using general FAQs
 */
export function buildMainSiteFAQSchema(generalFAQs: FAQItem[]): Record<string, unknown> | null {
  if (!generalFAQs || generalFAQs.length === 0) {
    return null;
  }

  const convertedFAQs = convertFAQItemsToSchemaFormat(generalFAQs);
  return generateFAQSchema(convertedFAQs);
}

/**
 * Build FAQ schemas for all location pages
 */
export function buildAllLocationFAQSchemas(locationDataArray: LocationPage[]): Array<{
  location: string;
  schema: Record<string, unknown> | null;
}> {
  return locationDataArray.map(locationData => ({
    location: locationData.slug,
    schema: buildLocationFAQSchema(locationData)
  }));
}

/**
 * Generate FAQ schema statistics
 */
export function getFAQSchemaStatistics(
  locationDataArray: LocationPage[],
  generalFAQs: FAQItem[]
): {
  totalLocations: number;
  locationsWithFAQs: number;
  totalLocationFAQs: number;
  mainSiteFAQs: number;
  schemaCoverage: {
    locations: number;
    mainSite: boolean;
  };
} {
  const locationsWithFAQs = locationDataArray.filter(location => 
    location.faqs && location.faqs.length > 0
  );
  
  const totalLocationFAQs = locationDataArray.reduce((total, location) => 
    total + (location.faqs?.length || 0), 0
  );

  return {
    totalLocations: locationDataArray.length,
    locationsWithFAQs: locationsWithFAQs.length,
    totalLocationFAQs,
    mainSiteFAQs: generalFAQs.length,
    schemaCoverage: {
      locations: locationsWithFAQs.length,
      mainSite: generalFAQs.length > 0
    }
  };
}

/**
 * Validate FAQ schema completeness
 */
export function validateFAQSchemaCompleteness(
  locationDataArray: LocationPage[],
  generalFAQs: FAQItem[]
): {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check main site FAQs
  if (generalFAQs.length === 0) {
    warnings.push('No general FAQs found for main site FAQPage schema');
    recommendations.push('Add general FAQs to generate main site FAQPage schema');
  }

  // Check location FAQs
  const locationsWithoutFAQs = locationDataArray.filter(location => 
    !location.faqs || location.faqs.length === 0
  );

  if (locationsWithoutFAQs.length > 0) {
    warnings.push(`${locationsWithoutFAQs.length} locations without FAQs`);
    recommendations.push('Consider adding location-specific FAQs for better SEO');
  }

  // Check FAQ quality
  locationDataArray.forEach(location => {
    if (location.faqs && location.faqs.length > 0) {
      const faqsWithoutIds = location.faqs.filter(faq => !faq.id);
      if (faqsWithoutIds.length > 0) {
        warnings.push(`Location ${location.slug}: ${faqsWithoutIds.length} FAQs without IDs`);
        recommendations.push('Add IDs to FAQs for better analytics and A/B testing');
      }

      const shortAnswers = location.faqs.filter(faq => faq.a.length < 50);
      if (shortAnswers.length > 0) {
        recommendations.push(`Location ${location.slug}: Consider expanding short FAQ answers for better SEO`);
      }
    }
  });

  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations
  };
}

/**
 * Generate FAQ schema manifest for build tools
 */
export function generateFAQSchemaManifest(
  locationDataArray: LocationPage[],
  generalFAQs: FAQItem[]
): {
  version: string;
  generatedAt: string;
  mainSite: {
    hasSchema: boolean;
    faqCount: number;
    schemaPath?: string;
  };
  locations: Array<{
    slug: string;
    hasSchema: boolean;
    faqCount: number;
    schemaPath?: string;
  }>;
  statistics: ReturnType<typeof getFAQSchemaStatistics>;
  validation: ReturnType<typeof validateFAQSchemaCompleteness>;
} {
  const statistics = getFAQSchemaStatistics(locationDataArray, generalFAQs);
  const validation = validateFAQSchemaCompleteness(locationDataArray, generalFAQs);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    mainSite: {
      hasSchema: generalFAQs.length > 0,
      faqCount: generalFAQs.length,
      schemaPath: generalFAQs.length > 0 ? '/schemas/main-site-faq.json' : undefined
    },
    locations: locationDataArray.map(location => ({
      slug: location.slug,
      hasSchema: !!(location.faqs && location.faqs.length > 0),
      faqCount: location.faqs?.length || 0,
      schemaPath: (location.faqs && location.faqs.length > 0) 
        ? `/schemas/locations/${location.slug}-faq.json` 
        : undefined
    })),
    statistics,
    validation
  };
}

/**
 * Build-time FAQ schema generation for static export
 */
export function buildStaticFAQSchemas(
  locationDataArray: LocationPage[],
  generalFAQs: FAQItem[]
): {
  schemas: Record<string, Record<string, unknown>>;
  manifest: ReturnType<typeof generateFAQSchemaManifest>;
} {
  const schemas: Record<string, Record<string, unknown>> = {};

  // Generate main site FAQ schema
  const mainSiteSchema = buildMainSiteFAQSchema(generalFAQs);
  if (mainSiteSchema) {
    schemas['main-site-faq.json'] = mainSiteSchema;
  }

  // Generate location FAQ schemas
  locationDataArray.forEach(locationData => {
    const locationSchema = buildLocationFAQSchema(locationData);
    if (locationSchema) {
      schemas[`locations/${locationData.slug}-faq.json`] = locationSchema;
    }
  });

  const manifest = generateFAQSchemaManifest(locationDataArray, generalFAQs);

  return {
    schemas,
    manifest
  };
}
