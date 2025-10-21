import { useNavigate } from 'react-router-dom';

import { Service } from '@tenant-app/components/services/types/service.types';
import { env } from '@shared/env';
import { useTenantSlug } from '@shared/hooks/useTenantSlug';
import type { LocationPage } from '@shared/types/location';
import { getServiceImageFromLocation } from '@shared/utils/schemaUtils';
import { usePreviewData } from '@tenant-app/contexts/PreviewDataProvider';
import { useData } from '@shared/hooks';

// Transform config servicesGrid to Service format with location-specific images
const getServicesFromSiteData = (
  siteConfig: any,
  locationData: LocationPage | null | undefined, 
  tenantSlug?: string,
  isPreview?: boolean,
  industry?: string | null
): Service[] => {
  // Check for servicesGrid (MainSiteConfig) or services.grid (legacy assets.json)
  const servicesGrid = siteConfig?.servicesGrid || siteConfig?.services?.grid;
  
  if (!servicesGrid || !Array.isArray(servicesGrid)) {
    return [];
  }
  
  return servicesGrid.map((service: any, index: number) => {
    // For MainSiteConfig, the service already has image/alt
    // For legacy assets.json, we need to get thumbnail data
    const thumbnail = siteConfig?.services?.thumbnails?.[service.slug] || {};
    // Determine service role for location-specific images
    let serviceRole: "auto" | "marine" | "rv" | null = null;
    if (service.slug.includes('auto-detailing')) {
      serviceRole = 'auto';
    } else if (service.slug.includes('marine-detailing')) {
      serviceRole = 'marine';
    } else if (service.slug.includes('rv-detailing')) {
      serviceRole = 'rv';
    }

    // Get image URL - MainSiteConfig uses 'image', legacy uses thumbnail.url
    const imageUrl = service.image || thumbnail.url || '';
    const imageAlt = service.alt || thumbnail.alt || service.title || '';
    const imageWidth = service.width || thumbnail.width || 400;
    const imageHeight = service.height || thumbnail.height || 300;
    
    // Get location-specific image if available, otherwise use default
    const imageData = serviceRole && locationData 
      ? getServiceImageFromLocation(locationData, serviceRole, imageUrl)
      : {
          url: imageUrl,
          alt: imageAlt,
          width: imageWidth,
          height: imageHeight,
          priority: service.priority
        };

    // Construct route based on context
    let route: string;
    if (isPreview && industry) {
      // Preview mode: /{industry}-preview/services/{serviceSlug}
      route = `/${industry}-preview/services/${service.slug}`;
    } else if (service.href) {
      // Use href from config if available
      route = service.href;
    } else if (env.DEV && tenantSlug) {
      // Dev mode: /{tenantSlug}/services/{serviceSlug}
      route = `/${tenantSlug}/services/${service.slug}`;
    } else {
      // Production: /service/${serviceSlug}
      route = `/service/${service.slug}`;
    }
    

    const serviceData = {
      id: (index + 1).toString(),
      title: service.title,
      description: imageAlt, // Using alt text as description
      imageUrl: imageData.url,
      route: route,
      category: service.slug?.split('-')[0] || 'general', // Extract category from slug
      imageWidth: imageData.width,
      imageHeight: imageData.height,
      imagePriority: imageData.priority || service.priority
    };
    
    
    return serviceData;
  });
};

export const useServices = (locationData: LocationPage | null | undefined) => {
  const navigate = useNavigate();
  const tenantSlug = useTenantSlug();
  const { isPreviewMode, previewConfig, industry } = usePreviewData();
  const data = useData();

  const handleServiceClick = (service: Service) => {
    void navigate(service.route);
  };

  const getServices = () => {
    // In preview mode, use previewConfig assets
    if (isPreviewMode && previewConfig) {
      return getServicesFromSiteData(previewConfig, locationData, tenantSlug, true, industry);
    }
    
    // In live mode, use siteConfig from DataContext
    if (data?.siteConfig) {
      return getServicesFromSiteData(data.siteConfig, locationData, tenantSlug, false, null);
    }
    
    return [];
  };

  const services = getServices();

  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category);
  };

  return {
    services,
    handleServiceClick,
    getServiceById,
    getServicesByCategory,
  };
};
