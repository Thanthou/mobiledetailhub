#!/usr/bin/env node

/**
 * Build-time validation script for location data
 * Now uses shared script utilities for DRY code
 *
 * Usage:
 *   npm run validate-location-data
 *   npm run validate-location-data -- --check
 *   npm run validate-location-data -- --fix
 *   npm run validate-location-data -- --verbose
 */

// NOTE: `path` was unused; removed to satisfy @typescript-eslint/no-unused-vars

import {
  formatPath,
  loadJsonFiles,
  parseArgs,
  parseScriptMode,
  printHelp,
  resolveFromRoot,
  ValidationReporter,
} from './_lib/index';

// ============================================================================
// Domain Logic - Location-specific validation rules
// ============================================================================

type ImageRole = 'hero' | 'gallery' | 'process' | 'result' | 'auto' | 'marine' | 'rv';

interface LocationImage {
  url: string;
  alt: string;
  role: ImageRole;
}
interface LocationFaq {
  q: string;
  a: string;
}
interface LocationData {
  slug: string;
  city: string;
  stateCode: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  urlPath: string;
  pricingModifierPct?: number;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    h1: string;
  };
  images?: LocationImage[];
  faqs?: LocationFaq[];
  serviceArea?: {
    postalCodes?: string[];
  };
  neighborhoods?: string[];
  localConditions?: string[];
}

// ---------- type guards & helpers ----------
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const getString = (o: Record<string, unknown>, key: string): string | undefined => {
  const v = o[key];
  return typeof v === 'string' ? v : undefined;
};

const getNumber = (o: Record<string, unknown>, key: string): number | undefined => {
  const v = o[key];
  return typeof v === 'number' ? v : undefined;
};

const getArray = (o: Record<string, unknown>, key: string): unknown[] | undefined => {
  const v = o[key];
  return Array.isArray(v) ? v : undefined;
};

const getObject = (o: Record<string, unknown>, key: string): Record<string, unknown> | undefined => {
  const v = o[key];
  return isObject(v) ? v : undefined;
};

const isImage = (v: unknown): v is LocationImage => {
  if (!isObject(v)) return false;
  return (
    typeof v['url'] === 'string' &&
    typeof v['alt'] === 'string' &&
    typeof v['role'] === 'string' &&
    (['hero', 'gallery', 'process', 'result', 'auto', 'marine', 'rv'] as const).includes(
      v['role'] as ImageRole,
    )
  );
};

const isFaq = (v: unknown): v is LocationFaq => {
  if (!isObject(v)) return false;
  return typeof v['q'] === 'string' && typeof v['a'] === 'string';
};

// ---------------------------------------------------------------------------

/**
 * Validate location data structure
 * This contains the business rules specific to locations
 */
