import React from 'react';
import { MapPin } from 'lucide-react';

import { formatPhoneNumber } from '@shared/utils/phoneFormatter';

import { useData } from '../contexts/DataProvider';

const BusinessInfo: React.FC = () => {
  const { businessName, phone, location, isTenant } = useData();
  
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // All sites are now tenant-based, so show business info
  if (!isTenant) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-1 md:space-y-1 md:ml-2 min-w-0 flex-1">
      {/* Business Name - Full width on mobile, larger on desktop */}
      <button 
        onClick={handleClick}
        className="hover:opacity-80 transition-opacity text-left min-w-0"
      >
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight truncate">
          {businessName}
        </h1>
      </button>
      
      {/* Phone + Location - side by side on mobile, horizontal on desktop */}
      <div className="flex items-center gap-2 md:gap-2 min-w-0 flex-wrap">
        <a 
          href={`tel:${phone || '5551234580'}`}
          className="text-sm md:text-sm lg:text-base text-stone-300 hover:text-cyan-400 transition-colors truncate flex-shrink-0"
        >
          {formatPhoneNumber(phone || '(555) 123-4580')}
        </a>
        <span className="text-stone-400 flex-shrink-0 text-sm">•</span>
        <div className="flex items-center gap-1 min-w-0">
          <MapPin className="h-4 w-4 md:h-4 md:w-4 text-cyan-400 flex-shrink-0" />
          <span className="text-sm md:text-sm lg:text-base text-cyan-400 truncate">
            {location || 'Service Area'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;