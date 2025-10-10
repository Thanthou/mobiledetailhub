/**
 * Location data validation utilities
 * Use these functions to validate location data at build time or runtime
 */

import type { LocationPage, MainSiteConfig } from '@/shared/types/location';
import { validateLocationData, validateMainSiteConfig, type ValidationResult } from '@/shared/validation/locationSchema';

/**
 * Validate a single location file
 */
export function validateLocationFile(locationData: unknown, filename?: string): ValidationResult<LocationPage> {
  const result = validateLocationData(locationData);
  
  if (!result.success && filename && result.errors) {
    console.error(`❌ Validation failed for ${filename}:`);
    const validationErrors = result.errors as Array<{ path: string; message: string; code: string }>;
    for (const issue of validationErrors) {
      console.error(`  - ${issue.path}: ${issue.message}`);
    }
  }
  
  return result;
}

/**
 * Validate multiple location files
 */
export function validateAllLocationFiles(locationFiles: Array<{ data: unknown; filename: string }>): {
  valid: Array<{ filename: string; data: LocationPage }>;
  invalid: Array<{ filename: string; errors: Array<{ path: string; message: string; code: string }> }>;
} {
  const valid: Array<{ filename: string; data: LocationPage }> = [];
  const invalid: Array<{ filename: string; errors: Array<{ path: string; message: string; code: string }> }> = [];
  
  locationFiles.forEach(({ data, filename }) => {
    const result = validateLocationFile(data, filename);
    
    if (result.success && result.data) {
      valid.push({ filename, data: result.data });
    } else if (result.errors) {
      invalid.push({ filename, errors: result.errors });
    }
  });
  
  return { valid, invalid };
}

/**
 * Validate main site configuration
 */
export function validateMainSiteFile(siteData: unknown, filename?: string): ValidationResult<MainSiteConfig> {
  const result = validateMainSiteConfig(siteData);
  
  if (!result.success && filename && result.errors) {
    console.error(`❌ Validation failed for ${filename}:`);
    const validationErrors = result.errors as Array<{ path: string; message: string; code: string }>;
    for (const issue of validationErrors) {
      console.error(`  - ${issue.path}: ${issue.message}`);
    }
  }
  
  return result;
}

/**
 * Validate location data with detailed error reporting
 */
export function validateLocationWithDetails(locationData: unknown): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: LocationPage;
} {
  const result = validateLocationData(locationData);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!result.success && result.errors) {
    const validationErrors = result.errors as Array<{ path: string; message: string; code: string }>;
    for (const issue of validationErrors) {
      errors.push(`${issue.path}: ${issue.message}`);
    }
  }
  
  // Additional business logic validations
  if (result.success && result.data) {
    const data = result.data;
    
    // Check for common issues
    if (data.images) {
      const heroImages = data.images.filter(img => img.role === 'hero');
      if (heroImages.length === 0) {
        warnings.push('No hero images found - consider adding images with role="hero"');
      }
      if (heroImages.length > 1) {
        warnings.push('Multiple hero images found - ensure carousel is implemented');
      }
    }
    
    if (data.pricingModifierPct !== undefined) {
      if (data.pricingModifierPct > 0.5) {
        warnings.push(`High pricing modifier (${(data.pricingModifierPct * 100).toFixed(1)}%) - ensure this is intentional`);
      }
      if (data.pricingModifierPct < -0.2) {
        warnings.push(`Negative pricing modifier (${(data.pricingModifierPct * 100).toFixed(1)}%) - ensure this is intentional`);
      }
    }
    
    if (!data.faqs || data.faqs.length === 0) {
      warnings.push('No FAQs provided - consider adding location-specific FAQs');
    }
    
    if (!data.neighborhoods || data.neighborhoods.length === 0) {
      warnings.push('No neighborhoods listed - consider adding local neighborhoods for SEO');
    }
    
    if (!data.localConditions || data.localConditions.length === 0) {
      warnings.push('No local conditions listed - consider adding location-specific conditions');
    }
    
    // Check for required fields that might be missing
    if (!data.header?.businessName) {
      warnings.push('No business name in header - using fallback');
    }
    
    if (!data.header?.phoneDisplay) {
      warnings.push('No phone display format in header - using fallback');
    }
    
    if (!data.seo.canonicalPath) {
      warnings.push('No canonical path specified - using urlPath as fallback');
    }
  }
  
  return {
    isValid: result.success,
    errors,
    warnings,
    data: result.data || undefined
  };
}

/**
 * Quick validation for development
 */
export function quickValidateLocation(locationData: unknown): boolean {
  const result = validateLocationData(locationData);
  return result.success;
}

/**
 * Validate and format error messages for display
 */
export function formatValidationErrors(errors: Array<{ path: string; message: string; code: string }>): string {
  return errors
    .map(error => `• ${error.path}: ${error.message}`)
    .join('\n');
}

/**
 * Get validation summary
 */
export function getValidationSummary(validationResult: ValidationResult<unknown>): string {
  if (validationResult.success) {
    return '✅ Validation passed';
  }
  
  const errorCount = validationResult.errors?.length || 0;
  const errorText = errorCount === 1 ? 'error' : 'errors';
  return `❌ Validation failed with ${errorCount} ${errorText}`;
}
