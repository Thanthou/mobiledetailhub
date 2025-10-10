import React, { useEffect,useState } from 'react';
import { Menu, X } from 'lucide-react';

import { NAV_LINKS } from '@/features/header/utils/constants';
import { handleSectionClick } from '@/features/header/utils/navigation';
import { useReviewsAvailability } from '@/shared/hooks';

import BusinessInfo from './BusinessInfo';
import Logo from './Logo';
import Navigation from './Navigation';
import SocialMediaIcons from './SocialMediaIcons';

interface HeaderProps {
  locationData?: unknown; // Location-specific data (reserved for future use)
  employeeData?: unknown; // Employee-specific data (reserved for future use)
}

const Header: React.FC<HeaderProps> = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const hasReviews = useReviewsAvailability();
  

  // Determine which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = hasReviews ? ['top', 'services', 'reviews', 'faq', 'footer'] : ['top', 'services', 'faq', 'footer'];
      const scrollPosition = window.scrollY + 100; // Offset for better detection
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = section;
            break;
          }
        }
      }

      // If no section is found and we're at the top, default to 'top'
      if (!currentSection && window.scrollY < 200) {
        currentSection = 'top';
      }
      
      setActiveSection(currentSection);
      
      // Clear focus from all navigation items when scrolling
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        if (activeElement.classList.contains('nav-link')) {
          activeElement.blur();
        }
      }
    };

    // Set initial active section
    handleScroll();
    
    // Try to find the scrollable container
    const scrollContainer = document.querySelector('.snap-container') || document.documentElement;
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => { scrollContainer.removeEventListener('scroll', handleScroll); };
  }, [hasReviews]); // Add hasReviews as dependency so effect re-runs when reviews availability changes

  // Determine if a nav item is active based on visible section
  const isActive = (link: typeof NAV_LINKS[0]) => {
    if (link.name === 'Home') {
      return activeSection === 'top';
    }
    
    if (link.name === 'Services') {
      return activeSection === 'services';
    }
    
    if (link.name === 'Reviews') {
      return activeSection === 'reviews';
    }
    
    if (link.name === 'FAQ') {
      return activeSection === 'faq';
    }
    
    if (link.name === 'Gallery') {
      return activeSection === 'footer';
    }
    
    return false;
  };

  // Filter navigation links based on reviews availability
  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.name === 'Reviews') {
      return hasReviews; // Only show reviews if there are reviews available
    }
    return true; // Show all other links
  });
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header role="banner" className="fixed top-0 z-50 bg-black/20 w-full">
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to content
      </a>
      
      <div className="w-full py-4 relative">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          <Logo />
          {/* BusinessInfo now gets data directly from DataProvider */}
          <BusinessInfo />
          <div className="flex items-center space-x-6 ml-auto">
            <Navigation activeSection={activeSection} />
            <SocialMediaIcons />
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="md:hidden bg-black/90 border-t border-white/20"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="px-4 py-6 space-y-4">
            <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation Menu</h2>
            
            {/* Mobile Navigation Links */}
            <nav aria-label="Mobile navigation" className="space-y-2">
              {filteredNavLinks.map(link => (
                link.isFAQ ? (
                  <button
                    key={link.name}
                    onClick={() => { handleSectionClick('#faq'); }}
                    className={`nav-link w-full text-left px-4 py-3 rounded-lg hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 ${
                      isActive(link) ? 'text-orange-400 bg-transparent ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20' : 'text-white bg-transparent'
                    }`}
                    aria-label={`Scroll to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                ) : link.isGallery ? (
                  <button
                    key={link.name}
                    onClick={() => { handleSectionClick('#footer'); }}
                    className={`nav-link w-full text-left px-4 py-3 rounded-lg hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 ${
                      isActive(link) ? 'text-orange-400 bg-transparent ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20' : 'text-white bg-transparent'
                    }`}
                    aria-label={`Scroll to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                ) : link.name === 'Reviews' ? (
                  <button
                    key={link.name}
                    onClick={() => { handleSectionClick('#reviews'); }}
                    className={`nav-link w-full text-left px-4 py-3 rounded-lg hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 ${
                      isActive(link) ? 'text-orange-400 bg-transparent ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20' : 'text-white bg-transparent'
                    }`}
                    aria-label={`Scroll to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                ) : link.name === 'Home' ? (
                  <button
                    key={link.name}
                    onClick={() => { handleSectionClick('#top'); }}
                    className={`nav-link w-full text-left px-4 py-3 rounded-lg hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 ${
                      isActive(link) ? 'text-orange-400 bg-transparent ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20' : 'text-white bg-transparent'
                    }`}
                    aria-label={`Scroll to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                ) : link.name === 'Services' ? (
                  <button
                    key={link.name}
                    onClick={() => { handleSectionClick('#services'); }}
                    className={`nav-link w-full text-left px-4 py-3 rounded-lg hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 ${
                      isActive(link) ? 'text-orange-400 bg-transparent ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20' : 'text-white bg-transparent'
                    }`}
                    aria-label={`Scroll to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`nav-link w-full text-left px-4 py-3 rounded-lg hover:text-orange-400 hover:bg-orange-500/10 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 ${
                      isActive(link) ? 'text-orange-400 bg-transparent ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20' : 'text-white bg-transparent'
                    }`}
                    aria-label={`Navigate to ${link.name} page`}
                  >
                    {link.name}
                  </a>
                )
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
