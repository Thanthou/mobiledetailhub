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
 * @param industry - Industry slug (e.g., 'mobile-detailing', 'maid-service')
 * @returns Promise resolving to industry preview data
 */
export async function loadIndustryPreview(industry: string): Promise<IndustryPreviewData | null> {
  try {
    // Use explicit imports - Vite can't handle fully dynamic template literals
    switch (industry) {
      case 'main': {
        const defaultsModule = await import('./main/defaults.json');
        const defaults = defaultsModule.default;
        return {
          business: {
            businessName: defaults.businessName,
            phone: defaults.phone,
            email: defaults.email,
            city: defaults.city,
            state: defaults.state,
          },
          reviews: defaults.reviews.map((r: any) => ({
            name: r.name,
            rating: r.rating,
            text: r.text,
            date: r.date,
            avatar: r.avatar
          })),
        };
      }
      case 'mobile-detailing': {
        const { getMobileDetailingPreview } = await import('./mobile-detailing/preview/index');
        return getMobileDetailingPreview();
      }
      case 'maid-service': {
        const { getMaidServicePreview } = await import('./maid-service/preview/index');
        return getMaidServicePreview();
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
    'maid-service',
    'lawncare',
    'pet-grooming',
    'barber',
  ];
}

