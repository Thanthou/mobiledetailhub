import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getFooterLocations } from '@/shared/utils/locationsUtils';

const FooterLocations: React.FC = () => {
  const navigate = useNavigate();
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  
  const locationsByState = getFooterLocations(8); // Limit to 8 states for footer

  const handleNavigation = useCallback((path: string) => {
    void navigate(path);
  }, [navigate]);

  const handleStateToggle = useCallback((stateCode: string) => {
    setExpandedStates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stateCode)) {
        newSet.delete(stateCode);
      } else {
        newSet.add(stateCode);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="text-center md:text-right">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
      <div className="flex flex-col space-y-3">
        {/* States and Cities */}
        {locationsByState.map((state) => (
          <div key={state.code} className="space-y-1">
            {/* State Header */}
            <button
              onClick={() => { handleStateToggle(state.code); }}
              className="text-lg text-white hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer flex items-center justify-end w-full"
            >
              <span className="text-right">{state.name}</span>
              <span className={`text-xs transition-transform duration-200 ml-2 ${
                expandedStates.has(state.code) ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </button>

            {/* Cities List */}
            {expandedStates.has(state.code) && (
              <div className="ml-4 space-y-1">
                {state.cities.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => { handleNavigation(city.urlPath); }}
                    className="text-lg text-white hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer block w-full text-right"
                  >
                    {city.city}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterLocations;
