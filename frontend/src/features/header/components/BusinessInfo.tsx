import React from 'react';
import { MapPin } from 'lucide-react';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';
import { ContextData } from '@/shared/utils/siteContext';

interface BusinessInfoProps {
  context: ContextData;
  employeeData?: any;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ context, employeeData }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show business info for main site with phone and location setter
  if (!context.isLocation) {
    return (
      <div className="flex flex-col space-y-2 ml-4">
        <button 
          onClick={handleClick}
          className="hover:opacity-80 transition-opacity text-left"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {context.siteData?.brand || 'Mobile Detail Hub'}
          </h1>
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-lg text-stone-300">
            {formatPhoneNumber(context.siteData?.contact?.phone || '(555) 123-4580')}
          </span>
          <span className="text-stone-400">•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-orange-400" />
            <a 
              href="/locations" 
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              Set Your Location
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  const businessName = employeeData?.['business-name'];
  const businessPhone = formatPhoneNumber(employeeData?.['business-phone']);
  const cityState = `${context.city}, ${context.state}`;
  
  return (
    <div className="flex flex-col space-y-2 ml-4">
      <button 
        onClick={handleClick}
        className="hover:opacity-80 transition-opacity text-left"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {businessName}
        </h1>
      </button>
      
      <div className="flex items-center space-x-2">
        <span className="text-lg text-stone-300">
          {businessPhone}
        </span>
        <span className="text-stone-400">•</span>
        <span className="text-lg text-stone-300">
          {cityState}
        </span>
      </div>
    </div>
  );
};

export default BusinessInfo;