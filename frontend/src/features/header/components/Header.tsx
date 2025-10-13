import { useEffect, useState } from "react";
import { Menu, X } from 'lucide-react';

import { NAV_LINKS } from '@/features/header/utils/constants';
import { handleSectionClick } from '@/features/header/utils/navigation';
import { useReviewsAvailability } from '@/shared/hooks';
import { getNavId,useSectionStore } from '@/shared/state/sectionStore';

import BusinessInfo from './BusinessInfo';
import Logo from './Logo';
import Navigation from './Navigation';
import SocialMediaIcons from './SocialMediaIcons';

export default function Header() {
  const [open, setOpen] = useState(false);
  const hasReviews = useReviewsAvailability();
  
  // Subscribe to the section store and map to navigation ID
  const currentSection = useSectionStore((s) => s.current);
  const activeSection = getNavId(currentSection) || 'top';

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur w-full"
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md"
      >
        Skip to content
      </a>

      {/* Bar */}
      <div className="py-3 sm:py-4 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 min-w-0">
          {/* Mobile row (< md 768px) */}
          <div className="flex md:hidden items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
              <Logo />
              <BusinessInfo />
            </div>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => { setOpen(v => !v); }}
              className="flex-shrink-0 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop row (≥ md 768px) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 min-w-0">
            <Logo />
            <BusinessInfo />
            <div className="flex items-center gap-4 lg:gap-6 ml-auto flex-shrink-0">
              <Navigation activeSection={activeSection} />
              <SocialMediaIcons />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`md:hidden absolute inset-x-0 top-full z-50 bg-black/90 transition-opacity duration-200
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div className="px-4 py-6 space-y-4 max-w-7xl mx-auto">
          <h2 className="sr-only">Mobile Navigation Menu</h2>
          
          {/* Mobile Navigation Links */}
          <nav aria-label="Mobile navigation" className="space-y-2">
            {(() => {
              const handleClick = () => {
                document.documentElement.style.overflow = '';
                setOpen(false);
              };
              
              return NAV_LINKS.filter(link => {
                if (link.name === 'Reviews') return hasReviews;
                return true;
              }).map(link => {
              
              return link.isFAQ ? (
                <button
                  key={link.name}
                  onClick={() => { 
                    handleSectionClick('#faq'); 
                    handleClick();
                  }}
                  className="nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
                  aria-label={`Scroll to ${link.name} section`}
                >
                  {link.name}
                </button>
              ) : link.isGallery ? (
                <button
                  key={link.name}
                  onClick={() => { 
                    handleSectionClick('#gallery'); 
                    handleClick();
                  }}
                  className="nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
                  aria-label={`Scroll to ${link.name} section`}
                >
                  {link.name}
                </button>
              ) : link.name === 'Reviews' ? (
                <button
                  key={link.name}
                  onClick={() => { 
                    handleSectionClick('#reviews'); 
                    handleClick();
                  }}
                  className="nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
                  aria-label={`Scroll to ${link.name} section`}
                >
                  {link.name}
                </button>
              ) : link.name === 'Home' ? (
                <button
                  key={link.name}
                  onClick={() => { 
                    handleSectionClick('#top'); 
                    handleClick();
                  }}
                  className="nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
                  aria-label={`Scroll to ${link.name} section`}
                >
                  {link.name}
                </button>
              ) : link.name === 'Services' ? (
                <button
                  key={link.name}
                  onClick={() => { 
                    handleSectionClick('#services'); 
                    handleClick();
                  }}
                  className="nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
                  aria-label={`Scroll to ${link.name} section`}
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleClick}
                  className="nav-link block w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
                  aria-label={`Navigate to ${link.name} page`}
                >
                  {link.name}
                </a>
              );
              });
            })()}
            
            {/* Mobile-only Contact link */}
            <button
              onClick={() => { 
                handleSectionClick('#footer'); 
                const closeMobileMenu = () => {
                  document.documentElement.style.overflow = '';
                  setOpen(false);
                };
                closeMobileMenu();
              }}
              className="nav-link w-full text-left px-4 py-3 rounded-lg text-base sm:text-lg text-white bg-transparent hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200"
              aria-label="Scroll to Contact section"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
