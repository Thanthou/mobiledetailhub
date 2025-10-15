import { useNavigate, useParams } from 'react-router-dom';

import assetsData from '@/data/mobile-detailing/assets.json';
import autoDetailingData from '@/data/mobile-detailing/services/auto-detailing.json';
import ceramicCoatingData from '@/data/mobile-detailing/services/ceramic-coating.json';
import marineDetailingData from '@/data/mobile-detailing/services/marine-detailing.json';
import paintCorrectionData from '@/data/mobile-detailing/services/paint-correction.json';
import ppfData from '@/data/mobile-detailing/services/ppf.json';
import rvDetailingData from '@/data/mobile-detailing/services/rv-detailing.json';
import { Service } from '@/features/services/types/service.types';
import { env } from '@/shared/env';
import type { LocationPage } from '@/shared/types/location';
import { getServiceImageFromLocation } from '@/shared/utils/schemaUtils';

// Transform assets.json services.grid data to Service format with location-specific images
const getServicesFromSiteData = (locationData: LocationPage | null | undefined, tenantSlug?: string): Service[] => {
  return assetsData.services.grid.map((service, index) => {
    // Get thumbnail data for this service
    const thumbnail = assetsData.services.thumbnails[service.slug as keyof typeof assetsData.services.thumbnails];
    // Determine service role for location-specific images
    let serviceRole: "auto" | "marine" | "rv" | null = null;
    if (service.slug.includes('auto-detailing')) {
      serviceRole = 'auto';
    } else if (service.slug.includes('marine-detailing')) {
      serviceRole = 'marine';
    } else if (service.slug.includes('rv-detailing')) {
      serviceRole = 'rv';
    }

    // Get location-specific image if available, otherwise use default thumbnail
    const imageData = serviceRole && locationData 
      ? getServiceImageFromLocation(locationData, serviceRole, thumbnail.url || '')
      : {
          url: thumbnail.url || '',
          alt: thumbnail.alt || '',
          width: thumbnail.width || 400,
          height: thumbnail.height || 300,
          priority: service.priority
        };

    // Construct route based on environment
    // Development: /{tenantSlug}/services/{serviceSlug}
    // Production: /services/{serviceSlug}
    const route = env.DEV && tenantSlug
      ? `/${tenantSlug}/services/${service.slug}`
      : `/services/${service.slug}`;
    

    return {
      id: (index + 1).toString(),
      title: service.title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- service.alt from JSON, type refinement planned
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
