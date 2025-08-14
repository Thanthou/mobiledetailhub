# MDH Service Areas Generator

This script automatically generates MDH's service areas by reading all business configuration files and extracting the unique states they serve, along with a comprehensive state-to-cities mapping.

## What it does

1. **Scans all business configs** (excluding MDH itself)
2. **Extracts unique states** from `serviceLocations` arrays
3. **Converts abbreviations to full names** (AZ → Arizona, CA → California, etc.)
4. **Generates state-to-cities dictionary** showing all available cities per state
5. **Updates MDH config** with both the state list and cities mapping
6. **Maintains consistency** across all business configurations

## Usage

### Option 1: Direct script execution
```bash
node scripts/generateMDHServiceAreas.js
```

### Option 2: Using npm script (from backend directory)
```bash
npm run generate-mdh-areas
```

## Current Coverage

Based on existing business configs:
- **JPS**: Arizona, Nevada, California
- **ABC**: Nevada
- **MDH**: Arizona, California, Nevada (auto-generated)

## Generated Data Structure

### State List
```javascript
serviceLocations: [
  'Arizona',
  'California', 
  'Nevada'
]
```

### State-to-Cities Dictionary
```javascript
stateCities: {
  "Arizona": [
    "Bullhead City", "Fort Mohave", "Katherine Landing",
    "Kingman", "Lake Havasu City", "Mohave Valley"
  ],
  "California": ["Needles"],
  "Nevada": [
    "Anthem", "Boulder City", "Enterprise", "Green Valley",
    "Henderson", "Las Vegas", "Laughlin", "Mount Charleston",
    "North Las Vegas", "Paradise", "Red Rock Canyon",
    "Spring Valley", "Summerlin", "Sunrise Manor",
    "Valley of Fire", "Whitney", "Winchester"
  ]
}
```

### City-to-Business Mapping
```javascript
cityToBusiness: {
  "Anthem": "abc",
  "Boulder City": "abc",
  "Enterprise": "abc",
  "Henderson": "abc",
  "Las Vegas": "abc",
  "Bullhead City": "jps",
  "Fort Mohave": "jps",
  "Kingman": "jps",
  "Needles": "jps"
}
```

## How it works

1. **Location Parsing**: Extracts both city and state from `"City, ST"` format
2. **State Deduplication**: Removes duplicate states across businesses
3. **City Aggregation**: Combines all cities for each state from all businesses
4. **Business Tracking**: Maps each city to its originating business slug
5. **Normalization**: Converts state abbreviations to full names
6. **Auto-update**: Modifies MDH config file with all mappings automatically

## Interactive Features

### Clickable Cities
- **City Navigation**: Each city in the service areas is now clickable
- **Business Routing**: Clicking a city navigates to the appropriate business subdomain
- **Location Pre-fill**: The target business receives the city as a query parameter
- **Seamless Experience**: Users can easily find and navigate to local businesses

### Navigation Examples
- Click "Las Vegas" → Redirects to `abc.mobiledetailhub.com?city=Las%20Vegas`
- Click "Bullhead City" → Redirects to `jps.mobiledetailhub.com?city=Bullhead%20City`
- Development mode → Uses `/?business=abc&city=Las%20Vegas` format

## Adding New Businesses

When you add a new business:
1. Create the business config with `serviceLocations` array
2. Run the script: `npm run generate-mdh-areas`
3. MDH automatically covers the new states and cities

## Example Output

```
Found business directories: [ 'abc', 'jps' ]
abc: { NV: ['Las Vegas', 'Henderson', ...] }
jps: { AZ: ['Bullhead City', ...], NV: ['Laughlin'], CA: ['Needles'] }

All unique states found: [ 'AZ', 'CA', 'NV' ]
State list for MDH: [ 'Arizona', 'California', 'Nevada' ]
State-to-cities dictionary: { Arizona: [...], California: [...], Nevada: [...] }

✅ MDH config updated successfully!
📍 Now serves 3 states: Arizona, California, Nevada
🏙️  State-to-cities mapping added with 3 states
```

## Benefits

- **Automatic**: No manual state or city list maintenance
- **Comprehensive**: Shows both states and specific cities available
- **Consistent**: All businesses use the same location format
- **Scalable**: Easy to add new businesses and locations
- **Clean**: MDH shows states for overview, cities for detail
- **Data-driven**: Perfect for location-based routing and filtering
