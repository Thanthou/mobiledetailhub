import React from 'react';
import GetInTouch from './GetInTouch';
import FollowUs from './FollowUs';
import FooterLocations from '@/shared/ui/navigation/FooterLocations';
import Disclaimer from './Disclaimer';
import CTAButtons from '@/shared/ui/buttons/CTAButtons';
import { useSiteContext } from '@/shared/hooks';
import { useData } from '@/features/header';
import { formatPhoneNumber } from '@/shared/utils/phoneFormatter';
import siteData from '@/data/mobile-detailing/site.json';

interface FooterProps {
  onRequestQuote?: () => void;
  locationData?: any;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote, locationData }) => {
  const context = useSiteContext();
  
  // Try to get tenant data, fall back to context if not available
  let tenantData;
  try {
    tenantData = useData();
  } catch {
    // Not in a tenant context, use fallback
    tenantData = null;
  }
  
  // Determine config based on site type
  const config = tenantData?.isTenant ? {
    // Tenant site - use tenant data
    phone: formatPhoneNumber(tenantData.phone),
    email: tenantData.email,
    base_location: {
      city: tenantData.location.split(', ')[0],
      state_name: tenantData.location.split(', ')[1]
    }
  } : context.isMainSite ? {
    // Main site - use site.json data, no location
    phone: formatPhoneNumber(context.siteData?.contact?.phone || '(555) 123-4567'),
    email: context.siteData?.contact?.email
    // No base_location for main site
  } : {
    // Location site - use direct fields from location data
    phone: formatPhoneNumber(locationData?.phone || '(555) 123-4567'),
    email: locationData?.email || 'service@mobiledetailhub.com',
    base_location: {
      city: locationData?.city,
      state_name: locationData?.stateCode
    }
  };

  // Use tenant social media if available, otherwise main site
  const socialMedia = tenantData?.isTenant ? {
    facebook: tenantData.socialMedia?.facebook,
    instagram: tenantData.socialMedia?.instagram,
    tiktok: tenantData.socialMedia?.tiktok,
    youtube: tenantData.socialMedia?.youtube
  } : {
    facebook: siteData?.socials?.facebook,
    instagram: siteData?.socials?.instagram,
    tiktok: siteData?.socials?.tiktok,
    youtube: siteData?.socials?.youtube
  };

  const businessInfo = {
    name: tenantData?.isTenant 
      ? tenantData.businessName
      : context.isMainSite 
        ? (context.siteData?.brand || 'Mobile Detail Hub')
        : (locationData?.businessName || 'Mobile Detail Hub')
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
        <FooterLocations serviceAreas={tenantData?.isTenant ? tenantData.serviceAreas : undefined} />
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
