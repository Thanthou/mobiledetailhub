// Locations API calls

import type { LocationData, SearchResult } from '../schemas/locations.schemas';

export const locationsApi = {
  // Search for locations by city, state, or zip code
  searchLocations: async (query: string): Promise<SearchResult[]> => {
    // For now, we'll use a simple mock implementation
    // In a real app, this would call a geocoding API like Google Places, Mapbox, etc.
    
    const mockResults: SearchResult[] = [
      {
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      {
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        coordinates: { lat: 34.0522, lng: -118.2437 }
      },
      {
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        coordinates: { lat: 41.8781, lng: -87.6298 }
      },
      {
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        coordinates: { lat: 29.7604, lng: -95.3698 }
      },
      {
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        coordinates: { lat: 33.4484, lng: -112.0740 }
      }
    ];

    // Filter results based on query
    const filteredResults = mockResults.filter(result => 
      result.city.toLowerCase().includes(query.toLowerCase()) ||
      result.state.toLowerCase().includes(query.toLowerCase()) ||
      result.zipCode.includes(query)
    );

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return filteredResults;
  },

  // Get location by coordinates (reverse geocoding)
  getLocationByCoordinates: async (lat: number, lng: number): Promise<LocationData | null> => {
    // Mock implementation - in real app, would call reverse geocoding API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a mock location based on coordinates
    console.log('Getting location for coordinates:', lat, lng);
    return {
      city: 'Sample City',
      state: 'SC',
      zipCode: '12345',
      fullLocation: 'Sample City, SC'
    };
  },

  // Validate location data
  validateLocation: async (location: LocationData): Promise<boolean> => {
    // Mock validation - in real app, would validate against a real geocoding service
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return location.city.length > 0 && location.state.length > 0;
  },

  // Get popular locations (for suggestions)
  getPopularLocations: async (): Promise<SearchResult[]> => {
    // Mock popular locations
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      {
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      {
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        coordinates: { lat: 34.0522, lng: -118.2437 }
      },
      {
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        coordinates: { lat: 41.8781, lng: -87.6298 }
      }
    ];
  },

  // Get service areas for a business
  getServiceAreas: async (businessSlug: string): Promise<LocationData[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/service-areas`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch service areas');
    }
    
    const data = await response.json() as { serviceAreas?: LocationData[] };
    return data.serviceAreas || [];
  },

  // Add service area
  addServiceArea: async (businessSlug: string, location: LocationData): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/service-areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      },
      body: JSON.stringify(location)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add service area');
    }
  },

  // Remove service area
  removeServiceArea: async (businessSlug: string, locationId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/service-areas/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove service area');
    }
  }
};
