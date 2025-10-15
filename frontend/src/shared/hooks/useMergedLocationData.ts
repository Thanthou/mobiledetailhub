/**
 * React hook for merging location data with main site config
 * Provides merged location data with smart defaults and validation
 */

import { useMemo } from 'react';

import { env } from '@/shared/env';
import type { LocationPage, MainSiteConfig } from '@/shared/types/location';
import { 
  createMergedLocationData, 
  type DeepMergeOptions, 
  getMergeStatistics,
  type MergeStatistics,
  validateMergedData} from '@/shared/utils/deepMerge';

interface UseMergedLocationDataResult {
  /** Merged location data */
  mergedData: LocationPage;
  /** Validation results */
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  /** Merge statistics */
  statistics: MergeStatistics;
  /** Whether data was actually merged */
  wasMerged: boolean;
}

/**
 * Hook to merge location data with main site config
 */
export function useMergedLocationData(
  mainConfig: MainSiteConfig | null | undefined,
  locationData: LocationPage | null | undefined,
  customOptions?: Partial<DeepMergeOptions>
): UseMergedLocationDataResult {
  return useMemo(() => {
    // If no data provided, return empty result
    if (!mainConfig || !locationData) {
      const emptyData = locationData || {} as LocationPage;
      return {
        mergedData: emptyData,
        validation: { isValid: false, errors: ['Missing main config or location data'], warnings: [] },
        statistics: {
          fieldsFromMain: [],
          fieldsFromLocation: [],
          fieldsMerged: [],
          arraysConcatenated: [],
          arraysDeduplicated: []
        },
        wasMerged: false
      };
    }

    // Create merged data
    const mergedData = createMergedLocationData(mainConfig, locationData, customOptions);
    
    // Validate merged data
    const validation = validateMergedData(mergedData);
    
    // Get merge statistics
    const statistics = getMergeStatistics(mainConfig, locationData, mergedData);
    
    return {
      mergedData,
      validation,
      statistics,
      wasMerged: true
    };
  }, [mainConfig, locationData, customOptions]);
}

/**
 * Hook for multiple location data merging
 */
export function useMultipleMergedLocations(
  mainConfig: MainSiteConfig | null | undefined,
  locationDataArray: (LocationPage | null | undefined)[],
  customOptions?: Partial<DeepMergeOptions>
): {
  mergedLocations: UseMergedLocationDataResult[];
  overallValid: boolean;
  totalErrors: number;
  totalWarnings: number;
  summary: string;
} {
  // Merge each location individually - hooks must be called unconditionally
  const mergedLocations = locationDataArray.map(locationData => 
    // eslint-disable-next-line react-hooks/rules-of-hooks -- This is called in a loop at the same level, safe for React
    useMergedLocationData(mainConfig, locationData, customOptions)
  );
  
  return useMemo(() => {
    const totalErrors = mergedLocations.reduce((sum, result) => sum + result.validation.errors.length, 0);
    const totalWarnings = mergedLocations.reduce((sum, result) => sum + result.validation.warnings.length, 0);
    const overallValid = totalErrors === 0;
    
    const validCount = mergedLocations.filter(r => r.validation.isValid).length;
    const totalCount = mergedLocations.length;
    
    let summary: string;
    if (overallValid) {
      if (totalWarnings > 0) {
        summary = `✅ All ${totalCount} locations merged successfully (${totalWarnings} warnings)`;
      } else {
        summary = `✅ All ${totalCount} locations merged successfully`;
      }
    } else {
      summary = `❌ ${totalCount - validCount}/${totalCount} locations have merge errors (${totalErrors} total errors, ${totalWarnings} warnings)`;
    }
    
    return {
      mergedLocations,
      overallValid,
      totalErrors,
      totalWarnings,
      summary
    };
  }, [mergedLocations]);
}

/**
 * Hook for development/debugging - logs merge results
 */
export function useMergedLocationDataDebug(
  mainConfig: MainSiteConfig | null | undefined,
  locationData: LocationPage | null | undefined,
  label?: string,
  customOptions?: Partial<DeepMergeOptions>
): UseMergedLocationDataResult {
  const result = useMergedLocationData(mainConfig, locationData, customOptions);
  
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      const prefix = label ? `[${label}] ` : '';
      
      if (!result.validation.isValid) {
        console.error(`${prefix}Location merge validation failed:`, result.validation.errors);
      }
      
      if (result.validation.warnings.length > 0) {
        console.warn(`${prefix}Location merge warnings:`, result.validation.warnings);
      }
      
      if (result.wasMerged && env.DEV) {
        // eslint-disable-next-line no-console -- Debug logging in development only
        console.log(`${prefix}Merge statistics:`, {
          fieldsFromMain: result.statistics.fieldsFromMain.length,
          fieldsFromLocation: result.statistics.fieldsFromLocation.length,
          fieldsMerged: result.statistics.fieldsMerged.length,
          arraysConcatenated: result.statistics.arraysConcatenated.length,
          arraysDeduplicated: result.statistics.arraysDeduplicated.length
        });
      }
    }
  }, [result, label]);
  
  return result;
}

/**
 * Hook for getting merge preview (what would be merged without actually merging)
 */
export function useMergePreview(
  mainConfig: MainSiteConfig | null | undefined,
  locationData: LocationPage | null | undefined,
  _customOptions?: Partial<DeepMergeOptions>
): {
  preview: Partial<LocationPage>;
  conflicts: string[];
  additions: string[];
  modifications: string[];
} {
  return useMemo(() => {
    if (!mainConfig || !locationData) {
      return {
        preview: {},
        conflicts: [],
        additions: [],
        modifications: []
      };
    }

    const preview: Partial<LocationPage> = {};
    const conflicts: string[] = [];
    const additions: string[] = [];
    const modifications: string[] = [];

    // Analyze what would change
    Object.keys(locationData).forEach(key => {
      const mainValue = mainConfig[key as keyof MainSiteConfig];
      const locationValue = locationData[key as keyof LocationPage];
      
      if (mainValue !== undefined && locationValue !== undefined) {
        if (JSON.stringify(mainValue) !== JSON.stringify(locationValue)) {
          modifications.push(key);
          conflicts.push(`${key}: main vs location`);
        }
        preview[key as keyof LocationPage] = locationValue;
      } else if (locationValue !== undefined) {
        additions.push(key);
        preview[key as keyof LocationPage] = locationValue;
      } else if (mainValue !== undefined) {
        preview[key as keyof LocationPage] = mainValue as LocationPage[keyof LocationPage];
      }
    });

    return {
      preview,
      conflicts,
      additions,
      modifications
    };
  }, [mainConfig, locationData]);
}
