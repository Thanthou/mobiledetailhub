/**
 * Service Data Loader
 * 
 * Dynamically loads service detail JSON files based on industry and service type
 */

import { ServiceData } from '@shared/components/services/types/service.types';

/**
 * Map service URL slugs to file names
 * Some services have shorter file names than their URL slugs
 */
const SERVICE_FILE_MAPPINGS: Record<string, string> = {
  'paint-protection-film': 'ppf',
  'ppf-installation': 'ppf',
  // Add more mappings as needed
};

/**
 * Load service data for a specific industry and service type
 * 
 * @param industry - Industry slug (e.g., 'mobile-detailing')
 * @param serviceType - Service slug (e.g., 'auto-detailing', 'paint-protection-film')
 * @returns ServiceData object or null if not found
 * 
 * @example
 * ```ts
 * const serviceData = await loadServiceData('mobile-detailing', 'auto-detailing');
 * const ppfData = await loadServiceData('mobile-detailing', 'paint-protection-film');
 * ```
 */
export async function loadServiceData(
  industry: string,
  serviceType: string
): Promise<ServiceData | null> {
  try {
    // Map URL slug to file name if needed
    const fileName = SERVICE_FILE_MAPPINGS[serviceType] || serviceType;
    
    // Dynamic import based on industry and service type
    const module = await import(`@/data/${industry}/services/${fileName}.json`);
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

