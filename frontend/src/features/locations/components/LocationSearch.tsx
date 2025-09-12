import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

import { useLocation } from '@/shared/hooks';

import { locationsApi } from '../api/locations.api';
import type { LocationData, SearchResult } from '../schemas/locations.schemas';

interface LocationSearchProps {
  placeholder?: string;
  className?: string;
  id?: string;
  onLocationSelect?: (location: LocationData) => void;
  showIcon?: boolean;
  buttonClassName?: string;
  displayText?: string;
  gapClassName?: string;
  onLocationChange?: (location: string, zipCode?: string, city?: string, state?: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  placeholder = "Enter your zip code or city",
  className = "",
  id = "location-search",
  onLocationSelect,
  showIcon = true,
  onLocationChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { setSelectedLocation } = useLocation() as { setSelectedLocation: (location: LocationData) => void };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Handle search input
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await locationsApi.searchLocations(term);
      setSearchResults(results);
    } catch (err) {
      console.error('Location search error:', err);
      setError('Failed to search locations');
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

    setSelectedLocation(locationData);
    setIsOpen(false);
    setSearchTerm('');
    setSearchResults([]);

    // Call external handlers
    onLocationSelect?.(locationData);
    onLocationChange?.(locationData.fullLocation, locationData.zipCode, locationData.city, locationData.state);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    if (searchResults.length === 0 && searchTerm.length >= 2) {
      void handleSearch(searchTerm);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={searchTerm}
          onChange={(e) => {
            void handleSearch(e.target.value);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
        />
        {showIcon && (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-3 text-gray-500 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mx-auto"></div>
              <span className="ml-2">Searching...</span>
            </div>
          )}
          
          {error && (
            <div className="px-4 py-3 text-red-600 text-center">
              {error}
            </div>
          )}
          
          {!isLoading && !error && searchResults.length === 0 && searchTerm.length >= 2 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              No locations found
            </div>
          )}
          
          {!isLoading && !error && searchResults.map((result, index) => (
            <button
              key={`${result.city}-${result.state}-${String(index)}`}
              onClick={() => { handleLocationSelect(result); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
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
    </div>
  );
};

export default LocationSearch;
