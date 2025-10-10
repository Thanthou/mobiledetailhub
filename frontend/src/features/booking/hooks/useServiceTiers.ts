import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { toFolderName } from '@/shared/constants';

import { getCardDescription } from '../utils/displayUtils';

/**
 * Service tier for booking flow (price in dollars for compatibility)
 * Note: The centralized type uses priceCents
 */
export interface ServiceTier {
  id: string;
  name: string;
  price: number;                   // Price in dollars (legacy format)
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface ServiceEntry {
  cost: number;
  features: string[];
  popular?: boolean;
  description?: string;
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
 * Hook to load service tiers for a specific vehicle type
 */
export const useServiceTiers = (vehicleType: string): {
  serviceTiers: ServiceTier[];
  isLoading: boolean;
  error: string | null;
} => {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);


  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceTiers', vehicleType],
    queryFn: async () => {
      const folderName = toFolderName(vehicleType);
      
      if (!folderName) {
        throw new Error(`No services available for vehicle type: ${vehicleType}`);
      }

      // Dynamically import the services data for the specific vehicle type
      const [servicesModule, featuresModule] = await Promise.all([
        import(`@/data/affiliate-services/${folderName}/service/services.json`),
        import(`@/data/affiliate-services/${folderName}/service/features.json`)
      ]) as [{ default: Record<string, ServiceEntry> }, { default: FeatureData }];

      
      return { 
        services: servicesModule.default, 
        features: featuresModule.default 
      };
    },
    enabled: !!vehicleType && !!toFolderName(vehicleType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });


  // Reset serviceTiers when vehicleType is empty or invalid
  useEffect(() => {
    if (!vehicleType || !toFolderName(vehicleType)) {
      setServiceTiers([]);
    }
  }, [vehicleType]);

  useEffect(() => {
    if (data) {
      try {
        const services = data.services as Record<string, ServiceEntry>;
        const features = data.features as FeatureData;
        
        const processedServices = Object.entries(services).map(([name, service]) => {
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: service.cost,
            description: getCardDescription(service, service.features, features),
            features: service.features.map((featureId: string) => getFeatureName(featureId, features)),
            featureIds: service.features,
            popular: service.popular || false
          };
        });
        
        setServiceTiers(processedServices);
      } catch {
        setServiceTiers([]);
      }
    }
  }, [data]);

  return {
    serviceTiers,
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
