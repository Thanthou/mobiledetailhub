import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

import { locationsApi } from '../api/locations.api';
import type { LocationData, SearchResult } from '../schemas/locations.schemas';

interface LocationSelectorProps {
  locations: LocationData[];
  selectedLocation?: LocationData;
  onLocationSelect: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  placeholder = "Select a location",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await locationsApi.searchLocations(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Location search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (result: SearchResult) => {
    const locationData: LocationData = {
      city: result.city,
      state: result.state,
      zipCode: result.zipCode || '',
      fullLocation: `${result.city}, ${result.state}`
    };

    onLocationSelect(locationData);
    setIsOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Handle existing location selection
  const handleExistingLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    setIsOpen(false);
  };

  return (
    <div ref={selectorRef} className={`relative ${className}`}>
      {/* Selector Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); }}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
      >
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <span className={selectedLocation ? 'text-gray-900' : 'text-gray-500'}>
            {selectedLocation ? selectedLocation.fullLocation : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                void handleSearch(e.target.value);
              }}
              placeholder="Search for a location..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-gray-500 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mx-auto"></div>
              <span className="ml-2 text-sm">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {searchTerm.length >= 2 && searchResults.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Search Results
              </div>
              {searchResults.map((result, index) => (
                <button
                  key={`search-${result.city}-${result.state}-${String(index)}`}
                  onClick={() => {
                    handleLocationSelect(result);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {result.city}, {result.state}
                      </div>
                      {result.zipCode && (
                        <div className="text-sm text-gray-500">
                          {result.zipCode}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Existing Locations */}
          {locations.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Your Locations
              </div>
              {locations.map((location, index) => (
                <button
                  key={`existing-${location.city}-${location.state}-${String(index)}`}
                  onClick={() => {
                    handleExistingLocationSelect(location);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    selectedLocation?.fullLocation === location.fullLocation ? 'bg-orange-50 text-orange-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {location.fullLocation}
                      </div>
                      {location.zipCode && (
                        <div className="text-sm text-gray-500">
                          {location.zipCode}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchTerm.length >= 2 && !isLoading && searchResults.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-center text-sm">
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
