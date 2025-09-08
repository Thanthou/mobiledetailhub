import { useState } from 'react';

export const useFAQState = (autoExpand: boolean = false) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleExpanded = () => { setIsExpanded((v) => !v); };
  
  const toggleItem = (index: number) =>
    { setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    ); };

  const resetState = () => {
    setIsExpanded(false);
    setOpenItems([]);
  };

  return {
    isExpanded,
    setIsExpanded,
    openItems,
    toggleExpanded,
    toggleItem,
    resetState
  };
};