import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Services' | 'Locations' | 'Scheduling' | 'Payments' | 'Warranty' | 'Weather' | 'General';
}

interface FAQItemWithIndex extends FAQItem {
  originalIndex: number;
}

const faqData: FAQItem[] = [
    {
  question: "What mobile detailing services do you offer in Bullhead City?",
  answer: "We offer comprehensive mobile detailing services in Bullhead City, AZ and surrounding areas. Our offerings include interior detailing (vacuuming, carpet shampooing, leather conditioning), exterior detailing (hand wash, clay bar, waxing, polishing), ceramic coating, and paint protection film (PPF). We service all types of vehicles—cars, trucks, boats, RVs, motorcycles, and more—right at your location.",
  category: "Services"
},
{
  question: "Do you provide interior and exterior detailing?",
  answer: "Yes! We provide full-service interior and exterior mobile detailing. Interior services include deep vacuuming, stain removal, odor elimination, and surface conditioning. Exterior services include hand washing, bug and tar removal, clay bar treatment, polishing, and waxing for a showroom shine. Our team comes directly to your home, office, or storage site.",
  category: "Services"
},
{
  question: "Do you apply ceramic coating and PPF?",
  answer: "Absolutely. We offer professional-grade ceramic coating and paint protection film (PPF) services. Ceramic coating protects your vehicle for 1–7 years (depending on product selection) from UV rays, road debris, bird droppings, and oxidation, while providing unmatched gloss and water beading. PPF offers physical protection against rock chips and scratches. Please note: PPF installations must be done in a clean, enclosed garage to ensure proper application and long-term durability. If you don’t have a garage, we can help arrange a suitable location.",
  category: "Services"
},
{
  question: "What types of vehicles can you detail?",
  answer: "We detail all types of vehicles including sedans, trucks, SUVs, RVs, boats, motorcycles, and even commercial fleets. Whether it’s a compact car, luxury sedan, fishing boat, or Class A motorhome, our experienced mobile detailers have the tools and training to handle it.",
  category: "Services"
},
{
  question: "Do you offer motorcycle, boat, and/or RV detailing?",
  answer: "Yes, we specialize in mobile motorcycle, marine, and RV detailing. For motorcycles, we offer gentle but thorough cleaning, chrome polishing, and paint protection. For boats, we provide interior cabin cleaning, oxidation removal, gelcoat polishing, and UV-resistant waxing—all performed dockside or at your home. For RVs, we offer interior cleaning, exterior cleaning, and paint protection.",
  category: "Services"
},
{
  question: "Is your detailing service mobile or do I need to drop off my vehicle?",
  answer: "We are 100% mobile. Our detailing professionals bring all the necessary tools, water, and power to your location, whether that's your driveway, office parking lot, marina, or RV park. No drop-off required—just schedule and we come to you.",
  category: "Services"
},
{
    question: "What areas do you serve for mobile detailing?",
    answer: "We proudly provide mobile car, truck, RV, and boat detailing services in Bullhead City, AZ; Fort Mohave, AZ; Laughlin, NV; Kingman, AZ; and Needles, CA. Whether you're at home, work, or the marina, our fully equipped team brings professional detailing to your location. We service residential driveways, commercial lots, RV parks, and boat docks. If you're unsure about your area, call us at (702) 420-3151 to confirm service availability.",
    category: "Locations"
  },
  {
    question: "Do you offer mobile detailing near me?",
    answer: "If you're located near Bullhead City, Fort Mohave, Laughlin, Kingman, or Needles, there's a good chance we service your area. We specialize in mobile car, truck, boat, and RV detailing throughout northwest Arizona, southeast California, and southern Nevada. Contact us to check availability for your exact address.",
    category: "Locations"
  },
  {
    question: "Can I get my boat or RV detailed at my location?",
    answer: "Yes! We offer on-site detailing for boats and RVs throughout Bullhead City, AZ and surrounding areas. Whether you’re parked at home, in storage, or docked at a marina, our mobile team will arrive with all the necessary equipment to restore and protect your boat or motorhome with expert care.",
    category: "Locations"
  },
  {
    question: "How do I book a mobile detailing appointment?",
    answer: "Booking a mobile detailing appointment is easy! You can call us at (702) 420-3151, email service@jpsmobiledetail.com, or click the 'Book Now' button on our website. We’ll help you choose the right detailing package and schedule a convenient time at your home, office, storage facility, or marina.",
    category: "Scheduling"
  },
  {
    question: "How soon can I get my vehicle detailed?",
    answer: "Availability depends on demand and your location, but we often offer same-day or next-day service in Bullhead City, Fort Mohave, Laughlin, Kingman, and Needles. We recommend booking in advance for weekends or premium services like ceramic coating and paint protection film (PPF).",
    category: "Scheduling"
  },
  {
    question: "How often should I get my car detailed?",
    answer: "For optimal protection and appearance, we recommend full detailing every 3 to 4 months. Vehicles exposed to harsh sun, dust, or salt water—common in the Bullhead City area—may benefit from more frequent service. We also offer regular maintenance plans to keep your car, truck, or RV in top shape year-round.",
    category: "Scheduling"
  },
  
  {
    question: "What payment options do you accept for mobile detailing services?",
    answer: "We accept cash, checks, Zelle, and all major credit and debit cards. You can pay in person, online, or through our mobile app after your service is complete. Whether you booked a ceramic coating, PPF installation, or a basic car wash, we make the payment process quick and convenient.",
    category: "Payments"
  },
  {
    question: "Do you guarantee your auto detailing work?",
    answer: "Yes! We stand behind our mobile detailing services with a satisfaction guarantee. If you're not completely satisfied, we'll work to make it right. For premium services like ceramic coating and paint protection film (PPF), we offer specific manufacturer-backed warranties that cover longevity, durability, and protection. Warranty details are reviewed with you during booking or installation.",
    category: "Warranty"
  },
  {
    question: "Can you still detail my vehicle in rain or bad weather?",
    answer: "We can safely perform interior detailing in most weather, including light rain or overcast conditions. However, for exterior services—especially ceramic coating or paint protection film (PPF)—we require dry conditions to ensure proper application and curing. During heavy rain, strong winds, or extreme heat (common in Bullhead City), we’ll gladly reschedule your appointment for the soonest available clear day to maintain our quality standards.",
    category: "Weather"
  }
  
  ];


interface FAQProps {
  autoExpand?: boolean;
}

interface FAQRef {
  expand: () => void;
}

const FAQ = React.forwardRef<FAQRef, FAQProps>(({ autoExpand = false }, ref) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Expose expand function to parent component
  React.useImperativeHandle(ref, () => ({
    expand: () => setIsExpanded(true)
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

  // Add structured data to head when component mounts
  useEffect(() => {
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
  }, []);

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
    <section className="bg-stone-800 py-16" id="faq" aria-labelledby="faq-heading">
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
                  Call us at (702) 420-3151
                </span>
                {' '}or{' '}
                <a 
                  href="mailto:service@jpsmobiledetail.com" 
                  className="text-orange-400 hover:text-orange-300 font-medium"
                  aria-label="Email us at service@jpsmobiledetail.com"
                >
                  email us
                </a>
                {' '}for personalized assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default FAQ;