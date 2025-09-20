import { useMemo, useState } from 'react';

import { useSiteContext } from '@/shared/hooks';

import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import type { GeoConfig } from '@/features/faq/types';

interface UseFAQDataProps {
  config?: GeoConfig;
  autoExpand?: boolean;
}

export const useFAQData = ({ config, autoExpand = false }: UseFAQDataProps = {}) => {
  const { isMDH } = useSiteContext();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Get FAQ data based on site context
  const faqData = useMemo(() => {
    // For now, we only have MDH FAQ data
    // In the future, you can add affiliate-specific FAQ data here
    return isMDH ? MDH_FAQ_ITEMS : MDH_FAQ_ITEMS;
  }, [isMDH, config]);

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
