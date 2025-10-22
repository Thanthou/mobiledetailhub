import React, { useState } from 'react';

import { useData } from '@shared/hooks/useData';
import ServiceAreasModal from '@shared/ui/modals/ServiceAreasModal';

interface ServiceAreasLinkProps {
  children?: React.ReactNode;
  className?: string;
}

const ServiceAreasLink: React.FC<ServiceAreasLinkProps> = ({ 
  children = 'view our service areas',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get tenant data for service areas - hooks must be called unconditionally
  const tenantData = useData();

  // If no service areas, just render as plain text
  if (tenantData.serviceAreas.length === 0) {
    return <span>{children}</span>;
  }

  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={`text-orange-400 hover:text-orange-300 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit ${className}`}
      >
        {children}
      </button>
      
      <ServiceAreasModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        serviceAreas={tenantData.serviceAreas}
        businessName={tenantData.businessName}
      />
    </>
  );
};

export default ServiceAreasLink;

