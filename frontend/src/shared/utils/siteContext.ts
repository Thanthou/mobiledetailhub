// Data-based site context utility
// Determines site context based on actual location data files

import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import data files
import siteData from '@/data/mdh/site.json';
import employeeData from '@/data/employee/employees.json';
import allLocations from '@/data/locations/locations.json';

export interface ContextData {
  // Site type flags
  isMainSite: boolean;
  isLocation: boolean;
  isAffiliate: boolean;
  
  // Legacy aliases for backward compatibility
  isMDH: boolean;
  
  // Actual data objects that components need
  locationData?: any;
  employeeData?: any;
  siteData?: any;
  
  // Route info
  pathname: string;
  city: string | undefined;
  state: string | undefined;
}

// Hook version for components
export function useSiteContext(): ContextData {
  const location = useLocation();
  const { state, city } = useParams();
  const [locationData, setLocationData] = useState<any>(undefined);
  const [employee, setEmployee] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load location data dynamically
  useEffect(() => {
    const loadLocationData = async () => {
      if (state && city) {
        // Check if location exists in locations.json (URL validation)
        const locationKey = `${state}/${city}`;
        const foundLocation = allLocations[locationKey as keyof typeof allLocations];
        
        if (foundLocation) {
          setIsLoading(true);
          try {
            // Dynamically load the full data from /data/areas/{state}/{city}.json
            const fullData = await import(`@/data/areas/${state}/${city}.json`);
            setLocationData(fullData.default);
            
            // Get employee data
            const employeeId = foundLocation.employee;
            setEmployee(employeeData[employeeId as keyof typeof employeeData]);
          } catch (error) {
            console.error('Failed to load location data:', error);
            setLocationData(undefined);
            setEmployee(undefined);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        // Main site - no location data
        setLocationData(undefined);
        setEmployee(undefined);
      }
    };

    loadLocationData();
  }, [state, city]);
  
  // Determine site type
  const isLocation = !!(state && city && locationData);
  const isMainSite = !isLocation;
  const isAffiliate = isLocation;
  
  return {
    isMainSite,
    isLocation,
    isAffiliate,
    isMDH: isMainSite, // Legacy alias
    locationData,
    employeeData: employee,
    siteData: isMainSite ? siteData : undefined,
    pathname: location.pathname,
    city,
    state
  };
}

// Utility function for data-based detection
export function getContextFromData(locationData?: any): ContextData {
  // Only treat as location if it has city/state properties
  if (locationData && (locationData.city || locationData.state)) {
    return {
      isMainSite: false,
      isLocation: true,
      isAffiliate: true,
      isMDH: false, // Legacy alias
      city: locationData.city,
      state: locationData.state,
      pathname: '' // Not available in data context
    };
  }
  
  return {
    isMainSite: true,
    isLocation: false,
    isAffiliate: false,
    isMDH: true, // Legacy alias
    pathname: '',
    city: undefined,
    state: undefined
  };
}

// Legacy function for backward compatibility
export function getContext(locationData?: any): ContextData {
  return getContextFromData(locationData);
}
