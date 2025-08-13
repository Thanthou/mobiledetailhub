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
      return saved ? JSON.parse(saved) : null;
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

  const clearLocation = () => {
    setSelectedLocation(null);
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
