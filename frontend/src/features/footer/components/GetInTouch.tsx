import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface GetInTouchProps {
  config?: {
    phone?: string;
    email?: string;
    base_location?: {
      city?: string;
      state_name?: string;
    };
  };
  onRequestQuote?: () => void;
  showLocationSetter?: boolean;
}

const GetInTouch: React.FC<GetInTouchProps> = ({ 
  config, 
  onRequestQuote,
  showLocationSetter = false
}) => {
  const contactInfo = {
    phone: config?.phone || '(555) 123-4567',
    email: config?.email || 'service@mobiledetailhub.com',
    location: config?.base_location?.city && config?.base_location?.state_name 
      ? `${config.base_location.city}, ${config.base_location.state_name}`
      : null // Don't show location for main site
  };

  return (
    <div className="text-center md:text-left">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Get in Touch</h3>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <Phone className="h-5 w-5 flex-shrink-0 text-orange-400" />
          <a 
            href={`tel:${contactInfo.phone}`}
            className="text-lg text-white hover:text-orange-400 transition-colors duration-200"
          >
            {contactInfo.phone}
          </a>
        </div>
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <Mail className="h-5 w-5 flex-shrink-0 text-orange-400" />
          <button
            onClick={onRequestQuote}
            className="text-lg text-white hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer text-left"
          >
            {contactInfo.email}
          </button>
        </div>
        {contactInfo.location && (
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <MapPin className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <span className="text-lg text-white">
              {contactInfo.location}
            </span>
          </div>
        )}
        {showLocationSetter && !contactInfo.location && (
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <MapPin className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <a 
              href="/locations" 
              className="text-lg text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              Set Your Location
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetInTouch;
