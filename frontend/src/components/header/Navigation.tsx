import React from 'react';
import { scrollToTop, scrollToServices, scrollToBottom, scrollToFAQ } from '../../utils/scrollUtils';
import { HEADER_CONSTANTS } from './constants';

interface NavLink {
  name: string;
  href: string;
  onClick?: () => void;
}

interface NavigationProps {
  navLinks?: NavLink[];
}

const Navigation: React.FC<NavigationProps> = ({ navLinks }) => {
  const links = navLinks || HEADER_CONSTANTS.DEFAULT_NAV_LINKS;

  const handleNavClick = (link: NavLink, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Handle different navigation types
    switch (link.href) {
      case '/':
        scrollToTop();
        break;
      case '/contact':
        scrollToBottom();
        break;
      case '/services':
        scrollToServices();
        break;
      case '/faq':
        scrollToFAQ();
        break;
    }
    
    // Call custom onClick if it exists
    if (link.onClick) {
      link.onClick();
    }
  };

  return (
    <nav className="flex items-center space-x-8">
      {links.map((link, index) => {
        // Skip gallery link
        if (link.name === 'Gallery') return null;
        
        return (
          <a
            key={index}
            href={link.href}
            onClick={(e) => handleNavClick(link, e)}
            className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
            aria-label={`Navigate to ${link.name}`}
          >
            {link.name}
          </a>
        );
      })}
    </nav>
  );
};

export default Navigation;