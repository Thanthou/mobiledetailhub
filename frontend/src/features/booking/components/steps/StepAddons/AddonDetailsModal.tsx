import React from 'react';
import DetailsModal from '../../shared/DetailsModal';

interface AddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
  featureIds: string[];
  popular?: boolean;
}

interface AddonDetailsModalProps {
  addon: AddonItem;
  isOpen: boolean;
  onClose: () => void;
  vehicleType: string;
  category: string;
}

const AddonDetailsModal: React.FC<AddonDetailsModalProps> = ({
  addon,
  isOpen,
  onClose,
  vehicleType,
  category
}) => {
  return (
    <DetailsModal
      item={addon}
      isOpen={isOpen}
      onClose={onClose}
      vehicleType={vehicleType}
      category={category}
      itemType="addon"
    />
  );
};

export default AddonDetailsModal;
