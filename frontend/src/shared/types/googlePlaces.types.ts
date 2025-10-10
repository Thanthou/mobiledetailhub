// Google Places API types for location autocomplete
// Shared types - can be used across features

export interface AutocompleteSuggestion {
  placePrediction: {
    place: string;
    placeId: string;
    text: {
      text: string;
      matches: Array<{
        endOffset: number;
        startOffset: number;
      }>;
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: Array<{
          endOffset: number;
          startOffset: number;
        }>;
      };
      secondaryText: {
        text: string;
        matches: Array<{
          endOffset: number;
          startOffset: number;
        }>;
      };
    };
    types: string[];
  };
}

export interface AutocompleteRequest {
  input: string;
  sessionToken: AutocompleteSessionToken;
  includedRegionCodes?: string[];
  locationBias?: google.maps.LatLngBounds | google.maps.LatLng;
  locationRestriction?: google.maps.LatLngBounds | google.maps.LatLng;
  includedPrimaryTypes?: string[];
  includedSecondaryTypes?: string[];
  languageCode?: string;
  regionCode?: string;
  origin?: google.maps.LatLng;
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

export interface AutocompleteSessionToken {
  // This is a Google Maps API object, so we just need to type it as an object
  // The actual implementation is provided by Google Maps
  [key: string]: unknown;
}

export interface PlacesLibrary {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: AutocompleteRequest): Promise<AutocompleteResponse>;
  };
  AutocompleteSessionToken: new () => AutocompleteSessionToken;
}

