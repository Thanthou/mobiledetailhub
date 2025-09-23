import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toFolderName } from '@/shared/constants';
import { getCardDescription } from '../utils/displayUtils';

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface ServiceData {
  [key: string]: {
    cost: number;
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
 * Hook to load service tiers for a specific vehicle type
 */
export const useServiceTiers = (vehicleType: string) => {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);


  const { data, isLoading, error, isFetching, isSuccess, isError } = useQuery({
    queryKey: ['serviceTiers', vehicleType],
    queryFn: async () => {
      const folderName = toFolderName(vehicleType);
      
      if (!folderName) {
        throw new Error(`No services available for vehicle type: ${vehicleType}`);
      }

      // Dynamically import the services data for the specific vehicle type
      const [servicesData, featuresData] = await Promise.all([
        import(`@/data/affiliate-services/${folderName}/service/services.json`),
        import(`@/data/affiliate-services/${folderName}/service/features.json`)
      ]);

      
      return { services: servicesData.default, features: featuresData.default };
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
        const processedServices = Object.entries(data.services).map(([name, service]: [string, any]) => {
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: service.cost,
            description: getCardDescription(service, service.features, data.features),
            features: service.features.map((featureId: string) => getFeatureName(featureId, data.features)),
            featureIds: service.features,
            popular: service.popular || false
          };
        });
        
        setServiceTiers(processedServices);
      } catch (error) {
        setServiceTiers([]);
      }
    }
  }, [data]);

  // Consider loading if query is loading OR if we have data but haven't processed it yet
  const isActuallyLoading = isLoading || (data && serviceTiers.length === 0);
  
  
  return {
    serviceTiers,
    isLoading: isActuallyLoading,
    error: error?.message || null
  };
};

/**
 * Helper function to get feature name from feature ID
 */
const getFeatureName = (featureId: string, featuresData: FeatureData): string => {
  return featuresData[featureId]?.name || featureId;
};
