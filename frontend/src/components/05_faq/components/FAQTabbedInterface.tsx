import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FAQItem from './FAQItem';
import { FAQItemWithIndex } from '../types';

interface FAQTabbedInterfaceProps {
  groupedFAQs: Record<string, FAQItemWithIndex[]>;
  categories: string[];
  openItems: number[];
  onToggleItem: (index: number) => void;
}

const FAQTabbedInterface: React.FC<FAQTabbedInterfaceProps> = ({
  groupedFAQs,
  categories,
  openItems,
  onToggleItem
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter FAQs based on search term across all categories
  const getFilteredFAQs = () => {
    if (!searchTerm.trim()) {
      return groupedFAQs[activeCategory] || [];
    }

    // Search across all categories when there's a search term
    const allFAQs = Object.values(groupedFAQs).flat();
    return allFAQs.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredFAQs = getFilteredFAQs();
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="bg-stone-800 rounded-xl p-6 shadow-xl">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            id="faq-search"
            name="faqSearch"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {!isSearching && (
        <>
          {/* Category Tabs - Horizontal scrollable on mobile */}
          <div className="mb-8">
            <div className="border-b border-stone-600">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-stone-600 scrollbar-track-transparent">
                <div className="flex space-x-1 min-w-max px-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`
                        px-6 py-3 font-semibold text-sm whitespace-nowrap rounded-t-lg transition-all duration-200
                        ${activeCategory === category
                          ? 'text-orange-400 bg-stone-700 border-b-2 border-orange-400'
                          : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
                        }
                      `}
                      aria-selected={activeCategory === category}
                      role="tab"
                    >
                      {category}
                      <span className="ml-2 text-xs opacity-75">
                        ({groupedFAQs[category]?.length || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Category Content */}
          <div className="min-h-[400px]">
            <h3 className="text-xl font-bold text-orange-400 mb-6 text-center">
              {activeCategory}
            </h3>
            
            {/* FAQ Items in Grid Layout */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2">
              {(groupedFAQs[activeCategory] || []).map((item) => (
                <div key={item.originalIndex} className={openItems.includes(item.originalIndex) ? "h-fit" : "h-[120px]"}>
                  <FAQItem
                    item={item}
                    isOpen={openItems.includes(item.originalIndex)}
                    onToggle={() => onToggleItem(item.originalIndex)}
                  />
                </div>
              ))}
            </div>

            {(!groupedFAQs[activeCategory] || groupedFAQs[activeCategory].length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <p>No FAQs found in this category.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Search Results */}
      {isSearching && (
        <div className="min-h-[400px]">
          <h3 className="text-xl font-bold text-orange-400 mb-6 text-center">
            Search Results ({filteredFAQs.length})
          </h3>
          
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2">
            {filteredFAQs.map((item) => (
              <div key={item.originalIndex} className={openItems.includes(item.originalIndex) ? "h-fit" : "h-[120px]"}>
                <FAQItem
                  item={item}
                  isOpen={openItems.includes(item.originalIndex)}
                  onToggle={() => onToggleItem(item.originalIndex)}
                  highlightTerm={searchTerm}
                />
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No FAQs found matching "{searchTerm}"</p>
              <p className="text-sm mt-2">Try different keywords or browse by category above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQTabbedInterface;
