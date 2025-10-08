import React from 'react';
import GetInTouch from './GetInTouch';
import FollowUs from './FollowUs';
import FooterLocations from '@/shared/ui/navigation/FooterLocations';
import Disclaimer from './Disclaimer';
import CTAButtons from '@/shared/ui/buttons/CTAButtons';
// Legacy useSiteContext removed - now using tenant-based routing
import { useData } from '@/features/header';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';
import siteData from '@/data/mobile-detailing/site.json';

interface FooterProps {
  onRequestQuote?: () => void;
  locationData?: any;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote, locationData }) => {
  const tenantData = useData();
  
  // All sites are now tenant-based, so use tenant data
  const config = {
    phone: formatPhoneNumber(tenantData.phone || '(555) 123-4567'),
    email: tenantData.email || 'service@mobiledetailhub.com',
    base_location: {
      city: tenantData.location?.split(', ')[0] || '',
      state_name: tenantData.location?.split(', ')[1] || ''
    }
  };

  // Use tenant social media
  const socialMedia = {
    facebook: tenantData.socialMedia?.facebook,
    instagram: tenantData.socialMedia?.instagram,
    tiktok: tenantData.socialMedia?.tiktok,
    youtube: tenantData.socialMedia?.youtube
  };

  const businessInfo = {
    name: tenantData.businessName || 'Mobile Detail Hub'
  };


  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <GetInTouch 
          config={config}
          onRequestQuote={onRequestQuote || (() => {})}
          showLocationSetter={false}
        />
        <FollowUs socialMedia={socialMedia} />
        <FooterLocations serviceAreas={tenantData.serviceAreas} />
      </div>
      
      {/* CTA Buttons - Centered above line break */}
      <div className="flex justify-center mb-8">
        <CTAButtons 
          getQuoteProps={{ onClick: onRequestQuote }}
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
