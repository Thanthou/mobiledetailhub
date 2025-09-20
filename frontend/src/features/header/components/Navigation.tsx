import React from 'react';
import { NAV_LINKS } from '@/features/header/utils/constants';
import { handleSectionClick } from '@/features/header/utils/navigation';

interface NavigationProps {
  activeSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  // Determine if a nav item is active based on visible section
  const isActive = (link: typeof NAV_LINKS[0]) => {
    const isLinkActive = (
      (link.name === 'Home' && activeSection === 'top') ||
      (link.name === 'Services' && activeSection === 'services') ||
      (link.name === 'Reviews' && activeSection === 'reviews') ||
      (link.name === 'FAQ' && activeSection === 'faq') ||
      (link.name === 'Gallery' && activeSection === 'footer')
    );
    
    return isLinkActive;
  };

  // Base classes for nav items
  const getNavItemClasses = (link: typeof NAV_LINKS[0]) => {
    const isLinkActive = isActive(link);
    
    const baseClasses = "nav-link hover:text-orange-400 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black/20 transition-colors duration-200 p-2 font-inherit cursor-pointer rounded";
    
    const finalClasses = isLinkActive 
      ? `${baseClasses} text-orange-400 bg-transparent border-none ring-2 ring-orange-400 ring-offset-2 ring-offset-black/20` 
      : `${baseClasses} text-white bg-transparent border-none`;
    
    return finalClasses;
  };

  return (
    <nav aria-label="Primary navigation" className="hidden md:flex space-x-6">
      {NAV_LINKS.map(link => (
        link.isFAQ ? (
          <button
            key={link.name}
            onClick={() => handleSectionClick('#faq')}
            className={getNavItemClasses(link)}
            aria-label={`Scroll to ${link.name} section`}
          >
            {link.name}
          </button>
        ) : link.isGallery ? (
          <button
            key={link.name}
            onClick={() => handleSectionClick('#footer')}
            className={getNavItemClasses(link)}
            aria-label={`Scroll to ${link.name} section`}
          >
            {link.name}
          </button>
        ) : link.name === 'Reviews' ? (
          <button
            key={link.name}
            onClick={() => handleSectionClick('#reviews')}
            className={getNavItemClasses(link)}
            aria-label={`Scroll to ${link.name} section`}
          >
            {link.name}
          </button>
        ) : link.name === 'Home' ? (
          <button
            key={link.name}
            onClick={() => handleSectionClick('#top')}
            className={getNavItemClasses(link)}
            aria-label={`Scroll to ${link.name} section`}
          >
            {link.name}
          </button>
        ) : link.name === 'Services' ? (
          <button
            key={link.name}
            onClick={() => handleSectionClick('#services')}
            className={getNavItemClasses(link)}
            aria-label={`Scroll to ${link.name} section`}
          >
            {link.name}
          </button>
        ) : (
          <a
            key={link.name}
            href={link.href}
            className={getNavItemClasses(link)}
            aria-label={`Navigate to ${link.name} page`}
          >
            {link.name}
          </a>
        )
      ))}
    </nav>
  );
};

export default Navigation;
