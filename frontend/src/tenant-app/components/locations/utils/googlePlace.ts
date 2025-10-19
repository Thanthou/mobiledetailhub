export type PlaceField = 'address_components' | 'formatted_address' | 'geometry' | 'name';

export interface ParsedPlace {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  formattedAddress?: string;
  lat?: number;
  lng?: number;
  name?: string;
}

const getComponent = (
  list: google.maps.GeocoderAddressComponent[] | undefined,
  type: string,
  long = true
): string | undefined => {
  if (!list) return;
  const comp = list.find(c => c.types.includes(type));
  return long ? comp?.long_name : comp?.short_name;
};

export const parsePlace = (place: google.maps.places.PlaceResult): ParsedPlace => {
  const comps = place.address_components;
  const location = place.geometry?.location;

  return {
    street: getComponent(comps, 'route'),
    city: getComponent(comps, 'locality') ?? getComponent(comps, 'sublocality'),
    state: getComponent(comps, 'administrative_area_level_1', false),
    postalCode: getComponent(comps, 'postal_code'),
    country: getComponent(comps, 'country', false),
    formattedAddress: place.formatted_address,
    lat: location?.lat(),
    lng: location?.lng(),
    name: place.name
  };
};

export async function importPlaces(): Promise<google.maps.PlacesLibrary> {
  const w = window as Window & { google?: typeof google };
  if (!w.google?.maps.importLibrary) throw new Error('Google Maps not loaded');
  return (await w.google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
}