import React from 'react';
import { useBusinessConfig } from '../../hooks/useBusinessConfig';
import { FAQProps, FAQRef } from './types';
import { useFAQData } from './hooks/useFAQData';
import { useFAQState } from './hooks/useFAQState';
import { useFAQEffects } from './hooks/useFAQEffects';
import FAQExpandButton from './components/FAQExpandButton';
import FAQHeader from './components/FAQHeader';
import FAQCategory from './components/FAQCategory';
import FAQFooter from './components/FAQFooter';
import FAQLoadingState from './components/FAQLoadingState';
import FAQErrorState from './components/FAQErrorState';

const FAQMDH = React.forwardRef<FAQRef, FAQProps>(
  ({ autoExpand = false, onRequestQuote, autoCollapseOnScroll = false }, ref) => {
    const { businessConfig, isLoading, error } = useBusinessConfig();
    
    // Custom hooks for state management
    const {
      isExpanded,
      setIsExpanded,
      openItems,
      openCategories,
      toggleExpanded,
      toggleItem,
      toggleCategory,
      resetState
    } = useFAQState(autoExpand);

    // Custom hook for FAQ data
    const { faqData, groupedFAQs, categories } = useFAQData(businessConfig);

    // Custom hook for side effects
    useFAQEffects({
      faqData,
      isExpanded,
      autoCollapseOnScroll,
      resetState,
      setIsExpanded
    });

    // Imperative handle for ref
    React.useImperativeHandle(ref, () => ({
      expand: () => setIsExpanded(true),
    }), [setIsExpanded]);

    // Dynamic content generation
    const locations: string[] = businessConfig?.serviceLocations ?? [];
    const nearbyList = locations.slice(0, 7).join(", ");
    const offeredServices: string[] = businessConfig?.services?.available ?? [];
    const servicesLine =
      offeredServices.length > 0
        ? offeredServices.join(", ")
        : "auto detailing, boat & RV detailing, ceramic coating, and PPF";

    return (
      <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading || !businessConfig ? (
            <FAQLoadingState />
          ) : error ? (
            <FAQErrorState error={error} />
          ) : !isExpanded ? (
            <FAQExpandButton onToggleExpanded={toggleExpanded} />
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

              <FAQFooter onRequestQuote={onRequestQuote} />
            </div>
          )}
        </div>
      </section>
    );
  }
);

FAQMDH.displayName = 'FAQMDH';

export default FAQMDH;