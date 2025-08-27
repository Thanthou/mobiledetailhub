import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navigation from './Navigation';
import SocialMediaIcons from './SocialMediaIcons';

interface NavLink {
  name: string;
  href: string;
  onClick?: () => void;
}

interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

interface MobileMenuProps {
  navLinks?: NavLink[];
  socialMedia?: SocialMediaConfig;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navLinks, socialMedia }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white hover:text-orange-400 transition-colors duration-200"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeMenu}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                closeMenu();
              }
            }}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-stone-800 z-40 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-700">
                <span className="text-white font-semibold">Menu</span>
                <button
                  onClick={closeMenu}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      closeMenu();
                    }
                  }}
                  className="text-white hover:text-orange-400 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-4">
                <div className="flex flex-col space-y-1">
                  <Navigation navLinks={navLinks} />
                </div>
              </div>

              {/* Social Media Icons */}
              {socialMedia && (
                <div className="p-4 border-t border-stone-700">
                  <div className="text-white text-sm mb-3">Follow Us</div>
                  <SocialMediaIcons socialMedia={socialMedia} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;