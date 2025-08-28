**Note:** Each service area includes the affiliate's `slug` for routing purposes. This enables the footer to redirect users from State → City → Affiliate page.

## Footer Aggregation Endpoint

### Purpose
The `/mdh-config/service-areas` endpoint aggregates all affiliate service areas to power the footer navigation, showing users which states and cities MDH serves.

### Data Structure
```typescript
interface FooterServiceAreas {
  [state: string]: {
    [city: string]: {
      slug: string;    // affiliate slug for routing
      zip?: string;    // optional zip code
    }[];
  };
}
```

### Example Response
```json
{
  "success": true,
  "service_areas": {
    "AZ": {
      "Gilbert": [{"slug": "mesa-detail-pro", "zip": "85233"}],
      "Mesa": [{"slug": "mesa-detail-pro", "zip": "85201"}],
      "Phoenix": [{"slug": "phoenix-mobile-detail", "zip": "85001"}],
      "Tempe": [{"slug": "phoenix-mobile-detail", "zip": "85281"}]
    },
    "CA": {
      "Los Angeles": [{"slug": "california-detail", "zip": "90210"}],
      "San Diego": [{"slug": "california-detail", "zip": "92101"}]
    }
  },
  "count": 2,
  "message": "Found service areas in 2 states"
}
```

### Frontend Usage
```typescript
// Footer shows states
{Object.keys(serviceAreas).map(state => (
  <StateDropdown key={state} state={state} cities={serviceAreas[state]} />
))}

// State dropdown shows cities with affiliate links
{cities.map(city => (
  <Link key={city} to={`/${city.slug}`}>
    {city} ({cities[city].length} affiliate{affiliates.length > 1 ? 's' : ''})
  </Link>
))}
```
