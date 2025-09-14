import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';
import { getServiceDisplayNames } from '../../../utils/serviceNameMapping';

import type { Service, ServiceTier } from '../../../types';

interface StepServiceTierProps {
  availableServices: Service[];
  selectedService: string;
  loading: boolean;
  selectedTierForService: { [serviceId: string]: string };
  currentTierIndex: { [serviceId: string]: number };
  averageRating: number;
  totalReviews: number;
  onTierSelect: (serviceId: string, tierIndex: number) => void;
  onTierNavigate: (serviceId: string, direction: 'left' | 'right') => void;
  onTierModalOpen: (tier: ServiceTier) => void;
  onNext: () => void;
  onBack: () => void;
  onBackToHome: () => void;
}

const StepServiceTier: React.FC<StepServiceTierProps> = ({
  availableServices,
  selectedService,
  loading,
  selectedTierForService,
  currentTierIndex,
  averageRating,
  totalReviews,
  onTierSelect,
  onTierNavigate,
  onTierModalOpen,
  onNext,
  onBack,
  onBackToHome,
}) => {
  const getTierPosition = (serviceId: string, tierIndex: number, totalTiers: number): 'center' | 'left' | 'right' | 'center-left' | 'center-right' | 'hidden' => {
    const currentIndex = currentTierIndex[serviceId] || 0;
    
    // Adjust for dummy cards - real indices are 1 to totalTiers
    const adjustedCurrentIndex = currentIndex + 1;
    const diff = tierIndex - adjustedCurrentIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    
    return 'hidden';
  };

  const renderTierCard = (service: Service, tier: ServiceTier, tierIndex: number) => {
    // Skip dummy cards (index 0 and last index)
    if (tierIndex === 0 || tierIndex === service.tiers.length + 1) {
      const position = getTierPosition(service.id, tierIndex, service.tiers.length + 2);
      if (position === 'hidden') return null;
      
      // Render invisible dummy card
      return (
        <div
          key={`dummy-${service.id}-${tierIndex}`}
          className="bg-transparent rounded-xl p-6 text-center transition-all duration-300 transform flex-1 scale-90 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="h-full invisible">Dummy</div>
        </div>
      );
    }
    
    // Adjust tier index for real cards (subtract 1 to get actual tier)
    const realTierIndex = tierIndex - 1;
    const realTier = service.tiers[realTierIndex];
    
    const position = getTierPosition(service.id, tierIndex, service.tiers.length);
    const isSelected = selectedTierForService[service.id] === realTier.id;
    
    if (position === 'hidden') return null;

           const baseClasses = "relative bg-stone-800/80 backdrop-blur-sm rounded-xl p-9 text-center transition-all duration-300 transform cursor-pointer flex-1";
    
    const positionClasses = {
      center: "scale-100 z-10 ring-2 ring-orange-500",
      left: "scale-90 -translate-x-2 opacity-70",
      right: "scale-90 translate-x-2 opacity-70"
    };
    
    let finalClasses = `${baseClasses} ${positionClasses[position as keyof typeof positionClasses]}`;
    
    if (isSelected) {
      finalClasses = finalClasses.replace('ring-orange-500', 'ring-green-500') + ' bg-green-800/80';
    }

    return (
      <div
        key={`${service.id}-${realTier.id}`}
        className={finalClasses}
        onClick={() => onTierModalOpen(realTier)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTierModalOpen(realTier);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {/* Popular Badge */}
        {realTier.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              POPULAR
            </div>
          </div>
        )}
        
               <div className="mb-6">
                 <h3 className="text-3xl font-bold text-white mb-3">{realTier.name}</h3>
                 <p className="text-4xl font-bold text-orange-500">${realTier.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 {realTier.originalPrice && realTier.originalPrice > realTier.price && (
                   <p className="text-xl text-gray-400 line-through">${realTier.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 )}
               </div>

        <div className="mb-6">
          <p className="text-stone-300 text-base mb-6">{realTier.description}</p>
          
          {realTier.features && realTier.features.length > 0 && (
            <div className="space-y-3">
              {getServiceDisplayNames(realTier.features).map((feature, index) => (
                <div key={index} className="flex items-center text-base text-stone-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onTierSelect(service.id, realTierIndex);
          }}
          variant={isSelected ? "primary" : "secondary"}
          size="lg"
          className={`w-full text-lg py-4 ${
            isSelected 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
          leftIcon={isSelected ? <CheckCircle size={20} /> : undefined}
        >
          {isSelected ? 'Selected' : 'Choose'}
        </Button>
      </div>
    );
  };

  if (!selectedService) {
    return (
      <div className="text-center">
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center max-w-md mx-auto">
          <p className="text-stone-300 text-lg">
            No service selected
          </p>
        </div>
      </div>
    );
  }

  const service = availableServices.find(s => s.id === selectedService);
  if (!service || !service.tiers) {
    return (
      <div className="text-center">
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center max-w-md mx-auto">
          <p className="text-stone-300 text-lg">
            No tiers available for this service
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = currentTierIndex[service.id] || 0;
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < service.tiers.length - 1;

  return (
    <StepContainer>
      {/* Main Content Area - Green Container */}
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Main Content */}
        <div className="flex flex-col justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Service Tiers */}
          <div className="relative">
            {/* Navigation Arrows */}
            {canGoLeft && (
              <button
                onClick={() => onTierNavigate(service.id, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-full transition-colors"
                aria-label="Previous tier"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
            )}

            {canGoRight && (
              <button
                onClick={() => onTierNavigate(service.id, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-full transition-colors"
                aria-label="Next tier"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            )}

                   {/* Tier Cards */}
                   <div className="flex justify-center items-start py-8">
                     <div className="flex gap-4 w-full max-w-5xl justify-center">
                {/* Create array with dummy cards at start and end */}
                {[null, ...service.tiers, null].map((tier, index) => 
                  renderTierCard(service, tier as ServiceTier, index)
                )}
              </div>
            </div>

            {/* Tier Indicators - Disabled for now */}
            {/* {service.tiers.length > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {service.tiers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onTierSelect(service.id, index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex 
                        ? 'bg-orange-500' 
                        : 'bg-stone-600 hover:bg-stone-500'
                    }`}
                    aria-label={`Go to tier ${index + 1}`}
                  />
                ))}
              </div>
            )} */}
          </div>
        </div>

        {/* Orange Container - Footer inside Green */}
        <div className="-mt-52 pb-4">
        <StepBottomSection
          onBack={onBack}
          onNext={() => {
            if (onNext) {
              onNext();
            }
          }}
          showBack={true}
          showNext={true}
          nextText="Continue"
          averageRating={averageRating}
          totalReviews={totalReviews}
          currentStep={2}
          totalSteps={5}
        />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepServiceTier;