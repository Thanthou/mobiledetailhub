import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Services' | 'Locations' | 'Scheduling' | 'Payments' | 'Warranty' | 'Weather' | 'General';
}

interface FAQItemWithIndex extends FAQItem {
  originalIndex: number;
}

interface FAQProps {
  autoExpand?: boolean;
  onRequestQuote?: () => void;
}

interface FAQRef {
  expand: () => void;
}

const FAQ = React.forwardRef<FAQRef, FAQProps>(({ autoExpand = false, onRequestQuote }, ref) => {
  const { businessConfig, isLoading, error } = useBusinessConfig();
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Expose expand function to parent component
  React.useImperativeHandle(ref, () => ({
    expand: () => setIsExpanded(true)
  }));

  // Add structured data to head when component mounts
  useEffect(() => {
    if (!businessConfig?.faq?.items) return;
    
    const faqData = businessConfig.faq.items.map((item: any) => ({
      question: item.question,
      answer: item.answer,
      category: 'General' // Default category since config doesn't specify
    }));

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    // Remove existing structured data if any
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[data-faq-schema]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [businessConfig?.faq?.items]);

  // Add scroll listener to close FAQ when user scrolls to bottom or up past FAQ section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Get FAQ section element
      const faqSection = document.getElementById('faq');
      
      if (faqSection) {
        const faqRect = faqSection.getBoundingClientRect();
        const faqTop = faqRect.top;
        
        // Check if user has scrolled to the bottom (within 50px)
        if (scrollTop + windowHeight >= documentHeight - 50) {
          setIsExpanded(false);
          setOpenItems([]);
        }
        // Check if user has scrolled up past the FAQ section (when services section is in view)
        else if (faqTop > windowHeight * 0.95) {
          setIsExpanded(false);
          setOpenItems([]);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Show loading state while waiting for config
  if (isLoading || !businessConfig) {
    return (
      <section id="faq" className="bg-stone-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">Loading FAQ...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="bg-stone-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">Error loading FAQ: {error}</div>
        </div>
      </section>
    );
  }

  // Get FAQ data from business config
  const { faq } = businessConfig;
  
  // If no FAQ data in config, show default FAQ
  if (!faq || !faq.items || faq.items.length === 0) {
    return (
      <section id="faq" className="bg-stone-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">FAQ section not configured</div>
        </div>
      </section>
    );
  }

  // Convert config FAQ items to the expected format
  const faqData: FAQItem[] = faq.items.map((item: any) => ({
    question: item.question,
    answer: item.answer,
    category: 'General' // Default category since config doesn't specify
  }));

  // Group FAQs by category
  const groupedFAQs = faqData.reduce((acc, item, index) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({ ...item, originalIndex: index });
    return acc;
  }, {} as Record<string, (FAQItemWithIndex)[]>);

  // Get all categories that have FAQs
  const categories = Object.keys(groupedFAQs);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-6xl mx-auto px-4">
        {!isExpanded ? (
          /* Compact View - Just FAQ Text */
          <div className="text-center flex justify-center items-center">
            <button
              onClick={toggleExpanded}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-12 py-6 md:px-16 md:py-8 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="View Frequently Asked Questions about mobile detailing services"
            >
              <span className="text-2xl md:text-3xl font-bold">FAQ</span>
            </button>
          </div>
        ) : (
          /* Expanded View */
          <div className="space-y-6">
            {/* Header with SEO-optimized heading */}
            <header className="text-center">
              <h2 
                id="faq-heading" 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
              >
                Frequently Asked Questions About Mobile Detailing in<br />Bullhead City & Fort Mohave, AZ
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                We provide expert mobile detailing services in Bullhead City, Fort Mohave, Laughlin, Kingman, and Needles. Learn more about interior and exterior detailing, ceramic coating, paint protection film (PPF), scheduling, pricing, and service areas.
              </p>
              
              {/* Collapse Button */}
              <button
                onClick={toggleExpanded}
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
                aria-label="Hide FAQ section"
              >
                <ChevronUp className="h-5 w-5" />
                Hide FAQ
              </button>
            </header>

            {/* FAQ Items by Category */}
            <div className="space-y-8" role="region" aria-labelledby="faq-heading">
              {categories.map(category => (
                <div key={category} className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-orange-500 mb-6">
                      {category}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {groupedFAQs[category].map((item) => (
                      <article
                        key={item.originalIndex}
                        className="bg-stone-700 rounded-lg shadow-sm border border-stone-600 overflow-hidden"
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                      >
                        <button
                          onClick={() => toggleItem(item.originalIndex)}
                          className="w-full text-left p-6 flex justify-between items-center hover:bg-stone-600 transition-colors"
                          aria-expanded={openItems.includes(item.originalIndex)}
                          aria-controls={`faq-answer-${item.originalIndex}`}
                        >
                          <h4 
                            className="text-lg font-semibold text-white pr-4"
                            itemProp="name"
                          >
                            {item.question}
                          </h4>
                          {openItems.includes(item.originalIndex) ? (
                            <ChevronUp className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                        
                        {openItems.includes(item.originalIndex) && (
                          <div 
                            id={`faq-answer-${item.originalIndex}`}
                            className="px-6 pb-6"
                            itemScope
                            itemProp="acceptedAnswer"
                            itemType="https://schema.org/Answer"
                          >
                            <div className="border-t border-stone-600 pt-4">
                              <p 
                                className="text-gray-300 leading-relaxed"
                                itemProp="text"
                              >
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional SEO content */}
            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                Need more information about our mobile detailing services? 
                <span 
                  className="text-orange-400 ml-1 font-medium"
                >
                  Call us at {businessConfig.business.phone}
                </span>
                {' '}or{' '}
                <button
                  onClick={onRequestQuote}
                  className="text-orange-400 hover:text-orange-300 underline font-medium"
                >
                  request a quote online
                </button>
                {' '}to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default FAQ;