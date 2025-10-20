/**
 * Deep merge utility for location data
 * Handles merging main site config with location-specific overrides
 * Includes array deduplication and special handling for different data types
 */

import type { LocationPage, MainSiteConfig } from '@shared/types/location';

// Type-safe representations for merge operations
type PlainObject = Record<string, unknown>;
type MergeValue = unknown;
type ArrayItem = unknown;

/**
 * Deep merge configuration options
 */
export interface DeepMergeOptions {
  /** Array merge strategy */
  arrayMergeStrategy?: 'replace' | 'concat' | 'dedupe' | 'smart';
  /** Keys to always replace (not merge) */
  replaceKeys?: string[];
  /** Keys to always concatenate arrays */
  concatKeys?: string[];
  /** Keys to deduplicate arrays */
  dedupeKeys?: string[];
  /** Custom merge function for specific keys */
  customMergers?: Record<string, (target: MergeValue, source: MergeValue) => MergeValue>;
}

/**
 * Default merge options for location data
 */
export const DEFAULT_MERGE_OPTIONS: DeepMergeOptions = {
  arrayMergeStrategy: 'smart',
  replaceKeys: [
    'slug', 'city', 'stateCode', 'state', 'postalCode', 'urlPath',
    'latitude', 'longitude', 'affiliateRef', 'employee'
  ],
  concatKeys: [
    'neighborhoods', 'landmarks', 'localConditions', 'keywords'
  ],
  dedupeKeys: [
    'images', 'faqs'
  ],
  customMergers: {
    // SEO: deep merge with location overriding main
    seo: (main, location) => deepMergeObject(main || {}, location || {}),
    // Header: location completely overrides main
    header: (_main, location) => location || _main,
    // Hero: deep merge with location overriding main
    hero: (main, location) => deepMergeObject(main || {}, location || {}),
    // Reviews section: location overrides main
    reviewsSection: (_main, location) => location || _main,
    // Ops: location overrides main
    ops: (_main, location) => location || _main,
    // Service area: location overrides main
    serviceArea: (_main, location) => location || _main,
    // Schema org: location overrides main
    schemaOrg: (_main, location) => location || _main
  }
};

/**
 * Check if value is a plain object
 */
