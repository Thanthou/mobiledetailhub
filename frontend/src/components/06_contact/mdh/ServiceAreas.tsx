import React, { useEffect, useState } from 'react';

interface ServiceArea {
  state: string;
  city: string;
  zip?: string;
}

const ServiceAreaList: React.FC = () => {
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

  if (loading) return <div className="text-white">Loading service areas...</div>;

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
    <div className="bg-stone-800 p-6 rounded-lg shadow-lg text-center max-w-md">
      <h3 className="text-xl font-bold mb-4 text-white">
        Service Areas
      </h3>
      
      <div className="space-y-2">
        {selectedState === null ? (
          // Show all states
          states.map(state => (
            <button
              key={state}
              onClick={() => selectState(state)}
              className="block w-full text-orange-400 hover:text-orange-300 text-lg font-medium cursor-pointer transition-colors text-center"
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
                className="text-orange-400 text-sm"
              >
                {city}
              </div>
            ))}
            <button
              onClick={goBackToStates}
              className="text-gray-400 hover:text-gray-300 text-xs cursor-pointer transition-colors mt-2"
            >
              ← Back to states
            </button>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-300 mt-4">
        Don't see your area? Give us a call - we may still be able to help!
      </p>
    </div>
  );
};

export default ServiceAreaList;