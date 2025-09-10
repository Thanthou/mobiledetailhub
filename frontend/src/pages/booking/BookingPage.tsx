import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Truck, Ship, Star, Lock, CheckCircle, ChevronRight, ChevronLeft, Check, X, ChevronDown, ChevronUp, Bike } from 'lucide-react';

import Header from '../home/components/01_header';
import HeroBackground from '../home/components/02_hero/components/HeroBackground';
import { HERO_CONSTANTS } from '../home/components/02_hero/constants';
import { useAffiliate } from '../../hooks/useAffiliate';
import { useSiteContext } from '../../hooks/useSiteContext';
import serviceDefinitions from '../../data/serviceDefinitions.json';

interface Vehicle {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Category {
  id: string;
  name: string;
  color: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  base_price_cents: string;
  tiers?: ServiceTier[];
}

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

// Custom RV Icon Component
const RVIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/icons/rv.png" 
    alt="RV" 
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(60%) sepia(100%) saturate(3000%) hue-rotate(-20deg) brightness(1.1) contrast(1.2)'
    }}
  />
);

const vehicles: Vehicle[] = [
  { id: 'car', name: 'Car', description: 'Sedan/Coupe/Compact', icon: Car },
  { id: 'truck', name: 'Truck', description: 'Light duty, work trucks', icon: Truck },
  { id: 'suv', name: 'SUV', description: 'Crossovers & full-size', icon: Car },
  { id: 'boat', name: 'Boat', description: 'Runabout, bass, wake', icon: Ship },
  { id: 'rv', name: 'RV', description: 'Travel trailers & coaches', icon: RVIcon },
  { id: 'motorcycle', name: 'Motorcycle', description: 'Street & sport bikes', icon: Bike },
];

