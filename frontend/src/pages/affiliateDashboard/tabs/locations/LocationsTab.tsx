import { AlertCircle, ChevronDown, ChevronRight,MapPin, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect,useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import type { DetailerData } from '../../types';
import { AddLocationModal } from './components/AddLocationModal';
import { DeleteLocationModal } from './components/DeleteLocationModal';
import { useLocationsData } from './hooks/useLocationsData';
import type { LocationFormData,ServiceArea } from './types';

// Google Places API Type Definitions
interface AutocompleteRequest {
  input: string;
  region: string;
  includedPrimaryTypes: string[];
  sessionToken: google.maps.places.AutocompleteSessionToken;
}



interface LocationsTabProps {
  detailerData?: DetailerData;
}

const LocationsTab: React.FC<LocationsTabProps> = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<ServiceArea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State organization and collapsible functionality
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  
  // Primary Service Area edit state
  const [isPrimaryEditMode, setIsPrimaryEditMode] = useState(false);
  const [primaryLocationInput, setPrimaryLocationInput] = useState('');
  const [primaryOriginalInput, setPrimaryOriginalInput] = useState(''); // Store original input for ZIP extraction
  const [primaryPredictions, setPrimaryPredictions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [showPrimaryPredictions, setShowPrimaryPredictions] = useState(false);
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);
  const [primaryDropdownStyle, setPrimaryDropdownStyle] = useState<React.CSSProperties>({});

  
  // Service area location search state (similar to primary)
  const [isServiceAreaEditMode, setIsServiceAreaEditMode] = useState(false);
  const [serviceAreaLocationInput, setServiceAreaLocationInput] = useState('');
  const [serviceAreaOriginalInput, setServiceAreaOriginalInput] = useState(''); // Store original input for ZIP extraction
  const [serviceAreaPredictions, setServiceAreaPredictions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [showServiceAreaPredictions, setShowServiceAreaPredictions] = useState(false);
  const [isServiceAreaLoading, setIsServiceAreaLoading] = useState(false);
  const [serviceAreaDropdownStyle, setServiceAreaDropdownStyle] = useState<React.CSSProperties>({});
  const [apiLoaded, setApiLoaded] = useState(false);
  
  // Individual location edit state
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingLocationInput, setEditingLocationInput] = useState('');
  const [editingLocationOriginalInput, setEditingLocationOriginalInput] = useState(''); // Store original input for ZIP extraction
  const [editingLocationPredictions, setEditingLocationPredictions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [showEditingLocationPredictions, setShowEditingLocationPredictions] = useState(false);
  const [isEditingLocationLoading, setIsEditingLocationLoading] = useState(false);
  const [editingLocationDropdownStyle, setEditingLocationDropdownStyle] = useState<React.CSSProperties>({});

  // Primary service area refs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const primaryPredictionsRef = useRef<HTMLDivElement>(null);
  const primarySessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  
  // Service area refs
  const serviceAreaInputRef = useRef<HTMLInputElement>(null);
  const serviceAreaPredictionsRef = useRef<HTMLDivElement>(null);
  const serviceAreaSessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  
  // Editing location refs
  const editingLocationInputRef = useRef<HTMLInputElement>(null);
  const editingLocationPredictionsRef = useRef<HTMLDivElement>(null);
  const editingLocationSessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load Google Places API
  useEffect(() => {
    const checkAPIReady = async (): Promise<void> => {
      try {
        if (!window.google.maps.importLibrary) {
          setTimeout(() => void checkAPIReady(), 250);
          return;
        }
        
        const placesLib = await window.google.maps.importLibrary('places');
        
        if (placesLib && typeof placesLib === 'object' && 'AutocompleteSuggestion' in placesLib) {
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
      if (window.google.maps) {
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

  const {
    locations,
    loading,
    error,
    addLocation,
    removeLocation,
    updateLocationField
  } = useLocationsData();

  // Get primary service area from locations data (where primary: true)
  const primaryServiceArea = locations.find(location => location.primary);

  // Group locations by state
  const locationsByState = React.useMemo(() => {
    const grouped: Record<string, ServiceArea[]> = {};
    
    locations.forEach(location => {
      if (!location.primary) { // Exclude primary service area from state grouping
        const state = location.state.toUpperCase();
        if (state && !grouped[state]) {
          grouped[state] = [];
        }
        if (state && grouped[state]) {
          grouped[state].push(location);
        }
      }
    });
    
    // Sort locations within each state by city
    Object.keys(grouped).forEach(state => {
      if (grouped[state]) {
        grouped[state].sort((a, b) => a.city.localeCompare(b.city));
      }
    });
    
    return grouped;
  }, [locations]);

  // Get sorted state names
  const stateNames = React.useMemo(() => {
    return Object.keys(locationsByState).sort();
  }, [locationsByState]);

  // Toggle state expansion
  const toggleStateExpansion = (state: string) => {
    setExpandedStates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(state)) {
        newSet.delete(state);
      } else {
        newSet.add(state);
      }
      return newSet;
    });
  };

  // Expand all states
  const expandAllStates = () => {
    setExpandedStates(new Set(stateNames));
  };

  // Collapse all states
  const collapseAllStates = () => {
    setExpandedStates(new Set());
  };

  // Helper function to update primary service area
  const updatePrimaryServiceAreaField = (field: keyof ServiceArea, value: string | number) => {
    void updateLocationField('primary', field, value);
  };

  // Handle primary service area location input changes and get predictions
  const handlePrimaryLocationInputChange = async (value: string): Promise<void> => {
    setPrimaryLocationInput(value);
    // Store the original input for ZIP code extraction
    setPrimaryOriginalInput(value);

    if (!value.trim()) {
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
      primarySessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded) {
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
      return;
    }

    setIsPrimaryLoading(true);
    try {
      const placesLib = await window.google.maps.importLibrary('places');

      if (!primarySessionTokenRef.current) {
        primarySessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }

      const request: AutocompleteRequest = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: primarySessionTokenRef.current,
      };

      const response = await (placesLib as { AutocompleteSuggestion: { fetchAutocompleteSuggestions: (req: AutocompleteRequest) => Promise<{ suggestions?: google.maps.places.AutocompleteSuggestion[] }> } }).AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      const suggestions = response.suggestions || [];
      setPrimaryPredictions(suggestions);
      setShowPrimaryPredictions(suggestions.length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
    } finally {
      setIsPrimaryLoading(false);
    }
  };

  // Handle service area location input changes and get predictions
  const handleServiceAreaLocationInputChange = async (value: string): Promise<void> => {
    setServiceAreaLocationInput(value);
    // Store the original input for ZIP code extraction
    setServiceAreaOriginalInput(value);

    if (!value.trim()) {
      setServiceAreaPredictions([]);
      setShowServiceAreaPredictions(false);
      serviceAreaSessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded) {
      setServiceAreaPredictions([]);
      setShowServiceAreaPredictions(false);
      return;
    }

    setIsServiceAreaLoading(true);
    try {
      const placesLib = await window.google.maps.importLibrary('places');

      if (!serviceAreaSessionTokenRef.current) {
        serviceAreaSessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }

      const request: AutocompleteRequest = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: serviceAreaSessionTokenRef.current,
      };

      const response = await (placesLib as { AutocompleteSuggestion: { fetchAutocompleteSuggestions: (req: AutocompleteRequest) => Promise<{ suggestions?: google.maps.places.AutocompleteSuggestion[] }> } }).AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      const suggestions = response.suggestions || [];
      setServiceAreaPredictions(suggestions);
      setShowServiceAreaPredictions(suggestions.length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setServiceAreaPredictions([]);
      setShowServiceAreaPredictions(false);
    } finally {
      setIsServiceAreaLoading(false);
    }
  };

  // Handle primary service area prediction selection
  const handlePrimaryPredictionSelect = async (suggestion: google.maps.places.AutocompleteSuggestion): Promise<void> => {
    try {
      const label = suggestion.placePrediction?.text.toString() || '';
      setPrimaryLocationInput(label);
      setShowPrimaryPredictions(false);
      setPrimaryPredictions([]);

      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(primaryOriginalInput);
      
      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction?.toPlace();
      if (!place) return;
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = (place.addressComponents || []);

      const get = (type: string) => comps.find((c) => c.types.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      // If we found a ZIP code in the input, use that instead of the one from address components
      if (inputZipCode) {
        zipCode = inputZipCode;
      } else if (!zipCode && city && state) {
        // If no ZIP code was found, attempt to extract one for city,state
        zipCode = await attemptZipCodeExtraction(city, state);
      }

      // Update primary service area in locations data
      if (primaryServiceArea) {
        
        // TODO: Implement updatePrimaryServiceArea function
        // await updatePrimaryServiceArea(updatedLocation);
      }

      // Exit edit mode - process is complete
      setIsPrimaryEditMode(false);
      setPrimaryLocationInput('');
      setPrimaryOriginalInput(''); // Reset original input
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);

    } catch {
      const text = suggestion.placePrediction?.text.toString() ?? '';
      const parts = text.split(', ');
      let c = '', s = '';
      
      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(primaryOriginalInput);
      
      if (parts.length >= 2) {
        c = parts[0] || '';
        s = parts[1] || '';
        // Use input ZIP code if available, otherwise attempt to get ZIP code for the parsed city,state
        if (!inputZipCode && c && s) {
          await attemptZipCodeExtraction(c, s);
        }
      }
      // Update primary service area in locations data
      if (primaryServiceArea) {
        
        // TODO: Implement updatePrimaryServiceArea function
        // await updatePrimaryServiceArea(updatedLocation);
      }

      // Exit edit mode - process is complete
      setIsPrimaryEditMode(false);
      setPrimaryLocationInput('');
      setPrimaryOriginalInput(''); // Reset original input
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
    } finally {
      primarySessionTokenRef.current = null;
    }
  };

  // Handle service area prediction selection
  const handleServiceAreaPredictionSelect = async (suggestion: google.maps.places.AutocompleteSuggestion): Promise<void> => {
    try {
      const label = suggestion.placePrediction?.text.toString() || '';
      setServiceAreaLocationInput(label);
      setShowServiceAreaPredictions(false);
      setServiceAreaPredictions([]);

      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(serviceAreaOriginalInput);
      
      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction?.toPlace();
      if (!place) return;
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = (place.addressComponents || []);

      const get = (type: string) => comps.find((c) => c.types.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      // If we found a ZIP code in the input, use that instead of the one from address components
      if (inputZipCode) {
        zipCode = inputZipCode;
      } else if (!zipCode && city && state) {
        // If no ZIP code was found, attempt to extract one for city,state
        zipCode = await attemptZipCodeExtraction(city, state);
      }

      // Add location directly with default values
      const locationData: Omit<ServiceArea, 'id'> = {
        city: city,
        state: state,
        zip: zipCode ? parseInt(zipCode, 10) : null,
        primary: false,
        minimum: 0,
        multiplier: 1.0
      };

      const result = await addLocation(locationData);
      if (result.success) {
        // Exit edit mode - process is complete
        setIsServiceAreaEditMode(false);
        setServiceAreaLocationInput('');
        setServiceAreaOriginalInput(''); // Reset original input
        setServiceAreaPredictions([]);
        setShowServiceAreaPredictions(false);
      }

    } catch {
      const text = suggestion.placePrediction?.text.toString() ?? '';
      const parts = text.split(', ');
      let zip = '', c = '', s = '';
      
      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(serviceAreaOriginalInput);
      
      if (parts.length >= 2) {
        c = parts[0] || '';
        s = parts[1] || '';
        // Use input ZIP code if available, otherwise attempt to get ZIP code for the parsed city,state
        if (inputZipCode) {
          zip = inputZipCode;
        } else if (c && s) {
          zip = await attemptZipCodeExtraction(c, s);
        }
      }
      
      // Add location directly with default values
      const locationData: Omit<ServiceArea, 'id'> = {
        city: c,
        state: s,
        zip: zip ? parseInt(zip, 10) : null,
        primary: false,
        minimum: 0,
        multiplier: 1.0
      };

      const result = await addLocation(locationData);
      if (result.success) {
        // Exit edit mode - process is complete
        setIsServiceAreaEditMode(false);
        setServiceAreaLocationInput('');
        setServiceAreaOriginalInput(''); // Reset original input
        setServiceAreaPredictions([]);
        setShowServiceAreaPredictions(false);
      }
    } finally {
      serviceAreaSessionTokenRef.current = null;
    }
  };

  // Handle editing location input changes and get predictions
  const handleEditingLocationInputChange = async (value: string): Promise<void> => {
    setEditingLocationInput(value);
    // Store the original input for ZIP code extraction
    if (!editingLocationOriginalInput) {
      setEditingLocationOriginalInput(value);
    }

    if (!value.trim()) {
      setEditingLocationPredictions([]);
      setShowEditingLocationPredictions(false);
      editingLocationSessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded) {
      setEditingLocationPredictions([]);
      setShowEditingLocationPredictions(false);
      return;
    }

    setIsEditingLocationLoading(true);
    try {
      const placesLib = await window.google.maps.importLibrary('places');

      if (!editingLocationSessionTokenRef.current) {
        editingLocationSessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }

      const request: AutocompleteRequest = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: editingLocationSessionTokenRef.current,
      };

      const response = await (placesLib as { AutocompleteSuggestion: { fetchAutocompleteSuggestions: (req: AutocompleteRequest) => Promise<{ suggestions?: google.maps.places.AutocompleteSuggestion[] }> } }).AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      const suggestions = response.suggestions || [];
      setEditingLocationPredictions(suggestions);
      setShowEditingLocationPredictions(suggestions.length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setEditingLocationPredictions([]);
      setShowEditingLocationPredictions(false);
    } finally {
      setIsEditingLocationLoading(false);
    }
  };

  // Handle editing location prediction selection
  const handleEditingLocationPredictionSelect = async (suggestion: google.maps.places.AutocompleteSuggestion): Promise<void> => {
    if (!editingLocationId) return;

    try {
      const label = suggestion.placePrediction?.text.toString() || '';
      setEditingLocationInput(label);
      setShowEditingLocationPredictions(false);
      setEditingLocationPredictions([]);

      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(editingLocationOriginalInput || '');
      
      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction?.toPlace();
      if (!place) return;
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = (place.addressComponents || []);

      const get = (type: string) => comps.find((c) => c.types.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      // If we found a ZIP code in the input, use that instead of the one from address components
      if (inputZipCode) {
        zipCode = inputZipCode;
      } else if (!zipCode && city && state) {
        // If no ZIP code was found, attempt to extract one for city,state
        zipCode = await attemptZipCodeExtraction(city, state);
      }

      // TODO: Implement updateLocation function
      // const result = await updateLocation(editingLocationId, {
      //   city: city,
      //   state: state,
      //   zip: zipCode,
      //   minimum: 0, // Keep existing values, will be updated separately
      //   multiplier: 1.0
      // });
      // if (result.success) {
        // Exit edit mode - process is complete
        setEditingLocationId(null);
        setEditingLocationInput('');
        setEditingLocationOriginalInput(''); // Reset original input
        setEditingLocationPredictions([]);
        setShowEditingLocationPredictions(false);
      // }

    } catch {
      const text = suggestion.placePrediction?.text.toString() ?? '';
      const parts = text.split(', ');
      let c = '', s = '';
      
      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(editingLocationOriginalInput || '');
      
      if (parts.length >= 2) {
        c = parts[0] || '';
        s = parts[1] || '';
        // Use input ZIP code if available, otherwise attempt to get ZIP code for the parsed city,state
        if (inputZipCode) {
          // zip = inputZipCode; // Not used in this context
        } else if (c && s) {
          // zip = await attemptZipCodeExtraction(c, s); // Not used in this context
        }
      }
      
      // TODO: Implement updateLocation function
      // const result = await updateLocation(editingLocationId, {
      //   city: c,
      //   state: s,
      //   zip: zip,
      //   minimum: 0, // Keep existing values, will be updated separately
      //   multiplier: 1.0
      // });
      // if (result.success) {
        // Exit edit mode - process is complete
        setEditingLocationId(null);
        setEditingLocationInput('');
        setEditingLocationOriginalInput(''); // Reset original input
        setEditingLocationPredictions([]);
        setShowEditingLocationPredictions(false);
      // }
    } finally {
      editingLocationSessionTokenRef.current = null;
    }
  };

  // Helper function to extract ZIP code from input text
  const extractZipFromInput = (input: string): string => {
    // Look for 5-digit ZIP code pattern
    const zipMatch = input.match(/\b(\d{5}(-\d{4})?)\b/);
    const result = zipMatch?.[1] || '';
    return result;
  };

  // Attempt to get ZIP code for city,state combinations
  const attemptZipCodeExtraction = async (city: string, state: string): Promise<string> => {
    if (!apiLoaded) {
      return '';
    }

    try {
      const placesLib = await window.google.maps.importLibrary('places');

      const sessionToken = new google.maps.places.AutocompleteSessionToken();
      const request: AutocompleteRequest = {
        input: `${city}, ${state}`,
        region: 'us',
        includedPrimaryTypes: ['locality'],
        sessionToken: sessionToken,
      };

      const response = await (placesLib as { AutocompleteSuggestion: { fetchAutocompleteSuggestions: (req: AutocompleteRequest) => Promise<{ suggestions?: google.maps.places.AutocompleteSuggestion[] }> } }).AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      const suggestions = response.suggestions || [];
      
      if (suggestions.length > 0) {
        // Try the first suggestion
        const suggestion = suggestions[0];
        if (!suggestion) return '';
        const place = (suggestion).placePrediction?.toPlace();
        if (!place) return '';
        await place.fetchFields({
          fields: ['addressComponents'],
        });

        const comps = ((place).addressComponents || []);

        const get = (type: string) => comps.find((c: { types: string[] }) => c.types.includes(type));
        const zipCode = get('postal_code')?.longText ?? '';
        
        // Validate the ZIP code
        if (zipCode && /^\d{5}(-\d{4})?$/.test(zipCode)) {
          return zipCode;
        }
      }
    } catch {
      // Could not extract ZIP code for city,state
    }
    
    return '';
  };

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle primary service area predictions
      if (
        primaryPredictionsRef.current &&
        !primaryPredictionsRef.current.contains(event.target as Node) &&
        primaryInputRef.current &&
        !primaryInputRef.current.contains(event.target as Node)
      ) {
        setShowPrimaryPredictions(false);
      }
      
      // Handle service area predictions
      if (
        serviceAreaPredictionsRef.current &&
        !serviceAreaPredictionsRef.current.contains(event.target as Node) &&
        serviceAreaInputRef.current &&
        !serviceAreaInputRef.current.contains(event.target as Node)
      ) {
        setShowServiceAreaPredictions(false);
      }
      
      // Handle editing location predictions
      if (
        editingLocationPredictionsRef.current &&
        !editingLocationPredictionsRef.current.contains(event.target as Node) &&
        editingLocationInputRef.current &&
        !editingLocationInputRef.current.contains(event.target as Node)
      ) {
        setShowEditingLocationPredictions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Update service area dropdown position when predictions are shown
  useEffect(() => {
    if (showServiceAreaPredictions && serviceAreaInputRef.current) {
      const rect = serviceAreaInputRef.current.getBoundingClientRect();
      setServiceAreaDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [showServiceAreaPredictions, serviceAreaPredictions.length]);

  // Update primary dropdown position when predictions are shown
  useEffect(() => {
    if (showPrimaryPredictions && primaryInputRef.current) {
      const rect = primaryInputRef.current.getBoundingClientRect();
      setPrimaryDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [showPrimaryPredictions, primaryPredictions.length]);

  // Update editing location dropdown position when predictions are shown
  useEffect(() => {
    if (showEditingLocationPredictions && editingLocationInputRef.current) {
      const rect = editingLocationInputRef.current.getBoundingClientRect();
      setEditingLocationDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [showEditingLocationPredictions, editingLocationPredictions.length]);

  // Focus input fields when edit modes are activated
  useEffect(() => {
    if (isPrimaryEditMode && primaryInputRef.current) {
      primaryInputRef.current.focus();
    }
  }, [isPrimaryEditMode]);

  useEffect(() => {
    if (isServiceAreaEditMode && serviceAreaInputRef.current) {
      serviceAreaInputRef.current.focus();
    }
  }, [isServiceAreaEditMode]);

  useEffect(() => {
    if (editingLocationId && editingLocationInputRef.current) {
      editingLocationInputRef.current.focus();
    }
  }, [editingLocationId]);

  const handleAddLocation = async (locationData: LocationFormData): Promise<{ success: boolean; error?: string }> => {
    const serviceAreaData: Omit<ServiceArea, 'id'> = {
      ...locationData,
      zip: locationData.zip ? parseInt(locationData.zip, 10) : null,
      primary: false
    };
    return await addLocation(serviceAreaData);
  };



  const handleDeleteLocation = async (): Promise<void> => {
    if (!locationToDelete) return;

    setIsDeleting(true);
    try {
      const locationId = `${locationToDelete.city}-${locationToDelete.state}`;
      const result = await removeLocation(locationId);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setLocationToDelete(null);
      } else {
        console.error('Failed to delete location:', result.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (location: ServiceArea) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLocationToDelete(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Locations</h2>
            <p className="text-gray-600 mt-1">Manage the areas where you provide services</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Locations</h2>
            <p className="text-gray-600 mt-1">Manage the areas where you provide services</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Locations</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Primary Service Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-orange-500">Primary Service Area</h3>
        </div>
        
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : !primaryServiceArea ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-600">No primary service area found</p>
            </div>
          ) : isPrimaryEditMode ? (
            // Edit mode - show location search
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="primary-location-search" className="block text-sm font-medium text-gray-300">
                  Search for a city or ZIP code
                </label>
                <button
                  onClick={() => { setIsPrimaryEditMode(false); }}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  title="Cancel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="primary-location-search"
                  ref={primaryInputRef}
                  type="text"
                  value={primaryLocationInput}
                  onChange={(e) => void handlePrimaryLocationInputChange(e.target.value)}
                  placeholder={apiLoaded ? "Enter city or ZIP code" : "Loading..."}
                  style={{ colorScheme: 'dark' }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    apiLoaded ? 'border-stone-700 bg-stone-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                  disabled={!apiLoaded}
                />
                {isPrimaryLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              {!apiLoaded && (
                <p className="mt-1 text-xs text-gray-500">Loading Google Places API...</p>
              )}
            </div>
          ) : (
            // Read-only mode - show current data with clickable location fields
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="primary-city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input
                  id="primary-city"
                  type="text"
                  value={primaryServiceArea.city || ''}
                  readOnly
                  onClick={() => { setIsPrimaryEditMode(true); }}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                  title="Click to edit location"
                />
              </div>
              <div>
                <label htmlFor="primary-state" className="block text-sm font-medium text-gray-300 mb-1">State</label>
                <input
                  id="primary-state"
                  type="text"
                  value={primaryServiceArea.state || ''}
                  readOnly
                  onClick={() => { setIsPrimaryEditMode(true); }}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                  title="Click to edit location"
                />
              </div>
              <div>
                <label htmlFor="primary-zip" className="block text-sm font-medium text-gray-300 mb-1">Zip</label>
                <input
                  id="primary-zip"
                  type="text"
                  value={primaryServiceArea.zip || ''}
                  readOnly
                  onClick={() => { setIsPrimaryEditMode(true); }}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                  title="Click to edit location"
                />
              </div>
              <div>
                <label htmlFor="primary-minimum" className="block text-sm font-medium text-gray-300 mb-1">Minimum</label>
                <input
                  id="primary-minimum"
                  type="number"
                  value={primaryServiceArea.minimum || ''}
                  onChange={(e) => {
                    const newMinimum = parseFloat(e.target.value) || 0;
                    updatePrimaryServiceAreaField('minimum', newMinimum);
                    // TODO: Implement API call to updatePrimaryServiceAreaMinimum
                    // updatePrimaryServiceAreaMinimum(newMinimum);
                  }}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label htmlFor="primary-multiplier" className="block text-sm font-medium text-gray-300 mb-1">Multiplier</label>
                <input
                  id="primary-multiplier"
                  type="number"
                  step="0.01"
                  value={primaryServiceArea.multiplier || ''}
                  onChange={(e) => {
                    const newMultiplier = parseFloat(e.target.value) || 1.0;
                    updatePrimaryServiceAreaField('multiplier', newMultiplier);
                    // TODO: Implement API call to updatePrimaryServiceAreaMultiplier
                    // updatePrimaryServiceAreaMultiplier(newMultiplier);
                  }}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Areas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-orange-500">Service Areas</h3>
            {stateNames.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={expandAllStates}
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Expand All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={collapseAllStates}
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
          {!isServiceAreaEditMode && (
            <button
              onClick={() => { setIsServiceAreaEditMode(true); }}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </button>
          )}
        </div>
        
        {isServiceAreaEditMode && (
          <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="service-area-location-input" className="block text-sm font-medium text-gray-300">
                  Search for a city or ZIP code
                </label>
                <button
                  onClick={() => { setIsServiceAreaEditMode(false); }}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  title="Cancel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="service-area-location-input"
                  ref={serviceAreaInputRef}
                  type="text"
                  value={serviceAreaLocationInput}
                  onChange={(e) => void handleServiceAreaLocationInputChange(e.target.value)}
                  placeholder={apiLoaded ? "Enter city or ZIP code" : "Loading..."}
                  style={{ colorScheme: 'dark' }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    apiLoaded ? 'border-stone-700 bg-stone-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                  disabled={!apiLoaded}
                />
                {isServiceAreaLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              {!apiLoaded && (
                <p className="mt-1 text-xs text-gray-500">Loading Google Places API...</p>
              )}
            </div>
          </div>
        )}
        
        {/* State-organized Service Areas */}
        {stateNames.length > 0 ? (
          <div className="space-y-3">
            {stateNames.map((state) => {
              const stateLocations = locationsByState[state];
              const isExpanded = expandedStates.has(state);
              const locationCount = stateLocations?.length || 0;
              
              return (
                <div key={state} className="bg-stone-800 border border-stone-700 rounded-lg overflow-hidden">
                  {/* State Header */}
                  <button
                    onClick={() => { toggleStateExpansion(state); }}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-orange-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-orange-500" />
                      )}
                      <h4 className="text-lg font-semibold text-white">{state}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {locationCount} {locationCount === 1 ? 'location' : 'locations'}
                      </span>
                    </div>
                  </button>
                  
                  {/* State Locations */}
                  {isExpanded && stateLocations && (
                    <div className="border-t border-stone-700">
                      <div className="p-6 space-y-4">
                        {stateLocations.map((location, index) => {
                          const locationId = `${location.city}-${location.state}`;
                          const isEditingThisLocation = editingLocationId === locationId;
                          
                          return (
                            <div key={`${location.city}-${location.state}-${(index + 1).toString()}`} className="bg-stone-700 border border-stone-600 rounded-lg p-4">
                              {isEditingThisLocation ? (
                                // Edit mode - show location search
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <label htmlFor={`editing-location-input-${locationId}`} className="block text-sm font-medium text-gray-300">
                                      Search for a city or ZIP code
                                    </label>
                                    <button
                                      onClick={() => { setEditingLocationId(null); }}
                                      className="text-gray-400 hover:text-gray-300 transition-colors"
                                      title="Cancel"
                                    >
                                      <X className="h-5 w-5" />
                                    </button>
                                  </div>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                      id={`editing-location-input-${locationId}`}
                                      ref={editingLocationInputRef}
                                      type="text"
                                      value={editingLocationInput}
                                      onChange={(e) => void handleEditingLocationInputChange(e.target.value)}
                                      placeholder={apiLoaded ? "Enter city or ZIP code" : "Loading..."}
                                      style={{ colorScheme: 'dark' }}
                                      className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                        apiLoaded ? 'border-stone-600 bg-stone-600 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                                      }`}
                                      disabled={!apiLoaded}
                                    />
                                    {isEditingLocationLoading && (
                                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                      </div>
                                    )}
                                  </div>
                                  {!apiLoaded && (
                                    <p className="mt-1 text-xs text-gray-500">Loading Google Places API...</p>
                                  )}
                                </div>
                              ) : (
                                // Read-only mode - show current data with clickable location fields
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                  <div>
                                    <label htmlFor={`edit-city-${String(index)}`} className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                    <input
                                      id={`edit-city-${String(index)}`}
                                      type="text"
                                      value={location.city}
                                      readOnly
                                      onClick={() => {
                                        setEditingLocationId(locationId);
                                        setEditingLocationInput('');
                                      }}
                                      className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors"
                                      title="Click to edit location"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`edit-state-${String(index)}`} className="block text-sm font-medium text-gray-300 mb-1">State</label>
                                    <input
                                      id={`edit-state-${String(index)}`}
                                      type="text"
                                      value={location.state}
                                      readOnly
                                      onClick={() => {
                                        setEditingLocationId(locationId);
                                        setEditingLocationInput('');
                                      }}
                                      className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors"
                                      title="Click to edit location"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`edit-zip-${String(index)}`} className="block text-sm font-medium text-gray-300 mb-1">Zip</label>
                                    <input
                                      id={`edit-zip-${String(index)}`}
                                      type="text"
                                      value={location.zip || ''}
                                      readOnly
                                      onClick={() => {
                                        setEditingLocationId(locationId);
                                        setEditingLocationInput('');
                                      }}
                                      className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors"
                                      title="Click to edit location"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`edit-minimum-${String(index)}`} className="block text-sm font-medium text-gray-300 mb-1">Minimum</label>
                                    <input
                                      id={`edit-minimum-${String(index)}`}
                                      type="number"
                                      value={location.minimum || ''}
                                                                              onChange={(e) => {
                                          const newMinimum = parseFloat(e.target.value) || 0;
                                          void updateLocationField(locationId, 'minimum', newMinimum);
                                        }}
                                      className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`edit-multiplier-${String(index)}`} className="block text-sm font-medium text-gray-300 mb-1">Multiplier</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        id={`edit-multiplier-${String(index)}`}
                                        type="number"
                                        step="0.01"
                                        value={location.multiplier || ''}
                                        onChange={(e) => {
                                          const newMultiplier = parseFloat(e.target.value) || 1.0;
                                          void updateLocationField(locationId, 'multiplier', newMultiplier);
                                        }}
                                        className="w-1/4 px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      />
                                      <button
                                        onClick={() => { openDeleteModal(location); }}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors flex-shrink-0 h-8 w-8 flex items-center justify-center"
                                        title="Delete location"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
            <div className="text-center text-gray-400">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p className="text-lg font-medium mb-2">No service areas added yet</p>
              <p className="text-sm">Add your first service area to get started</p>
            </div>
          </div>
        )}
      </div>



      {/* Service Area Google Places Predictions Dropdown */}
      {showServiceAreaPredictions && serviceAreaPredictions.length > 0 && ReactDOM.createPortal(
        <div
          ref={serviceAreaPredictionsRef}
          style={serviceAreaDropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {serviceAreaPredictions.map((sugg: google.maps.places.AutocompleteSuggestion, i: number) => (
            <button
              key={i}
              onClick={() => { void handleServiceAreaPredictionSelect(sugg); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-900">
                  {sugg.placePrediction?.text.toString() ?? ''}
                </span>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* Primary Service Area Google Places Predictions Dropdown */}
      {showPrimaryPredictions && primaryPredictions.length > 0 && ReactDOM.createPortal(
        <div
          ref={primaryPredictionsRef}
          style={primaryDropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {primaryPredictions.map((sugg: google.maps.places.AutocompleteSuggestion, i: number) => (
            <button
              key={i}
              onClick={() => { void handlePrimaryPredictionSelect(sugg); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-900">
                  {sugg.placePrediction?.text.toString() ?? ''}
                </span>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* Editing Location Google Places Predictions Dropdown */}
      {showEditingLocationPredictions && editingLocationPredictions.length > 0 && ReactDOM.createPortal(
        <div
          ref={editingLocationPredictionsRef}
          style={editingLocationDropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {editingLocationPredictions.map((sugg: google.maps.places.AutocompleteSuggestion, i: number) => (
            <button
              key={i}
              onClick={() => { void handleEditingLocationPredictionSelect(sugg); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-900">
                  {sugg.placePrediction?.text.toString() ?? ''}
                </span>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* Modals */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); }}
        onAdd={handleAddLocation}
      />

      <DeleteLocationModal
        isOpen={isDeleteModalOpen}
        location={locationToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteLocation}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default LocationsTab;
