import { useState, useMemo } from 'react';

import { useSiteContext } from '@/shared/hooks';

import { MDH_FAQ_ITEMS } from '../data/mdh/data';
import { AFFILIATE_FAQ_ITEMS } from '../data/affiliate/data';
import type { AffiliateConfig } from '../data/affiliate/types';

interface UseFAQDataProps {
  config?: AffiliateConfig;
  autoExpand?: boolean;
}

export const useFAQData = ({ config, autoExpand = false }: UseFAQDataProps = {}) => {
  const { isMDH } = useSiteContext();
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Get FAQ data based on site context
  const faqData = useMemo(() => {
    return isMDH ? MDH_FAQ_ITEMS : AFFILIATE_FAQ_ITEMS(config || {});
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
    setIsExpanded(false);
    setOpenItems(new Set());
  };

  return {
    faqData,
    isExpanded,
    setIsExpanded,
    openItems,
    toggleItem,
    resetState,
  };
};
