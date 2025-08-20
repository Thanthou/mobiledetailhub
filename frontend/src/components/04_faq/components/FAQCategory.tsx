import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FAQItem from './FAQItem';
import { FAQItemWithIndex } from '../types';

interface FAQCategoryProps {
  category: string;
  items: FAQItemWithIndex[];
  isOpen: boolean;
  openItems: number[];
  onToggleCategory: (category: string) => void;
  onToggleItem: (index: number) => void;
}

const FAQCategory: React.FC<FAQCategoryProps> = ({
  category,
  items,
  isOpen,
  openItems,
  onToggleCategory,
  onToggleItem
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <button
          className="w-full flex items-center justify-center gap-2 text-2xl font-bold text-orange-500 mb-6 focus:outline-none"
          onClick={() => onToggleCategory(category)}
          aria-expanded={isOpen}
          aria-controls={`faq-category-${category}`}
        >
          {category}
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="space-y-4" id={`faq-category-${category}`}>
          {items.map((item) => (
            <FAQItem
              key={item.originalIndex}
              item={item}
              isOpen={openItems.includes(item.originalIndex)}
              onToggle={() => onToggleItem(item.originalIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQCategory;