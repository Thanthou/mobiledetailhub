import { useNavigate, useParams } from 'react-router-dom';

import autoDetailingData from '@/data/mobile-detailing/services/auto-detailing.json';
import ceramicCoatingData from '@/data/mobile-detailing/services/ceramic-coating.json';
import marineDetailingData from '@/data/mobile-detailing/services/marine-detailing.json';
import paintCorrectionData from '@/data/mobile-detailing/services/paint-correction.json';
import ppfData from '@/data/mobile-detailing/services/ppf.json';
import rvDetailingData from '@/data/mobile-detailing/services/rv-detailing.json';
import siteData from '@/data/mobile-detailing/site.json';
import { Service } from '@/features/services/types/service.types';
import type { LocationPage } from '@/shared/types/location';
import { getServiceImageFromLocation } from '@/shared/utils/schemaUtils';

// Transform site.json servicesGrid data to Service format with location-specific images
const getServicesFromSiteData = (locationData: LocationPage | null | undefined, tenantSlug?: string): Service[] => {
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

    // Construct route based on environment
    // Development: /{tenantSlug}/services/{serviceSlug}
    // Production: /services/{serviceSlug}
    const route = import.meta.env.DEV && tenantSlug
      ? `/${tenantSlug}/services/${service.slug}`
      : `/services/${service.slug}`;
    

    return {
      id: (index + 1).toString(),
      title: service.title,
      description: service.alt, // Using alt text as description
      imageUrl: imageData.url,
      route: route,
      category: service.slug.split('-')[0] || 'general', // Extract category from slug
      imageWidth: imageData.width,
      imageHeight: imageData.height,
      imagePriority: imageData.priority
    };
  });
};

export const useServices = (locationData: LocationPage | null | undefined) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const handleServiceClick = (service: Service) => {
    void navigate(service.route);
  };

  const getServices = () => {
    return getServicesFromSiteData(locationData, slug);
  };

  const getServiceById = (id: string) => {
    return getServicesFromSiteData(locationData, slug).find(service => service.id === id);
  };

  const getServicesByCategory = (category: string) => {
    return getServicesFromSiteData(locationData, slug).filter(service => service.category === category);
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
  };
};
