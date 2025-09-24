import React, { useState } from 'react';
import { getImageOpacityClasses, getTransitionStyles } from '@/shared/utils';

import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import { useRotatingBackground } from '@/features/faq/hooks';
import FAQSearchBar from './FAQSearchBar';
import FAQCategoryFilter from './FAQCategoryFilter';
import FAQList from './FAQList';
import FAQEmptyState from './FAQEmptyState';

interface FAQProps {
  locationData?: any;
}

const FAQ: React.FC<FAQProps> = ({ locationData }) => {
  const [selectedCategory, setSelectedCategory] = useState('Services & Packages');
  const [expandedFaq, setExpandedFaq] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Rotating background
  const { images, currentIndex, loading: backgroundLoading, error: backgroundError } = useRotatingBackground();

  // Convert location FAQs to FAQItem format if available
  const locationFAQs = locationData?.faqs?.map((faq: any) => ({
    id: faq.id,
    question: faq.q,
    answer: faq.a,
    category: locationData.city ? locationData.city : 'Location'
  })) || [];

  // Combine location FAQs with existing FAQs
  const allFAQs = [...MDH_FAQ_ITEMS, ...locationFAQs];

  // Extract unique categories from combined FAQ data
  const allCategories = ['All', ...Array.from(new Set(allFAQs.map(faq => faq.category)))];
  
  // Map full category names to short display names
  const categoryDisplayMapping = {
    'All': 'All',
    'General': 'General',
    'Services & Packages': 'Services',
    'Scheduling & Location': 'Scheduling',
    'Pricing & Payment': 'Pricing',
    'Preparation & Aftercare': 'Preparation',
    'RV & Boat Services': 'RV',
    'Locations': 'Locations',
    'Payments & Deposits': 'Payments',
    'Warranty & Guarantee': 'Warranty',
  };
  
  // Create display categories, keeping location categories as-is
  const categories = allCategories.map(category => {
    // For location categories (city names), keep the full name
    if (category === locationData?.city || category === 'Location') {
      return category;
    }
    // For standard categories, use short display name
    return categoryDisplayMapping[category as keyof typeof categoryDisplayMapping] || category;
  });

  // Create reverse mapping for filtering
  const displayToActualMapping = {
    'All': 'All',
    'General': 'General', 
    'Services': 'Services & Packages',
    'Scheduling': 'Scheduling & Location',
    'Pricing': 'Pricing & Payment',
    'Preparation': 'Preparation & Aftercare',
    'RV': 'RV & Boat Services',
    'Locations': 'Locations',
    'Payments': 'Payments & Deposits',
    'Warranty': 'Warranty & Guarantee',
  };
  
  // Get the actual category name for filtering
  const actualSelectedCategory = (selectedCategory === locationData?.city || selectedCategory === 'Location')
    ? selectedCategory 
    : (displayToActualMapping[selectedCategory as keyof typeof displayToActualMapping] || selectedCategory);

  // Filter FAQs based on category and search
  const filteredFaqs = allFAQs.filter(faq => {
    const matchesCategory = actualSelectedCategory === 'All' || faq.category === actualSelectedCategory;
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
              alt={image.alt || `FAQ background image ${index + 1}`}
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
      <div className="relative z-10 h-full overflow-y-auto pt-20">
        <div className="max-w-6xl mx-auto w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-stone-200 text-lg max-w-2xl mx-auto drop-shadow-md">
              {locationData?.faqIntro || "Find answers to common questions about our mobile detailing services"}
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

export default FAQ;
