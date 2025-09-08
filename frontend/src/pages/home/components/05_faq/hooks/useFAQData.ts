import { useMemo } from 'react';

import { MDH_FAQ_ITEMS } from '../data/mdh';
import type { FAQItem } from '../types';

export const useFAQData = () => {
  const faqData: FAQItem[] = useMemo(() => {
    return [...MDH_FAQ_ITEMS];
  }, []);

  const groupedFAQs = useMemo(() => {
    return faqData.reduce<Record<string, (FAQItem & { originalIndex: number })[]>>((acc, item, index) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ ...item, originalIndex: index });
      return acc;
    }, {});
  }, [faqData]);

  const categories = useMemo(() => Object.keys(groupedFAQs), [groupedFAQs]);

  return {
    faqData,
    groupedFAQs,
    categories
  };
};