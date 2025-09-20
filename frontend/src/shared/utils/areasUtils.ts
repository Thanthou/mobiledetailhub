/**
 * Areas Data Utilities
 * Functions to work with the areas file system structure for service areas display
 */

// Get all area data files using Vite's glob import
const areaModules = import.meta.glob('@/data/areas/**/*.json', { eager: true });

export interface AreaInfo {
  slug: string;
  city: string;
  stateCode: string;
  state: string;
  urlPath: string;
  affiliate: string;
}

export interface StateInfo {
  code: string;
  name: string;
  cities: AreaInfo[];
}

/**
 * Get all available areas from the file system
 */
export function getAllAreas(): AreaInfo[] {
  try {
    const areas: AreaInfo[] = [];
    
    Object.values(areaModules).forEach((module: any) => {
      try {
        const areaData = module.default;
        if (areaData?.slug && areaData?.city && areaData?.stateCode) {
          areas.push({
            slug: areaData.slug,
            city: areaData.city,
            stateCode: areaData.stateCode,
            state: areaData.state,
            urlPath: areaData.urlPath,
            affiliate: areaData.affiliate,
          });
        }
      } catch (error) {
        console.error('Error processing area module:', error);
      }
    });
    
    return areas.sort((a, b) => {
      // Sort by state, then by city
      if (a.state !== b.state) {
        return a.state.localeCompare(b.state);
      }
      return a.city.localeCompare(b.city);
    });
  } catch (error) {
    console.error('Error getting all areas:', error);
    return [];
  }
}

/**
 * Get areas grouped by state
 */
export function getAreasByState(): StateInfo[] {
  const areas = getAllAreas();
  const stateMap = new Map<string, StateInfo>();
  
  areas.forEach(area => {
    if (!stateMap.has(area.stateCode)) {
      stateMap.set(area.stateCode, {
        code: area.stateCode,
        name: area.state,
        cities: []
      });
    }
    
    const state = stateMap.get(area.stateCode)!;
    state.cities.push(area);
  });
  
  // Sort cities within each state
  stateMap.forEach(state => {
    state.cities.sort((a, b) => a.city.localeCompare(b.city));
  });
  
  return Array.from(stateMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get unique states with their display names
 */
export function getAreasStates(): Array<{ code: string; name: string }> {
  const areas = getAllAreas();
  const stateMap = new Map<string, string>();
  
  areas.forEach(area => {
    stateMap.set(area.stateCode, area.state);
  });
  
  return Array.from(stateMap.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get cities for a specific state
 */
export function getCitiesForState(stateCode: string): AreaInfo[] {
  const areas = getAllAreas();
  return areas
    .filter(area => area.stateCode === stateCode)
    .sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Get area data by slug
 */
export function getAreaBySlug(slug: string): AreaInfo | null {
  const areas = getAllAreas();
  return areas.find(area => area.slug === slug) || null;
}

/**
 * Get area data by city and state
 */
export function getAreaByCityState(city: string, stateCode: string): AreaInfo | null {
  const areas = getAllAreas();
  return areas.find(area => 
    area.city.toLowerCase() === city.toLowerCase() && 
    area.stateCode === stateCode
  ) || null;
}

/**
 * Search areas by city name (case-insensitive)
 */
export function searchAreasByCity(searchTerm: string): AreaInfo[] {
  const areas = getAllAreas();
  const term = searchTerm.toLowerCase();
  
  return areas
    .filter(area => area.city.toLowerCase().includes(term))
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.city.toLowerCase() === term;
      const bExact = b.city.toLowerCase() === term;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then sort by state, then city
      if (a.state !== b.state) {
        return a.state.localeCompare(b.state);
      }
      return a.city.localeCompare(b.city);
    });
}

/**
 * Get areas for footer display (limited number for performance)
 */
export function getFooterAreas(limit: number = 12): StateInfo[] {
  const areasByState = getAreasByState();
  
  // Limit the number of states and cities shown in footer
  return areasByState
    .map(state => ({
      ...state,
      cities: state.cities.slice(0, 6) // Max 6 cities per state in footer
    }))
    .slice(0, limit);
}
