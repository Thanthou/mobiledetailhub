import React from 'react';
import GetInTouch from './GetInTouch';
import FollowUs from './FollowUs';
import FooterLocations from '@/shared/ui/navigation/FooterLocations';
import Disclaimer from './Disclaimer';
import CTAButtons from '@/shared/ui/buttons/CTAButtons';
import { useSiteContext } from '@/shared/hooks';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';
import siteData from '@/data/mdh/site.json';

interface FooterProps {
  onRequestQuote?: () => void;
  locationData?: any;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote, locationData }) => {
  const context = useSiteContext();
  
  // Determine config based on site type
  const config = context.isMainSite ? {
    // Main site - use site.json data, no location
    phone: context.siteData?.contact?.phone,
    email: context.siteData?.contact?.email
    // No base_location for main site
  } : {
    // Location site - use location data if available, otherwise fall back to employee data
    phone: locationData?.header?.phoneDisplay || 
           (context.employeeData?.['business-phone'] ? formatPhoneNumber(context.employeeData['business-phone']) : '(555) 123-4567'),
    email: context.siteData?.contact?.email || 'service@mobiledetailhub.com',
    base_location: {
      city: context.locationData?.city,
      state_name: context.locationData?.stateCode
    }
  };

  // Always use main site social media data (import directly)
  const socialMedia = {
    facebook: siteData?.socials?.facebook,
    instagram: siteData?.socials?.instagram,
    tiktok: siteData?.socials?.tiktok,
    youtube: siteData?.socials?.youtube
  };


  const businessInfo = {
    name: context.isMainSite 
      ? (context.siteData?.brand || 'Mobile Detail Hub')
      : (locationData?.header?.businessName || context.employeeData?.['business-name'] || 'Mobile Detail Hub')
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <GetInTouch 
          config={config}
          onRequestQuote={onRequestQuote || (() => {})}
          showLocationSetter={context.isMainSite}
        />
        <FollowUs socialMedia={socialMedia} />
        <FooterLocations />
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
