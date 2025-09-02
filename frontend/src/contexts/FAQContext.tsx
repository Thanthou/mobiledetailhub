import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FAQContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  expandFAQ: () => void;
  collapseFAQ: () => void;
  toggleFAQ: () => void;
}

const FAQContext = createContext<FAQContextType | undefined>(undefined);

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
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const collapseFAQ = () => setIsExpanded(false);
  
  const toggleFAQ = () => setIsExpanded(prev => !prev);

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

export const useFAQ = (): FAQContextType => {
  const context = useContext(FAQContext);
  if (context === undefined) {
    throw new Error('useFAQ must be used within a FAQProvider');
  }
  return context;
};
