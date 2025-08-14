import React, { useState, useEffect, useMemo } from 'react';
import { Car, Ship, Paintbrush, Palette, Sun, Zap } from 'lucide-react';
import { getAvailableBusinesses, loadBusinessConfig } from '../utils/businessLoader';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import BusinessSelector from './BusinessSelector';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import Contact from './Contact';
import FAQ from './FAQ';
import Affiliates from './Affiliates';
import Footer from './Footer';
import QuoteModal from './QuoteModal';


interface Service {
  title: string;
  image: string;
  icon: React.ReactNode;
  description: string[];
  images: string[];
}

const HomePage: React.FC = () => {
  // Detect business from URL path or query params
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    let businessSlug = pathParts[1];
    
    // If no business in path, check query params
    if (!businessSlug || !['jps', 'mdh', 'abc'].includes(businessSlug)) {
      const urlParams = new URLSearchParams(window.location.search);
      businessSlug = urlParams.get('business') || 'mdh';
    }
    
    setCurrentBusiness(businessSlug);
  }, []);

  // Load available businesses
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const fetchedBusinesses = await getAvailableBusinesses();
        setBusinesses(fetchedBusinesses);
      } catch (error) {
        console.error('Error loading businesses:', error);
      }
    };

    loadBusinesses();
  }, []);

  // Handle business change from URL
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.business) {
        setCurrentBusiness(event.state.business);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load initial business config
  useEffect(() => {
    if (currentBusiness && !businessConfigs[currentBusiness]) {
      const loadInitialConfig = async () => {
        try {
          const config = await loadBusinessConfig(currentBusiness);
          if (config) {
            setBusinessConfigs(prev => ({ ...prev, [currentBusiness]: config }));
          }
        } catch (error) {
          console.error(`Error loading initial config for ${currentBusiness}:`, error);
        }
      };

      loadInitialConfig();
    }
  }, [currentBusiness, businessConfigs]);

  // Update current config when business changes
  useEffect(() => {
    if (currentBusiness && businessConfigs[currentBusiness]) {
      setCurrentConfig(businessConfigs[currentBusiness]);
    }
  }, [currentBusiness, businessConfigs]);

  const handleBusinessChange = async (businessSlug: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setCurrentConfig(null);
    setBusinessConfigs(prev => ({ ...prev, [businessSlug]: null }));

    // Update URL
    const newUrl = `/${businessSlug}`;
    window.history.pushState({ business: businessSlug }, '', newUrl);
    setCurrentBusiness(businessSlug);

    try {
      const config = await loadBusinessConfig(businessSlug);
      if (config) {
        setBusinessConfigs(prev => ({ ...prev, [businessSlug]: config }));
        setCurrentConfig(config);
      }
    } catch (error) {
      console.error(`Error loading business config for ${businessSlug}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    // Handle book now action
  };

  const handleManualReset = () => {
    setCurrentBusiness('mdh');
    setCurrentConfig(null);
    setBusinessConfigs({});
    window.history.pushState({ business: 'mdh' }, '', '/mdh');
  };

  // Create services configuration using business config
  const servicesConfig = useMemo(() => {
    if (!currentConfig) return defaultServices;
    
    return defaultServices.map(service => ({
      ...service,
      title: currentConfig.services?.available?.[0] || service.title,
      description: currentConfig.services?.description || service.description
    }));
  }, [currentConfig]);

  // Modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  // Loading state
  if (!currentConfig || isLoading) {
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
          {currentConfig?.business?.name && (
            <p className="text-sm text-blue-400 mt-1">
              Loading: {currentConfig.business.name}
            </p>
          )}
          {/* Manual reset button if loading gets stuck */}
          <button
            onClick={() => {
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
          key={`${currentBusiness}-${currentConfig?.hero?.backgroundImage || 'default'}`}
          services={config.services}
          onBookNow={handleBookNow}
          onRequestQuote={openQuoteModal}
          businessSlug={currentBusiness}
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
        businessSlug={currentBusiness}
      />

      {/* Modals */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
      />


    </div>
  );
};

export default HomePage;