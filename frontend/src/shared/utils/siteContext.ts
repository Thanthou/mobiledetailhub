// Data-based site context utility
// Determines site context based on actual location data files

import { useLocation as useRouterLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import data files
import siteData from '@/data/mobile-detailing/site.json';
// Note: Location data is now stored in the database

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
  const location = useRouterLocation();
  const { state, city } = useParams();
  const [locationData, setLocationData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load location data dynamically
  useEffect(() => {
    const loadLocationData = async () => {
      if (state && city) {
        // TODO: Check if location exists in database (URL validation)
        // For now, assume location exists and try to load data
        const locationExists = true; // TODO: Replace with database check
        
        if (locationExists) {
          setIsLoading(true);
          try {
            // TODO: Load location data from database API instead of JSON file
            // For now, set empty location data
            setLocationData({
              city: city,
              stateCode: state,
              // Add other required fields as needed
            });
            
            // Note: Employee data should be loaded from database via API calls
            // when needed by components
          } catch (error) {
            console.error('Failed to load location data:', error);
            setLocationData(undefined);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        // Main site - no location data
        setLocationData(undefined);
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
    employeeData: undefined, // Employee data should be loaded from database when needed
    siteData: isMainSite ? siteData : undefined,
    pathname: location.pathname,
    city: locationData?.city || city,
    state: locationData?.stateCode || state
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
