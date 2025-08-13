// Frontend Business Configuration Loader
// Uses the shared backend business loader via API calls

// No theme system needed - business config is loaded directly

interface BusinessConfig {
  business: {
    name: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    services: string[];
    description: string;
  };
  domain: string;
  emailNotifications?: string[];
  serviceLocations?: string[]; // Add service locations array
}

interface Business {
  slug: string;
  name: string;
  domain: string;
}

// Backend API base URL
const API_BASE_URL = 'http://localhost:3001';

// Function to get all available businesses from backend
export async function getAvailableBusinesses(): Promise<Business[]> {
  console.log('getAvailableBusinesses: Starting API call to', `${API_BASE_URL}/api/businesses`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/businesses`);
    console.log('getAvailableBusinesses: Response status:', response.status);
    console.log('getAvailableBusinesses: Response ok:', response.ok);
    
    if (response.ok) {
      const businesses = await response.json();
      console.log('getAvailableBusinesses: Successfully loaded businesses:', businesses);
      return businesses;
    } else {
      console.error('getAvailableBusinesses: Response not ok, status:', response.status);
      throw new Error('Failed to fetch businesses');
    }
  } catch (error) {
    console.error('getAvailableBusinesses: Error fetching businesses:', error);
    return [];
  }
}

// Function to get a specific business by slug from backend
export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  console.log('getBusinessBySlug: Called with slug:', slug);
  try {
    const businesses = await getAvailableBusinesses();
    const business = businesses.find(business => business.slug === slug);
    console.log('getBusinessBySlug: Found business:', business);
    return business;
  } catch (error) {
    console.error('getBusinessBySlug: Error getting business by slug:', error);
    return undefined;
  }
}

// Function to load business configuration from backend
export async function loadBusinessConfig(businessSlug: string): Promise<BusinessConfig> {
  console.log('loadBusinessConfig: Starting with businessSlug:', businessSlug);
  
  try {
    console.log('loadBusinessConfig: Making API call to', `${API_BASE_URL}/api/business-config/${businessSlug}`);
    const response = await fetch(`${API_BASE_URL}/api/business-config/${businessSlug}`);
    console.log('loadBusinessConfig: Response status:', response.status);
    console.log('loadBusinessConfig: Response ok:', response.ok);
    
    if (response.ok) {
      const config = await response.json();
      console.log('loadBusinessConfig: Successfully loaded config:', config);
      
      // Business config loaded successfully
      console.log('loadBusinessConfig: Business config loaded for:', businessSlug);
      
      return config;
    } else {
      console.error('loadBusinessConfig: Response not ok, status:', response.status);
      throw new Error(`Failed to load business config: ${response.status}`);
    }
  } catch (error) {
    console.error('loadBusinessConfig: Error loading config:', error);
    throw error;
  }
}

// Function to get business config synchronously (for immediate use)
// Note: This will return null since we need to fetch from backend
export function getBusinessConfigSync(businessSlug: string): BusinessConfig | null {
  // Cannot provide sync access to backend data
  // Use loadBusinessConfig() for async access instead
  console.warn('getBusinessConfigSync is deprecated. Use loadBusinessConfig() for async access.');
  return null;
}

// Function to find which business serves a given location
export async function findBusinessByLocation(location: string, zipCode?: string, city?: string, state?: string): Promise<string | null> {
  try {
    console.log('findBusinessByLocation: Starting search for location:', { location, zipCode, city, state });
    
    // Get all available businesses
    const businesses = await getAvailableBusinesses();
    console.log('findBusinessByLocation: Available businesses:', businesses);
    
    if (!businesses || businesses.length === 0) {
      console.error('findBusinessByLocation: No businesses available');
      return null;
    }
    
    // For each business, check if they serve the location
    for (const business of businesses) {
      try {
        console.log(`findBusinessByLocation: Loading config for business: ${business.slug}`);
        const config = await loadBusinessConfig(business.slug);
        console.log(`findBusinessByLocation: Config loaded for ${business.slug}:`, config);
        
        // Check if this business has service locations defined
        if (config.serviceLocations && Array.isArray(config.serviceLocations)) {
          console.log(`findBusinessByLocation: ${business.slug} has ${config.serviceLocations.length} service locations:`, config.serviceLocations);
          
          // Normalize the search location
          const searchLocation = location.toLowerCase().trim();
          const searchCity = city?.toLowerCase().trim();
          const searchState = state?.toUpperCase().trim();
          
          console.log('findBusinessByLocation: Normalized search terms:', { searchLocation, searchCity, searchState });
          
          // Check if any service location matches
          for (const serviceLocation of config.serviceLocations) {
            const normalizedServiceLocation = serviceLocation.toLowerCase().trim();
            console.log(`findBusinessByLocation: Checking service location: "${serviceLocation}" against search terms`);
            
            // Check for exact matches or partial matches
            const locationMatch = normalizedServiceLocation.includes(searchLocation);
            const cityMatch = searchCity && normalizedServiceLocation.includes(searchCity);
            const stateMatch = searchState && normalizedServiceLocation.includes(searchState);
            const zipMatch = zipCode && serviceLocation.includes(zipCode);
            
            console.log('findBusinessByLocation: Match results:', { locationMatch, cityMatch, stateMatch, zipMatch });
            
            if (locationMatch || cityMatch || stateMatch || zipMatch) {
              console.log(`findBusinessByLocation: Found match! Business ${business.slug} serves ${serviceLocation}`);
              return business.slug;
            }
          }
        } else {
          console.log(`findBusinessByLocation: ${business.slug} has no serviceLocations defined`);
        }
      } catch (error) {
        console.error(`findBusinessByLocation: Error loading config for ${business.slug}:`, error);
        continue; // Skip this business and continue with others
      }
    }
    
    console.log('findBusinessByLocation: No business found for location:', location);
    return null;
  } catch (error) {
    console.error('findBusinessByLocation: Error searching for location:', error);
    console.error('findBusinessByLocation: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error
    });
    return null;
  }
}

// Test function to verify business configs are working
export async function testBusinessConfigs(): Promise<void> {
  try {
    console.log('=== TESTING BUSINESS CONFIGS ===');
    
    // Test 1: Get available businesses
    const businesses = await getAvailableBusinesses();
    console.log('Test 1 - Available businesses:', businesses);
    
    // Test 2: Load each business config
    for (const business of businesses) {
      try {
        const config = await loadBusinessConfig(business.slug);
        console.log(`Test 2 - Config for ${business.slug}:`, {
          hasServiceLocations: !!config.serviceLocations,
          serviceLocationsCount: config.serviceLocations?.length || 0,
          serviceLocations: config.serviceLocations
        });
      } catch (error) {
        console.error(`Test 2 - Error loading config for ${business.slug}:`, error);
      }
    }
    
    // Test 3: Test location search
    const testLocation = 'Los Angeles, CA';
    const result = await findBusinessByLocation(testLocation);
    console.log(`Test 3 - Location search for "${testLocation}":`, result);
    
    console.log('=== END TESTING ===');
  } catch (error) {
    console.error('Test failed:', error);
  }
}
