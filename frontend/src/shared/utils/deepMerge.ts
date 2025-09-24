/**
 * Deep merge utility for location data
 * Handles merging main site config with location-specific overrides
 * Includes array deduplication and special handling for different data types
 */

import type { LocationPage, MainSiteConfig } from '@/shared/types/location';

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
  customMergers?: Record<string, (target: any, source: any) => any>;
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
    header: (main, location) => location || main,
    // Hero: deep merge with location overriding main
    hero: (main, location) => deepMergeObject(main || {}, location || {}),
    // Reviews section: location overrides main
    reviewsSection: (main, location) => location || main,
    // Ops: location overrides main
    ops: (main, location) => location || main,
    // Service area: location overrides main
    serviceArea: (main, location) => location || main,
    // Schema org: location overrides main
    schemaOrg: (main, location) => location || main
  }
};

/**
 * Check if value is a plain object
 */
function isPlainObject(value: any): boolean {
  return value !== null && 
         typeof value === 'object' && 
         value.constructor === Object &&
         Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Check if value is an array
 */
function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Create a unique key for array items to enable deduplication
 */
function createItemKey(item: any, index: number): string {
  // For images, use role + url combination
  if (item.role && item.url) {
    return `${item.role}:${item.url}`;
  }
  
  // For FAQs, use id or question
  if (item.id) {
    return `faq:${item.id}`;
  }
  if (item.q) {
    return `faq:${item.q}`;
  }
  
  // For simple strings, use the string itself
  if (typeof item === 'string') {
    return `string:${item}`;
  }
  
  // For objects, try to create a meaningful key
  if (isPlainObject(item)) {
    if (item.slug) return `object:${item.slug}`;
    if (item.title) return `object:${item.title}`;
    if (item.name) return `object:${item.name}`;
  }
  
  // Fallback to index-based key
  return `index:${index}`;
}

/**
 * Deduplicate array based on custom key function
 */
function deduplicateArray(array: any[], keyFn: (item: any, index: number) => string): any[] {
  const seen = new Map<string, any>();
  
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
  target: any[], 
  source: any[], 
  key: string, 
  options: DeepMergeOptions
): any[] {
  const { arrayMergeStrategy, concatKeys, dedupeKeys, replaceKeys } = options;
  
  // Always concatenate for specific keys (takes precedence over replace)
  if (concatKeys?.includes(key)) {
    return [...(target || []), ...(source || [])];
  }
  
  // Always replace for specific keys
  if (replaceKeys?.includes(key)) {
    return source;
  }
  
  // Always deduplicate for specific keys
  if (dedupeKeys?.includes(key)) {
    const combined = [...(target || []), ...(source || [])];
    return deduplicateArray(combined, createItemKey);
  }
  
  // Smart strategy: choose based on key
  switch (arrayMergeStrategy) {
    case 'replace':
      return source;
    case 'concat':
      return [...(target || []), ...(source || [])];
    case 'dedupe':
      const combined = [...(target || []), ...(source || [])];
      return deduplicateArray(combined, createItemKey);
    case 'smart':
    default:
      // Smart defaults based on key
      if (['images', 'faqs'].includes(key)) {
        const combined = [...(target || []), ...(source || [])];
        return deduplicateArray(combined, createItemKey);
      } else if (['neighborhoods', 'landmarks', 'localConditions', 'keywords'].includes(key)) {
        return [...(target || []), ...(source || [])];
      } else {
        return source; // Replace by default
      }
  }
}

/**
 * Deep merge two objects
 */
function deepMergeObject(target: any, source: any, options: DeepMergeOptions = DEFAULT_MERGE_OPTIONS): any {
  if (!isPlainObject(source)) {
    return source;
  }
  
  if (!isPlainObject(target)) {
    return source;
  }
  
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    // Use custom merger if available
    if (options.customMergers?.[key]) {
      result[key] = options.customMergers[key](targetValue, sourceValue);
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
 * Deep merge main site config with location data
 */
export function deepMergeLocationData(
  mainConfig: MainSiteConfig,
  locationData: LocationPage,
  options: DeepMergeOptions = DEFAULT_MERGE_OPTIONS
): LocationPage {
  // Start with location data as base (it should override main config)
  const merged = deepMergeObject(mainConfig, locationData, options);
  
  // Ensure required location-specific fields are preserved
  const requiredLocationFields = [
    'slug', 'city', 'stateCode', 'state', 'postalCode', 'urlPath'
  ];
  
  requiredLocationFields.forEach(field => {
    if (locationData[field as keyof LocationPage]) {
      merged[field as keyof LocationPage] = locationData[field as keyof LocationPage];
    }
  });
  
  return merged as LocationPage;
}

/**
 * Merge multiple location data objects
 */
export function deepMergeMultipleLocations(
  baseData: LocationPage,
  ...additionalData: Partial<LocationPage>[]
): LocationPage {
  let result = { ...baseData };
  
  additionalData.forEach(data => {
    result = deepMergeObject(result, data, DEFAULT_MERGE_OPTIONS);
  });
  
  return result;
}

/**
 * Create a merged location data object with smart defaults
 */
export function createMergedLocationData(
  mainConfig: MainSiteConfig,
  locationData: LocationPage,
  customOptions?: Partial<DeepMergeOptions>
): LocationPage {
  const options = {
    ...DEFAULT_MERGE_OPTIONS,
    ...customOptions
  };
  
  return deepMergeLocationData(mainConfig, locationData, options);
}

/**
 * Validate merged data structure
 */
export function validateMergedData(mergedData: LocationPage): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  const requiredFields = ['slug', 'city', 'stateCode', 'state', 'postalCode', 'urlPath'];
  requiredFields.forEach(field => {
    if (!mergedData[field as keyof LocationPage]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Check for duplicate images
  if (mergedData.images) {
    const imageKeys = new Set();
    const duplicates: string[] = [];
    
    mergedData.images.forEach((img, index) => {
      const key = createItemKey(img, index);
      if (imageKeys.has(key)) {
        duplicates.push(`Image ${index}: ${img.role}:${img.url}`);
      }
      imageKeys.add(key);
    });
    
    if (duplicates.length > 0) {
      warnings.push(`Duplicate images found: ${duplicates.join(', ')}`);
    }
  }
  
  // Check for duplicate FAQs
  if (mergedData.faqs) {
    const faqKeys = new Set();
    const duplicates: string[] = [];
    
    mergedData.faqs.forEach((faq, index) => {
      const key = createItemKey(faq, index);
      if (faqKeys.has(key)) {
        duplicates.push(`FAQ ${index}: ${faq.q}`);
      }
      faqKeys.add(key);
    });
    
    if (duplicates.length > 0) {
      warnings.push(`Duplicate FAQs found: ${duplicates.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Utility to get merge statistics
 */
export function getMergeStatistics(
  mainConfig: MainSiteConfig,
  locationData: LocationPage,
  mergedData: LocationPage
): {
  fieldsFromMain: string[];
  fieldsFromLocation: string[];
  fieldsMerged: string[];
  arraysConcatenated: string[];
  arraysDeduplicated: string[];
} {
  const fieldsFromMain: string[] = [];
  const fieldsFromLocation: string[] = [];
  const fieldsMerged: string[] = [];
  const arraysConcatenated: string[] = [];
  const arraysDeduplicated: string[] = [];
  
  // Analyze field sources
  Object.keys(mergedData).forEach(key => {
    const mergedValue = mergedData[key as keyof LocationPage];
    const mainValue = mainConfig[key as keyof MainSiteConfig];
    const locationValue = locationData[key as keyof LocationPage];
    
    if (locationValue !== undefined) {
      fieldsFromLocation.push(key);
    } else if (mainValue !== undefined) {
      fieldsFromMain.push(key);
    }
    
    // Check for merged objects
    if (typeof mergedValue === 'object' && 
        typeof mainValue === 'object' && 
        typeof locationValue === 'object' &&
        !Array.isArray(mergedValue)) {
      fieldsMerged.push(key);
    }
    
    // Check arrays
    if (Array.isArray(mergedValue)) {
      const mainArray = Array.isArray(mainValue) ? mainValue : [];
      const locationArray = Array.isArray(locationValue) ? locationValue : [];
      
      if (mergedValue.length > Math.max(mainArray.length, locationArray.length)) {
        arraysConcatenated.push(key);
      } else if (mergedValue.length < mainArray.length + locationArray.length) {
        arraysDeduplicated.push(key);
      }
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
