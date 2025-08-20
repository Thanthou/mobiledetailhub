   // frontend/src/utils/findBusinessByLocation.ts
   export async function findBusinessByLocation(zipCode?: string, city?: string, state?: string) {
    const params = new URLSearchParams();
    if (zipCode) params.append('zip', zipCode);
    if (city) params.append('city', city);
    if (state) params.append('state', state);

    const res = await fetch(`/api/businesses/lookup?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  }