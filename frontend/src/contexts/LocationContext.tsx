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
        return JSON.parse(saved);
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
        
        // Store this location for the business to use
        localStorage.setItem('selectedLocation', JSON.stringify(locationData));
        return locationData;
      }
      
      return null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage whenever location changes
  useEffect(() => {
    if (selectedLocation) {
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
          setSelectedLocation(newLocation);
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
          if (JSON.stringify(parsed) !== JSON.stringify(selectedLocation)) {
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
  }, [selectedLocation]);

  const clearLocation = () => {
    setSelectedLocation(null);
  };

  const updateLocationWithState = (city: string, state: string) => {
    if (selectedLocation && selectedLocation.city === city && !selectedLocation.state) {
      const updatedLocation: LocationData = {
        ...selectedLocation,
        state: state,
        fullLocation: `${city}, ${state}`
      };
      setSelectedLocation(updatedLocation);
    }
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, clearLocation, updateLocationWithState }}>
      {children}
    </LocationContext.Provider>
  );
};
