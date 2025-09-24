import { useParams } from 'react-router-dom';
import { useServices } from './useServices';
import { ServiceData } from '@/features/services/types/service.types';

export const useServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getAutoDetailingData, getMarineDetailingData, getRvDetailingData, getCeramicCoatingData, getPaintCorrectionData, getPpfData, getAircraftDetailingData } = useServices();
  
  // Load the appropriate service data based on slug
  const getServiceData = (): ServiceData | null => {
    switch (slug) {
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
        return getAircraftDetailingData();
      // Add other services as you create their JSON files
      default:
        // Fallback to auto-detailing for unknown services
        return getAutoDetailingData();
    }
  };

  const serviceData = getServiceData();

  return {
    slug,
    serviceData,
    isLoading: false,
    error: null
  };
};
