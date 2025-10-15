import { useEffect, useState } from 'react';

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

export const useFeaturesData = ({ isOpen, vehicleType, category, itemType }: UseFeaturesDataProps) => {
  const [featuresData, setFeaturesData] = useState<FeaturesDataRecord | null>(null);

  useEffect(() => {
    if (isOpen && vehicleType) {
      void loadFeaturesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadFeaturesData is defined inside the effect to use current prop values
  }, [isOpen, vehicleType, category, itemType]);

  const loadFeaturesData = async (): Promise<void> => {
    try {
      const vehicleFolderMap: Record<string, string> = {
        'car': 'cars',
        'truck': 'trucks',
        'suv': 'suvs',
        'boat': 'boats',
        'rv': 'rvs'
      };

      const folderName = vehicleFolderMap[vehicleType];
      if (folderName) {
        let featuresModule: ImportedFeaturesModule | undefined;
        
        if (itemType === 'service') {
          // Service features - static imports to avoid Vite warnings
          // TODO: Make this industry-agnostic by using DataContext to get industry
          switch (folderName) {
            case 'cars':
              featuresModule = await import('@/data/mobile-detailing/pricing/cars/service/features.json') as ImportedFeaturesModule;
              break;
            case 'trucks':
              featuresModule = await import('@/data/mobile-detailing/pricing/trucks/service/features.json') as ImportedFeaturesModule;
              break;
            case 'suvs':
              featuresModule = await import('@/data/mobile-detailing/pricing/suvs/service/features.json') as ImportedFeaturesModule;
              break;
            case 'rvs':
              featuresModule = await import('@/data/mobile-detailing/pricing/rvs/service/features.json') as ImportedFeaturesModule;
              break;
            case 'boats':
              featuresModule = await import('@/data/mobile-detailing/pricing/boats/service/features.json') as ImportedFeaturesModule;
              break;
          }
        } else {
          // Addon features - only import files that exist
          // TODO: Make this industry-agnostic by using DataContext to get industry
          switch (folderName) {
            case 'cars':
              switch (category) {
                case 'windows':
                  featuresModule = await import('@/data/mobile-detailing/pricing/cars/addons/windows/features.json') as ImportedFeaturesModule;
                  break;
                case 'wheels':
                  featuresModule = await import('@/data/mobile-detailing/pricing/cars/addons/wheels/features.json') as ImportedFeaturesModule;
                  break;
                case 'trim':
                  featuresModule = await import('@/data/mobile-detailing/pricing/cars/addons/trim/features.json') as ImportedFeaturesModule;
                  break;
                case 'engine':
                  featuresModule = await import('@/data/mobile-detailing/pricing/cars/addons/engine/features.json') as ImportedFeaturesModule;
                  break;
              }
              break;
            case 'trucks':
              switch (category) {
                case 'windows':
                  featuresModule = await import('@/data/mobile-detailing/pricing/trucks/addons/windows/features.json') as ImportedFeaturesModule;
                  break;
                case 'wheels':
                  featuresModule = await import('@/data/mobile-detailing/pricing/trucks/addons/wheels/features.json') as ImportedFeaturesModule;
                  break;
                case 'trim':
                  featuresModule = await import('@/data/mobile-detailing/pricing/trucks/addons/trim/features.json') as ImportedFeaturesModule;
                  break;
                case 'engine':
                  featuresModule = await import('@/data/mobile-detailing/pricing/trucks/addons/engine/features.json') as ImportedFeaturesModule;
                  break;
              }
              break;
            case 'suvs':
              switch (category) {
                case 'windows':
                  featuresModule = await import('@/data/mobile-detailing/pricing/suvs/addons/windows/features.json') as ImportedFeaturesModule;
                  break;
                case 'wheels':
                  featuresModule = await import('@/data/mobile-detailing/pricing/suvs/addons/wheels/features.json') as ImportedFeaturesModule;
                  break;
                case 'trim':
                  featuresModule = await import('@/data/mobile-detailing/pricing/suvs/addons/trim/features.json') as ImportedFeaturesModule;
                  break;
                case 'engine':
                  featuresModule = await import('@/data/mobile-detailing/pricing/suvs/addons/engine/features.json') as ImportedFeaturesModule;
                  break;
              }
              break;
            // boats and rvs don't have addon features yet
          }
        }
        
        if (featuresModule) {
          setFeaturesData(featuresModule.default);
        }
      }
    } catch (importError) {
      // Silently handle import errors - features data is optional
      console.error('Failed to load features data:', importError);
    }
  };

  return featuresData;
};
