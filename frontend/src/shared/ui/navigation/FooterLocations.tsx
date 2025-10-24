import React, { useState } from 'react';

import { useDataOptional } from '@shared/hooks/useData';

import ServiceAreasModal from '../modals/ServiceAreasModal';

interface ServiceArea {
  city: string;
  state: string;
  zip?: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

interface FooterLocationsProps {
  serviceAreas?: ServiceArea[];
}

const FooterLocations: React.FC<FooterLocationsProps> = ({ serviceAreas }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get tenant data - may be null if not in tenant context
  const tenantData = useDataOptional();
  
  // Use tenant service areas if available, otherwise show default message
  const shouldUseTenantData = tenantData?.isTenant && serviceAreas && serviceAreas.length > 0;
  
  // Always show first 4 cities
  const displayAreas = shouldUseTenantData ? serviceAreas.slice(0, 4) : [];
  const hasMore = shouldUseTenantData && serviceAreas.length > 4;
  
  const handleViewMore = () => {
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="text-center md:text-right">
        <h3 className="font-bold text-primary-light text-xl mb-6">Service Areas</h3>
        <div className="flex flex-col space-y-3">
          {shouldUseTenantData ? (
            <>
              {displayAreas.map((area, index) => (
                <div key={index} className="text-theme-text text-lg">
                  {area.city}, {area.state}
                </div>
              ))}
              {hasMore && (
                <div className="flex justify-center md:justify-end">
                  <button
                    onClick={handleViewMore}
                    className="text-primary-light hover:text-primary transition-colors duration-200 text-lg bg-transparent border-none p-0 font-inherit cursor-pointer"
                  >
                    View More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-theme-text text-lg">
              Multiple Service Areas
            </div>
          )}
        </div>
      </div>

      {/* Service Areas Modal */}
      {shouldUseTenantData && tenantData && (
        <ServiceAreasModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); }}
          serviceAreas={serviceAreas}
          businessName={tenantData.businessName}
        />
      )}
    </>
  );
};

export default FooterLocations;
