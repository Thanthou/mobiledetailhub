import React, { useState } from 'react';

import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import { useRotatingBackground } from '@/features/faq/hooks';
import FAQSearchBar from './FAQSearchBar';
import FAQCategoryFilter from './FAQCategoryFilter';
import FAQList from './FAQList';
import FAQEmptyState from './FAQEmptyState';

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Services & Packages');
  const [expandedFaq, setExpandedFaq] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Rotating background
  const { images, currentIndex, loading: backgroundLoading, error: backgroundError } = useRotatingBackground();

  // Extract unique categories from FAQ data
  const categories = ['All', ...Array.from(new Set(MDH_FAQ_ITEMS.map(faq => faq.category)))];

  // Filter FAQs based on category and search
  const filteredFaqs = MDH_FAQ_ITEMS.filter(faq => {
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
        {/* Render all images but only show current and next for performance */}
        {images.map((image, index) => {
          // Only render current and next image (if there is a next)
          const hasNext = images.length > 1;
          const nextIndex = hasNext ? (currentIndex + 1) % images.length : 0;
          if (index !== currentIndex && (!hasNext || index !== nextIndex)) return null;
          
          const isCurrent = index === currentIndex;
          
          return (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity ${
                isCurrent ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                transitionDuration: '2s'
              }}
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
      <div className="relative z-10 h-full overflow-y-auto pt-20">
        <div className="max-w-6xl mx-auto w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-stone-200 text-lg max-w-2xl mx-auto drop-shadow-md">
              Find answers to common questions about our mobile detailing services
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

export default FAQ;