function isPlainObject(value: unknown): value is PlainObject {
  return value !== null && 
         typeof value === 'object' && 
         !Array.isArray(value) &&
         Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Check if value is an array
 */
function isArray(value: unknown): value is ArrayItem[] {
  return Array.isArray(value);
}

/**
 * Safely get property from object
 */
function getProperty(obj: unknown, key: string): unknown {
  if (isPlainObject(obj)) {
    return obj[key];
  }
  return undefined;
}

/**
 * Create a unique key for array items to enable deduplication
 */
function createItemKey(item: ArrayItem, index: number): string {
  // For images, use role + url combination
  if (isPlainObject(item)) {
    const role = getProperty(item, 'role');
    const url = getProperty(item, 'url');
    if (typeof role === 'string' && typeof url === 'string') {
      return `${role}:${url}`;
    }
    
    // For FAQs, use id or question
    const id = getProperty(item, 'id');
    if (id !== undefined) {
      return `faq:${String(id)}`;
    }
    const q = getProperty(item, 'q');
    if (typeof q === 'string') {
      return `faq:${q}`;
    }
    
    // For objects, try to create a meaningful key
    const slug = getProperty(item, 'slug');
    if (typeof slug === 'string') return `object:${slug}`;
    
    const title = getProperty(item, 'title');
    if (typeof title === 'string') return `object:${title}`;
    
    const name = getProperty(item, 'name');
    if (typeof name === 'string') return `object:${name}`;
  }
  
  // For simple strings, use the string itself
  if (typeof item === 'string') {
    return `string:${item}`;
  }
  
  // Fallback to index-based key
  return `index:${index}`;
}

/**
 * Deduplicate array based on custom key function
 */
function deduplicateArray(array: ArrayItem[], keyFn: (item: ArrayItem, index: number) => string): ArrayItem[] {
  const seen = new Map<string, ArrayItem>();
  
  array.forEach((item, index) => {
    const key = keyFn(item, index);
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  });
  
  return Array.from(seen.values());
}

/**
 * Merge arrays based on strategy
 */
function mergeArrays(
  target: unknown, 
  source: unknown, 
  key: string, 
  options: DeepMergeOptions
): ArrayItem[] {
  const { arrayMergeStrategy, concatKeys, dedupeKeys, replaceKeys } = options;
  
  // Ensure source is an array
  if (!isArray(source)) {
    return [];
  }
  
  // If target is not an array, just return source
  if (!isArray(target)) {
    return source;
  }
  
  // Always concatenate for specific keys (takes precedence over replace)
  if (concatKeys?.includes(key)) {
    return [...target, ...source];
  }
  
  // Always replace for specific keys
  if (replaceKeys?.includes(key)) {
    return source;
  }
  
  // Always deduplicate for specific keys
  if (dedupeKeys?.includes(key)) {
    const combined = [...target, ...source];
    return deduplicateArray(combined, createItemKey);
  }
  
  // Smart strategy: choose based on key
  switch (arrayMergeStrategy) {
    case 'replace':
      return source;
    case 'concat':
      return [...target, ...source];
    case 'dedupe': {
      const combined = [...target, ...source];
      return deduplicateArray(combined, createItemKey);
    }
    case 'smart':
    default: {
      // Smart defaults based on key
      if (['images', 'faqs'].includes(key)) {
        const combined = [...target, ...source];
        return deduplicateArray(combined, createItemKey);
      } else if (['neighborhoods', 'landmarks', 'localConditions', 'keywords'].includes(key)) {
        return [...target, ...source];
      } else {
        return source; // Replace by default
      }
    }
  }
}

/**
 * Deep merge two objects
 */
function deepMergeObject(target: MergeValue, source: MergeValue, options: DeepMergeOptions = DEFAULT_MERGE_OPTIONS): PlainObject {
  if (!isPlainObject(source)) {
    return isPlainObject(target) ? target : {};
  }
  
  if (!isPlainObject(target)) {
    return source;
  }
  
  const result: PlainObject = { ...target };
  
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    // Use custom merger if available
    const customMerger = options.customMergers?.[key];
    if (customMerger) {
      result[key] = customMerger(targetValue, sourceValue);
      return;
    }
    
    // Handle arrays
    if (isArray(sourceValue)) {
      result[key] = mergeArrays(targetValue, sourceValue, key, options);
      return;
    }
    
    // Handle objects
    if (isPlainObject(sourceValue)) {
      result[key] = deepMergeObject(targetValue || {}, sourceValue, options);
      return;
    }
    
    // Handle primitives
    result[key] = sourceValue;
  });
  
  return result;
}

/**
 * Main merge function for location data
 * Merges main site config with location-specific overrides
 */
export function createMergedLocationData(
  mainConfig: MainSiteConfig,
  locationData: LocationPage,
  options: Partial<DeepMergeOptions> = {}
): LocationPage {
  const mergeOptions: DeepMergeOptions = {
    ...DEFAULT_MERGE_OPTIONS,
    ...options
  };
  
  // Deep merge the configs
  const merged = deepMergeObject(mainConfig, locationData, mergeOptions) as unknown as LocationPage;
  
  // Ensure required fields from location always take precedence
  const requiredFields: Array<keyof LocationPage> = [
    'slug', 'city', 'stateCode', 'state', 'urlPath'
  ];
  
  requiredFields.forEach(field => {
    if (field in locationData) {
      (merged as unknown as PlainObject)[field] = locationData[field];
    }
  });
  
  return merged;
}

/**
 * Validation result for merged data
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate merged location data
 */
