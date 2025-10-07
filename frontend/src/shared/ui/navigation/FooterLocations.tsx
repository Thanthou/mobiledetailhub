import React, { useState } from 'react';
import { useData } from '@/features/header';
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
  
  // Try to get tenant data, fall back to static locations if not available
  let tenantData;
  try {
    tenantData = useData();
  } catch {
    tenantData = null;
  }
  
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
        <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
        <div className="flex flex-col space-y-3">
          {shouldUseTenantData ? (
            <>
              {displayAreas.map((area, index) => (
                <div key={index} className="text-white text-lg">
                  {area.city}, {area.state}
                </div>
              ))}
              {hasMore && (
                <div className="flex justify-end">
                  <button
                    onClick={handleViewMore}
                    className="text-orange-400 hover:text-orange-300 transition-colors duration-200 text-lg bg-transparent border-none p-0 font-inherit cursor-pointer"
                  >
                    View More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-white text-lg">
              Multiple Service Areas
            </div>
          )}
        </div>
      </div>

      {/* Service Areas Modal */}
      {shouldUseTenantData && serviceAreas && (
        <ServiceAreasModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceAreas={serviceAreas}
          businessName={tenantData?.businessName}
        />
      )}
    </>
  );
};

export default FooterLocations;
