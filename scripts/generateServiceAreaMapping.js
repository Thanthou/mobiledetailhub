#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// State abbreviation to full name mapping
const STATE_MAPPING = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
};

function extractStatesAndCitiesFromConfig(configPath, businessSlug) {
  try {
    const config = require(configPath);
    const stateCities = {};
    const cityToBusiness = {};
    
    if (config.serviceLocations && Array.isArray(config.serviceLocations)) {
      config.serviceLocations.forEach(location => {
        // Extract state and city from "City, ST" format
        const locationMatch = location.match(/^(.+?),\s*([A-Z]{2})$/);
        if (locationMatch) {
          const city = locationMatch[1].trim();
          const state = locationMatch[2];
          const fullStateName = STATE_MAPPING[state] || state;
          
          if (!stateCities[fullStateName]) {
            stateCities[fullStateName] = [];
          }
          stateCities[fullStateName].push(city);
          
          // Track which business serves this city
          if (!cityToBusiness[city]) {
            cityToBusiness[city] = [];
          }
          cityToBusiness[city].push(businessSlug);
        }
      });
    }
    
    return { stateCities, cityToBusiness };
  } catch (error) {
    console.error(`Error reading config from ${configPath}:`, error.message);
    return { stateCities: {}, cityToBusiness: {} };
  }
}