function validateLocationData(data: unknown, _filename: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isObject(data)) {
    errors.push('Root must be an object');
    return { errors, warnings };
  }

  // Required fields
  const slug = getString(data, 'slug');
  const city = getString(data, 'city');
  const stateCode = getString(data, 'stateCode');
  const state = getString(data, 'state');
  const postalCode = getString(data, 'postalCode');
  const urlPath = getString(data, 'urlPath');

  const seo = getObject(data, 'seo');
  const hero = getObject(data, 'hero');

  const requiredChecks: Array<[string, unknown]> = [
    ['slug', slug],
    ['city', city],
    ['stateCode', stateCode],
    ['state', state],
    ['postalCode', postalCode],
    ['urlPath', urlPath],
    ['seo', seo],
    ['hero', hero],
  ];

  for (const [field, value] of requiredChecks) {
    if (value === undefined) errors.push(`Missing required field: ${field}`);
  }

  // Validate slug format
  if (slug && !/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  // Validate state code
  if (stateCode && !/^[A-Z]{2}$/.test(stateCode)) {
    errors.push('State code must be 2 uppercase letters');
  }

  // Validate postal code
  if (postalCode && !/^\d{5}(-\d{4})?$/.test(postalCode)) {
    errors.push('Postal code must be valid ZIP format');
  }

  // Validate URL path
  if (urlPath) {
    if (!urlPath.startsWith('/') || !urlPath.endsWith('/')) {
      errors.push('URL path must start and end with /');
    }
  }

  // Validate coordinates
  const latitude = getNumber(data, 'latitude');
  const longitude = getNumber(data, 'longitude');

  if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }
  if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }

  // Validate pricing modifier
  const pricingModifierPct = getNumber(data, 'pricingModifierPct');
  if (pricingModifierPct !== undefined) {
    if (pricingModifierPct < -0.5 || pricingModifierPct > 1.0) {
      errors.push('Pricing modifier must be between -0.5 and 1.0');
    }
  }

  // Validate SEO
  if (seo) {
    const seoTitle = getString(seo, 'title');
    const seoDesc = getString(seo, 'description');
    if (!seoTitle) errors.push('SEO title is required');
    if (!seoDesc) errors.push('SEO description is required');
  }

  // Validate hero
  if (hero) {
    const h1 = getString(hero, 'h1');
    if (!h1) errors.push('Hero H1 is required');
  }

  // Validate images
  const imagesRaw = getArray(data, 'images');
  if (imagesRaw) {
    imagesRaw.forEach((img, i) => {
      if (!isImage(img)) {
        errors.push(`Image ${i}: must include valid { url, alt, role }`);
      }
    });
  }

  // Validate FAQs
  const faqsRaw = getArray(data, 'faqs');
  if (faqsRaw) {
    faqsRaw.forEach((fq, i) => {
      if (!isFaq(fq)) {
        errors.push(`FAQ ${i}: must include valid { q, a }`);
      }
    });
  }

  // Warnings for optional but recommended fields
  if (!faqsRaw || faqsRaw.length === 0) warnings.push('No FAQs provided');
  const neighborhoods = getArray(data, 'neighborhoods');
  if (!neighborhoods || neighborhoods.length === 0) warnings.push('No neighborhoods listed');
  const localConditions = getArray(data, 'localConditions');
  if (!localConditions || localConditions.length === 0) warnings.push('No local conditions listed');
  if (!imagesRaw || imagesRaw.length === 0) warnings.push('No images provided');

  return { errors, warnings };
}

// ============================================================================
// Main Script - Uses shared utilities for I/O and reporting
// ============================================================================

function main() {
  const args = parseArgs();
  const mode = parseScriptMode(args);
  
  // Show help
  if (args.flags.has('help') || args.flags.has('h')) {
    printHelp(
      'validate-location-data',
      'Validate location JSON files',
      [
        'npm run validate-location-data',
        'npm run validate-location-data -- --check',
        'npm run validate-location-data -- --fix --verbose',
      ]
    );
    process.exit(0);
  }
  
  const reporter = new ValidationReporter();
  
  if (!mode.quiet) {
    console.log('🔍 Validating location data files...\n');
  }
  
  // Load all location JSON files using shared utility
  const locationDir = resolveFromRoot('frontend/src/data/locations');
  const locationFiles = loadJsonFiles<LocationData>(locationDir, {
    recursive: true,
    filter: (f) => !f.endsWith('locations.json'),  // Exclude index file
  });
  
  if (locationFiles.length === 0) {
    console.warn('⚠️  No location files found');
    process.exit(0);
  }
  
  if (mode.verbose) {
    console.log(`Found ${locationFiles.length} location files`);
  }
  
  // Validate each file
  locationFiles.forEach(({ path: filePath, data }) => {
    reporter.incrementChecked();
    const displayPath = formatPath(filePath);

    const { errors, warnings } = validateLocationData(data, displayPath);

    // Report errors
    for (const msg of errors) reporter.addError(displayPath, msg);

    // Report warnings
    for (const msg of warnings) reporter.addWarning(displayPath, msg);

    // Log per-file if verbose
    if (mode.verbose) {
      if (errors.length === 0) {
        console.log(`✅ ${displayPath}`);
      } else {
        console.log(`❌ ${displayPath} (${errors.length} errors)`);
      }
    }
  });

  // Print final report
  reporter.printReport(mode);
  reporter.exit();
}

main();

