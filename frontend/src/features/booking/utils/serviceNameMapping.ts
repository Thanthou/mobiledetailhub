import carServices from '@/data/affiliate-services/cars/service.json';
import { CAR_ADDON_SERVICE_OPTIONS } from '@/data/affiliate-services/cars/addons/features';
import wheelsData from '@/data/affiliate-services/cars/addons/wheels.json';
import windowsData from '@/data/affiliate-services/cars/addons/windows.json';
import trimData from '@/data/affiliate-services/cars/addons/trim.json';


// Create a mapping from service keys to display names
const serviceNameMap: Record<string, string> = {};

// Populate the mapping from the car services JSON
Object.entries(carServices).forEach(([key, service]) => {
  serviceNameMap[key] = service.name;
});

// Add addon services to the mapping
CAR_ADDON_SERVICE_OPTIONS.forEach(addon => {
  serviceNameMap[addon.id] = addon.name;
});

/**
 * Maps a service key to its human-readable display name
 * @param serviceKey - The service key (e.g., 'full-exterior-detail')
 * @param addonType - Optional addon type to prioritize specific JSON files
 * @returns The display name (e.g., 'Full Exterior Detail') or the original key if not found
 */
export const getServiceDisplayName = (serviceKey: string, addonType?: 'wheels' | 'windows' | 'trim'): string => {
  // If addonType is specified, check that specific JSON file first
  if (addonType === 'wheels') {
    const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
    if (wheelsService?.name) {
      return wheelsService.name;
    }
  } else if (addonType === 'windows') {
    const windowsService = windowsData[serviceKey as keyof typeof windowsData];
    if (windowsService?.name) {
      return windowsService.name;
    }
  } else if (addonType === 'trim') {
    const trimService = trimData[serviceKey as keyof typeof trimData];
    if (trimService?.name) {
      return trimService.name;
    }
  }
  
  // Fallback to the original mapping
  return serviceNameMap[serviceKey] || serviceKey;
};

/**
 * Maps an array of service keys to their display names
 * @param serviceKeys - Array of service keys
 * @param addonType - Optional addon type to prioritize specific JSON files
 * @returns Array of display names
 */
export const getServiceDisplayNames = (serviceKeys: string[], addonType?: 'wheels' | 'windows' | 'trim'): string[] => {
  return serviceKeys.map(key => getServiceDisplayName(key, addonType));
};

/**
 * Gets the features array for a specific service key
 * @param serviceKey - The service key (e.g., 'full-exterior-detail')
 * @param addonType - Optional addon type to prioritize specific JSON files
 * @returns Array of features or empty array if not found
 */
export const getServiceFeatures = (serviceKey: string, addonType?: 'wheels' | 'windows' | 'trim'): string[] => {
  // If addonType is specified, check that specific JSON file first
  if (addonType === 'wheels') {
    const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
    if (wheelsService?.features) {
      return wheelsService.features;
    }
  } else if (addonType === 'windows') {
    const windowsService = windowsData[serviceKey as keyof typeof windowsData];
    if (windowsService?.features) {
      return windowsService.features;
    }
  } else if (addonType === 'trim') {
    const trimService = trimData[serviceKey as keyof typeof trimData];
    if (trimService?.features) {
      return trimService.features;
    }
  }
  
  // Check raw JSON files for addon services (fallback order)
  const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
  if (wheelsService?.features) {
    return wheelsService.features;
  }
  
  const windowsService = windowsData[serviceKey as keyof typeof windowsData];
  if (windowsService?.features) {
    return windowsService.features;
  }
  
  const trimService = trimData[serviceKey as keyof typeof trimData];
  if (trimService?.features) {
    return trimService.features;
  }
  
  // Then check main car services
  const mainService = carServices[serviceKey as keyof typeof carServices];
  if (mainService?.features) {
    return mainService.features;
  }
  
  // Fallback to processed addon services
  const addonService = CAR_ADDON_SERVICE_OPTIONS.find(addon => addon.id === serviceKey);
  if (addonService?.features) {
    return addonService.features;
  }
  
  return [];
};

/**
 * Gets the description for a specific service key
 * @param serviceKey - The service key (e.g., 'full-exterior-detail')
 * @param addonType - Optional addon type to prioritize specific JSON files
 * @returns Description string or empty string if not found
 */
export const getServiceDescription = (serviceKey: string, addonType?: 'wheels' | 'windows' | 'trim'): string => {
  // If addonType is specified, check that specific JSON file first
  if (addonType === 'wheels') {
    const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
    if (wheelsService?.description) {
      return wheelsService.description;
    }
  } else if (addonType === 'windows') {
    const windowsService = windowsData[serviceKey as keyof typeof windowsData];
    if (windowsService?.description) {
      return windowsService.description;
    }
  } else if (addonType === 'trim') {
    const trimService = trimData[serviceKey as keyof typeof trimData];
    if (trimService?.description) {
      return trimService.description;
    }
  }
  
  // Check raw JSON files for addon services (fallback order)
  const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
  if (wheelsService?.description) {
    return wheelsService.description;
  }
  
  const windowsService = windowsData[serviceKey as keyof typeof windowsData];
  if (windowsService?.description) {
    return windowsService.description;
  }
  
  const trimService = trimData[serviceKey as keyof typeof trimData];
  if (trimService?.description) {
    return trimService.description;
  }
  
  // Then check main car services
  const mainService = carServices[serviceKey as keyof typeof carServices];
  if (mainService?.description) {
    return mainService.description;
  }
  
  // Fallback to processed addon services
  const addonService = CAR_ADDON_SERVICE_OPTIONS.find(addon => addon.id === serviceKey);
  if (addonService?.description) {
    return addonService.description;
  }
  
  return '';
};

/**
 * Gets the explanation for a specific service key
 * @param serviceKey - The service key (e.g., 'full-exterior-detail')
 * @param addonType - Optional addon type to prioritize specific JSON files
 * @returns Explanation string or empty string if not found
 */
export const getServiceExplanation = (serviceKey: string, addonType?: 'wheels' | 'windows' | 'trim'): string => {
  // If addonType is specified, check that specific JSON file first
  if (addonType === 'wheels') {
    const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
    if (wheelsService?.explanation) {
      return wheelsService.explanation;
    }
  } else if (addonType === 'windows') {
    const windowsService = windowsData[serviceKey as keyof typeof windowsData];
    if (windowsService?.explanation) {
      return windowsService.explanation;
    }
  } else if (addonType === 'trim') {
    const trimService = trimData[serviceKey as keyof typeof trimData];
    if (trimService?.explanation) {
      return trimService.explanation;
    }
  }
  
  // Check raw JSON files for addon services (fallback order)
  const wheelsService = wheelsData[serviceKey as keyof typeof wheelsData];
  if (wheelsService?.explanation) {
    return wheelsService.explanation;
  }
  
  const windowsService = windowsData[serviceKey as keyof typeof windowsData];
  if (windowsService?.explanation) {
    return windowsService.explanation;
  }
  
  const trimService = trimData[serviceKey as keyof typeof trimData];
  if (trimService?.explanation) {
    return trimService.explanation;
  }
  
  // Then check main car services
  const mainService = carServices[serviceKey as keyof typeof carServices];
  if (mainService?.explanation) {
    return mainService.explanation;
  }
  
  // Fallback to processed addon services
  const addonService = CAR_ADDON_SERVICE_OPTIONS.find(addon => addon.id === serviceKey);
  if (addonService?.explanation) {
    return addonService.explanation;
  }
  
  return '';
};