export function validateMergedData(data: LocationPage): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!data.slug) errors.push('Missing required field: slug');
  if (!data.city) errors.push('Missing required field: city');
  if (!data.stateCode) errors.push('Missing required field: stateCode');
  if (!data.state) errors.push('Missing required field: state');
  if (!data.urlPath) errors.push('Missing required field: urlPath');
  
  // Check SEO
  if (!data.seo.title) warnings.push('Missing SEO title');
  if (!data.seo.description) warnings.push('Missing SEO description');
  
  // Check hero
  if (!data.hero.h1) warnings.push('Missing hero H1');
  
  // Warnings for optional but recommended fields
  if (!data.images || data.images.length === 0) {
    warnings.push('No images provided');
  }
  
  if (!data.faqs || data.faqs.length === 0) {
    warnings.push('No FAQs provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Helper to create a minimal location page from partial data
 */
export function createLocationPage(
  data: Partial<LocationPage> & { slug: string; city: string; stateCode: string; state: string; urlPath: string }
): LocationPage {
  const defaults = {
    seo: data.seo || {
      title: `${data.city}, ${data.stateCode} | Services`,
      description: `Professional services in ${data.city}, ${data.state}`,
      canonicalPath: data.urlPath,
    },
    hero: data.hero || {
      h1: `${data.city}, ${data.stateCode}`,
    }
  };

  return {
    ...defaults,
    ...data,
    slug: data.slug,
    city: data.city,
    stateCode: data.stateCode,
    state: data.state,
    urlPath: data.urlPath
  } as LocationPage;
}

/**
 * Deep clone an object (useful for testing merge operations)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item: unknown) => deepClone(item)) as unknown as T;
  }
  
  const cloned: Record<string, unknown> = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
  });
  
  return cloned as T;
}

/**
 * Compare two objects for equality (deep comparison)
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  if (Array.isArray(a) || Array.isArray(b)) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => 
    keysB.includes(key) && 
    deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
  );
}

/**
 * Statistics about merge operations
 */
export interface MergeStatistics {
  fieldsFromMain: string[];
  fieldsFromLocation: string[];
  fieldsMerged: string[];
  arraysConcatenated: string[];
  arraysDeduplicated: string[];
}

/**
 * Get merge statistics - analyze which fields came from where
 */
export function getMergeStatistics(
  mainConfig: MainSiteConfig,
  locationData: LocationPage,
  mergedData: LocationPage
): MergeStatistics {
  const fieldsFromMain: string[] = [];
  const fieldsFromLocation: string[] = [];
  const fieldsMerged: string[] = [];
  const arraysConcatenated: string[] = [];
  const arraysDeduplicated: string[] = [];

  const allKeys = new Set([
    ...Object.keys(mainConfig),
    ...Object.keys(locationData),
    ...Object.keys(mergedData)
  ]);

  allKeys.forEach(key => {
    const mainValue = (mainConfig as unknown as Record<string, unknown>)[key];
    const locationValue = (locationData as unknown as Record<string, unknown>)[key];
    const mergedValue = (mergedData as unknown as Record<string, unknown>)[key];

    // Skip if no merged value
    if (mergedValue === undefined) return;

    const hasMain = mainValue !== undefined;
    const hasLocation = locationValue !== undefined;

    if (hasMain && hasLocation) {
      // Both have values - field was merged
      fieldsMerged.push(key);

      // Check if arrays were involved
      if (Array.isArray(mainValue) && Array.isArray(locationValue) && Array.isArray(mergedValue)) {
        const totalLength = mainValue.length + locationValue.length;
        if (mergedValue.length < totalLength) {
          arraysDeduplicated.push(key);
        } else if (mergedValue.length === totalLength) {
          arraysConcatenated.push(key);
        }
      }
    } else if (hasLocation) {
      fieldsFromLocation.push(key);
    } else if (hasMain) {
      fieldsFromMain.push(key);
    }
  });

  return {
    fieldsFromMain,
    fieldsFromLocation,
    fieldsMerged,
    arraysConcatenated,
    arraysDeduplicated
  };
}