import React, { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { useLocation } from '../contexts/LocationContext';
import { 
  SERVICE_AREA_MAPPING, 
  getCitiesForState,
  getBusinessesForCity,
  getStatesForBusiness,
  getCitiesForBusiness,
  BUSINESS_SERVICE_AREAS,
  getCitiesForBusinessInState
} from '../utils/serviceAreaMapping';

interface ServiceAreasProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'footer' | 'header' | 'inline';
  onLocationClick?: () => void; // Callback for when location button is clicked
}

const ServiceAreas: React.FC<ServiceAreasProps> = ({ 
  className = '', 
  showIcon = true, 
  variant = 'footer',
  onLocationClick
}) => {
  const { businessConfig } = useBusinessConfig();
  const { selectedLocation } = useLocation();
  const [showServiceAreas, setShowServiceAreas] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  if (!businessConfig) return null;

  const businessInfo = businessConfig.business;
  const isMdh = businessConfig.slug === 'mdh';
  const businessSlug = businessConfig.slug;

  // Debug logging to see what's being detected
  console.log('ServiceAreas debug:', {
    businessSlug,
    isMdh,
    businessInfo: businessInfo?.name,
    businessAddress: businessInfo?.address,
    businessConfigKeys: Object.keys(businessConfig || {}),
    windowLocation: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search
  });

  // For subdomain businesses, just show their address as service area
  if (!isMdh) {
    console.log('ServiceAreas: Rendering subdomain version for:', businessSlug);
    
    // Add visible debug indicator
    const debugIndicator = (
      <div className="absolute -top-2 -left-2 bg-green-500 text-white px-2 py-1 rounded text-xs z-50">
        Subdomain: {businessSlug}
      </div>
    );
    
    const handleShowServiceAreas = () => {
      setShowServiceAreas(true);
    };

    const handleHideServiceAreas = () => {
      setShowServiceAreas(false);
    };

    // Button text for subdomains - show selected location if available, otherwise show business address
    let buttonText: string;
    if (selectedLocation && (variant === 'header' || variant === 'footer')) {
      buttonText = `${selectedLocation.city}, ${selectedLocation.state}`;
    } else {
      buttonText = businessInfo.address;
    }

    // Get service areas from config for subdomains
    const serviceAreas = businessConfig.serviceLocations || [];
    const stateCities = businessConfig.stateCities || {};

    return (
      <div className={className}>
        {/* Clickable button */}
        <button
          onClick={onLocationClick || handleShowServiceAreas}
          className="flex items-center space-x-3 hover:text-orange-400 transition-colors cursor-pointer"
        >
          {showIcon && <MapPin className="h-5 w-5 text-orange-400" />}
          <span className="text-lg text-gray-300">{buttonText}</span>
        </button>
        
        {/* Simple Service Area Display for Subdomains */}
        {showServiceAreas && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md relative z-50">
            {/* Debug indicator */}
            {debugIndicator}
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Service Areas</h3>
              <button
                onClick={handleHideServiceAreas}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {businessInfo.address}
              </div>
              <p className="text-gray-600 mb-4">
                We provide mobile detailing services in these areas:
              </p>
            </div>
            
            {/* Service Areas List */}
            <div className="space-y-3">
              {Object.entries(stateCities).map(([state, cities]) => (
                <div key={state} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2">{state}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.isArray(cities) && cities.map((city) => (
                      <div key={city} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-6 text-center text-gray-600 text-sm">
              Don't see your area? Give us a call - we may still be able to help!
            </div>
          </div>
        )}
      </div>
    );
  }

  // MDH - Use existing service area mapping system
  console.log('ServiceAreas: Rendering MDH version for:', businessSlug);
  const availableStates = Object.keys(SERVICE_AREA_MAPPING).sort();
  const businessStateCities = SERVICE_AREA_MAPPING;

  const handleShowServiceAreas = () => {
    console.log('handleShowServiceAreas called');
    setShowServiceAreas(true);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleHideServiceAreas = () => {
    setShowServiceAreas(false);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    setSelectedCity(null);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleBackToCities = () => {
    setSelectedCity(null);
  };

  // Button text for MDH - show selected location if available, otherwise show "Anywhere, USA"
  let buttonText: string;
  if (selectedLocation && (variant === 'header' || variant === 'footer')) {
    buttonText = `${selectedLocation.city}, ${selectedLocation.state}`;
    console.log(`ServiceAreas ${variant}: Using selected location:`, selectedLocation);
  } else {
    buttonText = 'Anywhere, USA';
  }
  
  // Debug logging for location context
  console.log(`ServiceAreas ${variant} render:`, {
    selectedLocation,
    buttonText,
    variant
  });

  // Get cities for a specific state and business
  const getCitiesForStateAndBusiness = (state: string, businessSlug: string) => {
    // MDH shows all cities in the state
    return getCitiesForState(state);
  };

  return (
    <div className={className}>
      {/* Clickable button */}
      <button
        onClick={onLocationClick || handleShowServiceAreas}
        className="flex items-center space-x-3 hover:text-orange-400 transition-colors cursor-pointer"
      >
        {showIcon && <MapPin className="h-5 w-5 text-orange-400" />}
        <span className="text-lg text-gray-300">{buttonText}</span>
      </button>
      
      {/* Service Areas Display */}
      {showServiceAreas && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-2xl relative z-50">
          {/* Debug info - remove after testing */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Debug: Open
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Service Areas</h3>
            <button
              onClick={handleHideServiceAreas}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {selectedCity ? (
            // Show businesses for selected city
            <div>
              <button
                onClick={handleBackToCities}
                className="mb-4 text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>{selectedCity}, {selectedState}</span>
              </button>
              
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Businesses serving {selectedCity}
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                {getBusinessesForCity(selectedCity).map((businessSlug) => (
                  <div
                    key={businessSlug}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="font-medium text-gray-800">{businessSlug.toUpperCase()}</div>
                    <div className="text-sm text-gray-500">Mobile Detailing Service</div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedState ? (
            // Show cities for selected state
            <div>
              <button
                onClick={handleBackToStates}
                className="mb-4 text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Service Areas</span>
              </button>
              
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Cities in {selectedState}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getCitiesForStateAndBusiness(selectedState, businessSlug).map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{city}</div>
                    <div className="text-sm text-gray-500">{selectedState}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Show all available states
            <div>
              <p className="text-gray-600 mb-4">
                We provide mobile detailing services across multiple states. Click on a state to see available cities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableStates.map((state) => {
                  const cities = getCitiesForStateAndBusiness(state, businessSlug);
                  
                  return (
                    <button
                      key={state}
                      onClick={() => handleStateClick(state)}
                      className="text-left p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                    >
                      <div className="font-bold text-gray-800 text-lg group-hover:text-orange-600">
                        {state}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cities.length} cities
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 ml-auto mt-2" />
                    </button>
                  );
                })}
              </div>
              
              {/* Footer */}
              <div className="mt-6 text-center text-gray-600 text-sm">
                Don't see your area? Give us a call - we may still be able to help!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceAreas;
