/**
 * React hook for validating location data
 * Provides validation state and error handling for location data
 */

import { useMemo } from 'react';
import { validateLocationWithDetails } from '@/shared/utils/validateLocationData';
import type { LocationPage } from '@/shared/types/location';

interface UseLocationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
  formattedErrors: string;
  formattedWarnings: string;
}

/**
 * Hook to validate location data and provide validation results
 */
export function useLocationValidation(locationData: LocationPage | null | undefined): UseLocationValidationResult {
  return useMemo(() => {
    if (!locationData) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        hasErrors: false,
        hasWarnings: false,
        errorCount: 0,
        warningCount: 0,
        formattedErrors: '',
        formattedWarnings: ''
      };
    }

    const validation = validateLocationWithDetails(locationData);
    
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      hasErrors: validation.errors.length > 0,
      hasWarnings: validation.warnings.length > 0,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      formattedErrors: validation.errors.join('\n'),
      formattedWarnings: validation.warnings.join('\n')
    };
  }, [locationData]);
}

/**
 * Hook to validate multiple location data objects
 */
export function useMultipleLocationValidation(locationDataArray: (LocationPage | null | undefined)[]): {
  overallValid: boolean;
  totalErrors: number;
  totalWarnings: number;
  results: UseLocationValidationResult[];
  summary: string;
} {
  return useMemo(() => {
    const results = locationDataArray.map(data => useLocationValidation(data));
    
    const totalErrors = results.reduce((sum, result) => sum + result.errorCount, 0);
    const totalWarnings = results.reduce((sum, result) => sum + result.warningCount, 0);
    const overallValid = totalErrors === 0;
    
    const validCount = results.filter(r => r.isValid).length;
    const totalCount = results.length;
    
    let summary: string;
    if (overallValid) {
      if (totalWarnings > 0) {
        summary = `✅ All ${totalCount} locations valid (${totalWarnings} warnings)`;
      } else {
        summary = `✅ All ${totalCount} locations valid`;
      }
    } else {
      summary = `❌ ${totalCount - validCount}/${totalCount} locations have errors (${totalErrors} total errors, ${totalWarnings} warnings)`;
    }
    
    return {
      overallValid,
      totalErrors,
      totalWarnings,
      results,
      summary
    };
  }, [locationDataArray]);
}

/**
 * Hook for development/debugging - logs validation results to console
 */
export function useLocationValidationDebug(locationData: LocationPage | null | undefined, label?: string): UseLocationValidationResult {
  const validation = useLocationValidation(locationData);
  
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      const prefix = label ? `[${label}] ` : '';
      
      if (!validation.isValid) {
        console.error(`${prefix}Location validation failed:`, validation.errors);
      }
      
      if (validation.hasWarnings) {
        console.warn(`${prefix}Location validation warnings:`, validation.warnings);
      }
    }
  }, [validation, label]);
  
  return validation;
}
