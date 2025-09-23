/**
 * Locations Data Utilities
 * Functions to work with the simplified locations.json structure for footer display
 */

import locationsData from '@/data/locations/locations.json';

export interface LocationInfo {
  slug: string;
  city: string;
  stateCode: string;
  state: string;
  urlPath: string;
}

export interface LocationStateInfo {
  code: string;
  name: string;
  cities: LocationInfo[];
}

// State code to full name mapping
const STATE_NAMES: Record<string, string> = {
  'AZ': 'Arizona',
  'NV': 'Nevada', 
  'CA': 'California',
  'UT': 'Utah',
  'CO': 'Colorado',
  'NM': 'New Mexico',
  'TX': 'Texas',
  'FL': 'Florida',
  'WA': 'Washington',
  'OR': 'Oregon'
};

/**
 * Get locations grouped by state from locations.json
 */
export function getLocationsByState(): LocationStateInfo[] {
  try {
    const stateMap = new Map<string, LocationStateInfo>();
    
    // Process each state from the locations.json
    locationsData.states.forEach((stateCode: string) => {
      const cities = locationsData[stateCode] || [];
      
      stateMap.set(stateCode, {
        code: stateCode,
        name: STATE_NAMES[stateCode] || stateCode,
        cities: cities.map((citySlug: string) => ({
          slug: citySlug,
          city: citySlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          stateCode,
          state: STATE_NAMES[stateCode] || stateCode,
          urlPath: `/${stateCode.toLowerCase()}/${citySlug}`
        }))
      });
    });
    
    // Sort cities within each state
    stateMap.forEach(state => {
      state.cities.sort((a, b) => a.city.localeCompare(b.city));
    });
    
    return Array.from(stateMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting locations by state:', error);
    return [];
  }
}

/**
 * Get all locations as a flat array
 */
export function getAllLocations(): LocationInfo[] {
  const locationsByState = getLocationsByState();
  return locationsByState.flatMap(state => state.cities);
}

/**
 * Get locations for footer display (limited number for performance)
 */
export function getFooterLocations(limit: number = 12): LocationStateInfo[] {
  const locationsByState = getLocationsByState();
  
  // Limit the number of states and cities shown in footer
  return locationsByState
    .map(state => ({
      ...state,
      cities: state.cities.slice(0, 6) // Max 6 cities per state in footer
    }))
    .slice(0, limit);
}
