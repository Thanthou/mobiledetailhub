import { useEffect, useState } from 'react';
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

interface AddonItemData {
  cost?: number;
  features?: string[];
  popular?: boolean;
  description?: string;
  name?: string;
}

interface AddonDataRecord {
  [key: string]: AddonItemData;
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

interface ImportedModule {
  default: AddonDataRecord;
}

interface QueryResultService {
  addons: AddonDataRecord;
  features: FeatureData;
  type: 'service';
}

interface QueryResultCategory {
  addons: AddonDataRecord;
  features: Record<string, never>;
  type: 'category';
}

type QueryResult = QueryResultService | QueryResultCategory;

/**
 * Hook to load addons for a specific vehicle type and category
 */
export const useAddons = (vehicleType: string, category: string) => {
  const [availableAddons, setAvailableAddons] = useState<AddonItem[]>([]);

  const { data, isLoading, error } = useQuery<QueryResult>({
    queryKey: ['addons', vehicleType, category],
    queryFn: async (): Promise<QueryResult> => {
      const folderName = toFolderName(vehicleType);
      
      if (!folderName) {
        throw new Error(`No addons available for vehicle type: ${vehicleType}`);
      }

      try {
        // Try to load service.json first (for windows), then fall back to category-specific files
        try {
          const [addonsData, featuresData] = await Promise.all([
            import(`@/data/mobile-detailing/pricing/${folderName}/addons/${category}/service.json`) as Promise<ImportedModule>,
            import(`@/data/mobile-detailing/pricing/${folderName}/addons/${category}/features.json`) as Promise<{ default: FeatureData }>
          ]);
          
          return {
            addons: addonsData.default,
            features: featuresData.default,
            type: 'service' as const
          };
        } catch {
          // Try to load category-specific file (wheels.json, trim.json, etc.)
          const categoryData = await import(`@/data/mobile-detailing/pricing/${folderName}/addons/${category}/${category}.json`) as Promise<ImportedModule>;
          
          return {
            addons: categoryData.default as AddonDataRecord,
            features: {},
            type: 'category' as const
          };
        }
      } catch {
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
        const serviceData = data as QueryResultService;
        processedAddons = Object.entries(serviceData.addons).map(([name, addon]) => {
          const features = addon.features ?? [];
          const featureNames = features.map((featureId) => getFeatureName(featureId, serviceData.features));
          const description = getCardDescription(addon, features, serviceData.features);
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: typeof addon.cost === 'number' ? addon.cost : 0,
            description: description,
            features: featureNames,
            featureIds: features,
            popular: addon.popular ?? false
          };
        });
      } else {
        // Convert features object to addon array format
        const categoryData = data as QueryResultCategory;
        const features = Object.keys(categoryData.addons);
        processedAddons = features.map((featureKey, index) => {
          const feature = categoryData.addons[featureKey];
          if (!feature) {
            return {
              id: featureKey,
              name: featureKey,
              price: 0,
              description: '',
              features: [],
              featureIds: [featureKey],
              popular: false
            };
          }
          return {
            id: featureKey,
            name: feature.name ?? featureKey,
            price: 0, // No pricing in features-only files
            description: feature.description ?? getCardDescription(feature, [featureKey], {}),
            features: feature.name ? [feature.name] : [], // Use the feature name as the single feature
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