// Categories for each vehicle type
const categories: { [vehicleId: string]: Category[] } = {
  car: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] },
    { id: 'ceramic-coating', name: 'Ceramic Coating', color: 'bg-blue-600', services: [] },
    { id: 'paint-correction', name: 'Paint Correction', color: 'bg-purple-600', services: [] }
  ],
  truck: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] },
    { id: 'ceramic-coating', name: 'Ceramic Coating', color: 'bg-blue-600', services: [] },
    { id: 'paint-correction', name: 'Paint Correction', color: 'bg-purple-600', services: [] }
  ],
  rv: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] }
  ],
  boat: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] }
  ],
  motorcycle: [
    { id: 'service-packages', name: 'Service Packages', color: 'bg-green-600', services: [] },
    { id: 'addons', name: 'Addons', color: 'bg-indigo-600', services: [] }
  ]
};

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAffiliate } = useSiteContext();
  const { affiliateData, isLoading: affiliateLoading } = useAffiliate();
  
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [currentTierIndex, setCurrentTierIndex] = useState<{ [serviceId: string]: number }>({});
  const [selectedTierForModal, setSelectedTierForModal] = useState<ServiceTier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(4.9);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [selectedTierForService, setSelectedTierForService] = useState<{ [serviceId: string]: string }>({});

  // Helper function to find service definition by name
  const findServiceDefinition = (serviceName: string) => {
    // Convert service name to key format (lowercase, hyphenated)
    const key = serviceName.toLowerCase().replace(/\s+/g, '-');
    let result = (serviceDefinitions as any)[key] || null;
    
    // Handle common spelling variations and formatting differences
    if (!result) {
      const variations: { [key: string]: string } = {
        'preperation-detail': 'preparation-detail', // Fix typo: Preperation -> Preparation
        '1-stage-paint-correction': '1-stage-paint-correction',
        '2-stage-paint-correction': '2-stage-paint-correction', 
        '3-stage-paint-correction': '3-stage-paint-correction',
        '1-stage-ceramic-coating': '1-stage-ceramic-coating',
        '2-stage-ceramic-coating': '2-stage-ceramic-coating',
        '3-stage-ceramic-coating': '3-stage-ceramic-coating',
        'paint-enhancement': 'paint-enhancement',
        'fallout-removal': 'fallout-removal',
        'full-exterior-wash': 'full-exterior-wash',
        // Handle 3-5 year ceramic coating variations
        '3-5-year-ceramic-coating': '2-stage-ceramic-coating',
        '3-5-year-ceramic': '2-stage-ceramic-coating',
        '3-5-year-coating': '2-stage-ceramic-coating',
        // Handle variations with different spacing/formatting
        '1 stage paint correction': '1-stage-paint-correction',
        '2 stage paint correction': '2-stage-paint-correction',
        '3 stage paint correction': '3-stage-paint-correction',
        '1 stage ceramic coating': '1-stage-ceramic-coating',
        '2 stage ceramic coating': '2-stage-ceramic-coating',
        '3 stage ceramic coating': '3-stage-ceramic-coating',
        'paint enhancement': 'paint-enhancement',
        'fallout removal': 'fallout-removal',
        'full exterior wash': 'full-exterior-wash',
        'preparation detail': 'preparation-detail',
        'preperation detail': 'preparation-detail',
        // Handle "Stage X" format variations
        'stage-1-paint-correction': '1-stage-paint-correction',
        'stage-2-paint-correction': '2-stage-paint-correction',
        'stage-3-paint-correction': '3-stage-paint-correction',
        'stage-1-ceramic-coating': '1-stage-ceramic-coating',
        'stage-2-ceramic-coating': '2-stage-ceramic-coating',
        'stage-3-ceramic-coating': '3-stage-ceramic-coating',
        'stage 1 paint correction': '1-stage-paint-correction',
        'stage 2 paint correction': '2-stage-paint-correction',
        'stage 3 paint correction': '3-stage-paint-correction',
        'stage 1 ceramic coating': '1-stage-ceramic-coating',
        'stage 2 ceramic coating': '2-stage-ceramic-coating',
        'stage 3 ceramic coating': '3-stage-ceramic-coating',
        // Handle additional ceramic coating variations
        'ceramic-coating-1-stage': '1-stage-ceramic-coating',
        'ceramic-coating-2-stage': '2-stage-ceramic-coating',
        'ceramic-coating-3-stage': '3-stage-ceramic-coating',
        'ceramic coating 1 stage': '1-stage-ceramic-coating',
        'ceramic coating 2 stage': '2-stage-ceramic-coating',
        'ceramic coating 3 stage': '3-stage-ceramic-coating',
      };
      
      const correctedKey = variations[key];
      if (correctedKey) {
        result = (serviceDefinitions as any)[correctedKey] || null;
      }
    }
    
    // If still not found, try fuzzy matching by searching through all service definitions
    if (!result) {
      const serviceDefs = serviceDefinitions as any;
      for (const [serviceKey, serviceDef] of Object.entries(serviceDefs)) {
        const service = serviceDef as any;
        if (service.name && service.name.toLowerCase() === serviceName.toLowerCase()) {
          result = service;
          break;
        }
      }
    }
    
    // If still not found, try partial matching for ceramic coating and paint correction
    if (!result) {
      const serviceDefs = serviceDefinitions as any;
      const lowerServiceName = serviceName.toLowerCase();
      
      // Try to match ceramic coating variations
      if (lowerServiceName.includes('ceramic') && lowerServiceName.includes('coating')) {
        // Special handling for 3-5 year services (should map to 2-stage)
        if (lowerServiceName.includes('3-5') || lowerServiceName.includes('3-5-year')) {
          result = serviceDefs['2-stage-ceramic-coating'] || null;
        } else if (lowerServiceName.includes('1') || lowerServiceName.includes('one')) {
          result = serviceDefs['1-stage-ceramic-coating'] || null;
        } else if (lowerServiceName.includes('2') || lowerServiceName.includes('two')) {
          result = serviceDefs['2-stage-ceramic-coating'] || null;
        } else if (lowerServiceName.includes('3') || lowerServiceName.includes('three')) {
          result = serviceDefs['3-stage-ceramic-coating'] || null;
        }
      }
      
      // Try to match paint correction variations
      if (!result && lowerServiceName.includes('paint') && lowerServiceName.includes('correction')) {
        if (lowerServiceName.includes('1') || lowerServiceName.includes('one')) {
          result = serviceDefs['1-stage-paint-correction'] || null;
        } else if (lowerServiceName.includes('2') || lowerServiceName.includes('two')) {
          result = serviceDefs['2-stage-paint-correction'] || null;
        } else if (lowerServiceName.includes('3') || lowerServiceName.includes('three')) {
          result = serviceDefs['3-stage-paint-correction'] || null;
        }
      }
    }
    
    
    return result;
  };

  // Helper function to get vehicle-specific features
  const getVehicleSpecificFeatures = (serviceDef: any, vehicleType: string) => {
    if (!serviceDef || !serviceDef.vehicles) return null;
    
    // Map frontend vehicle types to service definition keys
    const vehicleMap: { [key: string]: string } = {
      'car': 'car',
      'truck': 'truck', 
      'suv': 'truck', // SUVs use truck features
      'rv': 'rv',
      'boat': 'boat'
    };
    
    const mappedVehicle = vehicleMap[vehicleType] || 'car';
    return serviceDef.vehicles[mappedVehicle] || null;
  };

  // Filter vehicles based on affiliate's available services
  useEffect(() => {
    if (isAffiliate && affiliateData?.id) {
      const checkVehicleServices = async () => {
        setLoadingVehicles(true);
        const vehiclesWithServices: Vehicle[] = [];
        
        // Map frontend vehicle IDs to backend vehicle IDs
        const vehicleMap: { [key: string]: string } = {
          'car': 'cars',
          'truck': 'trucks', 
          'suv': 'trucks', // SUVs are treated as trucks in the backend
          'rv': 'rvs',
          'boat': 'boats',
          'motorcycle': 'motorcycles'
        };
        
        // Check each vehicle type to see if it has any services
        for (const vehicle of vehicles) {
          try {
            const backendVehicleId = vehicleMap[vehicle.id] || 'cars';
            
            // Check if this vehicle has any services by trying to fetch from any category
            const vehicleCategories = categories[vehicle.id] || [];
            let hasServices = false;
            
            for (const category of vehicleCategories) {
              const response = await fetch(`/api/services/affiliate/${affiliateData.id}/vehicle/${backendVehicleId}/category/${category.id}`);
              if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                  hasServices = true;
                  break; // Found services for this vehicle, no need to check other categories
                }
              }
            }
            
            if (hasServices) {
              vehiclesWithServices.push(vehicle);
            }
          } catch (error) {
            console.error(`Error checking services for ${vehicle.name}:`, error);
          }
        }
        
        setAvailableVehicles(vehiclesWithServices);
        setLoadingVehicles(false);
      };
      
      void checkVehicleServices();
    } else {
      // For MDH site or if no affiliate data, show all vehicles
      setAvailableVehicles(vehicles);
    }
  }, [isAffiliate, affiliateData]);

  const selectedVehicleData = availableVehicles.find(v => v.id === selectedVehicle);
  const selectedCategoryData = { name: 'Service Packages' };
  
  // Parse selected service to get service and tier info
  const selectedServiceData = (() => {
    if (!selectedService) return null;
    
    const [serviceId, tierId] = selectedService.split('-');
    const service = availableServices.find(s => s.id === serviceId);
    if (!service || !service.tiers) return null;
    
    const tier = service.tiers.find(t => t.id === tierId);
    if (!tier) return null;
    
    return {
      serviceName: service.name,
      tierName: tier.name,
      price: tier.price,
      duration: tier.duration,
      features: tier.features
    };
  })();


  // Fetch services directly when vehicle is selected (skip category selection for now)
  useEffect(() => {
    if (selectedVehicle && isAffiliate && affiliateData?.id) {
      const fetchServicePackages = async () => {
        setLoadingServices(true);
        try {
          // Map frontend vehicle IDs to backend vehicle IDs
          const vehicleMap: { [key: string]: string } = {
            'car': 'cars',
            'truck': 'trucks', 
            'suv': 'trucks', // SUVs are treated as trucks in the backend
            'rv': 'rvs',
            'boat': 'boats',
            'motorcycle': 'motorcycles'
          };
          
          const backendVehicleId = vehicleMap[selectedVehicle] || 'cars';
          
          // Only fetch service-packages for now, skip addons
          const response = await fetch(`/api/services/affiliate/${affiliateData.id}/vehicle/${backendVehicleId}/category/service-packages`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.length > 0) {
              setAvailableServices(data.data);
            } else {
              setAvailableServices([]);
            }
          } else {
            setAvailableServices([]);
          }
        } catch (error) {
          console.error(`Error fetching service packages for ${selectedVehicle}:`, error);
          setAvailableServices([]);
        } finally {
          setLoadingServices(false);
        }
      };
      
      void fetchServicePackages();
      setSelectedService(''); // Reset service selection
    } else if (selectedVehicle) {
      // For MDH site, show empty services for now
      setAvailableServices([]);
    }
  }, [selectedVehicle, isAffiliate, affiliateData]);

  // Auto-scroll to vehicle selection on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('vehicle-selection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch reviews and calculate average rating
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = '/api/reviews?type=mdh&status=approved&limit=100';
        
        // If we're on an affiliate page, fetch affiliate reviews
        if (isAffiliate && affiliateData?.id) {
          url = `/api/reviews?type=affiliate&affiliate_id=${affiliateData.id}&status=approved&limit=100`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            const reviews = data.data;
            const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
            const average = totalRating / reviews.length;
            setAverageRating(Math.round(average * 10) / 10); // Round to 1 decimal place
            setTotalReviews(reviews.length);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Keep default values if fetch fails
      }
    };
    
    fetchReviews();
  }, [isAffiliate, affiliateData]);


  const continueToBooking = () => {
    // This would open the full booking wizard
    alert(`Opening booking wizard for ${selectedVehicleData?.name} - ${selectedServiceData?.serviceName} - ${selectedServiceData?.tierName}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Carousel functions for tier selection
  const getTierPosition = (serviceId: string, tierIndex: number): 'center' | 'left' | 'right' | 'hidden' => {
    const currentIndex = currentTierIndex[serviceId] || 0;
    const diff = tierIndex - currentIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    
    return 'hidden';
  };

  const goLeft = (serviceId: string) => {
    setCurrentTierIndex(prev => ({
      ...prev,
      [serviceId]: Math.max(0, (prev[serviceId] || 0) - 1)
    }));
  };

  const goRight = (serviceId: string, tiers: ServiceTier[]) => {
    setCurrentTierIndex(prev => ({
      ...prev,
      [serviceId]: Math.min(tiers.length - 1, (prev[serviceId] || 0) + 1)
    }));
  };

  const selectTier = (serviceId: string, tierIndex: number) => {
    setCurrentTierIndex(prev => ({
      ...prev,
      [serviceId]: tierIndex
    }));
    // Find the actual tier ID from the service
    const service = availableServices.find(s => s.id === serviceId);
    if (service && service.tiers && service.tiers[tierIndex]) {
      const tierId = service.tiers[tierIndex].id;
      const isCurrentlySelected = selectedTierForService[serviceId] === tierId;
      
      if (isCurrentlySelected) {
        // Clear selection if clicking the same tier
        setSelectedService('');
        setSelectedTierForService(prev => {
          const newState = { ...prev };
          delete newState[serviceId];
          return newState;
        });
      } else {
        // Select the tier
        setSelectedService(`${serviceId}-${tierId}`);
        setSelectedTierForService(prev => ({
          ...prev,
          [serviceId]: tierId
        }));
      }
    }
  };

  const openModal = (tier: ServiceTier) => {
    setSelectedTierForModal(tier);
    setIsModalOpen(true);
    // Auto-expand the last feature
    if (tier.features && tier.features.length > 0) {
      setExpandedFeature(tier.features[tier.features.length - 1]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTierForModal(null);
    setExpandedFeature(null);
  };

  // TierCard component
  const TierCard = ({ 
    tier, 
    position, 
    onSelectTier,
    onOpenModal,
    isSingleTier = false,
    isSelected = false
  }: { 
    tier: ServiceTier; 
    position: 'center' | 'left' | 'right' | 'hidden'; 
    onSelectTier: () => void;
    onOpenModal: () => void;
    isSingleTier?: boolean;
    isSelected?: boolean;
  }) => {
    const getCardClasses = () => {
      const selectedBorder = isSelected ? "ring-2 ring-orange-500 border-orange-500" : "border-stone-700";
      
      if (isSingleTier) {
        // For single tier, use relative positioning to stay within section bounds
        return `relative w-full bg-stone-900 rounded-2xl shadow-lg transition-all duration-700 ease-in-out cursor-pointer hover:shadow-2xl border ${selectedBorder}`;
      }
      
      const baseClasses = `absolute top-0 w-80 bg-stone-900 rounded-2xl shadow-lg transition-all duration-700 ease-in-out cursor-pointer hover:shadow-2xl border ${selectedBorder}`;
      
      switch (position) {
        case 'center':
          return `${baseClasses} left-1/2 transform -translate-x-1/2 scale-110 z-20 shadow-2xl`;
        case 'left':
          return `${baseClasses} left-1/4 transform -translate-x-1/2 scale-95 -rotate-12 z-10 opacity-80`;
        case 'right':
          return `${baseClasses} right-1/4 transform translate-x-1/2 scale-95 rotate-12 z-10 opacity-80`;
        case 'hidden':
          return `${baseClasses} opacity-0 z-0 pointer-events-none`;
        default:
          return `${baseClasses} opacity-0 z-0 pointer-events-none`;
      }
    };

    return (
      <div className={getCardClasses()} onClick={onOpenModal}>
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              ${tier.price}
            </div>
            <p className="text-stone-400 text-sm mt-2">
              {tier.duration} minutes
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {tier.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-orange-600" />
                </div>
                <span className="text-white text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              onSelectTier();
            }}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
              isSelected 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle size={20} />
                Selected
              </>
            ) : (
              'Choose Tier'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-900">
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {/* Dynamic Header - Shows affiliate header if coming from affiliate page */}
      <Header />

      {/* Hero Section with Rotating Images - No Content Overlay */}
      <section className="relative w-full min-h-screen">
        <HeroBackground images={HERO_CONSTANTS.IMAGES} />
      </section>

      {/* Trust Strip */}
      <section className="bg-stone-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 place-items-center">
              <div className="flex items-center text-white">
                <Star className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-semibold">{averageRating}/5 ({totalReviews} reviews)</span>
              </div>
              <div className="flex items-center text-white">
                <Lock className="h-5 w-5 text-orange-500 mr-2" />
                <span>Secure checkout via <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">Stripe</a></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Selection (Gate) */}
      <section id="vehicle-selection" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Choose Your Vehicle Type
            </h2>
            <p className="text-xl text-stone-300">
              Select your vehicle to see available services and pricing
            </p>
          </div>

          {affiliateLoading || loadingVehicles ? (
            <div className="text-center py-12">
              <div className="text-white text-lg">Loading available services...</div>
            </div>
          ) : availableVehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white text-lg mb-4">No services available for this business</div>
              <button
                onClick={handleBackToHome}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {availableVehicles.map((vehicle) => {
              const IconComponent = vehicle.icon;
              const isSelected = selectedVehicle === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  className={`bg-stone-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-stone-700 w-full sm:w-64 lg:w-56 ${
                    isSelected ? 'ring-2 ring-orange-500 bg-stone-700' : ''
                  }`}
                  onClick={() => {
                    if (selectedVehicle === vehicle.id) {
                      // Clear selection if clicking the same vehicle
                      setSelectedVehicle('');
                      setSelectedService('');
                      setSelectedTierForService({});
                    } else {
                      // Select the vehicle
                      setSelectedVehicle(vehicle.id);
                      // Scroll to service selection section after a brief delay
                      setTimeout(() => {
                        const element = document.getElementById('service-selection');
                        if (element) {
                          const elementRect = element.getBoundingClientRect();
                          const absoluteElementTop = elementRect.top + window.pageYOffset;
                          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                          window.scrollTo({
                            top: middle,
                            behavior: 'smooth'
                          });
                        }
                      }, 100);
                    }
                  }}
                >
                  <IconComponent className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
                  <p className="text-stone-300 mb-6 text-sm">{vehicle.description}</p>
                  <button className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-stone-700 text-white hover:bg-orange-500'
                  }`}>
                    {isSelected ? (
                      <>
                        <CheckCircle size={16} />
                        Selected
                      </>
                    ) : (
                      'Choose'
                    )}
                  </button>
                </div>
              );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Service Selection - Skip Category Selection for now */}
      {selectedVehicle && (
        <section id="service-selection" className="py-16 bg-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loadingServices ? (
              <div className="text-center py-12">
                <div className="text-white text-lg">Loading service packages...</div>
              </div>
            ) : availableServices.length === 0 ? (
              <div className="space-y-16">
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Service Packages</h2>
                    <p className="text-xl text-stone-300">No service packages available for this vehicle</p>
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-center">
                      <div className="w-full max-w-sm">
                        <div className="bg-stone-900 rounded-2xl shadow-lg border border-stone-700 p-8 text-center">
                          <div className="text-stone-400 mb-6">
                            <p className="text-lg mb-4">No services available</p>
                            <p className="text-sm">This vehicle type doesn't have any service packages configured yet.</p>
                          </div>
                          <button
                            onClick={() => setSelectedVehicle('')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                          >
                            Back to Vehicle Selection
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {availableServices.map((service) => (
                  <div key={service.id}>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{service.name}</h2>
                      <p className="text-xl text-stone-300">{service.description}</p>
                    </div>
                    
                    {service.tiers && service.tiers.length > 0 ? (
                      <div className="relative">
                        {service.tiers.length === 1 ? (
                          // Single tier - centered with relative positioning
                          <div className="flex justify-center">
                            <div className="w-full max-w-sm">
                              {service.tiers[0] && (
                                <div className="relative">
                                  <TierCard
                                    tier={service.tiers[0]}
                                    position="center"
                                    onSelectTier={() => selectTier(service.id, 0)}
                                    onOpenModal={() => service.tiers && service.tiers[0] && openModal(service.tiers[0])}
                                    isSingleTier={true}
                                    isSelected={selectedTierForService[service.id] === service.tiers[0].id}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Multiple tiers - carousel style
                          <div className="relative h-[600px] max-w-6xl mx-auto">
                            {service.tiers.map((tier, tierIndex) => (
                              <TierCard
                                key={tier.id}
                                tier={tier}
                                position={getTierPosition(service.id, tierIndex)}
                                onSelectTier={() => selectTier(service.id, tierIndex)}
                                onOpenModal={() => openModal(tier)}
                                isSelected={selectedTierForService[service.id] === tier.id}
                              />
                            ))}

                            {/* Navigation buttons */}
                            <button
                              onClick={() => goLeft(service.id)}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                            >
                              <ChevronLeft size={24} />
                            </button>

                            <button
                              onClick={() => service.tiers && goRight(service.id, service.tiers)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                            >
                              <ChevronRight size={24} />
                            </button>
                          </div>
                        )}

                        {/* Dots indicator for multiple tiers */}
                        {service.tiers.length > 1 && (
                          <div className="flex justify-center mt-6 space-x-2">
                            {service.tiers.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => selectTier(service.id, index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  index === (currentTierIndex[service.id] || 0)
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 scale-125'
                                    : 'bg-stone-600 hover:bg-stone-500'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Current selection indicator */}
                        {service.tiers.length > 1 && (
                          <div className="text-center mt-4">
                            <p className="text-stone-400 text-sm">
                              Currently viewing: <span className="font-semibold text-white">
                                {service.tiers[currentTierIndex[service.id] || 0]?.name}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-stone-400">No tiers available for this service</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pre-Wizard Summary */}
      {selectedVehicle && selectedService && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-stone-800 rounded-xl p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Ready to Book Your Service
              </h2>
              
              <div className="bg-stone-900 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <p className="text-stone-400 text-sm">Vehicle</p>
                    <p className="text-white font-semibold">{selectedVehicleData?.name}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-stone-500" />
                  <div className="text-center">
                    <p className="text-stone-400 text-sm">Category</p>
                    <p className="text-white font-semibold">{selectedCategoryData?.name}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-stone-500" />
                  <div className="text-center">
                    <p className="text-stone-400 text-sm">Service</p>
                    <p className="text-white font-semibold">{selectedServiceData?.serviceName}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-stone-500" />
                  <div className="text-center">
                    <p className="text-stone-400 text-sm">Tier</p>
                    <p className="text-white font-semibold">{selectedServiceData?.tierName}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-orange-500 font-bold text-2xl">
                    ${selectedServiceData?.price}
                  </p>
                  <p className="text-stone-400 text-sm">
                    {selectedServiceData?.duration} minutes
                  </p>
                </div>
              </div>

              {selectedServiceData?.features && selectedServiceData.features.length > 0 && (
                <div className="bg-stone-900 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What's Included:</h3>
                  <ul className="space-y-2">
                    {selectedServiceData.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-stone-300">
                        <CheckCircle className="h-4 w-4 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-stone-300 mb-8 text-sm">
                Final pricing depends on condition, options, and availability.
              </p>

              <button
                onClick={continueToBooking}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Proof Section */}
      {selectedVehicle && selectedService && (
        <section className="py-16 bg-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              See the Difference
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-stone-700 rounded-lg h-64 mb-4 flex items-center justify-center">
                  <span className="text-stone-400">Before Photo</span>
                </div>
                <p className="text-white font-semibold">Before</p>
              </div>
              <div className="text-center">
                <div className="bg-stone-700 rounded-lg h-64 mb-4 flex items-center justify-center">
                  <span className="text-stone-400">After Photo</span>
                </div>
                <p className="text-white font-semibold">After</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {selectedVehicle && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Booking Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "What happens if it rains?",
                  answer: "We monitor weather closely and will reschedule if conditions aren't suitable for quality work."
                },
                {
                  question: "How long does the service take?",
                  answer: "Service time varies by vehicle and selected package, typically 2-6 hours. We'll provide an estimate during booking."
                },
                {
                  question: "Do I need to be home during service?",
                  answer: "No, you don't need to be present. We just need access to your vehicle and a water source."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-stone-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-stone-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Footer CTA */}
      {selectedVehicle && selectedService && (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-900/95 backdrop-blur-sm border-t border-stone-700 p-4 z-50">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={continueToBooking}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors duration-200"
            >
              Continue to Booking - {selectedServiceData?.tierName}
            </button>
          </div>
        </div>
      )}

      {/* Tier Details Modal */}
      {isModalOpen && selectedTierForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedTierForModal.name}</h2>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                    ${selectedTierForModal.price}
                  </div>
                  <p className="text-stone-400 text-sm mt-2">
                    {selectedTierForModal.duration} minutes
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-stone-400 hover:text-white transition-colors duration-200 p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Features Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included:</h3>
                <div className="space-y-4">
                  {selectedTierForModal.features.map((feature, index) => {
                    const serviceDef = findServiceDefinition(feature);
                    const vehicleFeatures = serviceDef ? getVehicleSpecificFeatures(serviceDef, selectedVehicle) : null;
                    const isExpanded = expandedFeature === feature;
                    
                    return (
                      <div key={index} className="border border-stone-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFeature(isExpanded ? null : feature)}
                          className="w-full p-4 flex items-center justify-between hover:bg-stone-800 transition-colors duration-200"
                        >
                          <div className="flex items-start gap-3 flex-1 text-left">
                            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                            <span className="text-white text-lg font-medium">{feature}</span>
                          </div>
                          {serviceDef && (
                            <div className="flex-shrink-0 ml-4">
                              {isExpanded ? (
                                <ChevronUp size={20} className="text-orange-500" />
                              ) : (
                                <ChevronDown size={20} className="text-orange-500" />
                              )}
                            </div>
                          )}
                        </button>
                        
                        {isExpanded && serviceDef && vehicleFeatures && (
                          <div className="px-4 pb-4 bg-stone-800/50">
                            <div className="ml-9">
                              <p className="text-stone-300 text-sm mb-4 leading-relaxed">
                                {serviceDef.explanation}
                              </p>
                              
                              {vehicleFeatures.features && vehicleFeatures.features.length > 0 && (
                                <div>
                                  <h4 className="text-white font-semibold mb-3 text-sm">Specific to your {selectedVehicleData?.name}:</h4>
                                  <ul className="space-y-2">
                                    {vehicleFeatures.features.map((vehicleFeature: string, featureIndex: number) => (
                                      <li key={featureIndex} className="flex items-start gap-2">
                                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-orange-400 rounded-full mt-2"></div>
                                        <span className="text-stone-300 text-sm">{vehicleFeature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {vehicleFeatures.duration && (
                                <div className="mt-4 pt-3 border-t border-stone-600">
                                  <p className="text-orange-400 text-sm font-medium">
                                    Duration: {vehicleFeatures.duration} minutes
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-stone-700 hover:bg-stone-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Find the service ID for this tier
                    const service = availableServices.find(s => 
                      s.tiers?.some(t => t.id === selectedTierForModal.id)
                    );
                    if (service) {
                      const tierIndex = service.tiers?.findIndex(t => t.id === selectedTierForModal.id) || 0;
                      selectTier(service.id, tierIndex);
                      closeModal();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                >
                  Choose This Tier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
