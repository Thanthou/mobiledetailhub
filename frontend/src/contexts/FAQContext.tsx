import type { ReactNode } from 'react';
import React, { createContext, useState } from 'react';

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

  const expandFAQ = () => {
    setIsExpanded(true);
    // Scroll to FAQ section after a brief delay to ensure it's expanded
    setTimeout(() => {
      const faqSection = document.getElementById('faq');
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const collapseFAQ = () => { setIsExpanded(false); };
  
  const toggleFAQ = () => { setIsExpanded(prev => !prev); };

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

