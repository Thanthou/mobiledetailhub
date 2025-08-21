
import React from 'react';
import { FAQProps, FAQRef } from '../types';
import { useAffiliateData } from '../hooks/useAffiliateData';
import { useFAQState } from '../hooks/useFAQState';
import { useFAQEffects } from '../hooks/useFAQEffects';
import FAQExpandButton from '../components/FAQExpandButton';
import AffiliateHeader from '../components/AffiliateHeader';
import FAQCategory from '../components/FAQCategory';
import AffiliateFooter from '../components/AffiliateFooter';

const FAQAffiliate = React.forwardRef<FAQRef, FAQProps>(
  ({ autoExpand = false, autoCollapseOnScroll = false }, ref) => {
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

    // Custom hook for affiliate FAQ data - pass null as businessConfig since we're using LocationContext
    const { faqData, groupedFAQs, categories, geoConfig } = useAffiliateData(null);

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

    return (
      <section className="bg-stone-800 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto px-4">
          {!isExpanded ? (
            <FAQExpandButton onToggleExpanded={toggleExpanded} />
          ) : (
            <div className="space-y-6">
              <AffiliateHeader
                geoConfig={geoConfig}
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

              <AffiliateFooter />
            </div>
          )}
        </div>
      </section>
    );
  }
);

FAQAffiliate.displayName = 'FAQAffiliate';

export default FAQAffiliate;
