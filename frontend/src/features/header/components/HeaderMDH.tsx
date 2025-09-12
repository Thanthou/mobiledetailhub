/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth, useFAQ, useMDHConfig } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { scrollToTop } from '@/shared/utils';

import { NAV_LINKS } from '../constants';
import LoginButton from './LoginButton';
import SocialMediaIcons from './SocialMediaIcons';
import UserMenu from './UserMenu';

// Type declaration for window.__MDH__
declare global {
  interface Window {
    __MDH__?: {
      logo_url?: string;
      header_display?: string;
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      youtube?: string;
    };
  }
}

const HeaderMDH: React.FC = () => {
  const authContext = useAuth();
  const { user, loading: authLoading } = authContext;
  
  const mdhConfigContext = useMDHConfig();
  const { mdhConfig } = mdhConfigContext;
  
  const faqContext = useFAQ();
  const { expandFAQ } = faqContext;
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a service page
  const isServicePage = location.pathname.includes('/service/');

  // Get static config immediately (available from TypeScript data file)
  const staticConfig = typeof window !== 'undefined' ? window.__MDH__ : null;
  
  // Use dynamic config if available, otherwise fall back to static config
  const config = mdhConfig.header_display ? mdhConfig : staticConfig;
  
  // Always render header immediately - never wait for network
  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          {/* Back button for service pages */}
          {isServicePage && (
            <Button
              onClick={() => {
                void navigate('/');
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
          
          {/* 1. Logo/Business Name - Always show immediately */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => { scrollToTop(); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
              }
            }}
            aria-label="Go to top of page"
            role="button"
            tabIndex={0}
          >
            {config.logo_url && (
              <img src={config.logo_url} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {config.header_display ?? 'Mobile Detail Hub'}
              </h1>
            </div>
          </div>

          {/* 2. Links/Social Media - Always show immediately */}
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
            {/* Social media icons - show if available in either config */}
            {(config.facebook || config.instagram || config.tiktok || config.youtube) && (
              <SocialMediaIcons socialMedia={{
                facebook: config.facebook ?? '',
                instagram: config.instagram ?? '',
                tiktok: config.tiktok ?? '',
                youtube: config.youtube ?? '',
              }} />
            )}
          </div>

          {/* 3. Login/User - Show loading state while auth is loading */}
          <div className="ml-6">
            {authLoading ? (
              <div className="text-white text-sm">Loading...</div>
            ) : user ? (
              <UserMenu />
            ) : (
              <LoginButton />
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default HeaderMDH;
