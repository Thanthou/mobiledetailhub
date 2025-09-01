import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Plus, MapPin, AlertCircle, Search, X, Trash2 } from 'lucide-react';
import { useLocationsData } from './hooks/useLocationsData';
import { useAffiliateData } from './hooks/useAffiliateData';
import { AddLocationModal } from './components/AddLocationModal';
import { DeleteLocationModal } from './components/DeleteLocationModal';
import { LocationCard } from './components/LocationCard';
import type { ServiceArea, LocationFormData } from './types';
import type { DetailerData } from '../../types';

interface LocationsTabProps {
  detailerData?: DetailerData;
}

const LocationsTab: React.FC<LocationsTabProps> = ({ detailerData }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<ServiceArea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Primary Service Area edit state
  const [isPrimaryEditMode, setIsPrimaryEditMode] = useState(false);
  const [primaryLocationInput, setPrimaryLocationInput] = useState('');
  const [primaryOriginalInput, setPrimaryOriginalInput] = useState(''); // Store original input for ZIP extraction
  const [primaryPredictions, setPrimaryPredictions] = useState<Array<any>>([]);
  const [showPrimaryPredictions, setShowPrimaryPredictions] = useState(false);
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);
  const [primaryDropdownStyle, setPrimaryDropdownStyle] = useState<React.CSSProperties>({});

  
  // Service area location search state (similar to primary)
  const [isServiceAreaEditMode, setIsServiceAreaEditMode] = useState(false);
  const [serviceAreaLocationInput, setServiceAreaLocationInput] = useState('');
  const [serviceAreaOriginalInput, setServiceAreaOriginalInput] = useState(''); // Store original input for ZIP extraction
  const [serviceAreaPredictions, setServiceAreaPredictions] = useState<Array<any>>([]);
  const [showServiceAreaPredictions, setShowServiceAreaPredictions] = useState(false);
  const [isServiceAreaLoading, setIsServiceAreaLoading] = useState(false);
  const [serviceAreaDropdownStyle, setServiceAreaDropdownStyle] = useState<React.CSSProperties>({});
  const [apiLoaded, setApiLoaded] = useState(false);
  
  // Individual location edit state
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingLocationInput, setEditingLocationInput] = useState('');
  const [editingLocationOriginalInput, setEditingLocationOriginalInput] = useState(''); // Store original input for ZIP extraction
  const [editingLocationPredictions, setEditingLocationPredictions] = useState<Array<any>>([]);
  const [showEditingLocationPredictions, setShowEditingLocationPredictions] = useState(false);
  const [isEditingLocationLoading, setIsEditingLocationLoading] = useState(false);
  const [editingLocationDropdownStyle, setEditingLocationDropdownStyle] = useState<React.CSSProperties>({});

  // Primary service area refs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const primaryPredictionsRef = useRef<HTMLDivElement>(null);
  const primarySessionTokenRef = useRef<any | null>(null);
  
  // Service area refs
  const serviceAreaInputRef = useRef<HTMLInputElement>(null);
  const serviceAreaPredictionsRef = useRef<HTMLDivElement>(null);
  const serviceAreaSessionTokenRef = useRef<any | null>(null);
  
  // Editing location refs
  const editingLocationInputRef = useRef<HTMLInputElement>(null);
  const editingLocationPredictionsRef = useRef<HTMLDivElement>(null);
  const editingLocationSessionTokenRef = useRef<any | null>(null);

  // Load Google Places API
  useEffect(() => {
    const checkAPIReady = async () => {
      try {
        if (!window.google?.maps?.importLibrary) {
          setTimeout(checkAPIReady, 250);
          return;
        }
        
        const placesLib = (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
        const AutocompleteSuggestion: any = (placesLib as any).AutocompleteSuggestion;
        
        if (AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          setApiLoaded(true);
        } else {
          setTimeout(checkAPIReady, 250);
        }
      } catch (error) {
        console.error('Google Maps API initialization error:', error);
        setApiLoaded(false);
      }
    };

    const loadGooglePlacesAPI = () => {
      if (window.google?.maps) {
        setTimeout(checkAPIReady, 300);
        return;
      }
      
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setTimeout(checkAPIReady, 500);
        return;
      }
      
      const script = document.createElement('script');
      const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
        setApiLoaded(false);
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(() => checkAPIReady(), 500);
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
    removeLocation
  } = useLocationsData();

  // Get primary service area from locations data (where primary: true)
  const primaryServiceArea = locations.find(location => location.primary === true);

  // Handle primary service area location input changes and get predictions
  const handlePrimaryLocationInputChange = async (value: string) => {
    setPrimaryLocationInput(value);
    // Store the original input for ZIP code extraction
    if (!primaryOriginalInput) {
      setPrimaryOriginalInput(value);
    }

    if (!value.trim()) {
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
      primarySessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded || !window.google?.maps?.importLibrary) {
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
      return;
    }

    setIsPrimaryLoading(true);
    try {
      const { AutocompleteSuggestion, AutocompleteSessionToken } =
        (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary as any;

      if (!primarySessionTokenRef.current) {
        primarySessionTokenRef.current = new AutocompleteSessionToken();
      }

      const request: any = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: primarySessionTokenRef.current,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setPrimaryPredictions(suggestions || []);
      setShowPrimaryPredictions((suggestions || []).length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);
    } finally {
      setIsPrimaryLoading(false);
    }
  };

  // Handle service area location input changes and get predictions
  const handleServiceAreaLocationInputChange = async (value: string) => {
    setServiceAreaLocationInput(value);
    // Store the original input for ZIP code extraction
    if (!serviceAreaOriginalInput) {
      setServiceAreaOriginalInput(value);
    }

    if (!value.trim()) {
      setServiceAreaPredictions([]);
      setShowServiceAreaPredictions(false);
      serviceAreaSessionTokenRef.current = null;
      return;
    }

    if (!apiLoaded || !window.google?.maps?.importLibrary) {
      setServiceAreaPredictions([]);
      setShowServiceAreaPredictions(false);
      return;
    }

    setIsServiceAreaLoading(true);
    try {
      const { AutocompleteSuggestion, AutocompleteSessionToken } =
        (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary as any;

      if (!serviceAreaSessionTokenRef.current) {
        serviceAreaSessionTokenRef.current = new AutocompleteSessionToken();
      }

      const request: any = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: serviceAreaSessionTokenRef.current,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setServiceAreaPredictions(suggestions || []);
      setShowServiceAreaPredictions((suggestions || []).length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setServiceAreaPredictions([]);
      setShowServiceAreaPredictions(false);
    } finally {
      setIsServiceAreaLoading(false);
    }
  };

  // Handle primary service area prediction selection
  const handlePrimaryPredictionSelect = async (suggestion: any) => {
    try {
      const label = suggestion.placePrediction.text?.toString?.() ?? '';
      setPrimaryLocationInput(label);
      setShowPrimaryPredictions(false);
      setPrimaryPredictions([]);

      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(primaryOriginalInput);
      console.log('📍 Primary prediction select - input ZIP:', inputZipCode, 'from original input:', primaryOriginalInput);
      
      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = (place.addressComponents || []) as Array<{
        longText?: string;
        shortText?: string;
        types: string[];
      }>;

      const get = (type: string) => comps.find((c) => c.types?.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      console.log('📍 Primary - Google Places data:', { zipCode, city, state, inputZipCode });

      // If we found a ZIP code in the input, use that instead of the one from address components
      if (inputZipCode) {
        zipCode = inputZipCode;
        console.log('📍 Primary - Using input ZIP code:', zipCode);
      } else if (!zipCode && city && state) {
        // If no ZIP code was found, attempt to extract one for city,state
        zipCode = await attemptZipCodeExtraction(city, state);
        console.log('📍 Primary - Extracted ZIP code:', zipCode);
      }

      // Update primary service area in locations data
      if (primaryServiceArea) {
        const updatedLocation = {
          ...primaryServiceArea,
          city: city,
          state: state,
          zip: zipCode,
          minimum: primaryServiceArea.minimum || 0,
          multiplier: primaryServiceArea.multiplier || 1.0
        };
        
        console.log('📍 Primary - Final updated location:', updatedLocation);
        
        // TODO: Implement updatePrimaryServiceArea function
        // await updatePrimaryServiceArea(updatedLocation);
      }

      // Exit edit mode - process is complete
      setIsPrimaryEditMode(false);
      setPrimaryLocationInput('');
      setPrimaryOriginalInput(''); // Reset original input
      setPrimaryPredictions([]);
      setShowPrimaryPredictions(false);

    } catch (e) {
      const text = suggestion?.placePrediction?.text?.toString?.() ?? '';
      const parts = text.split(', ');
      let zip = '', c = '', s = '';
      
      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(primaryOriginalInput);
      
      if (parts.length >= 2) {
        c = parts[0];
        s = parts[1];
        // Use input ZIP code if available, otherwise attempt to get ZIP code for the parsed city,state
        if (inputZipCode) {
          zip = inputZipCode;
        } else if (c && s) {
          zip = await attemptZipCodeExtraction(c, s);
        }
      }
      // Update primary service area in locations data
      if (primaryServiceArea) {
        const updatedLocation = {
          ...primaryServiceArea,
          city: c,
          state: s,
          zip: zip,
          minimum: primaryServiceArea.minimum || 0,
          multiplier: primaryServiceArea.multiplier || 1.0
        };
        
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
  const handleServiceAreaPredictionSelect = async (suggestion: any) => {
    try {
      const label = suggestion.placePrediction.text?.toString?.() ?? '';
      setServiceAreaLocationInput(label);
      setShowServiceAreaPredictions(false);
      setServiceAreaPredictions([]);

      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(serviceAreaOriginalInput);
      console.log('📍 Service Area prediction select - input ZIP:', inputZipCode, 'from original input:', serviceAreaOriginalInput);
      
      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = (place.addressComponents || []) as Array<{
        longText?: string;
        shortText?: string;
        types: string[];
      }>;

      const get = (type: string) => comps.find((c) => c.types?.includes(type));
      zipCode = get('postal_code')?.longText ?? '';
      city = get('locality')?.longText ?? get('postal_town')?.longText ?? '';
      state = get('administrative_area_level_1')?.shortText ?? '';

      console.log('📍 Service Area - Google Places data:', { zipCode, city, state, inputZipCode });

      // If we found a ZIP code in the input, use that instead of the one from address components
      if (inputZipCode) {
        zipCode = inputZipCode;
        console.log('📍 Service Area - Using input ZIP code:', zipCode);
      } else if (!zipCode && city && state) {
        // If no ZIP code was found, attempt to extract one for city,state
        zipCode = await attemptZipCodeExtraction(city, state);
        console.log('📍 Service Area - Extracted ZIP code:', zipCode);
      }

      // Add location directly with default values
      const locationData: LocationFormData = {
        city: city,
        state: state,
        zip: zipCode,
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

    } catch (e) {
      const text = suggestion?.placePrediction?.text?.toString?.() ?? '';
      const parts = text.split(', ');
      let zip = '', c = '', s = '';
      
      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(serviceAreaOriginalInput);
      
      if (parts.length >= 2) {
        c = parts[0];
        s = parts[1];
        // Use input ZIP code if available, otherwise attempt to get ZIP code for the parsed city,state
        if (inputZipCode) {
          zip = inputZipCode;
        } else if (c && s) {
          zip = await attemptZipCodeExtraction(c, s);
        }
      }
      
      // Add location directly with default values
      const locationData: LocationFormData = {
        city: c,
        state: s,
        zip: zip,
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
  const handleEditingLocationInputChange = async (value: string) => {
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

    if (!apiLoaded || !window.google?.maps?.importLibrary) {
      setEditingLocationPredictions([]);
      setShowEditingLocationPredictions(false);
      return;
    }

    setIsEditingLocationLoading(true);
    try {
      const { AutocompleteSuggestion, AutocompleteSessionToken } =
        (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary as any;

      if (!editingLocationSessionTokenRef.current) {
        editingLocationSessionTokenRef.current = new AutocompleteSessionToken();
      }

      const request: any = {
        input: value,
        region: 'us',
        includedPrimaryTypes: ['locality', 'postal_code'],
        sessionToken: editingLocationSessionTokenRef.current,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setEditingLocationPredictions(suggestions || []);
      setShowEditingLocationPredictions((suggestions || []).length > 0);
    } catch (err) {
      console.error('Error getting suggestions', err);
      setEditingLocationPredictions([]);
      setShowEditingLocationPredictions(false);
    } finally {
      setIsEditingLocationLoading(false);
    }
  };

  // Handle editing location prediction selection
  const handleEditingLocationPredictionSelect = async (suggestion: any) => {
    if (!editingLocationId) return;

    try {
      const label = suggestion.placePrediction.text?.toString?.() ?? '';
      setEditingLocationInput(label);
      setShowEditingLocationPredictions(false);
      setEditingLocationPredictions([]);

      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(editingLocationOriginalInput);
      
      let zipCode = '';
      let city = '';
      let state = '';

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });

      const comps = (place.addressComponents || []) as Array<{
        longText?: string;
        shortText?: string;
        types: string[];
      }>;

      const get = (type: string) => comps.find((c) => c.types?.includes(type));
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

      // Update the existing location
      const locationData: LocationFormData = {
        city: city,
        state: state,
        zip: zipCode,
        minimum: 0, // Keep existing values, will be updated separately
        multiplier: 1.0
      };

      // TODO: Implement updateLocation function
      // const result = await updateLocation(editingLocationId, locationData);
      // if (result.success) {
        // Exit edit mode - process is complete
        setEditingLocationId(null);
        setEditingLocationInput('');
        setEditingLocationOriginalInput(''); // Reset original input
        setEditingLocationPredictions([]);
        setShowEditingLocationPredictions(false);
      // }

    } catch (e) {
      const text = suggestion?.placePrediction?.text?.toString?.() ?? '';
      const parts = text.split(', ');
      let zip = '', c = '', s = '';
      
      // First, try to extract ZIP code from the original input
      const inputZipCode = extractZipFromInput(editingLocationOriginalInput);
      
      if (parts.length >= 2) {
        c = parts[0];
        s = parts[1];
        // Use input ZIP code if available, otherwise attempt to get ZIP code for the parsed city,state
        if (inputZipCode) {
          zip = inputZipCode;
        } else if (c && s) {
          zip = await attemptZipCodeExtraction(c, s);
        }
      }
      
      // Update the existing location
      const locationData: LocationFormData = {
        city: c,
        state: s,
        zip: zip,
        minimum: 0, // Keep existing values, will be updated separately
        multiplier: 1.0
      };

      // TODO: Implement updateLocation function
      // const result = await updateLocation(editingLocationId, locationData);
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
    const result = zipMatch ? zipMatch[1] : '';
    console.log('🔍 extractZipFromInput:', { input, result });
    return result;
  };

  // Attempt to get ZIP code for city,state combinations
  const attemptZipCodeExtraction = async (city: string, state: string): Promise<string> => {
    if (!apiLoaded || !window.google?.maps?.importLibrary) {
      return '';
    }

    try {
      const { AutocompleteSuggestion, AutocompleteSessionToken } =
        (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary as any;

      const sessionToken = new AutocompleteSessionToken();
      const request: any = {
        input: `${city}, ${state}`,
        region: 'us',
        includedPrimaryTypes: ['locality'],
        sessionToken: sessionToken,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      
      if (suggestions && suggestions.length > 0) {
        // Try the first suggestion
        const suggestion = suggestions[0];
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['addressComponents'],
        });

        const comps = (place.addressComponents || []) as Array<{
          longText?: string;
          shortText?: string;
          types: string[];
        }>;

        const get = (type: string) => comps.find((c) => c.types?.includes(type));
        const zipCode = get('postal_code')?.longText ?? '';
        
        // Validate the ZIP code
        if (zipCode && /^\d{5}(-\d{4})?$/.test(zipCode)) {
          return zipCode;
        }
      }
    } catch (error) {
      console.log('Could not extract ZIP code for city,state:', error);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleAddLocation = async (locationData: LocationFormData) => {
    return await addLocation(locationData);
  };



  const handleDeleteLocation = async () => {
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">Loading service areas...</span>
            </div>
          ) : error ? (
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
                <label className="block text-sm font-medium text-gray-300">
                  Search for a city or ZIP code
                </label>
                <button
                  onClick={() => setIsPrimaryEditMode(false)}
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
                  ref={primaryInputRef}
                  type="text"
                  value={primaryLocationInput}
                  onChange={(e) => handlePrimaryLocationInputChange(e.target.value)}
                  placeholder={apiLoaded ? "Enter city or ZIP code" : "Loading..."}
                  style={{ colorScheme: 'dark' }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    apiLoaded ? 'border-stone-700 bg-stone-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                  disabled={!apiLoaded}
                  autoFocus
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
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  value={primaryServiceArea?.city || ''}
                  readOnly
                  onClick={() => setIsPrimaryEditMode(true)}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                  title="Click to edit location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                <input
                  type="text"
                  value={primaryServiceArea?.state || ''}
                  readOnly
                  onClick={() => setIsPrimaryEditMode(true)}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                  title="Click to edit location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Zip</label>
                <input
                  type="text"
                  value={primaryServiceArea?.zip || ''}
                  readOnly
                  onClick={() => setIsPrimaryEditMode(true)}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                  title="Click to edit location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Minimum</label>
                <input
                  type="number"
                  value={primaryServiceArea?.minimum || ''}
                  onChange={(e) => {
                    // TODO: Implement updatePrimaryServiceAreaMinimum function
                    // updatePrimaryServiceAreaMinimum(parseFloat(e.target.value) || 0);
                  }}
                  className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Multiplier</label>
                <input
                  type="number"
                  step="0.01"
                  value={primaryServiceArea?.multiplier || ''}
                  onChange={(e) => {
                    // TODO: Implement updatePrimaryServiceAreaMultiplier function
                    // updatePrimaryServiceAreaMultiplier(parseFloat(e.target.value) || 1.0);
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
          <h3 className="text-lg font-semibold text-orange-500">Service Areas</h3>
          {!isServiceAreaEditMode && (
            <button
              onClick={() => setIsServiceAreaEditMode(true)}
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
                <label className="block text-sm font-medium text-gray-300">
                  Search for a city or ZIP code
                </label>
                <button
                  onClick={() => setIsServiceAreaEditMode(false)}
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
                  ref={serviceAreaInputRef}
                  type="text"
                  value={serviceAreaLocationInput}
                  onChange={(e) => handleServiceAreaLocationInputChange(e.target.value)}
                  placeholder={apiLoaded ? "Enter city or ZIP code" : "Loading..."}
                  style={{ colorScheme: 'dark' }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    apiLoaded ? 'border-stone-700 bg-stone-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                  disabled={!apiLoaded}
                  autoFocus
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
        
        {locations.filter(location => !location.primary).length > 0 && (
          <div className="space-y-4">
            {locations.filter(location => !location.primary).map((location, index) => {
              const locationId = `${location.city}-${location.state}`;
              const isEditingThisLocation = editingLocationId === locationId;
              
              return (
                <div key={`${location.city}-${location.state}-${index + 1}`} className="bg-stone-800 border border-stone-700 rounded-lg p-6">
                  <div className="flex items-center justify-end mb-4">
                    <button
                      onClick={() => openDeleteModal(location)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete location"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {isEditingThisLocation ? (
                    // Edit mode - show location search
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-300">
                          Search for a city or ZIP code
                        </label>
                        <button
                          onClick={() => setEditingLocationId(null)}
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
                          ref={editingLocationInputRef}
                          type="text"
                          value={editingLocationInput}
                          onChange={(e) => handleEditingLocationInputChange(e.target.value)}
                          placeholder={apiLoaded ? "Enter city or ZIP code" : "Loading..."}
                          style={{ colorScheme: 'dark' }}
                          className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            apiLoaded ? 'border-stone-700 bg-stone-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                          }`}
                          disabled={!apiLoaded}
                          autoFocus
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                        <input
                          type="text"
                          value={location.city}
                          readOnly
                          onClick={() => {
                            setEditingLocationId(locationId);
                            setEditingLocationInput('');
                          }}
                          className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                          title="Click to edit location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                        <input
                          type="text"
                          value={location.state}
                          readOnly
                          onClick={() => {
                            setEditingLocationId(locationId);
                            setEditingLocationInput('');
                          }}
                          className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                          title="Click to edit location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Zip</label>
                        <input
                          type="text"
                          value={location.zip || ''}
                          readOnly
                          onClick={() => {
                            setEditingLocationId(locationId);
                            setEditingLocationInput('');
                          }}
                          className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white cursor-pointer hover:bg-stone-600 transition-colors"
                          title="Click to edit location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Minimum</label>
                        <input
                          type="number"
                          value={location.minimum || ''}
                          onChange={(e) => {
                            // TODO: Implement updateLocationMinimum function
                            // updateLocationMinimum(locationId, parseFloat(e.target.value) || 0);
                          }}
                          className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Multiplier</label>
                        <input
                          type="number"
                          step="0.01"
                          value={location.multiplier || ''}
                          onChange={(e) => {
                            // TODO: Implement updateLocationMultiplier function
                            // updateLocationMultiplier(locationId, parseFloat(e.target.value) || 1.0);
                          }}
                          className="w-full px-3 py-2 border border-stone-700 rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
          {serviceAreaPredictions.map((sugg: any, i: number) => (
            <button
              key={i}
              onClick={() => handleServiceAreaPredictionSelect(sugg)}
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
          {primaryPredictions.map((sugg: any, i: number) => (
            <button
              key={i}
              onClick={() => handlePrimaryPredictionSelect(sugg)}
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
          {editingLocationPredictions.map((sugg: any, i: number) => (
            <button
              key={i}
              onClick={() => handleEditingLocationPredictionSelect(sugg)}
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
        </div>,
        document.body
      )}

      {/* Modals */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
