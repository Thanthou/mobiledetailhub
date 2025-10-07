/**
 * Locations Data Utilities
 * Functions to work with location data from the database
 * TODO: Update to use API calls instead of JSON imports
 */

// Note: Location data is now stored in the database
// These functions should be updated to use API calls

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
 * Get locations grouped by state from database
 * TODO: Update to use API call to database
 */
export function getLocationsByState(): LocationStateInfo[] {
  console.warn('getLocationsByState is using legacy JSON data. Should be updated to use database API.');
  // TODO: Replace with API call to get locations from database
  return [];
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
