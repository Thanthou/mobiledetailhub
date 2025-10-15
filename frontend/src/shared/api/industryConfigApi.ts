/**
 * Industry Configuration API
 * 
 * Single responsibility: Load industry-specific site configurations
 * All industries now use modular config approach via index.ts loaders
 */

import type { MainSiteConfig } from '@/shared/types/location';

/**
 * Fetch site configuration for a given industry
 * Uses modular config loaders for all industries
 * 
 * @param industry - Industry identifier (e.g., 'mobile-detailing', 'pet-grooming')
 * @returns MainSiteConfig object or null if not found
 * 
 * @example
 * ```ts
 * const config = await fetchIndustryConfig('mobile-detailing');
 * console.log(config.hero.h1);
 * ```
 */
export async function fetchIndustryConfig(industry: string): Promise<MainSiteConfig | null> {
  try {
    // All industries now use modular config files with index.ts loaders
    switch (industry) {
      case 'mobile-detailing': {
        const { loadMobileDetailingConfig } = await import('@/data/mobile-detailing');
        return loadMobileDetailingConfig();
      }
      
      case 'pet-grooming': {
        const { loadPetGroomingConfig } = await import('@/data/pet-grooming');
        return await loadPetGroomingConfig();
      }
      
      case 'maid-service': {
        const { loadMaidServiceConfig } = await import('@/data/maid-service');
        return await loadMaidServiceConfig();
      }
      
      case 'lawncare': {
        const { loadLawncareConfig } = await import('@/data/lawncare');
        return await loadLawncareConfig();
      }
      
      default:
        console.warn(`Unknown industry: ${industry}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load config for industry: ${industry}`, error);
    return null;
  }
}

