import React from 'react';
import { Phone } from 'lucide-react';
import LocationEditModal from '../shared/LocationEditModal';

interface ContactInfoProps {
  phone: string;
  address: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ phone, address }) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-200 mt-1">
      <div className="flex items-center space-x-1">
        <Phone className="h-4 w-4" />
        <span>{phone}</span>
      </div>
      <LocationEditModal
        placeholder="Enter new location"
        buttonClassName="text-gray-200"
        fallbackText={address}
        showIcon={true}
        gapClassName="space-x-2"
      />
    </div>
  );
};

export default ContactInfo;