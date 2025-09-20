import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useRef } from 'react';

export interface FAQContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  expandFAQ: () => void;
  collapseFAQ: () => void;
  toggleFAQ: () => void;
}

export const FAQContext = createContext<FAQContextType | null>(null);

interface FAQProviderProps {
  children: ReactNode;
}

export const FAQProvider: React.FC<FAQProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const expandFAQ = () => {
    setIsExpanded(true);
    // Scroll to FAQ section after a brief delay to ensure it's expanded
    setTimeout(() => {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const collapseFAQ = () => { setIsExpanded(false); };
  
  const toggleFAQ = () => { setIsExpanded(prev => !prev); };

  // Add scroll detection to collapse FAQ when scrolling away
  useEffect(() => {
    const handleScroll = () => {
      if (!isExpanded) return;

      const faqSection = document.getElementById('faq');
      if (!faqSection) return;

      const faqRect = faqSection.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if FAQ is visible in viewport
      const isFAQVisible = faqRect.top < windowHeight && faqRect.bottom > 0;
      
      // Check if user has scrolled to the bottom of the page
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 100; // 100px threshold
      
      // Check if FAQ is above the current viewport (scrolled up)
      const isAboveViewport = faqRect.bottom < 0;
      
      // Collapse if FAQ is not visible OR if user is at bottom of page OR if FAQ is above viewport
      if (!isFAQVisible || isAtBottom || isAboveViewport) {
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Add a small delay to prevent immediate collapse during smooth scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          setIsExpanded(false);
        }, 300);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isExpanded]);

  const value: FAQContextType = {
    isExpanded,
    setIsExpanded,
    expandFAQ,
    collapseFAQ,
    toggleFAQ,
  };

  return (
    <FAQContext.Provider value={value}>
      {children}
    </FAQContext.Provider>
  );
};

