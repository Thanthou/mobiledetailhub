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
    try {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.city && parsed.state) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading location from localStorage:', error);
    }
    return null;
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
          if (parsed && parsed.city && parsed.state && 
              (!selectedLocation || 
               parsed.city !== selectedLocation.city || 
               parsed.state !== selectedLocation.state || 
               parsed.zipCode !== selectedLocation.zipCode)) {
            setSelectedLocation(parsed);
          }
        }
      } catch {
        // Ignore errors
      }
    }, 5000); // Increased interval to 5 seconds to reduce frequency

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedLocation]); // Added selectedLocation as dependency to prevent stale closures

  const clearLocation = () => {
    setSelectedLocation(null);
  };

  const updateLocationWithState = (city: string, state: string) => {
    if (city && state) {
      // If no location is selected, or if the current location doesn't have a state, update it
      if (!selectedLocation || !selectedLocation.state) {
        const updatedLocation: LocationData = {
          city: city,
          state: state,
          zipCode: selectedLocation?.zipCode || '',
          fullLocation: `${city}, ${state}`
        };
        setSelectedLocation(updatedLocation);
      }
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
