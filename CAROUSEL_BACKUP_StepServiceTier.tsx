// BACKUP: Carousel Implementation from StepServiceTier.tsx
// Save this file - contains sophisticated carousel logic that took time to build

// Service tier selection step component
import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { StepContainer } from '@/features/booking/components/shared';
import { Button } from '@/shared/ui';
import { useTierSelection } from '@/features/booking/hooks/useTierSelection';
import { useServiceData } from '@/features/booking/hooks/useServiceData';
import { getServiceDisplayNames } from '@/features/booking/utils/serviceNameMapping';
import type { StepComponentProps } from '@/features/booking/types/booking';

interface StepServiceTierProps extends StepComponentProps<'service-tier'> {
  // Additional props for service tier selection
  selectedVehicle?: string;
  onTierModalOpen?: (tier: any) => void;
}

const StepServiceTier: React.FC<StepServiceTierProps> = ({
  data,
  onNext,
  onBack,
  onCancel,
  onSkip,
  isValid,
  errors,
  isLoading,
  selectedVehicle = 'car',
  onTierModalOpen,
}) => {
  console.log('🎯 SERVICE STEP LOADED - selectedVehicle:', selectedVehicle);
  // Get service data based on selected vehicle
  const { 
    availableServices, 
    isInitialLoading: servicesLoading,
    error: servicesError 
  } = useServiceData(selectedVehicle, { autoSelectFirst: false });

  const {
    currentTierIndex,
    selectedTierForService,
    goLeft,
    goRight,
    selectTier,
    initializeTierPositions,
  } = useTierSelection();

  // Initialize tier positions when services load
  useEffect(() => {
    if (availableServices.length > 0) {
      initializeTierPositions(availableServices);
      
      // Auto-select the first service if there's only one and no service is selected
      if (availableServices.length === 1 && !data?.selectedService) {
        console.log('Auto-selecting single service:', availableServices[0].id);
        // We'll handle this in the render logic instead of modifying data here
      }
    }
  }, [availableServices, initializeTierPositions, data?.selectedService]);

  const handleNext = () => {
    if (data && isValid) {
      onNext(data);
    }
  };

  const handleTierSelect = (serviceId: string, tierIndex: number) => {
    selectTier(serviceId, tierIndex, availableServices, 
      (serviceId) => {
        // Update service selection in parent
        console.log('Service selected:', serviceId);
      },
      (serviceId, tierId) => {
        // Update tier selection in parent
        console.log('Tier selected:', serviceId, tierId);
      }
    );
  };

  const handleTierNavigate = (serviceId: string, direction: 'left' | 'right') => {
    if (direction === 'left') {
      goLeft(serviceId);
    } else {
      const service = availableServices.find(s => s.id === serviceId);
      if (service?.tiers) {
        goRight(serviceId, service.tiers);
      }
    }
  };

  const getTierPosition = (serviceId: string, tierIndex: number): 'center' | 'left' | 'right' | 'center-left' | 'center-right' | 'hidden' => {
    const currentIndex = currentTierIndex[serviceId] || 0;
    
    // Adjust for dummy cards - real indices are 1 to totalTiers
    const adjustedCurrentIndex = currentIndex + 1;
    const diff = tierIndex - adjustedCurrentIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    
    return 'hidden';
  };

  const renderTierCard = (service: any, _tier: any, tierIndex: number) => {
    // Skip dummy cards (index 0 and last index)
    if (tierIndex === 0 || tierIndex === service.tiers.length + 1) {
      const position = getTierPosition(service.id, tierIndex);
      if (position === 'hidden') return null;
      
      // Render invisible dummy card with same dimensions as real cards
      return (
        <div
          key={`dummy-${service.id}-${tierIndex}`}
          className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300 transform w-80 flex-shrink-0 scale-90 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="h-full invisible">
            {/* Match the structure of real cards for consistent sizing */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Dummy</h3>
              <p className="text-3xl font-bold text-orange-500">$0.00</p>
            </div>
            <div className="mb-4">
              <p className="text-stone-300 text-sm mb-4">Dummy description</p>
            </div>
            <div className="w-full h-12 bg-orange-500 rounded"></div>
          </div>
        </div>
      );
    }
    
    // Adjust tier index for real cards (subtract 1 to get actual tier)
    const realTierIndex = tierIndex - 1;
    const realTier = service.tiers[realTierIndex];
    
    const position = getTierPosition(service.id, tierIndex);
    const isSelected = selectedTierForService[service.id] === realTier.id;
    
    if (position === 'hidden') return null;

    const baseClasses = "bg-stone-800/80 backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300 transform cursor-pointer w-80 flex-shrink-0";
    
    const positionClasses = {
      center: "scale-100 z-10 ring-2 ring-orange-500",
      left: "scale-90 -translate-x-4 opacity-70",
      right: "scale-90 translate-x-4 opacity-70"
    };
    
    let finalClasses = `${baseClasses} ${positionClasses[position as keyof typeof positionClasses]}`;
    
    if (isSelected) {
      finalClasses = finalClasses.replace('ring-orange-500', 'ring-green-500') + ' bg-green-800/80';
    }

    return (
      <div
        key={`${service.id}-${realTier.id}`}
        className={finalClasses}
        onClick={() => onTierModalOpen?.(realTier)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTierModalOpen?.(realTier);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">{realTier.name}</h3>
          <p className="text-3xl font-bold text-orange-500">${realTier.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          {realTier.originalPrice && realTier.originalPrice > realTier.price && (
            <p className="text-lg text-gray-400 line-through">${realTier.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-stone-300 text-sm mb-4">{realTier.description}</p>
          
          {realTier.features && realTier.features.length > 0 && (
            <div className="space-y-2">
              {getServiceDisplayNames(realTier.features).map((feature: string, index: number) => (
                <div key={index} className="flex items-center text-sm text-stone-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleTierSelect(service.id, realTierIndex);
          }}
          variant={isSelected ? "primary" : "secondary"}
          size="lg"
          className={`w-full text-base ${
            isSelected 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
          leftIcon={isSelected ? <CheckCircle size={16} /> : undefined}
        >
          {isSelected ? 'Selected' : 'Choose'}
        </Button>
      </div>
    );
  };

  // Debug logging
  console.log('StepServiceTier Debug:', {
    selectedVehicle,
    availableServices: availableServices.length,
    selectedService: data?.selectedService,
    isLoading,
    servicesLoading,
    servicesError,
    services: availableServices
  });

  // If no service is selected, show service selection (unless there's only one service)
  if (!data?.selectedService && availableServices.length > 1) {
    return (
      <StepContainer
        title="Choose Your Service"
        subtitle="Select the service you need for your vehicle"
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        onSkip={() => {}}
        canGoNext={isValid}
        canGoBack={true}
        canSkip={false}
        isLoading={isLoading}
        nextLabel="Continue"
        showNavigation={false}
        showTrustStrip={false}
      >
        <div className="space-y-8">
          {/* Debug Info */}
          <div className="text-center text-white">
            <p>Available Services: {availableServices.length}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices.map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-xl border-2 border-gray-600 hover:border-gray-500 transition-all cursor-pointer"
                onClick={() => {
                  console.log('Service selected:', service.id);
                }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-semibold">
                      Starting at ${service.price || '0.00'}
                    </span>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="px-4 py-2 bg-stone-700 hover:bg-orange-500"
                    >
                      Choose
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <ul className="text-red-200 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </StepContainer>
    );
  }

  // Show tier selection carousel for selected service (or first service if only one available)
  const service = data?.selectedService 
    ? availableServices.find(s => s.id === data.selectedService)
    : availableServices[0]; // Use first service if none selected and only one available
    
  if (!service || !service.tiers || service.tiers.length === 0) {
    return (
      <StepContainer
        title="Choose Your Service"
        subtitle="No tiers available for this service"
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        onSkip={() => {}}
        canGoNext={isValid}
        canGoBack={true}
        canSkip={false}
        isLoading={isLoading}
        nextLabel="Continue"
        showNavigation={false}
        showTrustStrip={false}
      >
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg">No service tiers available.</p>
        </div>
      </StepContainer>
    );
  }

  const currentIndex = currentTierIndex[service.id] || 0;
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < service.tiers.length - 1;

  return (
    <StepContainer
      title="Choose Your Service Tier"
      subtitle={`Select the tier that best fits your needs for ${service.name}`}
      onNext={handleNext}
      onBack={onBack}
      onCancel={onCancel}
      onSkip={onSkip || (() => {})}
      canGoNext={isValid}
      canGoBack={true}
      canSkip={false}
      isLoading={isLoading}
      nextLabel="Continue"
      showNavigation={false}
      showTrustStrip={false}
    >
      <div className="relative">
        {/* Navigation Arrows */}
        {canGoLeft && (
          <button
            onClick={() => handleTierNavigate(service.id, 'left')}
            className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg"
            aria-label="Previous tier"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {canGoRight && (
          <button
            onClick={() => handleTierNavigate(service.id, 'right')}
            className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg"
            aria-label="Next tier"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Tier Cards */}
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center justify-center gap-4 w-full max-w-5xl">
            {/* Create array with dummy cards at start and end */}
            {[null, ...service.tiers, null].map((tier, index) => 
              renderTierCard(service, tier, index)
            )}
          </div>
        </div>

        {/* Tier Indicators */}
        {service.tiers.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {service.tiers.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => handleTierSelect(service.id, index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-orange-500' 
                    : 'bg-stone-600 hover:bg-stone-500'
                }`}
                aria-label={`Go to tier ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <ul className="text-red-200 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </StepContainer>
  );
};

export default StepServiceTier;

{
  "message": [
    "We’ll contact you within 24 hours to confirm the arrival time and ensure you and/or your vehicle are available.",
    "Our team will arrive at your specified location between 6:00 AM and 9:00 AM, unless other arrangements are agreed upon.",
    "If we can’t reach you or confirm the appointment, we’ll cancel the service at no cost to you."
  ]
}
