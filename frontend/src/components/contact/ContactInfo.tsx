import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import ContactItem from './ContactItem';
import LocationEditModal from '../shared/LocationEditModal';

interface ContactInfoProps {
  businessInfo: {
    phone: string;
    email: string;
    address: string;
  };
  onRequestQuote?: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ businessInfo, onRequestQuote }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
      <div className="space-y-6">
        <ContactItem icon={Phone} title="Phone">
          <span className="text-orange-500 text-lg">
            {businessInfo.phone}
          </span>
        </ContactItem>

        <ContactItem icon={MapPin} title="Location">
          <LocationEditModal
            placeholder="Enter new location"
            buttonClassName="text-orange-500"
            fallbackText={businessInfo.address}
            showIcon={false}
          />
        </ContactItem>

        <ContactItem icon={Mail} title="Email">
          <button 
            onClick={onRequestQuote}
            className="text-orange-500 hover:text-orange-400 text-lg hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
          >
            {businessInfo.email}
          </button>
        </ContactItem>
      </div>
    </div>
  );
};

export default ContactInfo;