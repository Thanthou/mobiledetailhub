import React, { useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

import { Button } from '@/shared/ui';

import { useLocationSearch } from '../hooks/useLocationSearch';

interface LocationSearchProps {
  apiLoaded: boolean;
  onLocationSelect: (place: { city: string; state: string; zipCode: string }) => void;
  onCancel: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  apiLoaded,
  onLocationSelect,
  onCancel,
  placeholder = "Enter city or ZIP code",
  label = "Search for a city or ZIP code",
  className = "",
}) => {
  const {
    input,
    predictions,
    showPredictions,
    isLoading,
    dropdownStyle,
    inputRef,
    predictionsRef,
    handleInputChange,
    reset,
    setDropdownStyle,
  } = useLocationSearch({ apiLoaded });

  // Update dropdown position when predictions change
  useEffect(() => {
    if (showPredictions && inputRef.current && predictionsRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const predictionsHeight = predictionsRef.current.scrollHeight;
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (spaceBelow < predictionsHeight && spaceAbove > predictionsHeight) {
        setDropdownStyle({
          position: 'absolute',
          top: 'auto',
          bottom: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
        });
      } else {
        setDropdownStyle({
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
        });
      }
    }
  }, [showPredictions, setDropdownStyle, inputRef, predictionsRef]);

  const handlePredictionClick = (prediction: google.maps.places.AutocompleteSuggestion) => {
    try {
      // Extract location data from the AutocompleteSuggestion
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Google Maps types are incomplete
      const structuredFormat = prediction.placePrediction?.structuredFormat;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Google Maps types are incomplete
      const mainText: string = (structuredFormat?.mainText?.text as string | undefined) ?? '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Google Maps types are incomplete
      const secondaryText: string = (structuredFormat?.secondaryText?.text as string | undefined) ?? '';
      
      // Parse the location data
      // For postal_code type: mainText is ZIP, secondaryText is "City, State"
      // For locality type: mainText is City, secondaryText is "State, Country"
      const types = prediction.placePrediction?.types ?? [];
      let city = '';
      let state = '';
      let zipCode = '';

      if (types.includes('postal_code')) {
        zipCode = mainText;
        const parts = secondaryText.split(',').map((s: string) => s.trim());
        city = parts[0] ?? '';
        state = parts[1] ?? '';
      } else if (types.includes('locality')) {
        city = mainText;
        const parts = secondaryText.split(',').map((s: string) => s.trim());
        state = parts[0] ?? '';
      }

      onLocationSelect({ city, state, zipCode });
      reset();
    } catch (err: unknown) {
      console.error('Error parsing place:', err);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor="location-search-input" className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-300 p-1"
          title="Cancel"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="location-search-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { void handleInputChange(e.target.value); }}
          placeholder={apiLoaded ? placeholder : "Loading..."}
          style={{ colorScheme: 'dark' }}
          className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            apiLoaded ? 'border-stone-700 bg-stone-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
          }`}
          disabled={!apiLoaded}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>
      
      {!apiLoaded && (
        <p className="mt-1 text-xs text-gray-500">Loading Google Places API...</p>
      )}

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div
          ref={predictionsRef}
          style={dropdownStyle}
          className="bg-stone-800 border border-stone-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Google Maps types are incomplete
            const structuredFormat = prediction.placePrediction?.structuredFormat;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Google Maps types are incomplete
            const mainText: string = (structuredFormat?.mainText?.text as string | undefined) ?? '';
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Google Maps types are incomplete
            const secondaryText: string = (structuredFormat?.secondaryText?.text as string | undefined) ?? '';
            
            return (
              <button
                key={index}
                onClick={() => { handlePredictionClick(prediction); }}
                className="w-full px-4 py-3 text-left hover:bg-stone-700 transition-colors border-b border-stone-700 last:border-b-0"
              >
                <div className="text-white text-sm">{mainText}</div>
                {secondaryText && (
                  <div className="text-gray-400 text-xs mt-1">{secondaryText}</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
