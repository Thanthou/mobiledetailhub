import React from 'react';
import GetInTouch from './GetInTouch';
import FollowUs from './FollowUs';
import ServiceAreas from './ServiceAreas';
import Disclaimer from './Disclaimer';
import CTAButtons from '@/shared/ui/buttons/CTAButtons';
import { useSiteContext } from '@/shared/hooks';

interface FooterProps {
  onRequestQuote?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote }) => {
  const context = useSiteContext();
  
  // Determine config based on site type
  const config = context.isMainSite ? {
    // Main site - use site.json data, no location
    phone: context.siteData?.contact?.phone,
    email: context.siteData?.contact?.email
    // No base_location for main site
  } : {
    // Location site - use location data
    phone: context.locationData?.phone || '(555) 123-4567',
    email: context.locationData?.email || 'service@mobiledetailhub.com',
    base_location: {
      city: context.locationData?.city,
      state_name: context.locationData?.state
    }
  };

  const socialMedia = {
    facebook: context.siteData?.socials?.facebook,
    instagram: context.siteData?.socials?.instagram,
    tiktok: context.siteData?.socials?.tiktok,
    youtube: context.siteData?.socials?.youtube
  };

  const serviceAreas = [
    { city: 'Los Angeles', state: 'CA', primary: true },
    { city: 'San Diego', state: 'CA' },
    { city: 'San Francisco', state: 'CA' },
    { city: 'Sacramento', state: 'CA' }
  ];

  const businessInfo = {
    name: context.locationData?.business_name || context.siteData?.business_name || 'Mobile Detail Hub'
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <GetInTouch 
          config={config}
          onRequestQuote={onRequestQuote || (() => {})}
        />
        <FollowUs socialMedia={socialMedia} />
        <ServiceAreas serviceAreas={serviceAreas} />
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
