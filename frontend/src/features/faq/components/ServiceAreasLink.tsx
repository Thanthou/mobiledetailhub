import React, { useState } from 'react';
import { useData } from '@/features/header';
import ServiceAreasModal from '@/shared/ui/modals/ServiceAreasModal';

interface ServiceAreasLinkProps {
  children?: React.ReactNode;
  className?: string;
}

const ServiceAreasLink: React.FC<ServiceAreasLinkProps> = ({ 
  children = 'view our service areas',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get tenant data for service areas
  let tenantData;
  try {
    tenantData = useData();
  } catch {
    tenantData = null;
  }

  if (!tenantData?.isTenant || !tenantData?.serviceAreas) {
    return <span>{children}</span>;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`text-orange-400 hover:text-orange-300 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit ${className}`}
      >
        {children}
      </button>
      
      <ServiceAreasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceAreas={tenantData.serviceAreas}
        businessName={tenantData.businessName}
      />
    </>
  );
};

export default ServiceAreasLink;

