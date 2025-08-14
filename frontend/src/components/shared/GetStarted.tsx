import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { findBusinessByLocation } from '../../utils/businessLoader';
import { useLocation } from '../../contexts/LocationContext';

interface GetStartedProps {
  onLocationSubmit?: (location: string, zipCode?: string, city?: string, state?: string) => void;
  placeholder?: string;
  className?: string;
}

const GetStarted: React.FC<GetStartedProps> = ({
  onLocationSubmit,
  placeholder = 'Enter your zip code or city',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  // NEW: use the new Suggestion type (fallback to any for wider TS compatibility)
  const [predictions, setPredictions] = useState<Array<any>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  // NEW: keep a session token per typing session (billing + better relevance)
  const sessionTokenRef = useRef<any | null>(null);
  
  // Get location context at component level
  const { setSelectedLocation } = useLocation();

  // Load Google Places API
  useEffect(() => {
    const loadGooglePlacesAPI = () => {
      // Check if API is already loaded and properly initialized
      if (window.google?.maps?.places && window.google?.maps?.importLibrary) {
        // Give the API a moment to finish initializing
        setTimeout(checkAPIReady, 300);
        return;
      }
      
      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setTimeout(checkAPIReady, 500);
        return;
      }
      
      const script = document.createElement('script');
      const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'DEMO_KEY';
      
      // Use a more robust API loading approach
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(() => checkAPIReady(), 500);
      script.onerror = (err) => {
        console.error('Failed to load Google Maps JS API', err);
        // Disable location functionality if API fails to load
        setApiLoaded(false);
      };
      document.head.appendChild(script);
    };

    const checkAPIReady = async () => {
      try {
        if (!window.google?.maps?.importLibrary) {
          setTimeout(checkAPIReady, 250);
          return;
        }
        // NEW: ensure the modern Autocomplete Data API is available
        const placesLib = (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
        const AutocompleteSuggestion: any = (placesLib as any).AutocompleteSuggestion;
        if (AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          setApiLoaded(true);
          // Test business configs when API is ready
          // testBusinessConfigs(); // Removed since this function no longer exists
        } else {
          // fallback: keep polling a bit more
          setTimeout(checkAPIReady, 250);
        }
      } catch (error) {
        console.error('Google Maps API initialization error:', error);
        // If API fails to initialize, disable location functionality
        setApiLoaded(false);
      }
    };

    loadGooglePlacesAPI();
  }, []);

  // Handle input changes and get predictions (new API)
  const handleInputChange = async (value: string) => {
    setInputValue(value);

    if (!value.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      // reset token for a fresh session when user clears input
      sessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded || !window.google?.maps?.importLibrary) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);
    try {
      // Additional safety check for Google Maps API
      if (!window.google?.maps?.importLibrary) {
        console.warn('Google Maps API not available');
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      const { AutocompleteSuggestion, AutocompleteSessionToken } =
        (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary as any;

      // create (or reuse) a session token for this typing session
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      // Request tuned for city/ZIP entry
      const request: any = {
        input: value,
        region: 'us', // bias to US
        includedPrimaryTypes: ['locality', 'postal_code'], // cities + ZIPs
        // You can also bias or restrict by area later using locationRestriction/origin
      };
      // attach the session token (billing & relevance)
      request.sessionToken = sessionTokenRef.current;

      // NEW: promise-based suggestions
      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setPredictions(suggestions || []);
      setShowPredictions((suggestions || []).length > 0);
    } catch (err) {
      console.error('GetStarted: Error getting suggestions', err);
      setPredictions([]);
      setShowPredictions(false);
      // Disable API if it's consistently failing
      if (err instanceof Error && err.message.includes('wI')) {
        console.warn('Google Maps API appears to be broken, disabling location functionality');
        setApiLoaded(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prediction selection (new API)
  const handlePredictionSelect = async (suggestion: any) => {
    try {
      const label = suggestion.placePrediction.text?.toString?.() ?? '';
      setInputValue(label);
      setShowPredictions(false);
      setPredictions([]);

      let zipCode = '';
      let city = '';
      let state = '';

      // Ask for structured address parts
      const place = suggestion.placePrediction.toPlace(); // implicit placeId binding
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      }); // ends the session under the hood

      const comps = (place.addressComponents || []) as Array<{
        longText?: string;
        shortText?: string;
        types: string[];
      }>;

      const get = (type: string) => comps.find((c) => c.types?.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city =
        get('locality')?.longText ??
        get('postal_town')?.longText ??
        '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      // Find which business serves this location
      await handleLocationSearch(label, zipCode, city, state);
    } catch (e) {
      // graceful fallback: parse the text label
      const text = suggestion?.placePrediction?.text?.toString?.() ?? '';
      const parts = text.split(', ');
      let zip = '', c = '', s = '';
      if (parts.length >= 2) {
        c = parts[0];
        s = parts[1];
      }
      await handleLocationSearch(text, zip, c, s);
    } finally {
      // NEW: reset session token for the next search session
      sessionTokenRef.current = null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await handleLocationSearch(inputValue.trim());
      sessionTokenRef.current = null;
    }
  };

  // New function to handle location search and business routing
  const handleLocationSearch = async (location: string, zipCode?: string, city?: string, state?: string) => {
    setSearchingLocation(true);
    
    try {
      
      // Store the selected location in context
      setSelectedLocation({
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        fullLocation: location
      });
      
      
      // Call the callback if provided
      onLocationSubmit?.(location, zipCode, city, state);
      
      
      // Find which business serves this location
      const businessConfig = await findBusinessByLocation(location, zipCode, city, state);
      
      if (businessConfig) {
        // Found a business that serves this location
        if (businessConfig.slug === 'mdh') {
          // Stay on current domain if it's MDH
          window.location.href = '/';
        } else {
          // Redirect to business subdomain
          const currentProtocol = window.location.protocol;
          const currentHost = window.location.host;
          
          if (currentHost.includes('localhost')) {
            // Development mode - use query parameter
            const redirectUrl = `/?business=${businessConfig.slug}`;
            window.location.href = redirectUrl;
          } else {
            // Production mode - redirect to subdomain
            const subdomain = `${businessConfig.slug}.mobiledetailhub.com`;
            const redirectUrl = `${currentProtocol}//${subdomain}`;
            window.location.href = redirectUrl;
          }
        }
      } else {
        // Could show a message that no service is available in this area
        alert('Sorry, we don\'t currently serve this area. Please contact us for more information.');
      }
    } catch (error) {
      console.error('GetStarted: Error handling location search:', error);
      console.error('GetStarted: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        error
      });
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {!apiLoaded && <div className="mb-2 text-xs text-gray-400 text-center">Loading Google Places…</div>}

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-6 w-6 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={apiLoaded ? placeholder : 'Loading…'}
            className={`w-full pl-12 pr-16 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500 text-lg ${
              apiLoaded ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
            autoComplete="off"
            disabled={!apiLoaded}
          />
          <button
            type="submit"
            className={`absolute inset-y-0 right-0 px-6 flex items-center rounded-r-lg transition-colors duration-200 ${
              apiLoaded ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!apiLoaded}
          >
            <Search className="h-6 w-6" />
          </button>
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

      {showPredictions && predictions.length > 0 && (
        <div
          ref={predictionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {predictions.map((sugg: any, i: number) => (
            <button
              key={i}
              onClick={() => handlePredictionSelect(sugg)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-900">
                  {sugg.placePrediction?.text?.toString?.() ?? ''}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetStarted;
