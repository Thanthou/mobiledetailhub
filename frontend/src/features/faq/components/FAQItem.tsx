import React from 'react';
import { ChevronDown } from 'lucide-react';

import type { FAQItem } from '@/features/faq/types';

interface FAQItemProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isExpanded, onToggle }) => {
  return (
    <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg border border-stone-700/50 overflow-hidden hover:shadow-xl hover:shadow-black/30 transition-all duration-300 h-fit">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 text-left flex justify-between items-start hover:bg-stone-700/40 transition-colors duration-200 group"
      >
        <div className="flex-1 pr-2">
          <h3 className="text-white font-semibold text-base group-hover:text-orange-400 transition-colors duration-200 leading-tight">
            {faq.question}
          </h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-stone-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
            isExpanded ? 'rotate-180 text-orange-400' : ''
          }`}
        />
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 border-t border-stone-700/30">
          <div className="pt-3">
            <p className="text-stone-300 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
