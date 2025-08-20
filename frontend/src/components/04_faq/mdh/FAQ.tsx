import React from 'react';
import { useFAQState } from '../hooks/useFAQState';
import { useFAQData } from '../hooks/useFAQData';
import FAQHeader from '../components/FAQHeader';
import FAQCategory from '../components/FAQCategory';
import FAQFooter from '../components/FAQFooter';

const FAQMDH: React.FC = () => {
  // Use FAQ state (expand/collapse)
  const {
    isExpanded,
    setIsExpanded,
    openItems,
    openCategories,
    toggleExpanded,
    toggleItem,
    toggleCategory,
    resetState,
  } = useFAQState(false);

  // Use static MDH FAQ data (no backend)
  const { groupedFAQs, categories } = useFAQData(undefined);

  // Hard-coded lines for header (can be customized)
  const servicesLine = 'auto detailing, boat & RV detailing, ceramic coating, and PPF';
  const nearbyList = '';

  return (
    <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-6xl mx-auto px-4">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="mx-auto block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
          >
            Show FAQ
          </button>
        ) : (
          <div className="space-y-6">
            <FAQHeader
              servicesLine={servicesLine}
              nearbyList={nearbyList}
              onToggleExpanded={toggleExpanded}
            />
            <div className="space-y-8" role="region" aria-labelledby="faq-heading">
              {categories.map((category) => (
                <FAQCategory
                  key={category}
                  category={category}
                  items={groupedFAQs[category]}
                  isOpen={openCategories.includes(category)}
                  openItems={openItems}
                  onToggleCategory={toggleCategory}
                  onToggleItem={toggleItem}
                />
              ))}
            </div>
            <FAQFooter onRequestQuote={() => {}} />
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQMDH;