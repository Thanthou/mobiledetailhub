import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { getAreaBySlug, getBusinessBySlug, getBusinessPhone } from '@/shared/utils';

/**
 * Hook to get business data for the current location
 * This reads from employees.json based on the employee slug from the location data
 */
export const useBusinessData = () => {
  const location = useLocation();
  
  const businessData = useMemo(() => {
    // Extract location slug from pathname
    // Examples: /az/bullhead-city -> az-bullhead-city
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    console.log('🔍 useBusinessData Debug:', {
      pathname: location.pathname,
      pathSegments,
      pathSegmentsLength: pathSegments.length
    });
    
    if (pathSegments.length >= 2) {
      const stateCode = pathSegments[0];
      const city = pathSegments[1];
      const locationSlug = `${stateCode}-${city}`;
      
      console.log('🔍 Looking for area data:', {
        stateCode,
        city,
        locationSlug
      });
      
      const areaData = getAreaBySlug(locationSlug);
      
      console.log('🔍 Area data found:', areaData);
      
      if (areaData && areaData.employee) {
        console.log('🔍 Employee slug:', areaData.employee);
        
        // Get business data from database using the employee slug
        // TODO: Replace with API call to get employee data from database
        const employeeData = getBusinessBySlug(areaData.employee);
        
        console.log('🔍 Employee data found:', employeeData);
        
        if (employeeData) {
          const result = {
            businessName: employeeData['business-name'],
            businessPhone: getBusinessPhone(areaData.employee),
            city: areaData.city,
            state: areaData.state,
            employeeSlug: areaData.employee
          };
          
          console.log('🔍 Final business data result:', result);
          return result;
        }
      }
    }
    
    console.log('🔍 No business data found, returning null');
    return null;
  }, [location.pathname]);
  
  return {
    businessData,
    businessName: businessData?.businessName || '',
    businessPhone: businessData?.businessPhone || '',
    city: businessData?.city || '',
    state: businessData?.state || '',
    employeeSlug: businessData?.employeeSlug || '',
    isLoading: false,
    hasError: false
  };
};

/**
 * Hook to get business data by affiliate slug directly
 */
export const useBusinessDataBySlug = (affiliateSlug: string) => {
  const businessData = useMemo(() => {
    return getBusinessBySlug(affiliateSlug);
  }, [affiliateSlug]);
  
  return {
    businessData,
    businessName: businessData?.['business-name'] || '',
    businessPhone: businessData?.['business-phone'] || '',
    businessEmail: businessData?.['business-email'] || '',
    businessUrl: businessData?.['business-url'] || '',
    businessLogo: businessData?.['business-logo'] || '',
    businessDescription: businessData?.['business-description'] || '',
    businessServices: businessData?.['business-services'] || [],
    businessHours: businessData?.['business-hours'] || '',
    serviceAreas: businessData?.['service-areas'] || [],
    isLoading: false,
    hasError: !businessData
  };
};
