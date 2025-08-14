import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { useLocation } from '../contexts/LocationContext';
import { GetStarted } from './shared';
import { 
  BUSINESS_SERVICE_AREAS, 
  CITY_TO_BUSINESS_MAPPING 
} from '../utils/serviceAreaMapping';

interface ContactProps {
  onRequestQuote?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onRequestQuote }) => {
  const { businessConfig, isLoading, error, getBusinessInfoWithOverrides } = useBusinessConfig();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  
  const toggleState = (state: string) => {
    setExpandedStates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(state)) {
        newSet.delete(state);
      } else {
        newSet.add(state);
      }
      return newSet;
    });
  };

  const handleCityClick = (city: string, businessSlug: string) => {
    // Set the location in context for the target business
    
    // Extract state from the city's current state context
    const currentState = businessConfig?.stateCities ? 
      Object.keys(businessConfig.stateCities).find(state => 
        (businessConfig.stateCities?.[state] || []).includes(city)
      ) : null;
    
    if (currentState) {
      // Set the location in context before navigation
      // This will be stored in localStorage and available to the target business
      const locationData = {
        city: city,
        state: currentState,
        zipCode: '', // We don't have zip code from city click
        fullLocation: `${city}, ${currentState}`
      };
      
      // Store in localStorage so the target business can access it
      localStorage.setItem('selectedLocation', JSON.stringify(locationData));
    }
    
    // Determine the target URL based on environment
    const currentDomain = window.location.hostname;
    let targetUrl = '';
    
    if (currentDomain === 'localhost' || currentDomain.includes('127.0.0.1')) {
      // Development: use query parameter
      targetUrl = `/?business=${businessSlug}&city=${encodeURIComponent(city)}`;
    } else {
      // Production: use subdomain
      const currentProtocol = window.location.protocol;
      targetUrl = `${currentProtocol}//${businessSlug}.mobiledetailhub.com?city=${encodeURIComponent(city)}`;
    }
    
    // Navigate to the target business
    window.location.href = targetUrl;
  };

  const handleLocalCityClick = (city: string, state: string) => {
    // Set the location for the current business (non-MDH)
    
    const locationData = {
      city: city,
      state: state,
      zipCode: '',
      fullLocation: `${city}, ${state}`
    };
    
    // Update the location context directly
    setSelectedLocation(locationData);
  };

  const isClickableLocation = (location: string) => {
    // Check if location matches "City, ST" format
    const cityStateMatch = location.match(/^(.+?),\s*([A-Z]{2})$/);
    return cityStateMatch !== null;
  };

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
  
  if (isLoading) {
    return (
      <section id="contact" className="bg-stone-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">Loading contact information...</div>
        </div>
      </section>
    );
  }

  if (error || !businessConfig || !getBusinessInfoWithOverrides) {
    return (
      <section id="contact" className="bg-stone-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">Error loading contact information</div>
        </div>
      </section>
    );
  }

  // Get business info with overrides applied
  const businessInfo = getBusinessInfoWithOverrides;
  const { contact, serviceLocations } = businessConfig;
  


  return (
    <section id="contact" className="bg-stone-700 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Contact Information and Service Areas */}
          <div className={`${businessConfig.slug === 'mdh' ? 'flex justify-center' : 'grid grid-cols-1 lg:grid-cols-2 gap-40'}`}>
            {/* Contact Information - Only show for non-MDH businesses */}
            {businessConfig.slug !== 'mdh' && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="bg-orange-500 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left w-48">
                      <h3 className="font-semibold text-white">Phone</h3>
                      <span className="text-orange-500 text-lg">
                        {businessInfo.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="bg-orange-500 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left w-48">
                      <h3 className="font-semibold text-white">Location</h3>
                      {showLocationInput ? (
                        <div className="space-y-2">
                          <GetStarted
                            onLocationSubmit={(location, zipCode, city, state) => {
                              // Location will be handled by GetStarted component
                              setShowLocationInput(false);
                            }}
                            placeholder="Enter new location"
                            className="w-full"
                          />
                          <button
                            onClick={() => setShowLocationInput(false)}
                            className="text-xs text-gray-300 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowLocationInput(true)}
                            className="text-orange-500 hover:text-orange-400 text-lg hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit transition-colors"
                          >
                            {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.state}` : businessInfo.address}
                          </button>
                          {selectedLocation && (
                            <button
                              onClick={() => setSelectedLocation(null)} // Clear location from context
                              className="text-xs text-gray-400 hover:text-white transition-colors"
                              title="Clear location"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="bg-orange-500 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left w-48">
                      <h3 className="font-semibold text-white">Email</h3>
                      <button 
                        onClick={onRequestQuote}
                        className="text-orange-500 hover:text-orange-400 text-lg hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                      >
                        {businessInfo.email}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Areas */}
            <div className={`bg-stone-800 p-6 rounded-lg shadow-lg text-center ${businessConfig.slug === 'mdh' ? 'max-w-md' : ''}`}>
              <h3 className="text-xl font-bold mb-4 text-white">
                Service Areas
              </h3>
              
              {businessConfig.slug === 'mdh' ? (
                // MDH - Interactive service areas
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 gap-3 text-orange-500">
                    {(businessConfig.stateCities || BUSINESS_SERVICE_AREAS[businessConfig.slug]) ? (
                      // Show either all states OR cities for selected state
                      expandedStates.size > 0 ? (
                        // Show cities for the selected state
                        Object.entries(businessConfig.stateCities || BUSINESS_SERVICE_AREAS[businessConfig.slug]).map(([state, cities]) => {
                          if (expandedStates.has(state)) {
                            return (
                              <div key={state} className="text-left">
                                <div className="grid grid-cols-1 gap-1 text-sm">
                                  {(cities as string[]).map((city: string, index: number) => {
                                    const businessSlug = businessConfig.cityToBusiness?.[city] || CITY_TO_BUSINESS_MAPPING[city]?.[0];
                                    const isCurrentBusinessCity = businessSlug === businessConfig.slug;
                                    
                                    return (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          if (isCurrentBusinessCity) {
                                            // For current business cities, update local location
                                            handleLocalCityClick(city, state);
                                          } else if (businessSlug) {
                                            // For other business cities, navigate to that business
                                            handleCityClick(city, businessSlug);
                                          }
                                        }}
                                        className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer text-left hover:underline"
                                        title={isCurrentBusinessCity ? `Click to set location to ${city}, ${state}` : `Click to go to ${businessSlug} business`}
                                      >
                                        {city}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })
                      ) : (
                        // Show all clickable states
                        Object.entries(businessConfig.stateCities || BUSINESS_SERVICE_AREAS[businessConfig.slug]).map(([state, cities]) => (
                          <div key={state} className="text-center">
                            <button
                              onClick={() => toggleState(state)}
                              className="text-lg font-semibold hover:text-orange-400 transition-colors cursor-pointer"
                            >
                              {state}
                            </button>
                          </div>
                        ))
                      )
                    ) : (
                      // Fallback to original serviceLocations display
                      <div className="grid grid-cols-2 gap-x-16 gap-y-2 mx-auto w-fit">
                        {(serviceLocations || []).map((location, index) => {
                          const parsedLocation = parseLocation(location);
                          return (
                            <div key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              {parsedLocation.isClickable ? (
                                <button
                                  onClick={() => handleLocalCityClick(parsedLocation.city, parsedLocation.state)}
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
                    )}
                  </div>
                </div>
              ) : (
                // Subdomain - Show all service areas directly from config.js
                <div className="text-left">
                  
                  <div className="grid grid-cols-2 gap-x-20 gap-y-2 mx-auto w-fit">
                    {(businessConfig.serviceLocations || []).map((location, index) => (
                      <div key={index} className="text-orange-500 text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{location}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Fallback if no serviceLocations data */}
                  {(!businessConfig.serviceLocations || businessConfig.serviceLocations.length === 0) && (
                    <div className="text-gray-400 text-sm">
                      No service areas configured
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-300 mt-4">
                Don't see your area? Give us a call - we may still be able to help!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 