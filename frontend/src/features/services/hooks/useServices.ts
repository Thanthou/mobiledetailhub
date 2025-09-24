import { useNavigate } from 'react-router-dom';
import { Service } from '@/features/services/types/service.types';
import { getServiceImageFromLocation } from '@/shared/utils/schemaUtils';
import siteData from '@/data/mdh/site.json';
import autoDetailingData from '@/data/services/auto-detailing.json';
import marineDetailingData from '@/data/services/marine-detailing.json';
import rvDetailingData from '@/data/services/rv-detailing.json';
import ceramicCoatingData from '@/data/services/ceramic-coating.json';
import paintCorrectionData from '@/data/services/paint-correction.json';
import ppfData from '@/data/services/ppf.json';
import aircraftDetailingData from '@/data/services/aircraft-detailing.json';

// Transform site.json servicesGrid data to Service format with location-specific images
const getServicesFromSiteData = (locationData?: any): Service[] => {
  return siteData.servicesGrid.map((service, index) => {
    // Determine service role for location-specific images
    let serviceRole: "auto" | "marine" | "rv" | null = null;
    if (service.slug.includes('auto-detailing')) {
      serviceRole = 'auto';
    } else if (service.slug.includes('marine-detailing')) {
      serviceRole = 'marine';
    } else if (service.slug.includes('rv-detailing')) {
      serviceRole = 'rv';
    }

    // Get location-specific image if available, otherwise use default
    const imageData = serviceRole && locationData 
      ? getServiceImageFromLocation(locationData, serviceRole, service.image)
      : {
          url: service.image,
          alt: service.alt,
          width: service.width,
          height: service.height,
          priority: service.priority
        };

    return {
      id: (index + 1).toString(),
      title: service.title,
      description: service.alt, // Using alt text as description
      imageUrl: imageData.url,
      route: service.href,
      category: service.slug.split('-')[0] || 'general', // Extract category from slug
      imageWidth: imageData.width,
      imageHeight: imageData.height,
      imagePriority: imageData.priority
    };
  });
};

export const useServices = (locationData?: any) => {
  const navigate = useNavigate();

  const handleServiceClick = (service: Service) => {
    navigate(service.route);
  };

  const getServices = () => {
    return getServicesFromSiteData(locationData);
  };

  const getServiceById = (id: string) => {
    return getServicesFromSiteData(locationData).find(service => service.id === id);
  };

  const getServicesByCategory = (category: string) => {
    return getServicesFromSiteData(locationData).filter(service => service.category === category);
  };

  const getAutoDetailingData = () => {
    return autoDetailingData;
  };

  const getMarineDetailingData = () => {
    return marineDetailingData;
  };

  const getRvDetailingData = () => {
    return rvDetailingData;
  };

  const getCeramicCoatingData = () => {
    return ceramicCoatingData;
  };

  const getPaintCorrectionData = () => {
    return paintCorrectionData;
  };

  const getPpfData = () => {
    return ppfData;
  };

  const getAircraftDetailingData = () => {
    return aircraftDetailingData;
  };

  return {
    services: getServices(),
    handleServiceClick,
    getServiceById,
    getServicesByCategory,
    getAutoDetailingData,
    getMarineDetailingData,
    getRvDetailingData,
    getCeramicCoatingData,
    getPaintCorrectionData,
    getPpfData,
    getAircraftDetailingData
  };
};
