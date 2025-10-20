import { useEffect, useState } from 'react';

import { useData } from '@shared/hooks';

import type { FAQItem } from '../types';
import { loadIndustryFAQs } from '../utils';

export const useFAQData = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const { industry } = useData();

  // Load industry-specific FAQs
  useEffect(() => {
    if (!industry) return;
    
    loadIndustryFAQs(industry)
      .then(setFaqData)
      .catch((error: unknown) => {
        console.error('Failed to load FAQs:', error);
        setFaqData([]);
      });
  }, [industry]);

  const toggleItem = (question: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(question)) {
        newSet.delete(question);
      } else {
        newSet.add(question);
      }
      return newSet;
    });
  };

  const resetState = () => {
    setOpenItems(new Set());
  };

  return {
    faqData,
    openItems,
    toggleItem,
    resetState,
  };
};
