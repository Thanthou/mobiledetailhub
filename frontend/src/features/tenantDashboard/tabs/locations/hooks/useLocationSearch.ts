import { type CSSProperties, useCallback, useRef, useState } from 'react';

import { type AutocompleteSessionToken, getGoogle } from '@/shared';

interface UseLocationSearchProps {
  apiLoaded: boolean;
}

interface LocationSearchState {
  input: string;
  originalInput: string;
  predictions: google.maps.places.AutocompleteSuggestion[];
  showPredictions: boolean;
  isLoading: boolean;
  dropdownStyle: CSSProperties;
}

export const useLocationSearch = ({ apiLoaded }: UseLocationSearchProps) => {
  const [state, setState] = useState<LocationSearchState>({
    input: '',
    originalInput: '',
    predictions: [],
    showPredictions: false,
    isLoading: false,
    dropdownStyle: {},
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<AutocompleteSessionToken | null>(null);

  const handleInputChange = useCallback(async (value: string) => {
    setState(prev => ({
      ...prev,
      input: value,
      originalInput: value,
    }));

    if (!value.trim()) {
      setState(prev => ({
        ...prev,
        predictions: [],
        showPredictions: false,
      }));
      sessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded) {
      setState(prev => ({
        ...prev,
        predictions: [],
        showPredictions: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const g = getGoogle();
      if (!g?.maps.importLibrary) {
        throw new Error('Google Maps API not loaded');
      }
      const placesLib = (await g.maps.importLibrary('places')) as google.maps.PlacesLibrary;
      const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLib;

      sessionTokenRef.current ??= new AutocompleteSessionToken();

      const request = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: sessionTokenRef.current,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setState(prev => ({
        ...prev,
        predictions: suggestions,
        showPredictions: suggestions.length > 0,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Error getting suggestions', msg);
      setState(prev => ({
        ...prev,
        predictions: [],
        showPredictions: false,
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [apiLoaded]);

  const reset = useCallback(() => {
    setState({
      input: '',
      originalInput: '',
      predictions: [],
      showPredictions: false,
      isLoading: false,
      dropdownStyle: {},
    });
    sessionTokenRef.current = null;
  }, []);

  const setDropdownStyle = useCallback((style: CSSProperties) => {
    setState(prev => ({ ...prev, dropdownStyle: style }));
  }, []);

  return {
    ...state,
    inputRef,
    predictionsRef,
    sessionTokenRef,
    handleInputChange,
    reset,
    setDropdownStyle,
  };
};
