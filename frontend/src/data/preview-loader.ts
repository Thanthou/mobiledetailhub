/**
 * Industry Preview Data Loader
 * 
 * Loads preview data for any industry (business info and reviews only)
 * 
 * Note: FAQs and Services use existing dynamic loaders, not preview data
 */

import type { IndustryPreviewData } from './preview-types';

/**
 * Load preview data for a specific industry
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing', 'house-cleaning')
 * @returns Promise resolving to industry preview data
 */
export async function loadIndustryPreview(industry: string): Promise<IndustryPreviewData | null> {
  try {
    // Use explicit imports - Vite can't handle fully dynamic template literals
    switch (industry) {
      case 'mobile-detailing': {
        const { getMobileDetailingPreview } = await import('./mobile-detailing/preview/index');
        return getMobileDetailingPreview();
      }
      case 'house-cleaning': {
        const { getHouseCleaningPreview } = await import('./house-cleaning/preview/index');
        return getHouseCleaningPreview();
      }
      case 'lawncare': {
        const { getLawncarePreview } = await import('./lawncare/preview/index');
        return getLawncarePreview();
      }
      case 'pet-grooming': {
        const { getPetGroomingPreview } = await import('./pet-grooming/preview/index');
        return getPetGroomingPreview();
      }
      case 'barber': {
        const { getBarberPreview } = await import('./barber/preview/index');
        return getBarberPreview();
      }
      default:
        console.warn(`Unknown industry: ${industry}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load preview data for ${industry}:`, error);
    return null;
  }
}

/**
 * Get list of available industries with preview data
 */
export function getAvailableIndustries(): string[] {
  return [
    'mobile-detailing',
    'house-cleaning',
    'lawncare',
    'pet-grooming',
    'barber',
  ];
}

