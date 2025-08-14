import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';

// ===== Types =====
type FAQCategory =
  | 'Services'
  | 'Pricing & Quotes'
  | 'Scheduling & Weather'
  | 'Locations'
  | 'Preparation'
  | 'Payments & Deposits'
  | 'Warranty & Guarantee'
  | 'Aftercare & Maintenance'
  | 'Fleet & Commercial'
  | 'General';

type ServiceTag =
  | 'Auto'
  | 'Marine'
  | 'RV'
  | 'Ceramic Coating'
  | 'PPF'
  | 'Headlight Restore'
  | 'Odor Removal';

interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
  services?: ServiceTag[]; // optional filters for page-specific FAQs
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

// ===== Helpers (Services-only dynamic builder) =====
function buildServiceFAQs(cfg: any): FAQItem[] {
  if (!cfg) return [];

  const servicesAvail: string[] = cfg.services?.available ?? [];
  const vehicleTypes: string[] = cfg.services?.vehicleTypes ?? [];
  const primaryArea: string =
    cfg.business?.address ||
    (cfg.serviceLocations && cfg.serviceLocations[0]) ||
    'your area';
  const vehiclesList =
    vehicleTypes.length > 0
      ? vehicleTypes.join(', ')
      : 'cars, trucks, SUVs, boats, and RVs';

  const out: FAQItem[] = [];

  // Detail
  if (servicesAvail.some((s) => s.toLowerCase() === 'detail')) {
    out.push(
      {
        category: 'Services',
        question: `What does a full mobile detail include in ${primaryArea}?`,
        answer:
          'Our standard mobile detail covers a hand wash, decontamination, paint-safe drying, wheels/tires, interior vacuum, crevice cleaning, interior glass, and wipe-down. Heavier stains, pet hair, or polishing can be added as upgrades.',
      },
      {
        category: 'Services',
        question: `Do you detail ${vehiclesList.toLowerCase()}?`,
        answer: `Yes. We service ${vehiclesList}. If you have a unique setup, just mention it when you book so we arrive with the right tools.`,
      }
    );
  }

  // Ceramic Coating
  if (servicesAvail.some((s) => s.toLowerCase().includes('ceramic'))) {
    out.push(
      {
        category: 'Services',
        question: `Do you offer ceramic coating in ${primaryArea}?`,
        answer:
          'Yes. We install professional ceramic coatings for long-lasting gloss and easier washes. Packages vary by durability; we’ll prep the paint properly before application.',
      },
      {
        category: 'Services',
        question: 'Is ceramic coating better than wax?',
        answer:
          'Coatings last far longer, resist chemicals better, and keep gloss high with simple maintenance. Wax is short-term protection.',
      }
    );
  }

  // PPF
  if (
    servicesAvail.some(
      (s) =>
        s.toLowerCase().includes('paint protection film') ||
        s.toLowerCase() === 'ppf'
    )
  ) {
    out.push(
      {
        category: 'Services',
        question: `Do you install Paint Protection Film (PPF) in ${primaryArea}?`,
        answer:
          'Yes. PPF protects against rock chips and road rash. It’s a self-healing urethane film applied to high-impact areas or full panels.',
      },
      {
        category: 'Services',
        question: 'Can PPF be removed or replaced later?',
        answer:
          'Absolutely—quality films remove cleanly from OEM paint when installed correctly. Individual panels can be re-done as needed.',
      }
    );
  }

  // Marine / RV (if in vehicleTypes)
  if (vehicleTypes.map((v) => v.toLowerCase()).includes('marine')) {
    out.push({
      category: 'Services',
      question: 'Do you service boats and personal watercraft?',
      answer:
        'Yes. Gelcoat often needs stronger oxidation removal and UV protection. We handle wash, oxidation correction, polish, and protective coatings.',
    });
  }
  if (vehicleTypes.map((v) => v.toLowerCase()).includes('rv')) {
    out.push({
      category: 'Services',
      question: 'Do you detail RVs and travel trailers?',
      answer:
        'Yes. We offer wash, oxidation removal, polish, and long-term protection options tailored to RV surfaces and size.',
    });
  }

  return out;
}

