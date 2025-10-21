/**
 * Service Data Loader
 * 
 * Dynamically loads service detail JSON files based on industry and service type
 */

import { ServiceData } from '@/tenant-app/components/services/types/service.types';

/**
 * Load service data for a specific industry and service type
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing')
 * @param serviceType - Service slug (e.g., 'auto-detailing', 'ceramic-coating')
 * @returns ServiceData object or null if not found
 * 
 * @example
 * ```ts
 * const serviceData = await loadServiceData('mobile-detailing', 'auto-detailing');
 * ```
 */
export async function loadServiceData(
  industry: string,
  serviceType: string
): Promise<ServiceData | null> {
  try {
    // Dynamic import based on industry and service type
    const module = await import(`@/data/${industry}/services/${serviceType}.json`);
    return module.default as ServiceData;
  } catch (error) {
    console.error(`Failed to load service data for ${industry}/${serviceType}:`, error);
    return null;
  }
}

/**
 * Get available service types for an industry
 * Note: This requires the services to be defined in the industry's assets.json or config
 */
export function getAvailableServices(industry: string): string[] {
  // Common service types across industries
  // Each industry should have its own service definitions
  switch (industry) {
    case 'mobile-detailing':
      return [
        'auto-detailing',
        'ceramic-coating',
        'paint-correction',
        'ppf',
        'marine-detailing',
        'rv-detailing',
      ];
    case 'maid-service':
      return ['standard-clean', 'deep-clean', 'move-in-out'];
    case 'lawncare':
      return ['mowing', 'fertilization', 'landscaping'];
    case 'pet-grooming':
      return ['bath-brush', 'full-groom', 'deshedding'];
    case 'barber':
      return ['haircut', 'beard-trim', 'shave'];
    default:
      return [];
  }
}

