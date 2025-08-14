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
          
          if (!stateCities[state]) {
            stateCities[state] = [];
          }
          stateCities[state].push(city);
          
          // Track which business serves this city
          cityToBusiness[city] = businessSlug;
        }
      });
    }
    
    return { stateCities, cityToBusiness };
  } catch (error) {
    console.error(`Error reading config from ${configPath}:`, error.message);
    return { stateCities: {}, cityToBusiness: {} };
  }
}

function generateMDHServiceAreas() {
  const businessesDir = path.join(__dirname, '..', 'businesses');
  const mdhConfigPath = path.join(businessesDir, 'mdh', 'config.js');
  
  // Get all business directories (excluding mdh)
  const businessDirs = fs.readdirSync(businessesDir)
    .filter(dir => {
      const fullPath = path.join(businessesDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir !== 'mdh';
    });
  
  // Extract states and cities from each business config
  const allStateCities = {};
  const allCityToBusiness = {};
  
  businessDirs.forEach(businessDir => {
    const configPath = path.join(businessesDir, businessDir, 'config.js');
    if (fs.existsSync(configPath)) {
      const { stateCities, cityToBusiness } = extractStatesAndCitiesFromConfig(configPath, businessDir);
      
      // Merge cities for each state
      Object.keys(stateCities).forEach(state => {
        if (!allStateCities[state]) {
          allStateCities[state] = [];
        }
        allStateCities[state].push(...stateCities[state]);
      });

      // Merge cityToBusiness mapping
      Object.assign(allCityToBusiness, cityToBusiness);
    }
  });
  
  // Remove duplicates and sort cities for each state
  Object.keys(allStateCities).forEach(state => {
    allStateCities[state] = [...new Set(allStateCities[state])].sort();
  });
  
  // Convert to sorted array of states and map to full names
  const sortedStates = Object.keys(allStateCities).sort();
  const stateList = sortedStates.map(abbr => STATE_MAPPING[abbr] || abbr);
  
  // Create state-to-cities dictionary with full state names
  const stateCitiesDict = {};
  sortedStates.forEach(stateAbbr => {
    const fullStateName = STATE_MAPPING[stateAbbr] || stateAbbr;
    stateCitiesDict[fullStateName] = allStateCities[stateAbbr];
  });
  
  // Read current MDH config
  let mdhConfig = fs.readFileSync(mdhConfigPath, 'utf8');
  
  // Replace the serviceLocations array and add stateCities
  const newServiceLocations = `  // Service Areas/Locations - Auto-generated from all business configs
  serviceLocations: [
    ${stateList.map(state => `'${state}'`).join(',\n    ')}
  ],
  
  // State-to-cities mapping - Auto-generated from all business configs
  stateCities: ${JSON.stringify(stateCitiesDict, null, 4)},`;

  // Replace the cityToBusiness mapping
  const newCityToBusiness = `  // City-to-business mapping - Auto-generated from all business configs
  cityToBusiness: ${JSON.stringify(allCityToBusiness, null, 4)},`;
  
  // Find and replace the existing serviceLocations section
  const serviceLocationsRegex = /  \/\/ Service Areas\/Locations[\s\S]*?\],/;
  
  if (serviceLocationsRegex.test(mdhConfig)) {
    // Remove the old stateCities if it exists
    let updatedConfig = mdhConfig.replace(serviceLocationsRegex, newServiceLocations);
    
    // Remove old stateCities section if it exists
    const oldStateCitiesRegex = /  \/\/ State-to-cities mapping[\s\S]*?},/;
    if (oldStateCitiesRegex.test(updatedConfig)) {
      updatedConfig = updatedConfig.replace(oldStateCitiesRegex, '');
    }
    
    mdhConfig = updatedConfig;
  } else {
    // If no existing serviceLocations, add it before the socialMedia section
    const socialMediaRegex = /  \/\/ Social Media Links/;
    if (socialMediaRegex.test(mdhConfig)) {
      mdhConfig = mdhConfig.replace(socialMediaRegex, `${newServiceLocations}\n\n  // Social Media Links`);
    }
  }

  // Find and replace the existing cityToBusiness section
  const cityToBusinessRegex = /  \/\/ City-to-business mapping[\s\S]*?},/;
  if (cityToBusinessRegex.test(mdhConfig)) {
    let updatedConfig = mdhConfig.replace(cityToBusinessRegex, newCityToBusiness);
    // Remove old cityToBusiness section if it exists
    const oldCityToBusinessRegex = /  \/\/ City-to-business mapping[\s\S]*?},/;
    if (oldCityToBusinessRegex.test(updatedConfig)) {
      updatedConfig = updatedConfig.replace(oldCityToBusinessRegex, '');
    }
    mdhConfig = updatedConfig;
  } else {
    // If no existing cityToBusiness, add it before the socialMedia section
    const socialMediaRegex = /  \/\/ Social Media Links/;
    if (socialMediaRegex.test(mdhConfig)) {
      mdhConfig = mdhConfig.replace(socialMediaRegex, `${newCityToBusiness}\n\n  // Social Media Links`);
    }
  }
  
  // Write updated config
  fs.writeFileSync(mdhConfigPath, mdhConfig, 'utf8');
  
  console.log('\n✅ MDH config updated successfully!');
  console.log(`📍 Now serves ${stateList.length} states: ${stateList.join(', ')}`);
  console.log(`🏙️  State-to-cities mapping added with ${Object.keys(stateCitiesDict).length} states`);
  console.log(`🏢  City-to-business mapping added with ${Object.keys(allCityToBusiness).length} cities`);
}

// Run the script
if (require.main === module) {
  generateMDHServiceAreas();
}

module.exports = { generateMDHServiceAreas };
