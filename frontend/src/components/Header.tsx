import React from 'react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import Logo from './header/Logo';
import ContactInfo from './header/ContactInfo';
import Navigation from './header/Navigation';
import SocialMediaIcons from './header/SocialMediaIcons';
import MobileMenu from './header/MobileMenu';
import AuthSection from './header/AuthSection';
import { HEADER_CONSTANTS } from './header/constants';

const Header: React.FC = () => {
  const { businessConfig, parentConfig, isLoading, error, getBusinessInfoWithOverrides } = useBusinessConfig();
  
  if (isLoading) {
    return (
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-white text-center">Loading...</div>
        </div>
      </header>
    );
  }

  if (error || !businessConfig || !getBusinessInfoWithOverrides) {
    console.error('Header component error:', { 
      error, 
      businessConfig: !!businessConfig, 
      getBusinessInfoWithOverrides: !!getBusinessInfoWithOverrides 
    });
    
    return (
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-white text-center">
            <div className="mb-2">Error loading header</div>
            <div className="text-sm text-gray-300">
              {error && <div>Error: {error}</div>}
              {!businessConfig && <div>Missing business config</div>}
              {!getBusinessInfoWithOverrides && <div>Missing business info</div>}
            </div>
          </div>
        </div>
      </header>
    );
  }

  const businessInfo = getBusinessInfoWithOverrides;
  const { header } = businessConfig;
  const isMDH = businessConfig.slug === HEADER_CONSTANTS.BUSINESS_TYPES.MDH;

  return (
    <header className="sticky md:fixed top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Business Info */}
          <div>
            <Logo businessName={businessInfo.name} isMDH={isMDH} />
            {!isMDH && (
              <ContactInfo 
                phone={businessInfo.phone} 
                address={businessInfo.address} 
              />
            )}
          </div>

          {/* Desktop Navigation and Social Media */}
          <div className="hidden md:flex items-center space-x-8">
            <Navigation navLinks={header?.navLinks} />
            {parentConfig?.socialMedia && (
              <SocialMediaIcons socialMedia={parentConfig.socialMedia} />
            )}
            <AuthSection />
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            navLinks={header?.navLinks}
            socialMedia={parentConfig?.socialMedia}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;