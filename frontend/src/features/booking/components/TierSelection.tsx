import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

import { Button } from '@/shared/ui';
import { HERO_CONSTANTS, HeroBackground } from '@/features/hero';
import { getServiceDisplayNames } from '../utils/serviceNameMapping';

import type { Service, ServiceTier } from '../types';

interface TierSelectionProps {
  availableServices: Service[];
  selectedService: string;
  selectedTierForService: { [serviceId: string]: string };
  currentTierIndex: { [serviceId: string]: number };
  onTierSelect: (serviceId: string, tierIndex: number) => void;
  onTierNavigate: (serviceId: string, direction: 'left' | 'right') => void;
  onTierModalOpen: (tier: ServiceTier) => void;
}

const TierSelection: React.FC<TierSelectionProps> = ({
  availableServices,
  selectedService,
  selectedTierForService,
  currentTierIndex,
  onTierSelect,
  onTierNavigate,
  onTierModalOpen,
}) => {
  const getTierPosition = (serviceId: string, tierIndex: number): 'center' | 'left' | 'right' | 'hidden' => {
    const currentIndex = currentTierIndex[serviceId] || 0;
    const diff = tierIndex - currentIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    
    return 'hidden';
  };

  const renderTierCard = (service: Service, tier: ServiceTier, tierIndex: number) => {
    const position = getTierPosition(service.id, tierIndex);
    const isSelected = selectedTierForService[service.id] === tier.id;
    
    if (position === 'hidden') return null;

    const baseClasses = "relative bg-stone-800 rounded-xl p-12 text-center transition-all duration-300 transform";
    const positionClasses = {
      center: "scale-100 z-10 ring-2 ring-orange-500",
      left: "scale-90 -translate-x-4 opacity-70",
      right: "scale-90 translate-x-4 opacity-70"
    };

    return (
      <div
        key={`${service.id}-${tier.id}`}
        className={`${baseClasses} ${positionClasses[position]} ${
          isSelected ? 'bg-green-800 ring-green-500' : ''
        } cursor-pointer`}
        onClick={() => onTierModalOpen(tier)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTierModalOpen(tier);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {/* Popular Badge */}
        {tier.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              POPULAR
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">{tier.name}</h3>
          <p className="text-4xl font-bold text-orange-500">${tier.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          {tier.originalPrice && tier.originalPrice > tier.price && (
            <p className="text-lg text-gray-400 line-through">${tier.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>

        <div className="mb-8">
          <p className="text-stone-300 text-lg mb-6">{tier.description}</p>
          
          {tier.features && tier.features.length > 0 && (
            <div className="space-y-4">
              {getServiceDisplayNames(tier.features).map((feature, index) => (
                <div key={index} className="flex items-center text-lg text-stone-300">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onTierSelect(service.id, tierIndex);
          }}
          variant={isSelected ? "primary" : "secondary"}
          size="lg"
          className={`w-full ${
            isSelected 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
          leftIcon={isSelected ? <CheckCircle size={24} /> : undefined}
        >
          {isSelected ? 'Selected' : 'Choose Tier'}
        </Button>
      </div>
    );
  };

  if (!selectedService) {
    return null;
  }

  const service = availableServices.find(s => s.id === selectedService);
  if (!service || !service.tiers || service.tiers.length === 0) {
    return null;
  }

  const currentIndex = currentTierIndex[service.id] || 0;
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < service.tiers.length - 1;

  return (
    <section className="relative w-full min-h-screen bg-stone-900">
      {/* Rotating Background */}
      <HeroBackground images={HERO_CONSTANTS.IMAGES} />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-5" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your Service Tier
          </h2>
          <p className="text-xl text-stone-300">
            Select the tier that best fits your needs for {service.serviceName}
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          {canGoLeft && (
            <button
              onClick={() => onTierNavigate(service.id, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors"
              aria-label="Previous tier"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {canGoRight && (
            <button
              onClick={() => onTierNavigate(service.id, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors"
              aria-label="Next tier"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Tier Cards */}
          <div className="flex justify-center items-center min-h-[800px]">
            <div className="flex items-center justify-center space-x-4">
              {service.tiers.map((tier, index) => renderTierCard(service, tier, index))}
            </div>
          </div>

          {/* Tier Indicators */}
          {service.tiers.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
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
          )}
        </div>
      </div>
    </section>
  );
};

export default TierSelection;
