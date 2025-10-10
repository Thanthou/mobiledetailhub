/**
 * Location data loader with deep merge capabilities
 * Handles loading and merging main site config with location-specific data
 */

import type { LocationPage, MainSiteConfig } from '@/shared/types/location';
import { 
  createMergedLocationData, 
  type DeepMergeOptions, 
  validateMergedData} from '@/shared/utils/deepMerge';

/**
 * Load and merge location data
 */
export async function loadMergedLocationData(
  mainConfigPath: string,
  locationConfigPath: string,
  options?: Partial<DeepMergeOptions>
): Promise<{
  data: LocationPage;
  validation: ReturnType<typeof validateMergedData>;
  wasMerged: boolean;
}> {
  try {
    // Load main site config
    const mainConfigResponse = await fetch(mainConfigPath);
    if (!mainConfigResponse.ok) {
      throw new Error(`Failed to load main config: ${mainConfigResponse.statusText}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const mainConfig: MainSiteConfig = await mainConfigResponse.json();

    // Load location config
    const locationConfigResponse = await fetch(locationConfigPath);
    if (!locationConfigResponse.ok) {
      throw new Error(`Failed to load location config: ${locationConfigResponse.statusText}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const locationData: LocationPage = await locationConfigResponse.json();

    // Merge the data
    const mergedData = createMergedLocationData(mainConfig, locationData, options);
    
    // Validate merged data
    const validation = validateMergedData(mergedData);

    return {
      data: mergedData,
      validation,
      wasMerged: true
    };
  } catch (error) {
    console.error('Error loading merged location data:', error);
    throw error;
  }
}

/**
 * Load multiple location configs and merge with main config
 */
export async function loadAllMergedLocations(
  mainConfigPath: string,
  locationConfigPaths: string[],
  options?: Partial<DeepMergeOptions>
): Promise<Array<{
  path: string;
  data: LocationPage;
  validation: ReturnType<typeof validateMergedData>;
  wasMerged: boolean;
}>> {
  try {
    // Load main config once
    const mainConfigResponse = await fetch(mainConfigPath);
    if (!mainConfigResponse.ok) {
      throw new Error(`Failed to load main config: ${mainConfigResponse.statusText}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const mainConfig: MainSiteConfig = await mainConfigResponse.json();

    // Load and merge all location configs
    const results = await Promise.all(
      locationConfigPaths.map(async (path) => {
        try {
          const locationConfigResponse = await fetch(path);
          if (!locationConfigResponse.ok) {
            throw new Error(`Failed to load location config: ${locationConfigResponse.statusText}`);
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
          const locationData: LocationPage = await locationConfigResponse.json();

          const mergedData = createMergedLocationData(mainConfig, locationData, options);
          const validation = validateMergedData(mergedData);

          return {
            path,
            data: mergedData,
            validation,
            wasMerged: true
          };
        } catch (error) {
          console.error(`Error loading location config ${path}:`, error);
          throw error;
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Error loading all merged locations:', error);
    throw error;
  }
}

/**
 * Sync load merged location data (for build time or server-side)
 */
export function loadMergedLocationDataSync(
  mainConfig: MainSiteConfig,
  locationData: LocationPage,
  options?: Partial<DeepMergeOptions>
): {
  data: LocationPage;
  validation: ReturnType<typeof validateMergedData>;
  wasMerged: boolean;
} {
  const mergedData = createMergedLocationData(mainConfig, locationData, options);
  const validation = validateMergedData(mergedData);

  return {
    data: mergedData,
    validation,
    wasMerged: true
  };
}

/**
 * Create a location data loader with caching
 */
export class LocationDataLoader {
  private cache = new Map<string, LocationPage>();
  private mainConfigCache: MainSiteConfig | null = null;
  private validationCache = new Map<string, ReturnType<typeof validateMergedData>>();

  constructor(
    private mainConfigPath: string,
    private options?: Partial<DeepMergeOptions>
  ) {}

  /**
   * Load main config (with caching)
   */
  async loadMainConfig(): Promise<MainSiteConfig> {
    if (this.mainConfigCache) {
      return this.mainConfigCache;
    }

    const response = await fetch(this.mainConfigPath);
    if (!response.ok) {
      throw new Error(`Failed to load main config: ${response.statusText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    this.mainConfigCache = await response.json();
    return this.mainConfigCache;
  }

  /**
   * Load merged location data (with caching)
   */
  async loadLocation(locationConfigPath: string): Promise<{
    data: LocationPage;
    validation: ReturnType<typeof validateMergedData>;
    wasMerged: boolean;
  }> {
    const cacheKey = locationConfigPath;
    
    // Check cache
    const cachedData = this.cache.get(cacheKey);
    const cachedValidation = this.validationCache.get(cacheKey);
    
    if (cachedData && cachedValidation) {
      return {
        data: cachedData,
        validation: cachedValidation,
        wasMerged: true
      };
    }

    // Load fresh data
    const mainConfig = await this.loadMainConfig();
    
    const locationResponse = await fetch(locationConfigPath);
    if (!locationResponse.ok) {
      throw new Error(`Failed to load location config: ${locationResponse.statusText}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const locationData: LocationPage = await locationResponse.json();

    const mergedData = createMergedLocationData(mainConfig, locationData, this.options);
    const validation = validateMergedData(mergedData);

    // Cache results
    this.cache.set(cacheKey, mergedData);
    this.validationCache.set(cacheKey, validation);

    return {
      data: mergedData,
      validation,
      wasMerged: true
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.validationCache.clear();
    this.mainConfigCache = null;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    mainConfigCached: boolean;
    locationCount: number;
    totalCacheSize: number;
  } {
    return {
      mainConfigCached: this.mainConfigCache !== null,
      locationCount: this.cache.size,
      totalCacheSize: this.cache.size + (this.mainConfigCache ? 1 : 0)
    };
  }
}

/**
 * Create a default location data loader instance
 */
export function createLocationDataLoader(
  mainConfigPath: string = '/src/data/mdh/site.json',
  options?: Partial<DeepMergeOptions>
): LocationDataLoader {
  return new LocationDataLoader(mainConfigPath, options);
}

/**
 * Utility to get all location file paths
 */
export function getLocationFilePaths(basePath: string = '/src/data/locations'): string[] {
  // This would typically be generated at build time or read from a manifest
  // For now, return the known paths
  return [
    `${basePath}/az/bullhead-city.json`,
    `${basePath}/nv/las-vegas.json`
  ];
}

/**
 * Preload all location data
 */
export async function preloadAllLocationData(
  mainConfigPath: string = '/src/data/mdh/site.json',
  locationBasePath: string = '/src/data/locations',
  options?: Partial<DeepMergeOptions>
): Promise<Array<{
  path: string;
  data: LocationPage;
  validation: ReturnType<typeof validateMergedData>;
  wasMerged: boolean;
}>> {
  const loader = createLocationDataLoader(mainConfigPath, options);
  const locationPaths = getLocationFilePaths(locationBasePath);
  
  const results = await Promise.all(
    locationPaths.map(async (path) => {
      const result = await loader.loadLocation(path);
      return {
        path,
        ...result
      };
    })
  );

  return results;
}
