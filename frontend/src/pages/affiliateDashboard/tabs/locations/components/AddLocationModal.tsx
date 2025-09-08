import { MapPin, Plus, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import type { LocationFormData, LocationValidationErrors } from '../types';

// Google Maps API types
interface GoogleMapsWindow {
  google?: {
    maps: {
      importLibrary: (library: string) => Promise<unknown>;
    };
  };
}

interface AutocompleteSuggestion {
  placePrediction: {
    text: {
      toString(): string;
    };
    toPlace(): Place;
  };
}

interface Place {
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types: string[];
  }>;
  fetchFields(options: { fields: string[] }): Promise<void>;
}

interface AutocompleteRequest {
  input: string;
  region: string;
  includedPrimaryTypes: string[];
  sessionToken: AutocompleteSessionToken;
}

// Google Maps session token - using object type instead of empty interface
type AutocompleteSessionToken = object;

interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

interface PlacesLibrary {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: AutocompleteRequest): Promise<AutocompleteResponse>;
  };
  AutocompleteSessionToken: new () => AutocompleteSessionToken;
}


interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (location: LocationFormData) => Promise<{ success: boolean; error?: string }>;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState<LocationFormData>({
    city: '',
    state: '',
    zip: '',
    minimum: 0,
    multiplier: 1.0
  });
  const [errors, setErrors] = useState<LocationValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [predictions, setPredictions] = useState<AutocompleteSuggestion[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<AutocompleteSessionToken | null>(null);

  // Load Google Places API
  useEffect(() => {
    const checkAPIReady = async (): Promise<void> => {
      try {
        const googleWindow = window as GoogleMapsWindow;
        if (!googleWindow.google?.maps.importLibrary) {
          setTimeout(() => void checkAPIReady(), 250);
          return;
        }
        
        const placesLib = await googleWindow.google.maps.importLibrary('places') as PlacesLibrary;
        
        if (typeof placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions === 'function') {
          setApiLoaded(true);
        } else {
          setTimeout(() => void checkAPIReady(), 250);
        }
      } catch (error) {
        console.error('Google Maps API initialization error:', error);
        setApiLoaded(false);
      }
    };

    const loadGooglePlacesAPI = (): void => {
      const googleWindow = window as GoogleMapsWindow;
      if (googleWindow.google?.maps) {
        setTimeout(() => void checkAPIReady(), 300);
        return;
      }
      
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setTimeout(() => void checkAPIReady(), 500);
        return;
      }
      
      const script = document.createElement('script');
      const apiKey = import.meta.env['VITE_GOOGLE_MAPS_API_KEY'] as string;
      
      if (!apiKey) {
        console.error('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
        setApiLoaded(false);
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(() => void checkAPIReady(), 500);
      script.onerror = (err) => {
        console.error('Failed to load Google Maps JS API', err);
        setApiLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGooglePlacesAPI();
  }, []);

  // Handle location input changes and get predictions
  const handleLocationInputChange = useCallback(async (value: string): Promise<void> => {
    setLocationInput(value);

    if (!value.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      sessionTokenRef.current = null;
      return;
    }

    const googleWindow = window as GoogleMapsWindow;
    if (!apiLoaded || !googleWindow.google?.maps.importLibrary) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);
    try {
      const placesLib = await googleWindow.google.maps.importLibrary('places') as PlacesLibrary;

      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
      }

      const request: AutocompleteRequest = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: sessionTokenRef.current,
      };

      const response = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setPredictions(response.suggestions);
      setShowPredictions(response.suggestions.length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setPredictions([]);
      setShowPredictions(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiLoaded]);

  // Handle prediction selection
  const handlePredictionSelect = useCallback(async (suggestion: AutocompleteSuggestion): Promise<void> => {
    try {
      const label = suggestion.placePrediction.text.toString();
      setLocationInput(label);
      setShowPredictions(false);
      setPredictions([]);

      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = place.addressComponents || [];

      const get = (type: string) => comps.find((c) => c.types.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      // Update form data with the selected location
      setFormData(prev => ({
        ...prev,
        city: city,
        state: state,
        zip: zipCode
      }));
    } catch {
      const text = suggestion.placePrediction.text.toString();
      const parts = text.split(', ');
      const zip = '';
      const c = parts[0] ?? '';
      const s = parts[1] ?? '';
      setFormData(prev => ({
        ...prev,
        city: c,
        state: s,
        zip: zip
      }));
    } finally {
      sessionTokenRef.current = null;
    }
  }, []);

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

  const validateForm = useCallback((): boolean => {
    const newErrors: LocationValidationErrors = {};

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.length !== 2) {
      newErrors.state = 'State must be a 2-letter code (e.g., CA, NY)';
    }

    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = 'ZIP code must be 5 digits or 5+4 format';
    }

    if (formData.minimum < 0) {
      newErrors.minimum = 'Minimum must be a positive number';
    }

    if (formData.multiplier <= 0) {
      newErrors.multiplier = 'Multiplier must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onAdd(formData);
      if (result.success) {
        setFormData({ city: '', state: '', zip: '', minimum: 0, multiplier: 1.0 });
        setLocationInput('');
        setErrors({});
        onClose();
      } else {
        setErrors({ general: result.error || 'Failed to add location' });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onAdd, onClose, validateForm]);

  const handleInputChange = (field: keyof LocationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Add Service Location</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Location Search */}
          <div>
            <label htmlFor="location-search" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="location-search"
                ref={inputRef}
                type="text"
                value={locationInput}
                onChange={(e) => void handleLocationInputChange(e.target.value)}
                placeholder={apiLoaded ? "Search for a city or ZIP code" : "Loading..."}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  apiLoaded ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
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
          </div>

          {/* Auto-populated fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city-display" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city-display"
                type="text"
                value={formData.city}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                placeholder="Auto-filled from location"
              />
            </div>

            <div>
              <label htmlFor="state-display" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                id="state-display"
                type="text"
                value={formData.state}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                placeholder="Auto-filled from location"
              />
            </div>

            <div>
              <label htmlFor="zip-display" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                id="zip-display"
                type="text"
                value={formData.zip}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                placeholder="Auto-filled from location"
              />
            </div>
          </div>

          {/* Pricing fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minimum" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum
              </label>
              <input
                type="number"
                id="minimum"
                value={formData.minimum || ''}
                onChange={(e) => { handleInputChange('minimum', parseFloat(e.target.value) || 0); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.minimum ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.minimum && (
                <p className="mt-1 text-sm text-red-600">{errors.minimum}</p>
              )}
            </div>

            <div>
              <label htmlFor="multiplier" className="block text-sm font-medium text-gray-700 mb-1">
                Multiplier
              </label>
              <input
                type="number"
                id="multiplier"
                value={formData.multiplier || ''}
                onChange={(e) => { handleInputChange('multiplier', parseFloat(e.target.value) || 1.0); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.multiplier ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1.00"
                step="0.01"
                min="0.01"
              />
              {errors.multiplier && (
                <p className="mt-1 text-sm text-red-600">{errors.multiplier}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 rounded-md transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Location</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Google Places Predictions Dropdown */}
        {showPredictions && predictions.length > 0 && ReactDOM.createPortal(
          <div
            ref={predictionsRef}
            style={dropdownStyle}
            className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
          >
            {predictions.map((sugg: AutocompleteSuggestion, i: number) => (
              <button
                key={i}
                onClick={() => void handlePredictionSelect(sugg)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-900">
                    {sugg.placePrediction.text.toString()}
                  </span>
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};
