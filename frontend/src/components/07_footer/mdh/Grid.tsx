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
        
        const response = await fetch(`${config.apiUrl}/api/service_areas`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setServiceAreas(data);
        } else {
          console.warn('Service areas API returned non-array data:', data);
          setServiceAreas([]);
        }
      } catch (err) {
        console.error('Failed to fetch service areas:', err);
        setError('Failed to load service areas');
        setServiceAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAreas();
  }, []);

  const selectState = async (stateCode: string) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/service_areas/${stateCode}`);
      if (response.ok) {
        const data = await response.json();
        setCities(Array.isArray(data) ? data : []);
        setSelectedState(stateCode);
      }
    } catch (err) {
      console.error('Failed to fetch cities for state:', err);
      setCities([]);
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
                facebook: parentConfig?.facebook,
                instagram: parentConfig?.instagram,
                tiktok: parentConfig?.tiktok,
                youtube: parentConfig?.youtube,
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
                    <div
                      key={`${city.state_code}-${city.name}-${index}`}
                      className="text-orange-400 text-sm text-center md:text-right"
                    >
                      {city.name}
                    </div>
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