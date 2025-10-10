import React, { useState } from 'react';

import { Carousel } from '@/shared/ui';

import ServiceCard from './ServiceCard';
import ServiceDetailsModal from './ServiceDetailsModal';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface ServiceCarouselProps {
  services: ServiceTier[];
  selectedService?: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  const [modalService, setModalService] = useState<ServiceTier | null>(null);

  const handleCardClick = (service: ServiceTier) => {
    setModalService(service);
  };

  const handleCloseModal = () => {
    setModalService(null);
  };

  const renderServiceCard = (service: ServiceTier & { position: 'center' | 'left' | 'right' }, isSelected: boolean) => (
    <ServiceCard
      service={service}
      position={service.position}
      isSelected={isSelected}
      onSelect={() => {
        // Toggle selection: if already selected, deselect; otherwise select
        if (selectedService === service.id) {
          onServiceSelect(''); // Deselect
        } else {
          onServiceSelect(service.id); // Select
        }
      }}
      onCardClick={() => {
        handleCardClick(service);
      }}
    />
  );

  return (
    <>
      <Carousel
        items={services}
        selectedItem={selectedService ?? ''}
        onItemSelect={onServiceSelect}
        renderItem={renderServiceCard}
        onItemClick={handleCardClick}
        emptyMessage="No services available"
      />
      
      {/* Service Details Modal */}
      {modalService && (
        <ServiceDetailsModal
          service={modalService}
          isOpen={!!modalService}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ServiceCarousel;
