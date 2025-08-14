// Frontend Business Configuration Loader
// Uses the shared backend business loader via API calls

// No theme system needed - business config is loaded directly

import { config } from '../config/environment';

interface BusinessConfig {
  domain: string;
  slug: string;
  business: {
    name: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    services: string[];
    description: string;
  };
  emailNotifications?: string[];
  serviceLocations?: string[]; // Add service locations array
  stateCities?: { [state: string]: string[] }; // Add state-to-cities mapping
}

interface Business {
  slug: string;
  name: string;
  domain: string;
}

// Backend API base URL
const API_BASE_URL = config.apiUrl;

export const getAvailableBusinesses = async (): Promise<Business[]> => {
  try {
    console.log('Fetching businesses from:', `${API_BASE_URL}/api/businesses`);
    const response = await fetch(`${API_BASE_URL}/api/businesses`);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const businesses = await response.json();
    console.log('Successfully loaded businesses:', businesses);
    return businesses;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    console.error('API_BASE_URL was:', API_BASE_URL);
    return [];
  }
};

export const getBusinessBySlug = async (slug: string): Promise<Business | null> => {
  try {
    const businesses = await getAvailableBusinesses();
    const business = businesses.find(b => b.slug === slug);
    return business || null;
  } catch (error) {
    console.error(`Error getting business by slug ${slug}:`, error);
    return null;
  }
};

export const loadBusinessConfig = async (businessSlug: string): Promise<BusinessConfig | null> => {
  try {
    console.log(`Loading business config for ${businessSlug} from:`, `${API_BASE_URL}/api/business-config/${businessSlug}`);
    const response = await fetch(`${API_BASE_URL}/api/business-config/${businessSlug}`);
    
    if (!response.ok) {
      console.error(`HTTP error loading config for ${businessSlug}! status: ${response.status}, statusText: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const config = await response.json();
    console.log(`Successfully loaded config for ${businessSlug}:`, config);
    return config;
  } catch (error) {
    console.error(`Error loading business config for ${businessSlug}:`, error);
    console.error('API_BASE_URL was:', API_BASE_URL);
    return null;
  }
};

// Function to get business config synchronously (for immediate use)
// Note: This will return null since we need to fetch from backend
export function getBusinessConfigSync(businessSlug: string): BusinessConfig | null {
  // Cannot provide sync access to backend data
  // Use loadBusinessConfig() for async access instead
  console.warn('getBusinessConfigSync is deprecated. Use loadBusinessConfig() for async access.');
  return null;
}

export const findBusinessByLocation = async (
  location: string,
  zipCode?: string,
  city?: string,
  state?: string
): Promise<BusinessConfig | null> => {
  try {
    const businesses = await getAvailableBusinesses();
    
    for (const business of businesses) {
      try {
        const config = await loadBusinessConfig(business.slug);
        if (!config) continue;
        
        // Check if this business serves the requested location
        if (config.serviceLocations && config.serviceLocations.length > 0) {
          // Normalize search terms
          const searchLocation = location.toLowerCase().trim();
          const searchCity = city?.toLowerCase().trim() || '';
          const searchState = state?.toLowerCase().trim() || '';
          const searchZip = zipCode?.trim() || '';
          
          // Check each service location
          for (const serviceLocation of config.serviceLocations) {
            const locationMatch = serviceLocation.toLowerCase().includes(searchLocation) || searchLocation.includes(serviceLocation.toLowerCase());
            const cityMatch = searchCity && serviceLocation.toLowerCase().includes(searchCity);
            const stateMatch = searchState && serviceLocation.toLowerCase().includes(searchState);
            const zipMatch = searchZip && config.zipCodes && config.zipCodes.includes(searchZip);
            
            if (locationMatch || cityMatch || stateMatch || zipMatch) {
              return config;
            }
          }
        } else {
          // If no serviceLocations defined, skip this business
          continue;
        }
      } catch (error) {
        console.error(`Error checking business ${business.slug}:`, error);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding business by location:', error);
    return null;
  }
};
