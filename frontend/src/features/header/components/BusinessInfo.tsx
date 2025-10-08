import React from 'react';
import { MapPin } from 'lucide-react';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';
import { useData } from '../contexts/DataProvider';

interface BusinessInfoProps {
  employeeData?: any;
  locationData?: any;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ employeeData, locationData }) => {
  const { businessName, phone, location, isTenant } = useData();
  
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // All sites are now tenant-based, so show business info
  if (isTenant) {
    return (
      <div className="flex flex-col space-y-2 ml-4">
        <button 
          onClick={handleClick}
          className="hover:opacity-80 transition-opacity text-left"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {businessName || 'Mobile Detail Hub'}
          </h1>
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-lg text-stone-300">
            {formatPhoneNumber(phone || '(555) 123-4580')}
          </span>
          <span className="text-stone-400">•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400">
              {location || 'Service Area'}
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default BusinessInfo;