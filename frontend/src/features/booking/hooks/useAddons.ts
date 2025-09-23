import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toFolderName } from '@/shared/constants';
import { getCardDescription } from '../utils/displayUtils';

export interface AddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface AddonData {
  [key: string]: {
    cost?: number;
    features: string[];
    popular?: boolean;
    description?: string;
  };
}

interface FeatureData {
  [key: string]: {
    name: string;
    description: string;
    explanation: string;
    image: string;
    duration: number;
    features: string[];
  };
}

/**
 * Hook to load addons for a specific vehicle type and category
 */
export const useAddons = (vehicleType: string, category: string) => {
  const [availableAddons, setAvailableAddons] = useState<AddonItem[]>([]);


  const { data, isLoading, error, isFetching, isSuccess, isError } = useQuery({
    queryKey: ['addons', vehicleType, category],
    queryFn: async () => {
      const folderName = toFolderName(vehicleType);
      
      if (!folderName) {
        throw new Error(`No addons available for vehicle type: ${vehicleType}`);
      }

      try {
        // Try to load service.json first (for windows), then fall back to category-specific files
        try {
          const [addonsData, featuresData] = await Promise.all([
            import(`@/data/affiliate-services/${folderName}/addons/${category}/service.json`),
            import(`@/data/affiliate-services/${folderName}/addons/${category}/features.json`)
          ]);
          
          
          return {
            addons: addonsData.default,
            features: featuresData.default,
            type: 'service' as const
          };
        } catch (serviceError) {
          // Try to load category-specific file (wheels.json, trim.json, etc.)
          const categoryData = await import(`@/data/affiliate-services/${folderName}/addons/${category}/${category}.json`);
          
          return {
            addons: categoryData.default,
            features: {},
            type: 'category' as const
          };
        }
      } catch (error) {
        throw new Error(`No addons available for ${category} in ${vehicleType}`);
      }
    },
    enabled: (() => {
      const folderName = toFolderName(vehicleType);
      const enabled = !!vehicleType && !!category && !!folderName;
      return enabled;
    })(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });


  useEffect(() => {
    if (data) {
      let processedAddons: AddonItem[] = [];

      if (data.type === 'service') {
        // Process addons object (windows data structure)
        processedAddons = Object.entries(data.addons).map(([name, addon]: [string, any]) => {
          const featureNames = addon.features.map((featureId: string) => getFeatureName(featureId, data.features));
          const description = getCardDescription(addon, addon.features, data.features);
          
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: addon.cost || 0,
            description: description,
            features: featureNames,
            featureIds: addon.features || [],
            popular: addon.popular || false
          };
        });
      } else {
        // Convert features object to addon array format
        const features = Object.keys(data.addons);
        processedAddons = features.map((featureKey: string, index: number) => {
          const feature = data.addons[featureKey];
          return {
            id: featureKey,
            name: feature.name,
            price: 0, // No pricing in features-only files
            description: feature.description || getCardDescription(feature, [featureKey], {}),
            features: [feature.name], // Use the feature name as the single feature
            featureIds: [featureKey],
            popular: index === 0 // Make first item popular
          };
        });
      }
      
      setAvailableAddons(processedAddons);
    }
  }, [data]);

  return {
    availableAddons,
    isLoading,
    error: error?.message || null
  };
};

/**
 * Helper function to get feature name from feature ID
 */
const getFeatureName = (featureId: string, featuresData: FeatureData): string => {
  return featuresData[featureId]?.name || featureId;
};
