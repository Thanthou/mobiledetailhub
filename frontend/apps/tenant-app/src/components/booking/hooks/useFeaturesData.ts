import { useQuery } from '@tanstack/react-query';

interface UseFeaturesDataProps {
  isOpen: boolean;
  vehicleType: string;
  category?: string | undefined;
  itemType: 'service' | 'addon';
}

interface FeatureDataItem {
  name: string;
  description: string;
  explanation: string;
  image: string;
  duration: number;
  features: string[];
}

interface FeaturesDataRecord {
  [key: string]: FeatureDataItem;
}

interface ImportedFeaturesModule {
  default: FeaturesDataRecord;
}

/**
 * Async function to load features data
 */
const loadFeaturesData = async (vehicleType: string, category?: string, itemType: 'service' | 'addon' = 'service'): Promise<FeaturesDataRecord> => {
  const vehicleFolderMap: Record<string, string> = {
    'car': 'cars',
    'truck': 'trucks',
    'suv': 'suvs',
    'boat': 'boats',
    'rv': 'rvs'
  };

  const folderName = vehicleFolderMap[vehicleType];
  if (!folderName) {
    throw new Error(`No features available for vehicle type: ${vehicleType}`);
  }

  let featuresModule: ImportedFeaturesModule | undefined;
        
  if (itemType === 'service') {
    // Service features - static imports to avoid Vite warnings
    // TODO: Make this industry-agnostic by using DataContext to get industry
    switch (folderName) {
      case 'cars':
        featuresModule = await import('@data/mobile-detailing/pricing/cars/service/features.json') as ImportedFeaturesModule;
        break;
      case 'trucks':
        featuresModule = await import('@data/mobile-detailing/pricing/trucks/service/features.json') as ImportedFeaturesModule;
        break;
      case 'suvs':
        featuresModule = await import('@data/mobile-detailing/pricing/suvs/service/features.json') as ImportedFeaturesModule;
        break;
      case 'rvs':
        featuresModule = await import('@data/mobile-detailing/pricing/rvs/service/features.json') as ImportedFeaturesModule;
        break;
      case 'boats':
        featuresModule = await import('@data/mobile-detailing/pricing/boats/service/features.json') as ImportedFeaturesModule;
        break;
    }
  } else {
    // Addon features - only import files that exist
    // TODO: Make this industry-agnostic by using DataContext to get industry
    switch (folderName) {
      case 'cars':
        switch (category) {
          case 'windows':
            featuresModule = await import('@data/mobile-detailing/pricing/cars/addons/windows/features.json') as ImportedFeaturesModule;
            break;
          case 'wheels':
            featuresModule = await import('@data/mobile-detailing/pricing/cars/addons/wheels/features.json') as ImportedFeaturesModule;
            break;
          case 'trim':
            featuresModule = await import('@data/mobile-detailing/pricing/cars/addons/trim/features.json') as ImportedFeaturesModule;
            break;
          case 'engine':
            featuresModule = await import('@data/mobile-detailing/pricing/cars/addons/engine/features.json') as ImportedFeaturesModule;
            break;
        }
        break;
      case 'trucks':
        switch (category) {
          case 'windows':
            featuresModule = await import('@data/mobile-detailing/pricing/trucks/addons/windows/features.json') as ImportedFeaturesModule;
            break;
          case 'wheels':
            featuresModule = await import('@data/mobile-detailing/pricing/trucks/addons/wheels/features.json') as ImportedFeaturesModule;
            break;
          case 'trim':
            featuresModule = await import('@data/mobile-detailing/pricing/trucks/addons/trim/features.json') as ImportedFeaturesModule;
            break;
          case 'engine':
            featuresModule = await import('@data/mobile-detailing/pricing/trucks/addons/engine/features.json') as ImportedFeaturesModule;
            break;
        }
        break;
      case 'suvs':
        switch (category) {
          case 'windows':
            featuresModule = await import('@data/mobile-detailing/pricing/suvs/addons/windows/features.json') as ImportedFeaturesModule;
            break;
          case 'wheels':
            featuresModule = await import('@data/mobile-detailing/pricing/suvs/addons/wheels/features.json') as ImportedFeaturesModule;
            break;
          case 'trim':
            featuresModule = await import('@data/mobile-detailing/pricing/suvs/addons/trim/features.json') as ImportedFeaturesModule;
            break;
          case 'engine':
            featuresModule = await import('@data/mobile-detailing/pricing/suvs/addons/engine/features.json') as ImportedFeaturesModule;
            break;
        }
        break;
      // boats and rvs don't have addon features yet
    }
  }
  
  if (!featuresModule) {
    throw new Error(`No features data available for ${itemType} ${vehicleType}${category ? ` ${category}` : ''}`);
  }
  
  return featuresModule.default;
};

/**
 * Hook to load features data with React Query
 */
export const useFeaturesData = ({ isOpen, vehicleType, category, itemType }: UseFeaturesDataProps) => {
  return useQuery({
    queryKey: ['booking','featuresData', vehicleType, category, itemType],
    queryFn: () => loadFeaturesData(vehicleType, category, itemType),
    enabled: isOpen && !!vehicleType,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
