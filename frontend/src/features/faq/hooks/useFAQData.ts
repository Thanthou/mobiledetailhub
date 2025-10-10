import { useState } from 'react';

import { MDH_FAQ_ITEMS } from '@/features/faq/utils';

export const useFAQData = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // For now, we only have MDH FAQ data
  // In the future, you can add affiliate-specific FAQ data here
  const faqData = MDH_FAQ_ITEMS;

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
