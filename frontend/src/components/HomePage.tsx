import React, { useState, useEffect, useMemo } from 'react';
import { Car, Ship, Paintbrush, Palette, Sun, Zap } from 'lucide-react';
import { getAvailableBusinesses, loadBusinessConfig } from '../utils/businessLoader';
import { getUnifiedThemeConfig, getCurrentBusiness } from '../config/themes';
import BusinessSelector from './BusinessSelector';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import Contact from './Contact';
import FAQ from './FAQ';
import Affiliates from './Affiliates';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import ServiceModal from './ServiceModal';
import type { UnifiedThemeConfig } from '../config/themes';

interface Service {
  title: string;
  image: string;
  icon: React.ReactNode;
  description: string[];
  images: string[];
}

const HomePage: React.FC = () => {
  const [currentBusiness, setCurrentBusiness] = useState<string>('jps');
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [businessConfig, setBusinessConfig] = useState<string>('jps');
  const [isLoading, setIsLoading] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [unifiedConfig, setUnifiedConfig] = useState<UnifiedThemeConfig | null>(null);

  // Load available businesses
  useEffect(() => {
    console.log('HomePage: useEffect for loading businesses triggered');
    const loadBusinesses = async () => {
      try {
        console.log('HomePage: Calling getAvailableBusinesses()');
        const businesses = await getAvailableBusinesses();
        console.log('HomePage: Available businesses loaded successfully:', businesses);
      } catch (error) {
        console.error('HomePage: Error loading businesses:', error);
      }
    };
    
    loadBusinesses();
  }, []);

  // Load initial business config
  useEffect(() => {
    console.log('HomePage: useEffect for loading initial config triggered, currentBusiness:', currentBusiness);
    const loadInitialConfig = async () => {
      try {
        console.log('HomePage: Starting to load initial config for business:', currentBusiness);
        setIsLoading(true);
        console.log('HomePage: Calling loadBusinessConfig with:', currentBusiness);
        const config = await loadBusinessConfig(currentBusiness);
        console.log('HomePage: Initial config loaded successfully:', config);
        setCurrentConfig(config);
        setBusinessConfig(currentBusiness);
        
        console.log('HomePage: Getting unified theme config for business:', currentBusiness);
        // Get unified theme config
        const unified = getUnifiedThemeConfig(currentBusiness);
        console.log('HomePage: Unified theme config loaded:', unified);
        setUnifiedConfig(unified);
        setIsThemeReady(true);
        setIsLoading(false);
        
        console.log('HomePage: Initial config loaded:', config);
        console.log('HomePage: Unified config loaded:', unified);
      } catch (error) {
        console.error('HomePage: Error loading initial config:', error);
        setIsLoading(false);
      }
    };

    loadInitialConfig();
  }, [currentBusiness]);

  // Handle business change
  const handleBusinessChange = async (businessSlug: string) => {
    console.log('HomePage: handleBusinessChange called with:', businessSlug);
    if (isLoading) {
      console.log('HomePage: handleBusinessChange: Already loading, ignoring request');
      return;
    }

    console.log('HomePage: handleBusinessChange: Setting loading state and clearing configs');
    setCurrentBusiness(businessSlug);
    setIsLoading(true);
    setCurrentConfig(null);
    setUnifiedConfig(null);
    setIsThemeReady(false);

    const timeoutId = setTimeout(() => {
      console.error('HomePage: handleBusinessChange: Timeout reached, resetting loading state');
      setIsLoading(false);
    }, 10000); // 10 second timeout

    try {
      console.log('HomePage: handleBusinessChange: Loading business config for:', businessSlug);
      const config = await loadBusinessConfig(businessSlug);
      clearTimeout(timeoutId);
      
      console.log('HomePage: handleBusinessChange - New config loaded:', config);
      setCurrentConfig(config);
      setBusinessConfig(businessSlug);
      
      console.log('HomePage: handleBusinessChange: Getting unified theme config for:', businessSlug);
      // Get unified theme config
      const unified = getUnifiedThemeConfig(businessSlug);
      console.log('HomePage: handleBusinessChange - Unified config loaded:', unified);
      setUnifiedConfig(unified);
      setIsThemeReady(true);
      setIsLoading(false);
      
      console.log('HomePage: handleBusinessChange - Unified config loaded:', unified);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('HomePage: handleBusinessChange - Error loading config:', error);
      setIsLoading(false);
    }
  };

  // Create services configuration using unified theme
  const config = useMemo(() => {
    if (!unifiedConfig) return null;
    
    return {
      header: {
        logo: unifiedConfig.business.business.name,
        tagline: unifiedConfig.business.business.tagline,
      },
      socialMedia: {
        facebook: 'https://facebook.com/mobiledetailhub',
        instagram: 'https://instagram.com/mobiledetailhub',
        tiktok: 'https://tiktok.com/@mobiledetailhub',
        youtube: 'https://youtube.com/@mobiledetailhub'
      },
      hero: {
        backgroundImage: unifiedConfig.theme.images.hero,
        headline: unifiedConfig.business.hero.headline,
        subheadline: unifiedConfig.business.hero.subheadline,
        ctaText: unifiedConfig.business.hero.ctaText,
        ctaSubtext: unifiedConfig.business.hero.ctaSubtext,
      },
      services: [
        {
          title: unifiedConfig.business.services.auto.title,
          image: `${unifiedConfig.theme.images.auto}?theme=${currentBusiness || 'default'}`,
          icon: <Car className="h-6 w-6" />,
          description: unifiedConfig.business.services.auto.highlights,
          images: [unifiedConfig.theme.images.auto]
        },
        {
          title: unifiedConfig.business.services.marine.title,
          image: `${unifiedConfig.theme.images.marine}?theme=${currentBusiness || 'default'}`,
          icon: <Ship className="h-6 w-6" />,
          description: unifiedConfig.business.services.marine.highlights,
          images: [unifiedConfig.theme.images.marine]
        },
        {
          title: unifiedConfig.business.services.rv.title,
          image: `${unifiedConfig.theme.images.rv}?theme=${currentBusiness || 'default'}`,
          icon: <Paintbrush className="h-6 w-6" />,
          description: unifiedConfig.business.services.rv.highlights,
          images: [unifiedConfig.theme.images.rv]
        },
        {
          title: 'Interior / Exterior',
          image: '/interior_exterior/service_image.png',
          icon: <Palette className="h-6 w-6" />
        },
        {
          title: 'Ceramic Coating',
          image: '/ceramic/service_image.png',
          icon: <Sun className="h-6 w-6" />
        },
        {
          title: 'Paint Protection Film',
          image: '/ppf/service_image.png',
          icon: <Zap className="h-6 w-6" />
        }
      ],
      footer: {
        businessName: unifiedConfig.business.business.name,
        phone: currentConfig?.business?.phone || unifiedConfig.business.contact.phone,
        email: currentConfig?.business?.email || unifiedConfig.business.contact.email,
        hours: currentConfig?.business?.hours || unifiedConfig.business.contact.hours,
        locations: unifiedConfig.business.locations,
      }
    };
  }, [unifiedConfig, currentBusiness, currentConfig]);

  // Modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  const openServiceModal = (service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    setIsServiceModalOpen(false);
  };

  const handleBookNow = () => {
    // Handle booking logic
    console.log('Book now clicked');
  };

  // Loading state
  if (!isThemeReady || !unifiedConfig || isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">
            {isLoading ? 'Switching business...' : 'Loading business...'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Current business: {currentBusiness || 'none'}
          </p>
          {currentConfig?.theme && (
            <p className="text-sm text-blue-400 mt-1">
              Loading: {currentConfig.theme} theme
            </p>
          )}
          {/* Manual reset button if loading gets stuck */}
          <button
            onClick={() => {
              console.log('Manual reset triggered');
              setIsLoading(false);
              if (currentBusiness) {
                handleBusinessChange(currentBusiness);
              }
            }}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            Reset if stuck
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Configuration not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Business Selector (Development Only) */}
      <BusinessSelector
        onBusinessChange={handleBusinessChange}
        selectedBusiness={currentBusiness}
      />

      {/* Hero Section */}
      <Hero
        onBookNow={handleBookNow}
        onRequestQuote={openQuoteModal}
      />

      {/* Services Section */}
      <div id="services">
        <ServicesGrid
          key={`${currentBusiness}-${unifiedConfig.theme.images.auto || 'default'}-${unifiedConfig.theme.images.marine || 'default'}-${unifiedConfig.theme.images.rv || 'default'}`}
          services={config.services}
          onBookNow={handleBookNow}
          onRequestQuote={openQuoteModal}
        />
      </div>

      {/* FAQ Section */}
      <div id="faq">
        <FAQ />
      </div>

      {/* Affiliates Section */}
      <div id="affiliates">
        <Affiliates />
      </div>

      {/* Contact Section */}
      <div id="contact">
        <Contact
          onRequestQuote={openQuoteModal}
        />
      </div>

      {/* Footer */}
      <Footer
        onBookNow={handleBookNow}
        onRequestQuote={openQuoteModal}
      />

      {/* Modals */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
      />

      {selectedService && (
        <ServiceModal
          isOpen={isServiceModalOpen}
          onClose={closeServiceModal}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default HomePage;