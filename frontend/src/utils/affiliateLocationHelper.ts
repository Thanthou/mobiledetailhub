import { LocationData } from '../contexts/LocationContext';

interface ServiceArea {
  city: string;
  state: string;
  zip?: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

/**
 * Checks if an affiliate serves a specific location
 */
export const affiliateServesLocation = (
  serviceAreas: ServiceArea[] | string | null | undefined,
  location: LocationData | null
): boolean => {
  if (!location || !serviceAreas) return false;

  let serviceAreasData: ServiceArea[] = [];
  
  if (typeof serviceAreas === 'string') {
    try {
      serviceAreasData = JSON.parse(serviceAreas);
    } catch (e) {
      console.error('Error parsing service_areas JSON:', e);
      return false;
    }
  } else if (Array.isArray(serviceAreas)) {
    serviceAreasData = serviceAreas;
  }

  return serviceAreasData.some(area => 
    area.city.toLowerCase() === location.city.toLowerCase() && 
    area.state.toLowerCase() === location.state.toLowerCase()
  );
};

/**
 * Gets the primary service area from affiliate data
 */
export const getPrimaryServiceArea = (
  serviceAreas: ServiceArea[] | string | null | undefined
): ServiceArea | null => {
  if (!serviceAreas) return null;

  let serviceAreasData: ServiceArea[] = [];
  
  if (typeof serviceAreas === 'string') {
    try {
      serviceAreasData = JSON.parse(serviceAreas);
    } catch (e) {
      console.error('Error parsing service_areas JSON:', e);
      return null;
    }
  } else if (Array.isArray(serviceAreas)) {
    serviceAreasData = serviceAreas;
  }

  return serviceAreasData.find(area => area.primary === true) || null;
};

/**
 * Determines the location to display for an affiliate
 * Returns the selected location if the affiliate serves it, otherwise returns the primary service area
 */
export const getAffiliateDisplayLocation = (
  serviceAreas: ServiceArea[] | string | null | undefined,
  selectedLocation: LocationData | null
): { city: string; state: string; fullLocation: string } | null => {
  // If we have a selected location and the affiliate serves it, use that
  if (selectedLocation && affiliateServesLocation(serviceAreas, selectedLocation)) {
    return {
      city: selectedLocation.city,
      state: selectedLocation.state,
      fullLocation: selectedLocation.fullLocation
    };
  }

  // Otherwise, use the primary service area
  const primaryArea = getPrimaryServiceArea(serviceAreas);
  if (primaryArea) {
    return {
      city: primaryArea.city,
      state: primaryArea.state,
      fullLocation: `${primaryArea.city}, ${primaryArea.state}`
    };
  }

  return null;
};
