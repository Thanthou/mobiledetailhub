import React from 'react';

import { useData } from '@shared/hooks/useData';
import CTAButtons from '@shared/ui/buttons/CTAButtons';
import FooterLocations from '@shared/ui/navigation/FooterLocations';
import { formatPhoneNumber } from '@shared/utils/phoneFormatter';

import Disclaimer from './Disclaimer';
import FollowUs from './FollowUs';
import GetInTouch from './GetInTouch';

interface FooterProps {
  onRequestQuote?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote }) => {
  const tenantData = useData();
  
  // All sites are now tenant-based, so use tenant data
  const config = {
    phone: formatPhoneNumber(tenantData.phone),
    email: tenantData.email,
    base_location: {
      city: tenantData.location.split(', ')[0] ?? '',
      state_name: tenantData.location.split(', ')[1] ?? ''
    }
  };

  // Use tenant social media
  const socialMedia = {
    facebook: tenantData.socialMedia.facebook,
    instagram: tenantData.socialMedia.instagram,
    tiktok: tenantData.socialMedia.tiktok,
    youtube: tenantData.socialMedia.youtube
  };

  const businessInfo = {
    name: tenantData.businessName
  };


  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-8">
      {/* Mobile Layout: Vertical stack */}
      <div className="md:hidden space-y-6 mb-6">
        <GetInTouch 
          config={config}
          onRequestQuote={onRequestQuote || (() => {})}
          showLocationSetter={false}
        />
        <FollowUs socialMedia={socialMedia} />
        <FooterLocations serviceAreas={tenantData.serviceAreas} />
      </div>

      {/* Desktop Layout: 3 equal columns */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mb-6 md:mb-7 lg:mb-8">
        <GetInTouch 
          config={config}
          onRequestQuote={onRequestQuote || (() => {})}
          showLocationSetter={false}
        />
        <FollowUs socialMedia={socialMedia} />
        <FooterLocations serviceAreas={tenantData.serviceAreas} />
      </div>
      
      {/* CTA Buttons - Centered above line break */}
      <div className="flex justify-center mb-4 md:mb-8">
        <CTAButtons 
          getQuoteProps={{ onClick: onRequestQuote }}
          bookNowProps={{ size: 'md' }}
        />
      </div>
      
      {/* Footer Bottom */}
      <Disclaimer 
        businessInfo={businessInfo}
      />
    </div>
  );
};

export default Footer;
