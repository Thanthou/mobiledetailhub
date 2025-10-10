import { useParams } from 'react-router-dom';

import { ServiceData } from '@/features/services/types/service.types';

import { useServices } from './useServices';

export const useServicePage = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const { getAutoDetailingData, getMarineDetailingData, getRvDetailingData, getCeramicCoatingData, getPaintCorrectionData, getPpfData } = useServices();
  
  
  // Load the appropriate service data based on serviceType
  const getServiceData = (): ServiceData | null => {
    switch (serviceType) {
      case 'auto-detailing':
        return getAutoDetailingData();
      case 'marine-detailing':
        return getMarineDetailingData();
      case 'rv-detailing':
        return getRvDetailingData();
      case 'ceramic-coating':
        return getCeramicCoatingData();
      case 'paint-correction':
        return getPaintCorrectionData();
      case 'paint-protection-film':
      case 'ppf-installation':
        return getPpfData();
      case 'aircraft-detailing':
        // Aircraft detailing not implemented yet, fallback to auto-detailing
        return getAutoDetailingData();
      // Add other services as you create their JSON files
      default:
        // Fallback to auto-detailing for unknown services
        return getAutoDetailingData();
    }
  };

  const serviceData = getServiceData();

  return {
    serviceType,
    serviceData,
    isLoading: false,
    error: null
  };
};
