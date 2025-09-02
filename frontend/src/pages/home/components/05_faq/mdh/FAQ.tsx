import React from 'react';
import { useFAQState } from '../hooks/useFAQState';
import { useFAQData } from '../hooks/useFAQData';
import { useMDHConfig } from '/src/contexts/MDHConfigContext';
import FAQExpandButton from '../components/FAQExpandButton';
import FAQHeader from '../components/FAQHeader';
import FAQTabbedInterface from '../components/FAQTabbedInterface';
import FAQFooter from '../components/FAQFooter';

const FAQMDH: React.FC = () => {
  // Use FAQ state (expand/collapse)
  const {
    isExpanded,
    setIsExpanded,
    openItems,
    toggleExpanded,
    toggleItem,
  } = useFAQState(false);

  // Use static MDH FAQ data (no backend)
  const { groupedFAQs, categories } = useFAQData();

  // Get configurable services description from MDH config (with fallback)
  const { mdhConfig } = useMDHConfig();
  const servicesLine = mdhConfig?.services_description || 'auto detailing, boat & RV detailing, ceramic coating, and PPF';
  const nearbyList = '';

  return (
    <section className="bg-stone-900 py-16" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto px-4">
        {!isExpanded ? (
          <FAQExpandButton onToggleExpanded={() => setIsExpanded(true)} />
        ) : (
          <div className="space-y-8">
            <FAQHeader
              servicesLine={servicesLine}
              nearbyList={nearbyList}
              onToggleExpanded={toggleExpanded}
            />
            <FAQTabbedInterface
              groupedFAQs={groupedFAQs}
              categories={categories}
              openItems={openItems}
              onToggleItem={toggleItem}
            />
            <FAQFooter />
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQMDH;