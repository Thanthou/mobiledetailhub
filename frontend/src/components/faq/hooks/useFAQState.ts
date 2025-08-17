import { useState } from 'react';

export const useFAQState = (autoExpand: boolean = false) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleExpanded = () => setIsExpanded((v) => !v);
  
  const toggleItem = (index: number) =>
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetState = () => {
    setIsExpanded(false);
    setOpenItems([]);
    setOpenCategories([]);
  };

  return {
    isExpanded,
    setIsExpanded,
    openItems,
    openCategories,
    toggleExpanded,
    toggleItem,
    toggleCategory,
    resetState
  };
};