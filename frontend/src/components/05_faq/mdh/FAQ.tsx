import React from 'react';
import { useFAQState } from '../hooks/useFAQState';
import { useFAQData } from '../hooks/useFAQData';
import { useMDHConfig } from '../../../contexts/MDHConfigContext';
import FAQExpandButton from '../components/FAQExpandButton';
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
  } = useFAQState(false);

  // Use static MDH FAQ data (no backend)
  const { groupedFAQs, categories } = useFAQData(undefined);

  // Get configurable services description from MDH config (with fallback)
  const { mdhConfig } = useMDHConfig();
  const servicesLine = mdhConfig?.services_description || 'auto detailing, boat & RV detailing, ceramic coating, and PPF';
  const nearbyList = '';

  return (
          <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-6xl mx-auto px-4">
        {!isExpanded ? (
          <FAQExpandButton onToggleExpanded={() => setIsExpanded(true)} />
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
            <FAQFooter />
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQMDH;