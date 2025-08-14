import React from 'react';
import { Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { scrollToTop, scrollToServices, scrollToBottom, scrollToFAQ } from '../utils/scrollUtils';
import { GetStarted } from './shared';
import ServiceAreas from './ServiceAreas';

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
  onBookNow?: () => void;
  onRequestQuote?: () => void;
  businessSlug?: string; // Add business slug to determine which CTA to show
}

const Footer: React.FC<FooterProps> = ({ onBookNow, onRequestQuote, businessSlug }) => {
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
  const parentAttribution = parentConfig?.attribution;
  
  // Check if this is MDH to conditionally hide phone and location
  const isMdh = businessConfig.slug === 'mdh';
  


  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-12">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Get In Touch</h3>
            {!isMdh && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-lg text-white">
                  {businessInfo.phone}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="text-orange-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <button 
                onClick={() => {
                  // Handle location submission - you can customize this behavior
                  console.log('Location submitted:', { location: '', zipCode: '', city: '', state: '' });
                  // You could open a booking modal or redirect to a booking page
                }}
                className="text-lg hover:text-orange-400 transition-colors duration-200 hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
              >
                {businessInfo.email}
              </button>
            </div>

            <ServiceAreas 
              variant="footer" 
              onLocationClick={() => {
                // Open location input field
                console.log('Footer location clicked - should open location input');
                // You can implement your own location input logic here
              }}
            />
          </div>

          {/* Quick Links - Separate Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact', href: '/contact' }
              ].map((link, index) => {
                // Skip gallery link
                if (link.name === 'Gallery') return null;
                
                return (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        
                        // Handle different navigation types
                        if (link.href === '/') {
                          scrollToTop();
                        } else if (link.href === '/contact') {
                          scrollToBottom();
                        } else if (link.href === '/services') {
                          scrollToServices();
                        } else if (link.href === '/faq') {
                          scrollToFAQ();
                        }
                      }}
                      className="text-lg hover:text-orange-400 transition-colors duration-200 flex items-center cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Social Media - Separate Column */}
          {parentConfig?.socialMedia && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-400">Follow Us</h3>
              <div className="flex flex-col space-y-4">
                {parentConfig.socialMedia.facebook && (
                  <a 
                    href={parentConfig.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <Facebook className="h-6 w-6" />
                    <span className="text-lg">Facebook</span>
                  </a>
                )}
                {parentConfig.socialMedia.instagram && (
                  <a 
                    href={parentConfig.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <Instagram className="h-6 w-6" />
                    <span className="text-lg">Instagram</span>
                  </a>
                )}
                {parentConfig.socialMedia.tiktok && (
                  <a 
                    href={parentConfig.socialMedia.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <TikTokIcon className="h-6 w-6" />
                    <span className="text-lg">TikTok</span>
                  </a>
                )}
                {parentConfig.socialMedia.youtube && (
                  <a 
                    href={parentConfig.socialMedia.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <Youtube className="h-6 w-6" />
                    <span className="text-lg">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CTA Section - Dedicated column for GetStarted */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">
              {businessSlug === 'mdh' ? 'Ready to Get Started?' : 'Ready to Book?'}
            </h3>
            <div className="space-y-3">
              {businessSlug === 'mdh' ? (
                // Show GetStarted for MDH
                <GetStarted
                  onLocationSubmit={(location, zipCode, city, state) => {
                    // Handle location submission - you can customize this behavior
                    console.log('Location submitted:', { location, zipCode, city, state });
                    // You could open a booking modal or redirect to a booking page
                  }}
                  placeholder="Enter your zip code or city"
                  className="w-full"
                />
              ) : (
                // Show original buttons for other businesses
                <>
                  <button
                    onClick={onBookNow}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={onRequestQuote}
                    className="w-full bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Request Quote
                  </button>
                </>
              )}
            </div>
          </div>
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