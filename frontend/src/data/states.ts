/**
 * US States and Territories
 * Static data for dropdowns, validation, and display
 */

export const STATES = {
  // 50 US States
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
  'WY': 'Wyoming',
  
  // US Territories
  'DC': 'District of Columbia',
  'AS': 'American Samoa',
  'GU': 'Guam',
  'MP': 'Northern Mariana Islands',
  'PR': 'Puerto Rico',
  'VI': 'U.S. Virgin Islands',
  
  // Military/Diplomatic
  'AA': 'Armed Forces Americas',
  'AE': 'Armed Forces Europe',
  'AP': 'Armed Forces Pacific'
} as const;

export type StateCode = keyof typeof STATES;

export type StateName = typeof STATES[StateCode];

/**
 * Get state name from code
 */
export function getStateName(code: string): string | undefined {
  return STATES[code.toUpperCase() as StateCode];
}

/**
 * Get state code from name
 */
export function getStateCode(name: string): string | undefined {
  const normalizedName = name.toLowerCase();
  const entry = Object.entries(STATES).find(([_, stateName]) => 
    stateName.toLowerCase() === normalizedName
  );
  return entry?.[0];
}

/**
 * Get all state codes as array
 */
export function getStateCodes(): StateCode[] {
  return Object.keys(STATES) as StateCode[];
}

/**
 * Get all state names as array
 */
export function getStateNames(): StateName[] {
  return Object.values(STATES);
}

/**
 * Check if a string is a valid state code
 */
export function isValidStateCode(code: string): code is StateCode {
  return code.toUpperCase() in STATES;
}

/**
 * Check if a string is a valid state name
 */
export function isValidStateName(name: string): boolean {
  return getStateCode(name) !== undefined;
}

/**
 * Format state for display (e.g., "AZ - Arizona")
 */
export function formatState(code: StateCode): string {
  return `${code} - ${STATES[code]}`;
}

/**
 * Get states grouped by region (optional, for advanced UI)
 */
export const STATES_BY_REGION = {
  'Northeast': ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NJ', 'NY', 'PA'],
  'Midwest': ['IL', 'IN', 'MI', 'OH', 'WI', 'IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD'],
  'South': ['DE', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'WV', 'AL', 'KY', 'MS', 'TN', 'AR', 'LA', 'OK', 'TX'],
  'West': ['AZ', 'CO', 'ID', 'MT', 'NV', 'NM', 'UT', 'WY', 'AK', 'CA', 'HI', 'OR', 'WA']
} as const;

export type Region = keyof typeof STATES_BY_REGION;
