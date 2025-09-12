// frontend/src/shared/utils/findBusinessByLocation.ts
import { config } from '@/../config/env';

interface BusinessLookupResponse {
  slugs?: string[];
}

export async function findBusinessByLocation(zipCode?: string, city?: string, state?: string) {
  const params = new URLSearchParams();
  if (zipCode) params.append('zip', zipCode);
  if (city) params.append('city', city);
  if (state) params.append('state', state);

  const url = `${config.apiUrl}/api/affiliates/lookup?${params.toString()}`;
  
  if (import.meta.env.DEV) {
    // Making request to find business by location
  }
  
  const res = await fetch(url);
  if (!res.ok) {
    if (import.meta.env.DEV) {
      console.error('findBusinessByLocation: Request failed:', res.status, res.statusText);
    }
    return null;
  }
  
  const data = await res.json() as BusinessLookupResponse;
  
  if (import.meta.env.DEV) {
    // Response received
  }
  
  // Return the first affiliate slug found (assuming only 1 for now as mentioned)
  if (data.slugs && data.slugs.length > 0) {
    return { slug: data.slugs[0] };
  }
  
  return null;
}
