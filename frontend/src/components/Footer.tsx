import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import LocationEditModal from './shared/LocationEditModal';

// Custom TikTok icon component
const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface FooterProps {
  businessSlug?: string; // Add business slug to determine which CTA to show
}

const Footer: React.FC<FooterProps> = ({ businessSlug }) => {
  const { businessConfig, parentConfig, isLoading, error, getBusinessInfoWithOverrides } = useBusinessConfig();
  
  if (isLoading) {
    return (
      <footer className="bg-stone-800 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Loading footer...</div>
        </div>
      </footer>
    );
  }

  if (error || !businessConfig || !getBusinessInfoWithOverrides) {
    return (
      <footer className="bg-stone-800 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Error loading footer</div>
        </div>
      </footer>
    );
  }

  // Get business info with overrides applied
  const businessInfo = getBusinessInfoWithOverrides;
  

  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Row */}
        <div className="grid grid-cols-3 mb-2">
          <div className="text-center font-bold text-orange-400 text-xl">Get In Touch</div>
          <div className="text-center font-bold text-orange-400 text-xl">Quick Links</div>
          <div className="text-center font-bold text-orange-400 text-xl">Follow Us</div>
        </div>

        {/* Content and Google field wrapper */}
        <div className="mb-12 space-y-2 ml-0">
          <div className="grid grid-cols-3 gap-x-8">
            {/* Column 1: Get In Touch */}
            <div className="flex flex-col space-y-2 ml-20">
              <div className="flex items-center space-x-3 text-left w-full">
                <div className="w-6 flex-shrink-0 flex">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <button className="text-lg hover:text-orange-400 transition-colors duration-200 hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-left">
                  {businessInfo.email}
                </button>
              </div>
              <div className="flex items-center w-full">
                <LocationEditModal
                  placeholder="Enter your city or zip code"
                  buttonClassName="text-orange-500"
                  fallbackText={businessInfo.address}
                  showIcon={true}
                  gapClassName="space-x-4"
                />
              </div>
            </div>
            {/* Column 2: Quick Links */}
            <div className="flex flex-col space-y-2 ml-40 max-w-[100px] w-full">
              <a href="/" className="text-lg hover:text-orange-400 transition-colors duration-200 flex items-center cursor-pointer text-left">Home</a>
              <a href="/services" className="text-lg hover:text-orange-400 transition-colors duration-200 flex items-center cursor-pointer text-left">Services</a>
              <a href="/faq" className="text-lg hover:text-orange-400 transition-colors duration-200 flex items-center cursor-pointer text-left">FAQ</a>
              <a href="/contact" className="text-lg hover:text-orange-400 transition-colors duration-200 flex items-center cursor-pointer text-left">Contact</a>
            </div>
            {/* Column 3: Follow Us */}
            <div className="flex flex-col space-y-2 ml-32 max-w-[130px] w-full">
              {parentConfig?.socialMedia?.facebook && (
                <a href={parentConfig.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2 text-left">
                  <Facebook className="h-6 w-6" />
                  <span className="text-lg">Facebook</span>
                </a>
              )}
              {parentConfig?.socialMedia?.instagram && (
                <a href={parentConfig.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2 text-left">
                  <Instagram className="h-6 w-6" />
                  <span className="text-lg">Instagram</span>
                </a>
              )}
              {parentConfig?.socialMedia?.tiktok && (
                <a href={parentConfig.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2 text-left">
                  <TikTokIcon className="h-6 w-6" />
                  <span className="text-lg">TikTok</span>
                </a>
              )}
              {parentConfig?.socialMedia?.youtube && (
                <a href={parentConfig.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2 text-left">
                  <Youtube className="h-6 w-6" />
                  <span className="text-lg">YouTube</span>
                </a>
              )}
            </div>
          </div>
          {businessSlug === 'mdh' && (
            <div className="max-w-2xl mx-auto w-full px-4 mt-12">
              <h3 className="text-2xl font-bold mb-6 text-orange-400 text-center">Ready to Get Started?</h3>
              {/* The GetStarted component was removed, so this block is now empty */}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stone-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300">
                © 2024 {businessInfo.name}. All rights reserved.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300">
                Powered by MobileDetailHub -{' '}
                <a 
                  href="https://mobiledetailhub.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
                >
                  MobileDetailHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;