const FAQ = React.forwardRef<FAQRef, FAQProps>(
  ({ autoExpand = false, onRequestQuote }, ref) => {
    const { businessConfig, isLoading, error } = useBusinessConfig();
    const [isExpanded, setIsExpanded] = useState(autoExpand);
    const [openItems, setOpenItems] = useState<number[]>([]);

    React.useImperativeHandle(ref, () => ({
      expand: () => setIsExpanded(true),
    }));

    // ===== Build FAQ data (dynamic Services + static config items) =====
    const staticItems: FAQItem[] =
      (businessConfig?.faq?.items || []).map((item: any) => ({
        question: item.question,
        answer: item.answer,
        category:
          (item.category as FAQCategory) ||
          'General', // fallback if config lacks category
      })) ?? [];

    const dynamicServiceItems = buildServiceFAQs(businessConfig);

    const faqData: FAQItem[] = [...dynamicServiceItems, ...staticItems];

    // ===== Structured data (JSON-LD) =====
    useEffect(() => {
      if (!faqData || faqData.length === 0) return;

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

      const existingScript = document.querySelector(
        'script[data-faq-schema]'
      );
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-faq-schema', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.querySelector('script[data-faq-schema]');
        if (scriptToRemove) scriptToRemove.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(faqData)]);

    // ===== Auto-expand when scrolled to via navigation =====
    useEffect(() => {
      const handleHashChange = () => {
        if (window.location.hash === '#faq') {
          setIsExpanded(true);
          // Small delay to ensure smooth scrolling completes
          setTimeout(() => {
            setIsExpanded(true);
          }, 100);
        }
      };

      const handleFAQNavigation = () => {
        setIsExpanded(true);
      };

      // Check on mount
      handleHashChange();

      // Listen for hash changes and custom events
      window.addEventListener('hashchange', handleHashChange);
      window.addEventListener('faq-navigation', handleFAQNavigation);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        window.removeEventListener('faq-navigation', handleFAQNavigation);
      };
    }, []);

    // ===== Auto-collapse on scroll logic =====
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const faqSection = document.getElementById('faq');
        if (faqSection) {
          const faqRect = faqSection.getBoundingClientRect();
          const faqTop = faqRect.top;

          // Only auto-collapse, don't auto-expand
          if (scrollTop + windowHeight >= documentHeight - 50) {
            setIsExpanded(false);
            setOpenItems([]);
          } else if (faqTop > windowHeight * 0.95) {
            setIsExpanded(false);
            setOpenItems([]);
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ===== Loading / error states =====
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
            <div className="text-center text-white">
              Error loading FAQ: {error}
            </div>
          </div>
        </section>
      );
    }

    // ===== UI helpers =====
    const toggleExpanded = () => setIsExpanded((v) => !v);
    const toggleItem = (index: number) =>
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );

    // ===== Dynamic headings (locations/services) =====
    const locations: string[] = businessConfig.serviceLocations ?? [];
    const primaryArea =
      businessConfig.business?.address ||
      (locations[0] ?? 'Your Area');
    const nearbyList = locations.slice(0, 7).join(', ');
    const offeredServices: string[] = businessConfig.services?.available ?? [];
    const servicesLine =
      offeredServices.length > 0
        ? offeredServices.join(', ')
        : 'auto detailing, boat & RV detailing, ceramic coating, and PPF';

    // ===== Grouping logic =====
    const groupedFAQs = faqData.reduce((acc, item, index) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ ...item, originalIndex: index });
      return acc;
    }, {} as Record<string, FAQItemWithIndex[]>);

    const categories = Object.keys(groupedFAQs);

    // If no data at all
    if (faqData.length === 0) {
      return (
        <section
          className="bg-stone-700 py-16"
          id="faq"
          aria-labelledby="faq-heading"
        >
          <div className="max-w-6xl mx-auto px-4">
            {!isExpanded ? (
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
              <div className="space-y-6">
                <header className="text-center">
                  <h2
                    id="faq-heading"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
                  >
                    Frequently Asked Questions
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Have questions about our mobile detailing services? Contact
                    us for more information.
                  </p>
                  <button
                    onClick={toggleExpanded}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
                    aria-label="Hide FAQ section"
                  >
                    <ChevronUp className="h-5 w-5" />
                    Hide FAQ
                  </button>
                </header>

                <div className="text-center py-8">
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      <span className="text-orange-400 font-medium">
                        Call us at {businessConfig.business.phone}
                      </span>{' '}
                      or{' '}
                      <button
                        onClick={onRequestQuote}
                        className="text-orange-400 hover:text-orange-300 underline font-medium"
                      >
                        request a quote online
                      </button>{' '}
                      to get started.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      );
    }

    // ===== Main render =====
    return (
      <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto px-4">
          {!isExpanded ? (
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
            <div className="space-y-6">
              {/* Header with SEO-optimized dynamic heading */}
              <header className="text-center">
                <h2
                  id="faq-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
                >
                  Frequently Asked Questions About Mobile Detailing in
                  <br />
                  {primaryArea}
                  {locations.length > 1 ? ' & Surrounding Areas' : ''}
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Professional {servicesLine.toLowerCase()} in {nearbyList}.
                </p>

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
                {categories.map((category) => (
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
                            <h4 className="text-lg font-semibold text-white pr-4" itemProp="name">
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
                                <p className="text-gray-300 leading-relaxed" itemProp="text">
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
            </div>
          )}
        </div>
      </section>
    );
  }
);

export default FAQ;
