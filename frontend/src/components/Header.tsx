import React from 'react';
import { Phone, Menu, Facebook, Instagram, Youtube } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { scrollToTop, scrollToServices, scrollToBottom, scrollToFAQ } from '../utils/scrollUtils';
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
    console.error('Header component error:', { error, businessConfig: !!businessConfig, getBusinessInfoWithOverrides: !!getBusinessInfoWithOverrides });
    
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

  // Get business info with overrides applied
  const businessInfo = getBusinessInfoWithOverrides;
  const { header } = businessConfig;
  
  // Check if this is mdh (Mobile Detail Hub) - the special case
  const isMdh = businessInfo.name.toLowerCase().includes('mobile detail hub') || 
                businessInfo.name.toLowerCase() === 'mdh' || 
                businessInfo.name === 'Mobile Detail Hub' ||
                businessConfig.slug === 'mdh';
  

  
  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Business Name */}
            <div className="text-white">
              <div className="flex items-center space-x-3">
                {/* Only show favicon for mdh */}
                {isMdh && (
                  <img 
                    src="/favicon.webp" 
                    alt="Mobile Detail Hub Logo" 
                    className="h-8 w-8 md:h-10 md:w-10"
                  />
                )}
                <h1 className="text-2xl md:text-3xl font-bold">{businessInfo.name}</h1>
              </div>
              {/* Only show phone and location if NOT mdh */}
              {!isMdh && (
                <div className="flex items-center space-x-4 text-sm text-gray-200 mt-1">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{businessInfo.phone}</span>
                  </div>
                  <LocationEditModal
                    placeholder="Enter new location"
                    buttonClassName="text-orange-500"
                    fallbackText={businessInfo.address}
                    showIcon={true}
                    gapClassName="space-x-2"
                  />
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                {(header?.navLinks || [
                  { name: 'Home', href: '/' },
                  { name: 'Services', href: '/services' },
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Contact', href: '/contact' }
                ]).map((link, index) => {
                  // Skip gallery link
                  if (link.name === 'Gallery') return null;
                  
                  return (
                    <a
                      key={index}
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
                        
                        // Call onClick if it exists
                        if (link.onClick) {
                          link.onClick();
                        }
                      }}
                      className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>
              
              {/* Social Media Icons */}
              {parentConfig?.socialMedia && (
                <div className="flex items-center space-x-3 ml-4">
                  {parentConfig.socialMedia.facebook && (
                    <a 
                      href={parentConfig.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-400 transition-colors duration-200"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {parentConfig.socialMedia.instagram && (
                    <a 
                      href={parentConfig.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-400 transition-colors duration-200"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {parentConfig.socialMedia.tiktok && (
                    <a 
                      href={parentConfig.socialMedia.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-400 transition-colors duration-200"
                    >
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  )}
                  {parentConfig.socialMedia.youtube && (
                    <a 
                      href={parentConfig.socialMedia.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-400 transition-colors duration-200"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white hover:text-orange-400 transition-colors duration-200">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      
    </>
  );
};

export default Header;