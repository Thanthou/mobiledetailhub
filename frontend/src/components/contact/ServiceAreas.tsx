import React, { useState } from 'react';
import ServiceAreasList from './ServiceAreasList';
import { useLocation } from '../../contexts/LocationContext';

interface ServiceAreasProps {
  businessConfig: any;
  isMDH: boolean;
}

const ServiceAreas: React.FC<ServiceAreasProps> = ({ businessConfig, isMDH }) => {
  const { setSelectedLocation } = useLocation();
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
    const currentState = businessConfig?.stateCities ?
      Object.keys(businessConfig.stateCities).find(state =>
        (businessConfig.stateCities?.[state] || []).includes(city)
      ) : null;

    if (currentState) {
      const locationData = {
        city: city,
        state: currentState,
        zipCode: '',
        fullLocation: `${city}, ${currentState}`
      };
      localStorage.setItem('selectedLocation', JSON.stringify(locationData));
    }

    const currentDomain = window.location.hostname;
    let targetUrl = '';

    if (currentDomain === 'localhost' || currentDomain.includes('127.0.0.1')) {
      targetUrl = `/${businessSlug}`;
    } else {
      const currentProtocol = window.location.protocol;
      targetUrl = `${currentProtocol}//${businessSlug}.mobiledetailhub.com?city=${encodeURIComponent(city)}`;
    }

    window.location.href = targetUrl;
  };

  const handleLocalCityClick = (city: string, state: string) => {
    const locationData = {
      city: city,
      state: state,
      zipCode: '',
      fullLocation: `${city}, ${state}`
    };
    setSelectedLocation(locationData);
  };

  return (
    <div className={`bg-stone-800 p-6 rounded-lg shadow-lg text-center ${isMDH ? 'max-w-md' : ''}`}>
      <h3 className="text-xl font-bold mb-4 text-white">
        Service Areas
      </h3>
      <ServiceAreasList
        businessConfig={businessConfig}
        expandedStates={expandedStates}
        onToggleState={toggleState}
        onCityClick={handleCityClick}
        onLocalCityClick={handleLocalCityClick}
      />
      <p className="text-sm text-gray-300 mt-4">
        Don't see your area? Give us a call - we may still be able to help!
      </p>
    </div>
  );
};

export default ServiceAreas;