import React, { useState, useMemo } from 'react';

import { HeroBackground } from '@/features/hero';
import { BOOKING_HERO_CONSTANTS } from '../../constants/hero';
import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useAddonData } from '../../hooks/useAddonData';

import StepVehicleSelection from './steps/StepVehicleSelection';
import StepServiceTier from './steps/StepServiceTier';
import StepAddons from './steps/StepAddons';
import BookingSchedule from './steps/BookingSchedule';
import BookingPayment from './steps/BookingPayment';

import type { Vehicle, Service, ServiceTier } from '../../types';

interface MultiStepHeroProps {
  // Vehicle data
  availableVehicles: Vehicle[];
  selectedVehicle: string;
  loadingVehicles: boolean;
  vehicleMakes: string[];
  vehicleModels: { [make: string]: string[] };
  vehicleYears: string[];
  vehicleColors: string[];
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  };

  // Service data
  availableServices: Service[];
  selectedService: string;
  loadingServices: boolean;
  selectedTierForService: { [serviceId: string]: string };
  currentTierIndex: { [serviceId: string]: number };

  // Reviews
  averageRating: number;
  totalReviews: number;

  // Handlers
  onVehicleSelect: (vehicleId: string) => void;
  onVehicleDetailsChange: (details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => void;
  onTierSelect: (serviceId: string, tierIndex: number) => void;
  onTierNavigate: (serviceId: string, direction: 'left' | 'right') => void;
  onTierModalOpen: (tier: ServiceTier) => void;
  onBackToHome: () => void;
}

type Step = 'vehicle-selection' | 'service-tier' | 'addons' | 'schedule' | 'payment';

const MultiStepHero: React.FC<MultiStepHeroProps> = ({
  availableVehicles,
  selectedVehicle,
  loadingVehicles,
  vehicleMakes,
  vehicleModels,
  vehicleYears,
  vehicleColors,
  vehicleDetails,
  availableServices,
  selectedService,
  loadingServices,
  selectedTierForService,
  currentTierIndex,
  averageRating,
  totalReviews,
  onVehicleSelect,
  onVehicleDetailsChange,
  onTierSelect,
  onTierNavigate,
  onTierModalOpen,
  onBackToHome,
}) => {
  const { businessSlug } = useAffiliate();
  const [currentStep, setCurrentStep] = useState<Step>('vehicle-selection');

  // Addon data
  const {
    availableAddons,
    loadingAddons,
    selectedTierForAddon,
    toggleAddon,
    clearAddonSelection,
  } = useAddonData(selectedVehicle, selectedService);

  // Decide when vehicle details are "complete"
  const isVehicleDetailsComplete = useMemo(() => {
    if (!selectedVehicle) return false;

    const needsFullDetails = ['car', 'truck', 'boat', 'rv'].includes(selectedVehicle);
    if (!needsFullDetails) return true;

    const hasMake = !!vehicleDetails.make;
    const hasModel = !!vehicleDetails.model;
    const hasYear = !!vehicleDetails.year;

    if (selectedVehicle === 'boat' || selectedVehicle === 'rv') {
      const hasLength = !!vehicleDetails.length;
      return hasMake && hasModel && hasYear && hasLength;
    }
    const hasColor = !!vehicleDetails.color;
    return hasMake && hasModel && hasYear && hasColor;
  }, [selectedVehicle, vehicleDetails]);

  // Forward vehicle detail changes up — no local state here
  const handleVehicleDetailsChange = (details: typeof vehicleDetails) => {
    onVehicleDetailsChange(details);
  };

  const handleBackToHome = () => {
    if (businessSlug) {
      window.location.href = `/${businessSlug}`;
    } else {
      onBackToHome();
    }
  };

  const handleStepComplete = (step: Step) => {
    switch (step) {
      case 'vehicle-selection':
        if (isVehicleDetailsComplete) setCurrentStep('service-tier');
        break;
      case 'service-tier':
        if (selectedService && selectedTierForService[selectedService]) {
          setCurrentStep('addons');
        }
        break;
      case 'addons':
        setCurrentStep('schedule');
        break;
      case 'schedule':
        setCurrentStep('payment');
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'service-tier':
        setCurrentStep('vehicle-selection');
        break;
      case 'addons':
        setCurrentStep('service-tier');
        break;
      case 'schedule':
        setCurrentStep('addons');
        break;
      case 'payment':
        setCurrentStep('schedule');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'vehicle-selection':
        return (
          <StepVehicleSelection
            availableVehicles={availableVehicles}
            selectedVehicle={selectedVehicle}
            loading={loadingVehicles}
            vehicleMakes={vehicleMakes}
            vehicleModels={vehicleModels}
            vehicleYears={vehicleYears}
            vehicleColors={vehicleColors}
            vehicleDetails={vehicleDetails}
            onVehicleSelect={onVehicleSelect}
            onVehicleDetailsChange={handleVehicleDetailsChange}
            onNext={() => handleStepComplete('vehicle-selection')}
            onBackToHome={onBackToHome}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        );

      case 'service-tier':
        return (
          <StepServiceTier
            availableServices={availableServices}
            selectedService={selectedService}
            loading={loadingServices}
            selectedTierForService={selectedTierForService}
            currentTierIndex={currentTierIndex}
            onTierSelect={onTierSelect}
            onTierNavigate={onTierNavigate}
            onTierModalOpen={onTierModalOpen}
            onNext={() => handleStepComplete('service-tier')}
            onBack={goToPreviousStep}
            onBackToHome={handleBackToHome}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        );

      case 'addons':
        return (
          <StepAddons
            availableAddons={availableAddons}
            selectedTierForAddon={selectedTierForAddon}
            onAddonToggle={(addonId, tierId) =>
              toggleAddon(addonId, tierId || addonId)
            }
            onTierModalOpen={onTierModalOpen}
            onNext={() => handleStepComplete('addons')}
            onBack={goToPreviousStep}
            onBackToHome={handleBackToHome}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        );

      case 'schedule':
        return (
          <BookingSchedule
            onBack={goToPreviousStep}
            onBackToHome={handleBackToHome}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        );

      case 'payment':
        return (
          <BookingPayment
            onBack={goToPreviousStep}
            onBackToHome={handleBackToHome}
            averageRating={averageRating}
            totalReviews={totalReviews}
            selectedVehicle={selectedVehicle}
            selectedService={selectedService}
            selectedTierForService={selectedTierForService}
            selectedTierForAddon={selectedTierForAddon}
            availableVehicles={availableVehicles}
            availableServices={availableServices}
            availableAddons={availableAddons}
            vehicleDetails={vehicleDetails}
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="relative w-full h-screen bg-stone-900 overflow-hidden">
      <HeroBackground images={BOOKING_HERO_CONSTANTS.IMAGES} />
      <div className="absolute inset-0 bg-black/40 z-5" />
      <div className="relative z-10 flex flex-col justify-center h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentStep()}
      </div>
    </section>
  );
};

export default MultiStepHero;
