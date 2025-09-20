import React from 'react';
import siteData from '@/data/mdh/site.json';
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

  // Show business info for location pages, brand name for main site
  if (!context.isLocation) {
    return (
      <div className="flex items-center space-x-3 ml-4">
        <button 
          onClick={handleClick}
          className="hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {siteData.brand}
          </h1>
        </button>
      </div>
    );
  }
  
  const businessName = employeeData?.['business-name'];
  const businessPhone = formatPhoneNumber(employeeData?.['business-phone']);
  const cityState = `${context.city}, ${context.state}`;
  
  return (
    <div className="flex items-center space-x-3 ml-4">
      <div>
        <button 
          onClick={handleClick}
          className="hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {businessName}
          </h1>
        </button>
        <p className="text-lg text-stone-300">
          {businessPhone} • {cityState}
        </p>
      </div>
    </div>
  );
};

export default BusinessInfo;