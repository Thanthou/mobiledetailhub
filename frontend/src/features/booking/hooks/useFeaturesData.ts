import { useState, useEffect } from 'react';

interface UseFeaturesDataProps {
  isOpen: boolean;
  vehicleType: string;
  category?: string | undefined;
  itemType: 'service' | 'addon';
}

export const useFeaturesData = ({ isOpen, vehicleType, category, itemType }: UseFeaturesDataProps) => {
  const [featuresData, setFeaturesData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && vehicleType) {
      loadFeaturesData();
    }
  }, [isOpen, vehicleType, category, itemType]);

  const loadFeaturesData = async () => {
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
        let featuresData;
        
        if (itemType === 'service') {
          // Service features - static imports to avoid Vite warnings
          switch (folderName) {
            case 'cars':
              featuresData = await import('@/data/affiliate-services/cars/service/features.json');
              break;
            case 'trucks':
              featuresData = await import('@/data/affiliate-services/trucks/service/features.json');
              break;
            case 'suvs':
              featuresData = await import('@/data/affiliate-services/suvs/service/features.json');
              break;
            case 'rvs':
              featuresData = await import('@/data/affiliate-services/rvs/service/features.json');
              break;
            // boats doesn't have service features yet
          }
        } else {
          // Addon features - only import files that exist
          switch (folderName) {
            case 'cars':
              switch (category) {
                case 'windows':
                  featuresData = await import('@/data/affiliate-services/cars/addons/windows/features.json');
                  break;
                case 'wheels':
                  featuresData = await import('@/data/affiliate-services/cars/addons/wheels/features.json');
                  break;
                case 'trim':
                  featuresData = await import('@/data/affiliate-services/cars/addons/trim/features.json');
                  break;
                case 'engine':
                  featuresData = await import('@/data/affiliate-services/cars/addons/engine/features.json');
                  break;
              }
              break;
            case 'trucks':
              switch (category) {
                case 'windows':
                  featuresData = await import('@/data/affiliate-services/trucks/addons/windows/features.json');
                  break;
                case 'wheels':
                  featuresData = await import('@/data/affiliate-services/trucks/addons/wheels/features.json');
                  break;
                case 'trim':
                  featuresData = await import('@/data/affiliate-services/trucks/addons/trim/features.json');
                  break;
                case 'engine':
                  featuresData = await import('@/data/affiliate-services/trucks/addons/engine/features.json');
                  break;
              }
              break;
            case 'suvs':
              switch (category) {
                case 'windows':
                  featuresData = await import('@/data/affiliate-services/suvs/addons/windows/features.json');
                  break;
                case 'wheels':
                  featuresData = await import('@/data/affiliate-services/suvs/addons/wheels/features.json');
                  break;
                case 'trim':
                  featuresData = await import('@/data/affiliate-services/suvs/addons/trim/features.json');
                  break;
                case 'engine':
                  featuresData = await import('@/data/affiliate-services/suvs/addons/engine/features.json');
                  break;
              }
              break;
            // boats and rvs don't have addon features yet
          }
        }
        
        if (featuresData) {
          setFeaturesData(featuresData.default);
        }
      }
    } catch (error) {
      console.error(`❌ Error loading features for ${vehicleType}/${category || 'service'}:`, error);
    }
  };

  return featuresData;
};
