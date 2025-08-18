import React from 'react';
import {
  getStates,
  getCitiesForState,
  getBusinessesForCity,
  STATE_CITIES_MAPPING
} from 'shared/utils/serviceAreaMapping';

interface ServiceAreasListProps {
  businessConfig: any;
  expandedStates: Set<string>;
  onToggleState: (state: string) => void;
  onCityClick: (city: string, businessSlug: string) => void;
  onLocalCityClick: (city: string, state: string) => void;
}

const ServiceAreasList: React.FC<ServiceAreasListProps> = ({
  businessConfig,
  expandedStates,
  onToggleState,
  onCityClick,
  onLocalCityClick
}) => {
  const parseLocation = (location: string) => {
    const cityStateMatch = location.match(/^(.+?),\s*([A-Z]{2})$/);
    if (cityStateMatch) {
      return {
        city: cityStateMatch[1].trim(),
        state: cityStateMatch[2],
        isClickable: true
      };
    }
    return {
      city: location,
      state: '',
      isClickable: false
    };
  };

  const renderMDHServiceAreas = () => {
    // Use STATE_CITIES_MAPPING for MDH
    const stateCities = STATE_CITIES_MAPPING;
    
    if (!stateCities) {
      return renderFallbackServiceAreas();
    }

    if (expandedStates.size > 0) {
        // Find the expanded state
        const [expandedState] = Array.from(expandedStates);
        const cities = getCitiesForState(expandedState);
        return (
          <div key={expandedState} className="text-left">
            {/* Back button */}
            <button
              onClick={() => onToggleState(expandedState)}
              className="mb-2 text-sm text-orange-400 hover:text-orange-300 underline"
            >
              ← Back to states
            </button>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {cities.map((city: string, index: number) => {
                const businesses = getBusinessesForCity(expandedState, city);
                const businessSlug = businesses[0];
                const isCurrentBusinessCity = businessSlug === businessConfig.slug;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isCurrentBusinessCity) {
                        onLocalCityClick(city, expandedState);
                      } else if (businessSlug) {
                        onCityClick(city, businessSlug);
                      }
                    }}
                    className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer text-left hover:underline"
                    title={isCurrentBusinessCity ? `Click to set location to ${city}, ${expandedState}` : `Click to go to ${businessSlug} business`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
    

    // Show all clickable states
    return getStates().map((state: string) => (
      <div key={state} className="text-center">
        <button
          onClick={() => onToggleState(state)}
          className="text-lg font-semibold hover:text-orange-400 transition-colors cursor-pointer"
        >
          {state}
        </button>
      </div>
    ));
  };

  const renderFallbackServiceAreas = () => {
    const { serviceLocations = [] } = businessConfig;
    
    return (
      <div className="grid grid-cols-2 gap-x-16 gap-y-2 mx-auto w-fit">
        {serviceLocations.map((location: string, index: number) => {
          const parsedLocation = parseLocation(location);
          return (
            <div key={index} className="flex items-start">
              <span className="mr-2">•</span>
              {parsedLocation.isClickable ? (
                <button
                  onClick={() => onLocalCityClick(parsedLocation.city, parsedLocation.state)}
                  className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer hover:underline"
                  title={`Click to set location to ${parsedLocation.city}, ${parsedLocation.state}`}
                >
                  {location}
                </button>
              ) : (
                <span>{location}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSubdomainServiceAreas = () => {
    const { serviceLocations = [] } = businessConfig;
    
    if (serviceLocations.length === 0) {
      return (
        <div className="text-gray-400 text-sm">
          No service areas configured
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-x-20 gap-y-2 mx-auto w-fit">
        {serviceLocations.map((location: string, index: number) => (
          <div key={index} className="text-orange-500 text-sm flex items-start">
            <span className="mr-2">•</span>
            <span>{location}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 gap-3 text-orange-500">
        {businessConfig.slug === 'mdh' ? renderMDHServiceAreas() : renderSubdomainServiceAreas()}
      </div>
    </div>
  );
};

export default ServiceAreasList;