import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

interface ContactColumnProps {
  config?: {
    phone?: string;
    email?: string;
    base_location?: {
      city?: string;
      state_name?: string;
    };
  };
  onRequestQuote?: () => void;
}

const ContactColumn: React.FC<ContactColumnProps> = ({ 
  config, 
  onRequestQuote 
}) => {
  const contactInfo = {
    phone: config?.phone ?? '(555) 123-4567',
    email: config?.email ?? 'hello@thatsmartsite.com',
    location: config?.base_location?.city && config.base_location.state_name 
      ? `${config.base_location.city}, ${config.base_location.state_name}`
      : 'Select Location'
  };

  return (
    <div className="text-center md:text-left">
      <h3 className="font-bold text-primary-light text-xl mb-6">Get in Touch</h3>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <Phone className="h-5 w-5 flex-shrink-0 text-primary-light" />
          <a 
            href={`tel:${contactInfo.phone}`}
            className="text-lg text-theme-text hover:text-primary-light transition-colors duration-200"
          >
            {contactInfo.phone}
          </a>
        </div>
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <Mail className="h-5 w-5 flex-shrink-0 text-primary-light" />
          <button
            onClick={onRequestQuote}
            className="text-lg text-theme-text hover:text-primary-light transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left"
          >
            {contactInfo.email}
          </button>
        </div>
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <MapPin className="h-5 w-5 flex-shrink-0 text-primary-light" />
          <span className="text-lg text-theme-text">
            {contactInfo.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactColumn;
