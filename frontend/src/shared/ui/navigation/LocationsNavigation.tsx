import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Home } from 'lucide-react';

import { getAreasByState } from '@/shared/utils';

const LocationsNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const areasByState = getAreasByState();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedState(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleNavigation = useCallback((path: string) => {
    void navigate(path);
    setIsOpen(false);
    setSelectedState(null);
  }, [navigate]);

  const handleStateSelect = useCallback((stateCode: string) => {
    setSelectedState(selectedState === stateCode ? null : stateCode);
  }, [selectedState]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Locations Button */}
      <button
        id="locations-menu-button"
        onClick={() => { setIsOpen(!isOpen); }}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MapPin className="h-4 w-4" />
        <span>Locations</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="locations-menu-button"
        >
          <button
            onClick={() => { handleNavigation('/'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <Home className="h-4 w-4 mr-3" />
            All Locations
          </button>
          
          <hr className="my-2" />
          
          {areasByState.map((state) => (
            <div key={state.code} className="group">
              {/* State Header */}
              <button
                onClick={() => { handleStateSelect(state.code); }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                role="menuitem"
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span className="font-medium">{state.name}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${selectedState === state.code ? 'rotate-180' : ''}`} />
              </button>

              {/* Cities Submenu */}
              {selectedState === state.code && (
                <div className="ml-4 border-l border-gray-200 pl-2">
                  {state.cities.map((city) => (
                    <button
                      key={city.slug}
                      onClick={() => { handleNavigation(city.urlPath); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                      role="menuitem"
                    >
                      <MapPin className="h-4 w-4 mr-3" />
                      {city.city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsNavigation;
