import { useMemo } from 'react';
import { FAQItem } from '../types';
import { MDH_FAQ_ITEMS } from '../data/mdh';

export const useFAQData = () => {
  const faqData: FAQItem[] = useMemo(() => {
    return [...MDH_FAQ_ITEMS];
  }, []);

  const groupedFAQs = useMemo(() => {
    return faqData.reduce((acc, item, index) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ ...item, originalIndex: index });
      return acc;
    }, {} as Record<string, (FAQItem & { originalIndex: number })[]>);
  }, [faqData]);

  const categories = useMemo(() => Object.keys(groupedFAQs), [groupedFAQs]);

  return {
    faqData,
    groupedFAQs,
    categories
  };
};