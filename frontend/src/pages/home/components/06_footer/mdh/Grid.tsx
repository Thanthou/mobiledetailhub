import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { config } from '../../../../../config/environment';
import { useLocation } from '../../../../../hooks/useLocation';
import ConnectColumn from '../columns/ConnectColumn';
import SocialMediaColumn from '../columns/SocialMediaColumn';

interface ServiceArea {
  state_code: string;
  name: string;
  cities?: Record<string, string[]>;
}

interface City {
  city: string;
  state_code: string;
  slugs: string[];
}

interface ParentConfig {
  socials?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

interface FooterGridProps {
  parentConfig: ParentConfig;
  businessSlug?: string;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig }) => {
  const { setSelectedLocation } = useLocation();
  const navigate = useNavigate();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiUrl}/api/service_areas/footer`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${String(response.status)}`);
        }
        
        const data = await response.json() as {
          success?: boolean;
          service_areas?: Record<string, Record<string, string[]>>;
        };
        
        // Handle the new nested structure: { state: { city: [slugs] } }
        if (data.success && data.service_areas && Object.keys(data.service_areas).length > 0) {
          // Convert the nested structure to a flat array for backward compatibility
          const statesArray = Object.keys(data.service_areas).map(stateCode => ({
            state_code: stateCode,
            name: stateCode,
            cities: data.service_areas?.[stateCode] ?? {}
          }));
          
          setServiceAreas(statesArray);
        } else {
          // No service areas available - this is normal if no affiliates are approved yet
          setServiceAreas([]);
        }
      } catch {
        setError('Failed to load service areas');
        setServiceAreas([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchServiceAreas();
  }, []);

  const selectState = (stateCode: string) => {
    const selectedStateData = serviceAreas.find(state => state.state_code === stateCode);
    
    if (selectedStateData && selectedStateData.cities) {
      // Convert cities object to array format for display
      const citiesArray = Object.keys(selectedStateData.cities).map(cityName => ({
        city: cityName,
        state_code: stateCode,
        slugs: selectedStateData.cities[cityName]
      }));
      
      setCities(citiesArray);
      setSelectedState(stateCode);
    }
  };

  const goBackToStates = () => {
    setSelectedState(null);
    setCities([]);
  };

  const handleCityClick = (city: City) => {
    // Set the location before navigating
    setSelectedLocation({
      city: city.city,
      state: city.state_code,
      zipCode: '',
      fullLocation: `${city.city}, ${city.state_code}`
    });
    
    // Use React Router navigation instead of window.location.href
    // This allows the location to be set before navigation
    setTimeout(() => {
      void navigate(`/${city.slugs[0] ?? ''}`);
    }, 100); // Small delay to ensure location is set
  };

  // Get unique states and sort them by name
  const states = serviceAreas.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {/* 3-Column Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Column 1: Connect */}
        <div className="text-center md:text-left">
          <ConnectColumn config={parentConfig} />
        </div>

        {/* Column 2: Follow Us */}
        <div className="text-center">
          <div className="inline-flex flex-col space-y-3 items-start">
            <SocialMediaColumn
              socialMedia={{
                facebook: parentConfig.socials?.facebook || parentConfig.facebook,
                instagram: parentConfig.socials?.instagram || parentConfig.instagram,
                tiktok: parentConfig.socials?.tiktok || parentConfig.tiktok,
                youtube: parentConfig.socials?.youtube || parentConfig.youtube,
              }}
            />
          </div>
        </div>

        {/* Column 3: Service Areas */}
        <div className="text-center md:text-right">
          <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
          {loading ? (
            <div className="text-white md:text-right">Loading...</div>
          ) : error ? (
            <div className="text-gray-400 md:text-right">
              <div className="text-sm mb-2">{error}</div>
            </div>
          ) : serviceAreas.length === 0 ? (
            null
          ) : (
            <div className="space-y-2">
              {selectedState === null ? (
                // Show all states
                states.map(state => (
                  <button
                    key={state.state_code}
                    onClick={() => { selectState(state.state_code); }}
                    className="block w-full text-white hover:text-gray-300 text-lg font-medium cursor-pointer transition-colors text-center md:text-right"
                  >
                    {state.name}
                  </button>
                ))
              ) : (
                // Show cities for selected state
                <div className="space-y-1">
                                  {cities.map((city, index) => (
                  <button
                    key={`${city.state_code}-${city.city}-${String(index)}`}
                    onClick={() => { handleCityClick(city); }}
                    className="text-orange-400 hover:text-orange-300 text-sm text-center md:text-right cursor-pointer transition-colors block w-full"
                  >
                    {city.city}
                  </button>
                ))}
                  <button
                    onClick={goBackToStates}
                    className="text-gray-400 hover:text-gray-300 text-xs cursor-pointer transition-colors mt-2 text-center md:text-right block w-full"
                  >
                    ← Back to states
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FooterGrid;