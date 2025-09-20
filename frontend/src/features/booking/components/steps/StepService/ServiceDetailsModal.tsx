import React from 'react';
import { useBookingStore } from '@/features/booking/state';
import DetailsModal from '../../shared/DetailsModal';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface ServiceDetailsModalProps {
  service: ServiceTier;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  isOpen,
  onClose
}) => {
  const { bookingData } = useBookingStore();

  return (
    <DetailsModal
      item={service}
      isOpen={isOpen}
      onClose={onClose}
      vehicleType={bookingData.vehicle}
      itemType="service"
    />
  );
};

export default ServiceDetailsModal;
