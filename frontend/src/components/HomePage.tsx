import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Ship, Paintbrush, Palette, Sun, Zap } from 'lucide-react';
import { getAvailableBusinesses, loadBusinessConfig } from '../utils/businessLoader';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import BusinessSelector from './BusinessSelector';
import Hero from './hero/Hero';
import ServicesGrid from './ServicesGrid';
import ContactAffiliate from './contact/ContactAffiliate';
import ContactMDH from './contact/ContactMDH';
import FAQAffiliate from './faq_affiliate';
import FAQMDH from './faq_mdh';
import Affiliates from './Affiliates';
import { FooterMDH, FooterAffiliate } from './footer';
import QuoteModal from './QuoteModal';


interface Service {
  title: string;
  image: string;
  icon: React.ReactNode;
  description: string[];
  images: string[];
}

const HomePage: React.FC = () => {
  // Get business slug from URL parameters
  const { businessSlug } = useParams<{ businessSlug?: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [currentBusiness, setCurrentBusiness] = useState<string>('mdh');
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessConfigs, setBusinessConfigs] = useState<{[key: string]: any}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Detect business from URL path or query params
  useEffect(() => {
    // Use businessSlug from URL params if available
    if (businessSlug && ['jps', 'mdh', 'abc'].includes(businessSlug)) {
      setCurrentBusiness(businessSlug);
    } else {
      // Fallback to default business
      setCurrentBusiness('mdh');
    }
  }, [businessSlug]);

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

    // Update URL using React Router
    navigate(`/${businessSlug}`);
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
    navigate('/mdh');
  };

  // Create services configuration using business config
  const defaultServices: Service[] = [
    {
      title: 'Auto Detailing',
      image: '/auto_detailing/image1.png',
      icon: <Car className="h-6 w-6" />,
      description: ['Professional service', 'Quality results'],
      images: ['/auto_detailing/image1.png']
    },
    {
      title: 'Marine Detailing',
      image: '/boat_detailing/image1.png',
      icon: <Ship className="h-6 w-6" />,
      description: ['Boat care', 'Marine expertise'],
      images: ['/boat_detailing/image1.png']
    },
    {
      title: 'RV Detailing',
      image: '/rv_detailing/image1.png',
      icon: <Paintbrush className="h-6 w-6" />,
      description: ['RV maintenance', 'Travel ready'],
      images: ['/rv_detailing/image1.png']
    },
    {
      title: 'Interior / Exterior',
      image: '/interior_exterior/image1.png',
      icon: <Palette className="h-6 w-6" />,
      description: ['Complete care', 'Inside and out'],
      images: ['/interior_exterior/image1.png']
    },
    {
      title: 'Ceramic Coating',
      image: '/ceramic/image1.png',
      icon: <Sun className="h-6 w-6" />,
      description: ['Long-term protection', 'Enhanced shine'],
      images: ['/ceramic/image1.png']
    },
    {
      title: 'Paint Protection Film',
      image: '/ppf/image1.png',
      icon: <Zap className="h-6 w-6" />,
      description: ['Ultimate protection', 'Invisible shield'],
      images: ['/ppf/image1.png']
    }
  ];

  const servicesConfig = useMemo(() => {
    if (!currentConfig) return defaultServices;
    
    return defaultServices.map((service: Service) => ({
      ...service,
      // Don't override individual service titles - keep them as defined
      // title: currentConfig.services?.available?.[0] || service.title,
      description: currentConfig.services?.description || service.description
    }));
  }, [currentConfig]);

  // Modal state
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

  if (!currentConfig) {
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
      {import.meta.env.DEV && (
        <BusinessSelector
          onBusinessChange={handleBusinessChange}
          selectedBusiness={currentBusiness}
        />
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
          services={servicesConfig}
          onBookNow={handleBookNow}
          onRequestQuote={openQuoteModal}
          businessSlug={currentBusiness}
        />
      </div>

      {/* FAQ Section */}
      <div id="faq">
        {currentBusiness === 'mdh' ? (
          <FAQMDH onRequestQuote={openQuoteModal} autoCollapseOnScroll={true} />
        ) : (
          <FAQAffiliate onRequestQuote={openQuoteModal} autoCollapseOnScroll={true} />
        )}
      </div>

      {/* Affiliates Section */}
      <div id="affiliates">
        <Affiliates />
      </div>

      {/* Contact Section */}
      <div id="contact">
        {currentBusiness === 'mdh' ? (
          <ContactMDH />
        ) : (
          <ContactAffiliate onRequestQuote={openQuoteModal} />
        )}
      </div>

      {/* Footer */}
      {currentBusiness === 'mdh' ? (
        <FooterMDH businessSlug={currentBusiness} />
      ) : (
        <FooterAffiliate businessSlug={currentBusiness} onRequestQuote={openQuoteModal} />
      )}

      {/* Modals */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
      />


    </div>
  );
};

export default HomePage;