import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LocationData {
  city: string;
  state: string;
  zipCode: string;
  fullLocation: string;
}

interface LocationContextType {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  clearLocation: () => void;
  updateLocationWithState: (city: string, state: string) => void;
  hasValidLocation: () => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(() => {
    // Initialize from localStorage if available
    try {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only return if we have complete location data
        if (parsed && parsed.city && parsed.state) {
          return parsed;
        }
        // If incomplete, remove from localStorage and return null
        localStorage.removeItem('selectedLocation');
        return null;
      }
      
      // Check URL parameters for city and business
      const urlParams = new URLSearchParams(window.location.search);
      const cityFromUrl = urlParams.get('city');
      const businessFromUrl = urlParams.get('business');
      
      if (cityFromUrl) {
        // Try to extract state from the city name or use a default
        // This is a fallback - ideally the city should come with state info
        const locationData: LocationData = {
          city: cityFromUrl,
          state: '', // We'll need to determine this from business config
          zipCode: '',
          fullLocation: cityFromUrl
        };
        
        // Only store if we have both city and state
        if (cityFromUrl && cityFromUrl.includes(',')) {
          localStorage.setItem('selectedLocation', JSON.stringify(locationData));
          return locationData;
        }
        // If no comma, don't store incomplete location data
        return null;
      }
      
      return null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage whenever location changes
  useEffect(() => {
    if (selectedLocation && selectedLocation.city && selectedLocation.state) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    } else {
      localStorage.removeItem('selectedLocation');
    }
  }, [selectedLocation]);

  // Listen for localStorage changes from other components (like business config)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
              if (e.key === 'selectedLocation' && e.newValue) {
          try {
            const newLocation = JSON.parse(e.newValue);
            // Only set if we have complete location data
            if (newLocation && newLocation.city && newLocation.state) {
              setSelectedLocation(newLocation);
            }
          } catch {
            // Ignore invalid JSON
          }
        }
    };

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check localStorage periodically for changes from same window
    const interval = setInterval(() => {
              try {
          const saved = localStorage.getItem('selectedLocation');
          if (saved) {
            const parsed = JSON.parse(saved);
            // Only update if we have complete location data and it's different from current
            if (parsed && parsed.city && parsed.state && (!selectedLocation || JSON.stringify(parsed) !== JSON.stringify(selectedLocation))) {
              setSelectedLocation(parsed);
            }
          }
        } catch {
          // Ignore errors
        }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []); // Remove selectedLocation dependency to prevent infinite loops

  const clearLocation = () => {
    setSelectedLocation(null);
  };

  const updateLocationWithState = (city: string, state: string) => {
    if (selectedLocation && selectedLocation.city === city && !selectedLocation.state && city && state) {
      const updatedLocation: LocationData = {
        ...selectedLocation,
        state: state,
        fullLocation: `${city}, ${state}`
      };
      setSelectedLocation(updatedLocation);
    }
  };

  const hasValidLocation = () => {
    return !!(selectedLocation && selectedLocation.city && selectedLocation.state);
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, clearLocation, updateLocationWithState, hasValidLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
