import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

import type { AutocompleteSessionToken, PlacesLibrary } from '@/features/locations';
import { useLocation } from '@/shared/hooks/useLocation';
import { Button } from '../buttons/Button';
import { findBusinessByLocation } from '@/shared/utils';

interface GetStartedProps {
  onLocationSubmit?: (location: string, zipCode?: string, city?: string, state?: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const GetStarted: React.FC<GetStartedProps> = ({
  onLocationSubmit,
  placeholder = 'Enter your zip code or city',
  className = '',
  id,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<Array<{ placePrediction?: { text?: { toString?: () => string }; toPlace?: () => unknown } }>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<AutocompleteSessionToken | null>(null);
  
  const locationContext = useLocation();
  const setSelectedLocation = locationContext.setSelectedLocation;
  const navigate = useNavigate();
  const params = useParams();
  
  // Generate unique ID if none provided
  const inputId = id || `location-search-${Math.random().toString(36).substring(2, 11)}`;

  // Load Google Places API
  useEffect(() => {
    const checkAPIReady = async () => {
      try {
        const googleWindow = window as Window & { google?: { maps?: { importLibrary?: unknown } } };
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
      const googleWindow = window as Window;
      if (googleWindow.google?.maps) {
        setTimeout(() => { void checkAPIReady(); }, 300);
        return;
      }
      
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setTimeout(() => { void checkAPIReady(); }, 500);
        return;
      }
      
      const script = document.createElement('script');
      const apiKey = (import.meta as { env?: { VITE_GOOGLE_MAPS_API_KEY?: string } }).env?.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
        setApiLoaded(false);
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta&loading=async`;
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
      const googleWindow = window as Window & { google?: { maps?: { importLibrary?: unknown } } };
      if (!googleWindow.google?.maps.importLibrary) {
        throw new Error('Google Maps API not loaded');
      }
      const placesLib = (await googleWindow.google.maps.importLibrary('places')) as unknown as PlacesLibrary;
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
      console.error('GetStarted: Error getting suggestions', msg);
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
  const handlePredictionSelect = async (suggestion: unknown) => {
    const sugg = suggestion as {
      placePrediction?: {
        text?: { toString?: () => string };
        toPlace: () => {
          fetchFields: (options: { fields: string[] }) => Promise<void>;
          addressComponents?: Array<{
            longText?: string;
            shortText?: string;
            types: string[];
          }>;
        };
      };
    };
    try {
      const label = sugg.placePrediction?.text?.toString?.() ?? '';
      setInputValue(label);
      setShowPredictions(false);
      setPredictions([]);

      let zipCode: string | undefined = '';
      let city: string | undefined = '';
      let state: string | undefined = '';

      const place = sugg.placePrediction?.toPlace();
      if (place) {
        await place.fetchFields({
          fields: ['addressComponents', 'formattedAddress'],
        });

        const comps = place.addressComponents || [];

        const get = (type: string) => comps.find((c) => c.types.includes(type));
        zipCode = get('postal_code')?.longText ?? '';
        city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
        state = get('administrative_area_level_1')?.shortText ?? '';
      }

      await handleLocationSearch(label, zipCode, city, state);
    } catch {
      const text = sugg.placePrediction?.text?.toString?.() ?? '';
      const parts = text.split(', ');
      const zip: string | undefined = ''; let c: string | undefined = '', s: string | undefined = '';
      if (parts.length >= 2) {
        c = parts[0];
        s = parts[1];
      }
      await handleLocationSearch(text, zip, c, s);
    } finally {
      sessionTokenRef.current = null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Parse manual input for city, state when Google Places doesn't provide structured data
      const input = inputValue.trim();
      let city: string | undefined = '', state: string | undefined = '', zipCode: string | undefined = '';
      
      // Try to parse "City, State" or "City, State Zip" format
      if (input.includes(',')) {
        const parts = input.split(',').map(part => part.trim());
        city = parts[0];
        
        if (parts[1]) {
          // Check if second part contains zip code
          const stateZip = parts[1].split(' ');
          if (stateZip.length > 1 && /^\d{5}(-\d{4})?$/.test(stateZip[stateZip.length - 1] ?? '')) {
            // Last part is a zip code
            state = stateZip.slice(0, -1).join(' ');
            zipCode = stateZip[stateZip.length - 1];
          } else {
            // No zip code, just state
            state = parts[1];
          }
        }
      }
      
      await handleLocationSearch(input, zipCode, city, state);
      sessionTokenRef.current = null;
    }
  };

  // Handle location search and business routing
  const handleLocationSearch = async (location: string, zipCode?: string, city?: string, state?: string) => {
    setSearchingLocation(true);
    
    try {
      // Only set location if we have both city and state
      if (city && state) {
        setSelectedLocation({
          city: city,
          state: state,
          zipCode: zipCode || '',
          fullLocation: location
        });
      }
      
      onLocationSubmit?.(location, zipCode, city, state);
      
      const businessConfig = await findBusinessByLocation(zipCode, city, state);
      
      if (businessConfig) {
      // Check if we're currently on a service page
      const isOnServicePage = params['serviceType'] !== undefined;
      const currentServiceType = params['serviceType'] || '';
        
        const slug = businessConfig.slug ?? '';
        if (slug === 'mdh') {
          if (isOnServicePage) {
            // Stay on service page but navigate to MDH version
            void navigate(`/service/${currentServiceType}`);
            if (window.location.pathname === `/service/${currentServiceType}`) {
              window.location.reload();
            }
          } else {
            void navigate('/');
            if (window.location.pathname === '/') {
              window.location.reload();
            }
          }
        } else {
          if (isOnServicePage) {
            // Stay on service page but navigate to affiliate version
            void navigate(`/${slug}/service/${currentServiceType}`);
            if (window.location.pathname === `/${slug}/service/${currentServiceType}`) {
              window.location.reload();
            }
          } else {
            void navigate(`/${slug}`);
            if (window.location.pathname === `/${slug}`) {
              window.location.reload();
            }
          }
        }
      } else {
        alert('Sorry, we don\'t currently serve this area. Please contact us for more information.');
      }
    } catch (error: unknown) {
      console.error('GetStarted: Error handling location search:', error);
      alert('Sorry, there was an error processing your location. Please try again.');
    } finally {
      setSearchingLocation(false);
    }
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

      <form onSubmit={(e) => { void handleSubmit(e); }} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-6 w-6 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            id={inputId}
            name="location"
            value={inputValue}
            onChange={(e) => { void handleInputChange(e.target.value); }}
            placeholder={apiLoaded ? placeholder : 'Loading…'}
            className={`w-full pl-12 pr-16 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500 text-lg ${
              apiLoaded ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
            autoComplete="off"
            disabled={!apiLoaded}
          />
          <Button
            type="submit"
            variant={apiLoaded ? "primary" : "secondary"}
            className={`absolute inset-y-0 right-0 px-6 rounded-r-lg h-full ${
              apiLoaded ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!apiLoaded}
            leftIcon={<Search className="h-6 w-6" />}
          />
        </div>
      </form>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-center text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
          <span className="ml-2 text-sm">Finding locations…</span>
        </div>
      )}

      {searchingLocation && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-center text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
          <span className="ml-2 text-sm">Finding your local business…</span>
        </div>
      )}

      {showPredictions && predictions.length > 0 && ReactDOM.createPortal(
        <div
          ref={predictionsRef}
          style={dropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((sugg: unknown, i: number) => {
            const suggestion = sugg as {
              placePrediction?: {
                text?: { toString?: () => string };
              };
            };
            return (
            <Button
              key={i}
              onClick={() => { void handlePredictionSelect(sugg); }}
              variant="ghost"
              size="md"
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0 justify-start"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-900">
                  {suggestion.placePrediction?.text?.toString?.() ?? ''}
                </span>
              </div>
            </Button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
  
};

export default GetStarted;
