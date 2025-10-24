import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { env } from '@shared/config/env';

export default function PreviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);

  // Detect screen size and adjust cards to show
  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(window.innerWidth < 768 ? 1 : 2);
    };

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine base URL based on environment
  const getPreviewBaseUrl = () => {
    if (env.DEV) {
      // Local development - use tenant subdomain
      return 'http://tenant.localhost:5177';
    }
    // Production
    return 'https://preview.thatsmartsite.com';
  };

  const baseUrl = getPreviewBaseUrl();

  const industries = [
    {
      name: 'Mobile Detailing',
      description: 'Professional auto detailing services',
      color: 'from-blue-500 to-cyan-500',
      preview: `${baseUrl}/mobile-detailing-preview`,
      image: '/previews/mobile-detailing-preview.webp',
    },
    {
      name: 'House Cleaning',
      description: 'Residential and commercial cleaning',
      color: 'from-purple-500 to-pink-500',
      preview: `${baseUrl}/house-cleaning-preview`,
      image: '/previews/house-cleaning-preview.webp',
    },
    {
      name: 'Lawn Care',
      description: 'Landscaping and maintenance',
      color: 'from-green-500 to-emerald-500',
      preview: `${baseUrl}/lawncare-preview`,
    },
    {
      name: 'Pet Grooming',
      description: 'Professional pet care services',
      color: 'from-orange-500 to-amber-500',
      preview: `${baseUrl}/pet-grooming-preview`,
    },
    {
      name: 'Barber Shop',
      description: 'Classic cuts and styling',
      color: 'from-red-500 to-rose-500',
      preview: `${baseUrl}/barber-preview`,
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? industries.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === industries.length - 1 ? 0 : prev + 1));
  };

  // Get visible industries with circular wrapping
  const getVisibleIndustries = () => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % industries.length;
      visible.push(industries[index]);
    }
    return visible;
  };

  const visibleIndustries = getVisibleIndustries();

  return (
    <section id="preview" className="min-h-screen bg-gray-900 py-24 px-4 snap-start snap-always flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            See It In{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore live demos tailored to your industry
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all group"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all group"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visibleIndustries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:scale-105 cursor-pointer"
                onClick={() => window.open(industry.preview, '_blank')}
              >
                {/* Mini Preview Area */}
                <div className="bg-gray-800 overflow-hidden flex-shrink-0 relative">
                  {industry.image ? (
                    // Show preview image if available
                    <img 
                      src={industry.image} 
                      alt={`${industry.name} preview`}
                      className="w-full h-auto"
                    />
                  ) : (
                    // Show placeholder if no image
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-20`} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-white/50 text-sm">Preview Coming Soon</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{industry.name}</h3>
                  <p className="text-gray-400 text-sm">{industry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            {industries.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? 'w-8 bg-gradient-to-r from-cyan-400 to-purple-400'
                    : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

