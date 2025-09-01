import React, { useEffect, useState } from 'react';
import ConnectColumn from '../columns/ConnectColumn';
import SocialMediaColumn from '../columns/SocialMediaColumn';
import { MapPin } from 'lucide-react';
import { config } from '../../../config/environment';

interface ServiceArea {
  state_code: string;
  name: string;
}

interface City {
  id: number;
  name: string;
  city_slug: string;
  state_code: string;
}

interface FooterGridProps {
  parentConfig: any;
  businessSlug?: string;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig }) => {
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the new nested structure: { state: { city: [slugs] } }
        if (data.success && data.service_areas) {
          // Convert the nested structure to a flat array for backward compatibility
          const statesArray = Object.keys(data.service_areas).map(stateCode => ({
            state_code: stateCode,
            name: stateCode,
            cities: data.service_areas[stateCode]
          }));
          
          setServiceAreas(statesArray);
        } else {
          setServiceAreas([]);
        }
      } catch (err) {
        setError('Failed to load service areas');
        setServiceAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAreas();
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
                facebook: parentConfig?.socials?.facebook || parentConfig?.facebook,
                instagram: parentConfig?.socials?.instagram || parentConfig?.instagram,
                tiktok: parentConfig?.socials?.tiktok || parentConfig?.tiktok,
                youtube: parentConfig?.socials?.youtube || parentConfig?.youtube,
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
            <div className="text-gray-400 md:text-right">
              <div className="text-sm mb-2">No service areas available</div>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedState === null ? (
                // Show all states
                states.map(state => (
                  <button
                    key={state.state_code}
                    onClick={() => selectState(state.state_code)}
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
                    key={`${city.state_code}-${city.city}-${index}`}
                    onClick={() => window.location.href = `/${city.slugs[0]}`}
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