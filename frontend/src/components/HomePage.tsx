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
import ServiceModal from './ServiceModal';

interface Service {
  title: string;
  image: string;
  icon: React.ReactNode;
  description: string[];
  images: string[];
}

const HomePage: React.FC = () => {
  // Detect business from URL or default to 'mdh'
  const detectBusinessFromURL = () => {
    let businessSlug = 'mdh';
    
    // Check if there's a business in the URL path
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && ['jps', 'mdh', 'abc'].includes(pathParts[1])) {
      businessSlug = pathParts[1];
      console.log(`HomePage: Detected business from URL path: ${businessSlug}`);
    }
    
    // Check if there's a business query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const businessFromQuery = urlParams.get('business');
    if (businessFromQuery && ['jps', 'mdh', 'abc'].includes(businessFromQuery)) {
      businessSlug = businessFromQuery;
      console.log(`HomePage: Detected business from query param: ${businessSlug}`);
    }
    
    console.log(`HomePage: Final detected business: ${businessSlug}`);
    return businessSlug;
  };

  const [currentBusiness, setCurrentBusiness] = useState<string>(detectBusinessFromURL);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [businessConfig, setBusinessConfig] = useState<string>(detectBusinessFromURL);
  const [isLoading, setIsLoading] = useState(false);
  const { logPerformanceReport } = usePerformanceMonitor();

  // Load available businesses and check initial URL
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

    // Check if there's already a business in the URL on page load
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && ['jps', 'mdh', 'abc'].includes(pathParts[1])) {
      const businessFromUrl = pathParts[1];
      console.log('HomePage: Found business in URL on page load:', businessFromUrl);
      if (businessFromUrl !== currentBusiness) {
        setCurrentBusiness(businessFromUrl);
      }
    }
  }, []);

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.business) {
        console.log('HomePage: PopState detected, switching to business:', event.state.business);
        setCurrentBusiness(event.state.business);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
        
              // Config loaded successfully
        
        setIsLoading(false);
        
        console.log('HomePage: Initial config loaded:', config);
      } catch (error) {
        console.error('HomePage: Error loading initial config:', error);
        setIsLoading(false);
      }
    };

    loadInitialConfig();
  }, [currentBusiness]);

  // Add performance logging when config is ready
  useEffect(() => {
    if (currentConfig) {
      // Log performance after a short delay to allow media to load
      const timer = setTimeout(() => {
        logPerformanceReport();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentConfig, logPerformanceReport]);

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

    // Update the URL to trigger useBusinessConfig hook reload
    const newUrl = `/${businessSlug}`;
    window.history.pushState({ business: businessSlug }, '', newUrl);
    console.log('HomePage: Updated URL to:', newUrl);

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
      
      setIsLoading(false);
      
      console.log('HomePage: handleBusinessChange - Config loaded successfully');
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('HomePage: handleBusinessChange - Error loading config:', error);
      setIsLoading(false);
    }
  };

  // Create services configuration using business config
  const config = useMemo(() => {
    if (!currentConfig) return null;
    
    // Debug logging
    console.log('HomePage: Creating config with currentConfig:', currentConfig);
    
    return {
      header: {
        logo: currentConfig.business?.name || 'Business Name',
        tagline: 'Professional Mobile Detailing',
      },
      socialMedia: {
        facebook: 'https://facebook.com/mobiledetailhub',
        instagram: 'https://instagram.com/mobiledetailhub',
        tiktok: 'https://tiktok.com/@mobiledetailhub',
        youtube: 'https://youtube.com/@mobiledetailhub'
      },
      hero: {
        backgroundImage: currentConfig.hero?.backgroundImage || '/hero/image1.png',
        headline: currentConfig.hero?.headline || 'Premium Mobile Detailing',
        subheadline: currentConfig.hero?.subheadline || 'Professional service at your location',
        ctaText: currentConfig.hero?.ctaText || 'Book Now',
        ctaSubtext: currentConfig.hero?.ctaSubtext || 'Contact us today',
      },
      services: [
        {
          title: 'Auto Detailing',
          image: '/auto_detailing/image1.png',
          icon: <Car className="h-6 w-6" />,
          description: ['Professional service', 'Quality results'],
          images: [
            '/auto_detailing/image1.png',
          ]
        },
        {
          title: 'Marine Detailing',
          image: '/boat_detailing/image1.png',
          icon: <Ship className="h-6 w-6" />,
          description: ['Boat care', 'Marine expertise'],
          images: [
            '/boat_detailing/image1.png',
          ]
        },
        {
          title: 'RV Detailing',
          image: '/rv_detailing/image1.png',
          icon: <Paintbrush className="h-6 w-6" />,
          description: ['RV maintenance', 'Travel ready'],
          images: [
            '/rv_detailing/image1.png',
          ]
        },
        {
          title: 'Interior / Exterior',
          image: '/interior_exterior/image1.png',
          icon: <Palette className="h-6 w-6" />,
          images: [
            '/interior_exterior/image1.png',
          ]
        },
        {
          title: 'Ceramic Coating',
          image: '/ceramic/image1.png',
          icon: <Sun className="h-6 w-6" />,
          images: [
            '/ceramic/image1.png',
          ]
        },
        {
          title: 'Paint Protection Film',
          image: '/ppf/image1.png',
          icon: <Zap className="h-6 w-6" />,
          images: [
            '/ppf/image1.png',
          ]
        }
      ],
      footer: {
        businessName: currentConfig.business?.name || 'Business Name',
        phone: currentConfig.business?.phone || 'Contact for details',
        email: currentConfig.business?.email || 'info@business.com',
        hours: currentConfig.business?.hours || 'Mon-Fri 9AM-5PM',
        locations: currentConfig.serviceLocations || ['Main Location'],
      }
    };
  }, [currentConfig, currentBusiness]);

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
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-yellow-500 text-black px-3 py-2 rounded-lg shadow-lg text-sm font-medium mb-2">
            Dev Mode: {currentBusiness.toUpperCase()}
          </div>
          <div className="flex gap-2 mb-2">
            {['mdh', 'jps', 'abc'].map((business) => (
              <button
                key={business}
                onClick={() => handleBusinessChange(business)}
                disabled={isLoading || business === currentBusiness}
                className={`px-3 py-1 text-xs rounded ${
                  business === currentBusiness
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {business.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="text-xs text-black bg-yellow-200 px-2 py-1 rounded">
            URL: /{currentBusiness} or ?business={currentBusiness}
          </div>
        </div>
      )}

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