function generateServiceAreaMapping() {
  const businessesDir = path.join(__dirname, '..', 'businesses');
  const outputPath = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'serviceAreaMapping.ts');
  
  // Get all business directories
  const businessDirs = fs.readdirSync(businessesDir)
    .filter(dir => {
      const fullPath = path.join(businessesDir, dir);
      return fs.statSync(fullPath).isDirectory();
    });
  
  // Extract states and cities from each business config
  const allStateCities = {};
  const allCityToBusiness = {};
  const businessServiceAreas = {}; // New: business-specific service areas
  
  businessDirs.forEach(businessDir => {
    const configPath = path.join(businessesDir, businessDir, 'config.js');
    if (fs.existsSync(configPath)) {
      const { stateCities, cityToBusiness } = extractStatesAndCitiesFromConfig(configPath, businessDir);
      
      // Store business-specific service areas
      businessServiceAreas[businessDir] = stateCities;
      
      // Merge cities for each state (for global view)
      Object.keys(stateCities).forEach(state => {
        if (!allStateCities[state]) {
          allStateCities[state] = [];
        }
        allStateCities[state].push(...stateCities[state]);
      });

      // Merge cityToBusiness mapping
      Object.keys(cityToBusiness).forEach(city => {
        if (!allCityToBusiness[city]) {
          allCityToBusiness[city] = [];
        }
        allCityToBusiness[city].push(...cityToBusiness[city]);
      });
    }
  });
  
  // Remove duplicates and sort cities for each state
  Object.keys(allStateCities).forEach(state => {
    allStateCities[state] = [...new Set(allStateCities[state])].sort();
  });
  
  // Remove duplicates from cityToBusiness
  Object.keys(allCityToBusiness).forEach(city => {
    allCityToBusiness[city] = [...new Set(allCityToBusiness[city])].sort();
  });
  
  // Sort states
  const sortedStates = Object.keys(allStateCities).sort();
  
  // Generate the TypeScript file content
  const fileContent = `// Service Area Mapping - Auto-generated from business configs
// This provides the mapping structure: State -> City -> Business Slug

export interface ServiceAreaMapping {
  [state: string]: {
    [city: string]: string[]; // Array of business slugs that serve this city
  };
}

export interface CityToBusinessMapping {
  [city: string]: string[]; // Array of business slugs that serve this city
}

export interface BusinessServiceAreas {
  [businessSlug: string]: {
    [state: string]: string[]; // Array of cities in that state for this business
  };
}

// State abbreviation to full name mapping
export const STATE_MAPPING: { [abbr: string]: string } = ${JSON.stringify(STATE_MAPPING, null, 2)};

// Service area mapping data - Auto-generated from business configs
export const SERVICE_AREA_MAPPING: ServiceAreaMapping = ${JSON.stringify(allStateCities, null, 2)};

// City to business mapping (flattened version for quick lookups) - Auto-generated from business configs
export const CITY_TO_BUSINESS_MAPPING: CityToBusinessMapping = ${JSON.stringify(allCityToBusiness, null, 2)};

// Business-specific service areas - Auto-generated from business configs
export const BUSINESS_SERVICE_AREAS: BusinessServiceAreas = ${JSON.stringify(businessServiceAreas, null, 2)};

// Utility functions
export const getStates = (): string[] => {
  return Object.keys(SERVICE_AREA_MAPPING).sort();
};

export const getCitiesForState = (state: string): string[] => {
  return SERVICE_AREA_MAPPING[state] ? Object.keys(SERVICE_AREA_MAPPING[state]).sort() : [];
};

export const getBusinessesForCity = (city: string): string[] => {
  return CITY_TO_BUSINESS_MAPPING[city] || [];
};

export const getBusinessesForState = (state: string): string[] => {
  const cities = getCitiesForState(state);
  const allBusinesses = new Set<string>();
  
  cities.forEach(city => {
    const businesses = getBusinessesForCity(city);
    businesses.forEach(business => allBusinesses.add(business));
  });
  
  return Array.from(allBusinesses).sort();
};

export const isCityServedByBusiness = (city: string, businessSlug: string): boolean => {
  const businesses = getBusinessesForCity(city);
  return businesses.includes(businessSlug);
};

export const isStateServedByBusiness = (state: string, businessSlug: string): boolean => {
  const businesses = getBusinessesForState(state);
  return businesses.includes(businessSlug);
};

// Get all cities for a specific business
export const getCitiesForBusiness = (businessSlug: string): string[] => {
  const cities: string[] = [];
  
  Object.entries(CITY_TO_BUSINESS_MAPPING).forEach(([city, businesses]) => {
    if (businesses.includes(businessSlug)) {
      cities.push(city);
    }
  });
  
  return cities.sort();
};

// Get all states for a specific business
export const getStatesForBusiness = (businessSlug: string): string[] => {
  const states: string[] = [];
  
  Object.entries(CITY_TO_BUSINESS_MAPPING).forEach(([city, businesses]) => {
    if (businesses.includes(businessSlug)) {
      // Find which state this city belongs to
      Object.entries(SERVICE_AREA_MAPPING).forEach(([state, cityList]) => {
        if (cityList.includes(city) && !states.includes(state)) {
          states.push(state);
        }
      });
    }
  });
  
  return states.sort();
};

// Get cities for a specific business in a specific state
export const getCitiesForBusinessInState = (businessSlug: string, state: string): string[] => {
  const businessAreas = BUSINESS_SERVICE_AREAS[businessSlug];
  if (!businessAreas || !businessAreas[state]) {
    return [];
  }
  return businessAreas[state].sort();
};

// Check if a business serves a specific state
export const doesBusinessServeState = (businessSlug: string, state: string): boolean => {
  const businessAreas = BUSINESS_SERVICE_AREAS[businessSlug];
  return businessAreas && businessAreas[state] && businessAreas[state].length > 0;
};
`;
  
  // Write the generated file
  fs.writeFileSync(outputPath, fileContent, 'utf8');
  
  console.log('\n✅ Service area mapping generated successfully!');
  console.log(`📍 Generated mapping for ${sortedStates.length} states`);
  console.log(`🏙️  State-to-cities mapping with ${Object.keys(allStateCities).length} states`);
  console.log(`🏢  City-to-business mapping with ${Object.keys(allCityToBusiness).length} cities`);
  console.log(`🏪  Business-specific service areas for ${Object.keys(businessServiceAreas).length} businesses`);
  console.log(`📁 Output file: ${outputPath}`);
}

// Run the script
if (require.main === module) {
  generateServiceAreaMapping();
}

module.exports = { generateServiceAreaMapping };
