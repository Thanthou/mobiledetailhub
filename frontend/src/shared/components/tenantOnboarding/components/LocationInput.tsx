import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapPin, Search, X } from 'lucide-react';

import { type AutocompleteSessionToken, type AutocompleteSuggestion, type PlacesLibrary } from '@shared';
import { config } from '@shared/env';
import { Button } from '@shared/ui';

// interface AutocompleteResponse {
//   suggestions?: AutocompleteSuggestion[];
// }

interface LocationInputProps {
  onLocationSubmit: (location: string, zipCode?: string, city?: string, state?: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSubmit,
  placeholder = 'Enter your city, state, or ZIP code',
  className = '',
  value = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<AutocompleteSuggestion[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<AutocompleteSessionToken | null>(null);

  // Update internal state when value prop changes (for test data population)
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  // Load Google Places API
  useEffect(() => {
    const checkAPIReady = async () => {
      try {
        const googleWindow = window as Window & { google?: typeof google };
        if (!googleWindow.google?.maps.importLibrary) {
          setTimeout(() => { void checkAPIReady(); }, 250);
          return;
        }
        
        await googleWindow.google.maps.importLibrary('places');
        setApiLoaded(true);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Google Maps API initialization error:', msg);
        setApiLoaded(false);
      }
    };

    const loadGooglePlacesAPI = () => {
      const googleWindow = window as Window & { google?: typeof google };
      if (googleWindow.google?.maps) {
        setTimeout(() => { void checkAPIReady(); }, 300);
        return;
      }
      
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setTimeout(() => { void checkAPIReady(); }, 500);
        return;
      }
      
      const script = document.createElement('script');
      const apiKey = config.googleMapsApiKey;
      
      if (!apiKey) {
        console.error('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
        setApiLoaded(false);
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        apiKey
      )}&libraries=places&v=beta&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => { setTimeout(() => void checkAPIReady(), 500); };
      script.onerror = (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Failed to load Google Maps JS API', msg);
        setApiLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGooglePlacesAPI();
  }, []);

  // Handle input changes and get predictions
  const handleInputChange = async (value: string) => {
    setInputValue(value);

    if (!value.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      sessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);
    try {
      const googleWindow = window as Window & { google?: typeof google };
      if (!googleWindow.google?.maps.importLibrary) {
        throw new Error('Google Maps API not loaded');
      }
      const placesLib = (await googleWindow.google.maps.importLibrary('places')) as PlacesLibrary;
      const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLib;

      sessionTokenRef.current ??= new AutocompleteSessionToken();

      const request = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: sessionTokenRef.current,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setPredictions(suggestions);
      setShowPredictions(suggestions.length > 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('LocationInput: Error getting suggestions', msg);
      setPredictions([]);
      setShowPredictions(false);
      if (err instanceof Error && err.message.includes('wI')) {
        console.warn('Google Maps API appears to be broken, disabling location functionality');
        setApiLoaded(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prediction selection
  const handlePredictionSelect = (suggestion: AutocompleteSuggestion) => {
    const label = String(suggestion.placePrediction.text);
    
    try {
      setInputValue(label);
      setShowPredictions(false);
      setPredictions([]);

      let zipCode = '';
      let city = '';
      let state = '';

      // For now, we'll parse the text directly since toPlace() may not be available
      const text = String(suggestion.placePrediction.text);
      const parts = text.split(', ');
      
      if (parts.length >= 2) {
        city = parts[0] ?? '';
        state = parts[1] ?? '';
      }

      onLocationSubmit(label, zipCode, city, state);
    } catch (error: unknown) {
      console.error('Error processing prediction:', error);
      
      // Fallback: try to parse the text directly
      const parts = label.split(', ');
      const zip = '';
      let c = '', s = '';
      if (parts.length >= 2) {
        c = parts[0] ?? '';
        s = parts[1] ?? '';
      }
      onLocationSubmit(label, zip, c, s);
    } finally {
      sessionTokenRef.current = null;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Parse manual input for city, state when Google Places doesn't provide structured data
      const input = inputValue.trim();
      let city = '', state = '', zipCode = '';
      
      // Try to parse "City, State" or "City, State Zip" format
      if (input.includes(',')) {
        const parts = input.split(',').map(part => part.trim());
        city = parts[0] ?? '';
        
        if (parts[1]) {
          // Check if second part contains zip code
          const stateZip = parts[1].split(' ');
          const last = stateZip[stateZip.length - 1] ?? '';
          if (stateZip.length > 1 && /^\d{5}(-\d{4})?$/.test(last)) {
            // Last part is a zip code
            state = stateZip.slice(0, -1).join(' ');
            zipCode = last;
          } else {
            // No zip code, just state
            state = parts[1] ?? '';
          }
        }
      }
      
      onLocationSubmit(input, zipCode, city, state);
      sessionTokenRef.current = null;
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setInputValue('');
    setPredictions([]);
    setShowPredictions(false);
    sessionTokenRef.current = null;
    // Clear the form data by calling onLocationSubmit with empty values
    onLocationSubmit('', '', '', '');
    // Focus the input after clearing
    inputRef.current?.focus();
  };

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        predictionsRef.current &&
        !predictionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPredictions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Update dropdown position when predictions are shown
  useEffect(() => {
    if (showPredictions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [showPredictions, predictions.length]);

  return (
    <div className={`relative ${className}`}>
      {!apiLoaded && <div className="mb-2 text-xs text-gray-400 text-center">Loading Google Places…</div>}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MapPin className="h-6 w-6 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          id="location-search-onboarding"
          name="location"
          value={inputValue}
          onChange={(e) => { void handleInputChange(e.target.value); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={apiLoaded ? placeholder : 'Loading…'}
          className={`w-full pl-12 pr-20 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder:text-gray-400 text-lg ${
            apiLoaded ? 'bg-stone-700 border-stone-600' : 'bg-stone-600 border-stone-500'
          }`}
          autoComplete="off"
          disabled={!apiLoaded}
        />
        
        {/* Clear button - only show when there's input */}
        {inputValue && (
          <Button
            type="button"
            onClick={handleClear}
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-16 px-3 text-gray-400 hover:text-white"
            title="Clear location"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          type="button"
          onClick={handleSubmit}
          variant={apiLoaded ? "primary" : "secondary"}
          size="sm"
          className={`absolute inset-y-0 right-0 px-6 rounded-r-lg ${
            apiLoaded ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!apiLoaded}
          leftIcon={<Search className="h-6 w-6" />}
        />
      </div>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-stone-700 border border-stone-600 rounded-lg shadow-lg p-2 text-center text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
          <span className="ml-2 text-sm">Finding locations…</span>
        </div>
      )}

      {showPredictions && predictions.length > 0 && ReactDOM.createPortal(
        <div
          ref={predictionsRef}
          style={dropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((sugg: AutocompleteSuggestion, i: number) => (
            <Button
              key={i}
              onClick={() => { handlePredictionSelect(sugg); }}
              variant="ghost"
              size="md"
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0 justify-start"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-900">
                  {String(sugg.placePrediction.text)}
                </span>
              </div>
            </Button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default LocationInput;
