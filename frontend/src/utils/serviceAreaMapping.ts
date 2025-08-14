// Service Area Mapping - Auto-generated from business configs
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
export const STATE_MAPPING: { [abbr: string]: string } = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

// Service area mapping data - Auto-generated from business configs
export const SERVICE_AREA_MAPPING: ServiceAreaMapping = {
  "Nevada": [
    "Anthem",
    "Boulder City",
    "Enterprise",
    "Green Valley",
    "Henderson",
    "Las Vegas",
    "Laughlin",
    "Mount Charleston",
    "North Las Vegas",
    "Paradise",
    "Red Rock Canyon",
    "Spring Valley",
    "Summerlin",
    "Sunrise Manor",
    "Valley of Fire",
    "Whitney",
    "Winchester"
  ],
  "Arizona": [
    "Bullhead City",
    "Fort Mohave",
    "Katherine Landing",
    "Kingman",
    "Lake Havasu City",
    "Mohave Valley"
  ],
  "California": [
    "Needles"
  ]
};

// City to business mapping (flattened version for quick lookups) - Auto-generated from business configs
export const CITY_TO_BUSINESS_MAPPING: CityToBusinessMapping = {
  "Las Vegas": [
    "abc"
  ],
  "Henderson": [
    "abc"
  ],
  "North Las Vegas": [
    "abc"
  ],
  "Boulder City": [
    "abc"
  ],
  "Summerlin": [
    "abc"
  ],
  "Green Valley": [
    "abc"
  ],
  "Anthem": [
    "abc"
  ],
  "Enterprise": [
    "abc"
  ],
  "Spring Valley": [
    "abc"
  ],
  "Paradise": [
    "abc"
  ],
  "Sunrise Manor": [
    "abc"
  ],
  "Whitney": [
    "abc"
  ],
  "Winchester": [
    "abc"
  ],
  "Mount Charleston": [
    "abc"
  ],
  "Red Rock Canyon": [
    "abc"
  ],
  "Valley of Fire": [
    "abc"
  ],
  "Bullhead City": [
    "jps"
  ],
  "Laughlin": [
    "jps"
  ],
  "Mohave Valley": [
    "jps"
  ],
  "Needles": [
    "jps"
  ],
  "Fort Mohave": [
    "jps"
  ],
  "Katherine Landing": [
    "jps"
  ],
  "Lake Havasu City": [
    "jps"
  ],
  "Kingman": [
    "jps"
  ]
};

// Business-specific service areas - Auto-generated from business configs
export const BUSINESS_SERVICE_AREAS: BusinessServiceAreas = {
  "abc": {
    "Nevada": [
      "Las Vegas",
      "Henderson",
      "North Las Vegas",
      "Boulder City",
      "Summerlin",
      "Green Valley",
      "Anthem",
      "Enterprise",
      "Spring Valley",
      "Paradise",
      "Sunrise Manor",
      "Whitney",
      "Winchester",
      "Mount Charleston",
      "Red Rock Canyon",
      "Valley of Fire"
    ]
  },
  "jps": {
    "Arizona": [
      "Bullhead City",
      "Mohave Valley",
      "Fort Mohave",
      "Katherine Landing",
      "Lake Havasu City",
      "Kingman"
    ],
    "Nevada": [
      "Laughlin"
    ],
    "California": [
      "Needles"
    ]
  },
  "mdh": {}
};

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
