import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocation } from '@/shared/hooks';

import { useMDHServiceAreas } from '../hooks/useMDHServiceAreas';


const MDHServiceAreas: React.FC = () => {
  const { serviceAreas, isLoading, error } = useMDHServiceAreas() as {
    serviceAreas: Record<string, Record<string, string[]>>;
    isLoading: boolean;
    error: string | null;
  };
  
  // Always call the hook - it will throw if not in provider
  const { setSelectedLocation } = useLocation();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<{ city: string; state: string; slugs: string[] }>>([]);

  const selectState = (stateCode: string) => {
    const selectedStateData = serviceAreas[stateCode];
    
    if (selectedStateData) {
      // Convert cities object to array format for display
      const citiesArray = Object.keys(selectedStateData).map(cityName => ({
        city: cityName,
        state: stateCode,
        slugs: selectedStateData[cityName]
      }));
      
      setCities(citiesArray);
      setSelectedState(stateCode);
    }
  };

  const goBackToStates = () => {
    setSelectedState(null);
    setCities([]);
  };

  const handleCityClick = (city: { city: string; state: string; slugs: string[] }) => {
    // Set the location before navigating
    setSelectedLocation({
      city: city.city,
      state: city.state,
      zipCode: '',
      fullLocation: `${city.city}, ${city.state}`
    });
    
    // Use React Router navigation instead of window.location.href
    // This allows the location to be set before navigation
    setTimeout(() => {
      void navigate(`/${city.slugs[0] ?? ''}`);
    }, 100); // Small delay to ensure location is set
  };

  if (isLoading) {
    return (
      <div className="text-center md:text-right">
        <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
        <div className="text-white md:text-right">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center md:text-right">
        <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
        <div className="text-gray-400 md:text-right">
          <div className="text-sm mb-2">{String(error)}</div>
        </div>
      </div>
    );
  }

  if (Object.keys(serviceAreas).length === 0) {
    return null; // Don't show anything if no service areas
  }

  // Get unique states and sort them by name
  const states = Object.keys(serviceAreas).sort((a, b) => a.localeCompare(b));

  return (
    <div className="text-center md:text-right">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
      <div className="space-y-2">
        {selectedState === null ? (
          // Show all states
          states.map(state => (
            <button
              key={state}
              onClick={() => { selectState(state); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectState(state);
                }
              }}
              className="block w-full text-white hover:text-gray-300 text-lg font-medium cursor-pointer transition-colors text-center md:text-right bg-transparent border-none p-0"
              type="button"
            >
              {state}
            </button>
          ))
        ) : (
          // Show cities for selected state
          <div className="space-y-1">
            {cities.map((city, index) => (
              <button
                key={`${city.state}-${city.city}-${String(index)}`}
                onClick={() => { handleCityClick(city); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCityClick(city);
                  }
                }}
                className="text-orange-400 hover:text-orange-300 text-sm text-center md:text-right cursor-pointer transition-colors block w-full bg-transparent border-none p-0"
                type="button"
              >
                {city.city}
              </button>
            ))}
            <button
              onClick={goBackToStates}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goBackToStates();
                }
              }}
              className="text-gray-400 hover:text-gray-300 text-xs cursor-pointer transition-colors mt-2 text-center md:text-right block w-full bg-transparent border-none p-0"
              type="button"
            >
              ← Back to states
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MDHServiceAreas;
