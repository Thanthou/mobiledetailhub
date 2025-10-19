import React, { useState } from 'react';

import { useFAQContent,useRotatingBackground } from '@/tenant-app/components/faq/hooks';
import { getImageOpacityClasses, getTransitionStyles } from '@/shared/utils';

import FAQCategoryFilter from './FAQCategoryFilter';
import FAQEmptyState from './FAQEmptyState';
import FAQList from './FAQList';
import FAQSearchBar from './FAQSearchBar';

interface FAQProps {
  locationData?: {
    faqIntro?: string;
    city?: string;
    faqs?: Array<{ q: string; a: string }>;
  };
}

const FAQ: React.FC<FAQProps> = ({ locationData }) => {
  const [selectedCategory, setSelectedCategory] = useState('Services');
  const [expandedFaq, setExpandedFaq] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get FAQ content from database (with fallbacks)
  const { faqTitle, faqSubtitle, faqItems, categories } = useFAQContent({ locationData });
  
  // Rotating background
  const { images, currentIndex, loading: backgroundLoading } = useRotatingBackground();

  // Filter FAQs based on category and search
  const filteredFaqs = faqItems.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string | number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <section id="faq" className="relative h-screen snap-start snap-always overflow-hidden">
      {/* Rotating Background Images with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Render all images to test if performance optimization causes the pop */}
        {images.map((image, index) => {
          return (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt || `FAQ background image ${String(index + 1)}`}
              className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
              style={getTransitionStyles(2000)}
              decoding={index === 0 ? 'sync' : 'async'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          );
        })}
        
        {/* Fallback background if no images loaded */}
        {!images.length && !backgroundLoading && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/gallery/dodge-viper-gts-grigio-telesto-studio.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          />
        )}
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-stone-900/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pt-[72px] md:pt-[88px]">
        <div className="max-w-6xl mx-auto w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {faqTitle}
            </h1>
            <p className="text-stone-200 text-lg max-w-2xl mx-auto drop-shadow-md">
              {faqSubtitle}
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8">
            <FAQSearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <FAQCategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />
          </div>

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <FAQEmptyState />
            ) : (
              <FAQList
                faqs={filteredFaqs}
                expandedFaq={expandedFaq}
                onToggleFaq={toggleFaq}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* eslint-disable react-refresh/only-export-components -- Both named and default export needed for compatibility */
export { FAQ };
export default FAQ;
/* eslint-enable react-refresh/only-export-components -- End of multi-export section */
