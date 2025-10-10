import React from 'react';

import { useTenant } from '../contexts/TenantContext';
import { useBusiness } from '../hooks/useBusiness';

const BusinessInfoDisplay: React.FC = () => {
  const { slug } = useTenant();
  const { data: business, isLoading, error } = useBusiness(slug || '');

  if (isLoading) {
    return (
      <div className="text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="text-white">
        <div className="text-sm text-gray-300">Business information unavailable</div>
      </div>
    );
  }

  const primaryAreas = business.service_areas
    .filter(area => area.primary)
    .map(area => `${area.city}, ${area.state}`)
    .join(', ');
  
  const firstArea = business.service_areas[0];
  const fallbackArea = firstArea 
    ? `${firstArea.city}, ${firstArea.state}` 
    : '';

  return (
    <div className="text-white">
      <h1 className="text-xl font-bold">{business.business_name}</h1>
      <div className="text-sm text-gray-300">
        <div>Phone: {business.phone}</div>
        <div>Owner: {business.owner}</div>
        {business.service_areas.length > 0 && (
          <div>
            Serving: {primaryAreas || fallbackArea}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInfoDisplay;
