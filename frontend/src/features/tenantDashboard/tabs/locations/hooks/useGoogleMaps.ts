import { useCallback, useEffect, useState } from 'react';

import { getGoogle, hasImportLibrary } from '@/features/locations';

export const useGoogleMaps = () => {
  const [apiLoaded, setApiLoaded] = useState(false);

  const checkAPIReady = useCallback(async (): Promise<void> => {
    try {
      if (!hasImportLibrary()) {
        setTimeout(() => { void checkAPIReady(); }, 250);
        return;
      }
      
      const g = getGoogle();
      if (!g?.maps.importLibrary) {
        setTimeout(() => { void checkAPIReady(); }, 250);
        return;
      }
      
      await g.maps.importLibrary('places');
      
      setApiLoaded(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Google Maps API initialization error:', msg);
      setApiLoaded(false);
    }
  }, []);

  const loadGooglePlacesAPI = useCallback((): void => {
    const g = getGoogle();
    if (g?.maps) {
      setTimeout(() => { void checkAPIReady(); }, 300);
      return;
    }
    
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      setTimeout(() => { void checkAPIReady(); }, 500);
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
    script.onload = () => { void setTimeout(() => { void checkAPIReady(); }, 500); };
    script.onerror = (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to load Google Maps JS API', msg);
      setApiLoaded(false);
    };
    document.head.appendChild(script);
  }, [checkAPIReady]);

  useEffect(() => {
    loadGooglePlacesAPI();
  }, [loadGooglePlacesAPI]);

  return { apiLoaded };
};
