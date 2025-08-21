import React, { useEffect, useState } from 'react';
import ConnectColumn from '../columns/ConnectColumn';
import SocialMediaColumn from '../columns/SocialMediaColumn';
import { MapPin } from 'lucide-react';

interface ServiceArea {
  state: string;
  city: string;
  zip?: string;
}

interface FooterGridProps {
  parentConfig: any;
  businessSlug?: string;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig }) => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/service_areas')
      .then(res => res.json())
      .then(data => {
        setServiceAreas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectState = (state: string) => {
    setSelectedState(state);
  };

  const goBackToStates = () => {
    setSelectedState(null);
  };

  // Group cities by state
  const citiesByState = serviceAreas.reduce((acc, area) => {
    if (!acc[area.state]) {
      acc[area.state] = [];
    }
    acc[area.state].push(area.city);
    return acc;
  }, {} as Record<string, string[]>);

  // Get unique states and sort them
  const states = Object.keys(citiesByState).sort();

  return (
    <>
      {/* 3-Column Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Column 1: Connect */}
        <div className="text-center md:text-left">
          <ConnectColumn />
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
          ) : (
            <div className="space-y-2">
              {selectedState === null ? (
                // Show all states
                states.map(state => (
                  <button
                    key={state}
                    onClick={() => selectState(state)}
                    className="block w-full text-white hover:text-gray-300 text-lg font-medium cursor-pointer transition-colors text-center md:text-right"
                  >
                    {state}
                  </button>
                ))
              ) : (
                // Show cities for selected state
                <div className="space-y-1">
                  {citiesByState[selectedState].map((city, index) => (
                    <div
                      key={`${selectedState}-${city}-${index}`}
                      className="text-orange-400 text-sm text-center md:text-right"
                    >
                      {city}
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