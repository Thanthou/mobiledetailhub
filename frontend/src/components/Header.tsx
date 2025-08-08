import React from 'react';
import { Phone, MapPin, Menu, Facebook, Instagram, Youtube } from 'lucide-react';

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

interface HeaderProps {
  businessName: string;
  phone: string;
  location: string;
  navLinks: { name: string; href: string; onClick?: () => void }[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ businessName, phone, location, navLinks, socialLinks }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Business Name */}
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">{businessName}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-200 mt-1">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            
            {/* Social Media Icons */}
            {socialLinks && (
              <div className="flex items-center space-x-3 ml-4">
                {socialLinks.facebook && (
                  <a 
                    href={socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a 
                    href={socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a 
                    href={socialLinks.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors duration-200"
                  >
                    <TikTokIcon className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a 
                    href={socialLinks.youtube} 
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
  );
};

export default Header;