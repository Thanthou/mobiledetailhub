/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { getAffiliateDisplayLocation } from '@/features/affiliateDashboard/utils';
import { useAuth, useFAQ, useLocation as useLocationContext, useMDHConfig, useSiteContext } from '@/shared/hooks';
import { Button, LocationEditModal } from '@/shared/ui';
import { formatPhoneNumber, scrollToTop } from '@/shared/utils';

import { NAV_LINKS } from '../constants';
import LoginButton from './LoginButton';
import SocialMediaIcons from './SocialMediaIcons';
import UserMenu from './UserMenu';

// Type definitions

const HeaderAffiliate: React.FC = () => {
  const siteContext = useSiteContext();
  const authContext = useAuth();
  const locationContext = useLocationContext();
  const affiliateContext = useAffiliate();
  const mdhContext = useMDHConfig();
  const faqContext = useFAQ();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely extract values with proper type checking
  const businessSlug = siteContext.businessSlug;
  const user = authContext.user;
  const selectedLocation = locationContext.selectedLocation;
  const affiliateData = affiliateContext.affiliateData;
  const affiliateLoading = affiliateContext.isLoading;
  const affiliateError = affiliateContext.error;
  const mdhConfig = mdhContext.mdhConfig;
  const mdhLoading = mdhContext.isLoading;
  const mdhError = mdhContext.error;
  const expandFAQ = faqContext.expandFAQ;
  
  // Check if we're on a service page
  const isServicePage = location.pathname.includes('/service/');
  
  // Get the appropriate location to display (selected location if served, otherwise primary)
  const displayLocation = React.useMemo(() => {
    if (!affiliateData || !selectedLocation) return null;
    return getAffiliateDisplayLocation(affiliateData.service_areas, selectedLocation);
  }, [affiliateData, selectedLocation]);

  const isLoading = affiliateLoading || mdhLoading;
  const hasError = affiliateError || mdhError;



  if (isLoading) {
    return (
      <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-white text-center">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  if (hasError || !mdhConfig || !affiliateData) {
    return (
      <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4">
                         <div className="text-white text-center">Header placeholder</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          {/* Back button for service pages */}
          {isServicePage && (
            <Button
              onClick={() => {
                if (businessSlug) {
                  void navigate(`/${businessSlug}`);
                  // Scroll to services section after navigation
                  setTimeout(() => {
                    const servicesSection = document.getElementById('services');
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }
              }}
              variant="ghost"
              size="sm"
              className="flex items-center text-white hover:text-orange-400 mr-4"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
            >
              Back
            </Button>
          )}
          
          {/* 1. Logo/Business Name/Info */}
          <div className="flex items-center space-x-3">
            {mdhConfig.logo_url && (
              <button
                onClick={scrollToTop}
                className="h-8 w-8 md:h-10 md:w-10 hover:opacity-80 cursor-pointer transition-opacity duration-200"
                aria-label="Go to top"
              >
                <img 
                  src={mdhConfig.logo_url} 
                  alt="Logo" 
                  className="h-full w-full"
                />
              </button>
            )}
            <div>
              <button
                onClick={scrollToTop}
                className="text-2xl md:text-3xl font-bold text-white hover:opacity-80 cursor-pointer transition-opacity duration-200 text-left"
                aria-label="Go to top"
              >
                {affiliateData.business_name || 'Business Name'}
              </button>
              <div className="text-white text-sm md:text-base font-semibold">
                <div className="flex items-center space-x-2">
                  {/* Display phone number from database with consistent formatting */}
                  {affiliateData.phone ? (
                    <span>{formatPhoneNumber(affiliateData.phone)}</span>
                  ) : (
                    <span className="text-red-400">No phone data</span>
                  )}
                  {/* Show separator if we have both phone and location */}
                  {affiliateData.phone && displayLocation && (
                    <span className="text-orange-400">•</span>
                  )}
                  {displayLocation && (
                    <LocationEditModal
                      placeholder="Enter new location"
                      buttonClassName="text-white hover:text-orange-400 text-sm md:text-base font-semibold hover:underline cursor-pointer"
                      displayText={displayLocation.fullLocation || 'Select Location'}
                      showIcon={false}
                      asText={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Links/Social Media */}
          <div className="flex items-center space-x-4 ml-auto">
            <nav className="flex space-x-4">
              {NAV_LINKS.map(link => (
                link.isFAQ ? (
                  <button
                    key={link.name}
                    onClick={() => { expandFAQ(); }}
                    className="text-white hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer"
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                )
              ))}
            </nav>
            {(mdhConfig.facebook || mdhConfig.instagram || mdhConfig.tiktok || mdhConfig.youtube) && (
              <SocialMediaIcons socialMedia={{
                facebook: mdhConfig.facebook || '',
                instagram: mdhConfig.instagram || '',
                tiktok: mdhConfig.tiktok || '',
                youtube: mdhConfig.youtube || '',
              }} />
            )}
          </div>

          {/* 3. Login/User */}
          <div className="ml-6">
            {user ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAffiliate;
