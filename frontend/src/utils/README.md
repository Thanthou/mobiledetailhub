# Service Area Mapping System

This directory contains the service area mapping system that provides state-to-city-to-business mappings for the mobile detailing service areas.

## Files

### `serviceAreaMapping.ts`
The main service area mapping utility that provides:
- State-to-city-to-business mappings
- Utility functions for querying service areas
- Auto-generated from business configs

### `generateServiceAreaMapping.js` (in `scripts/` directory)
Script that generates the service area mapping by reading all business configs and extracting service locations.

## How It Works

1. **Business Configs**: Each business has a `serviceLocations` array in their config (e.g., `['Las Vegas, NV', 'Henderson, NV']`)

2. **Auto-Generation**: The script parses these locations and creates:
   - `SERVICE_AREA_MAPPING`: State → City → Business Slugs
   - `CITY_TO_BUSINESS_MAPPING`: City → Business Slugs

3. **Frontend Usage**: Components use the utility functions to display and navigate service areas

## Usage

### Regenerating Service Area Mapping
```bash
# From the frontend directory
npm run generate-service-areas

# Or manually from the root directory
node scripts/generateServiceAreaMapping.js
```

### Using in Components
```typescript
import { 
  getStates, 
  getCitiesForState, 
  getBusinessesForCity,
  isCityServedByBusiness 
} from '../utils/serviceAreaMapping';

// Get all available states
const states = getStates();

// Get cities for a specific state
const cities = getCitiesForState('Nevada');

// Check if a business serves a specific city
const servesCity = isCityServedByBusiness('Las Vegas', 'abc');
```

## Data Structure

### Service Area Mapping
```typescript
{
  'Nevada': {
    'Las Vegas': ['abc'],
    'Henderson': ['abc'],
    'Laughlin': ['jps']
  },
  'Arizona': {
    'Bullhead City': ['jps'],
    'Kingman': ['jps']
  }
}
```

### City to Business Mapping
```typescript
{
  'Las Vegas': ['abc'],
  'Henderson': ['abc'],
  'Laughlin': ['jps'],
  'Bullhead City': ['jps']
}
```

## Business Logic

- **MDH (Mobile Detail Hub)**: Serves all states and cities
- **Subdomain Businesses**: Only serve cities in their specific service areas
- **Navigation**: Two-level navigation (States → Cities)
- **Filtering**: Cities are filtered based on which business is currently viewing

## Updating Service Areas

1. Modify the `serviceLocations` array in the business config file
2. Run `npm run generate-service-areas` to regenerate the mapping
3. The frontend will automatically use the new mapping

## Example Business Config
```javascript
// businesses/abc/config.js
module.exports = {
  // ... other config
  serviceLocations: [
    'Las Vegas, NV',
    'Henderson, NV',
    'North Las Vegas, NV'
  ]
  // ... other config
};
```
