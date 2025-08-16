import React from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail, UserPlus } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import GetStarted from './shared/GetStarted';

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

interface FooterProps {}

const FooterMDH: React.FC<FooterProps> = () => {
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Content Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {/* Column 1: Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-orange-400 text-xl mb-6">Quick Links</h3>
              <div className="flex flex-col space-y-3">
                <a href="/" className="text-lg hover:text-orange-400 transition-colors duration-200 inline-block">
                  Home
                </a>
                <a href="/services" className="text-lg hover:text-orange-400 transition-colors duration-200 inline-block">
                  Services
                </a>
                <a href="/faq" className="text-lg hover:text-orange-400 transition-colors duration-200 inline-block">
                  FAQ
                </a>
                <a href="/careers" className="text-lg hover:text-orange-400 transition-colors duration-200 inline-block">
                  Careers
                </a>
              </div>
            </div>

            {/* Column 2: Follow Us */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-orange-400 text-xl mb-6">Follow Us</h3>
              <div className="flex flex-col space-y-3">
                {parentConfig?.socialMedia?.facebook && (
                  <a 
                    href={parentConfig.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center justify-center md:justify-start space-x-3"
                  >
                    <Facebook className="h-5 w-5 flex-shrink-0" />
                    <span className="text-lg">Facebook</span>
                  </a>
                )}
                {parentConfig?.socialMedia?.instagram && (
                  <a 
                    href={parentConfig.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center justify-center md:justify-start space-x-3"
                  >
                    <Instagram className="h-5 w-5 flex-shrink-0" />
                    <span className="text-lg">Instagram</span>
                  </a>
                )}
                {parentConfig?.socialMedia?.tiktok && (
                  <a 
                    href={parentConfig.socialMedia.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center justify-center md:justify-start space-x-3"
                  >
                    <TikTokIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-lg">TikTok</span>
                  </a>
                )}
                {parentConfig?.socialMedia?.youtube && (
                  <a 
                    href={parentConfig.socialMedia.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center justify-center md:justify-start space-x-3"
                  >
                    <Youtube className="h-5 w-5 flex-shrink-0" />
                    <span className="text-lg">YouTube</span>
                  </a>
                )}
              </div>
            </div>

            {/* Column 3: Connect */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-orange-400 text-xl mb-6">Connect</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-orange-400" />
                  <span className="text-lg">(888) 555-1234</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-orange-400" />
                  <span className="text-lg">service@mobiledetailhub.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <UserPlus className="h-5 w-5 flex-shrink-0 text-orange-400" />
                  <a 
                    href="/join-us" 
                    className="text-lg hover:text-orange-400 transition-colors duration-200"
                  >
                    Join as a Detailer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-bold mb-6 text-orange-400 text-center">Ready to Get Started?</h3>
          <GetStarted
            placeholder="Enter your zip code or city"
            className="w-full"
          />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stone-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-base">
                © 2024 {businessInfo.name}. All rights reserved.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300 text-base">
                Powered by -{' '}
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

export default FooterMDH;