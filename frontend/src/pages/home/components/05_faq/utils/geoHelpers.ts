// Shared geo helper functions for affiliate FAQs
export function getGeoParts(cfg: any) {
  const business = cfg?.business ?? {};
  const serviceLocations: string[] = cfg?.serviceLocations ?? [];

  // Prefer structured geo if present; fall back to address string.
  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  const zip = business.zip || business.postalCode || '';
  const address = business.address || `${city}, ${state}${zip ? ' ' + zip : ''}`;

  const primaryArea = address;
  const nearbyList = serviceLocations?.length
    ? serviceLocations.slice(0, 7).join(", ")
    : `${city}, ${state}`;

  // Human variants for natural insertion
  const cityState = `${city}, ${state}`;

  return { city, state, zip, address, primaryArea, nearbyList, cityState };
}