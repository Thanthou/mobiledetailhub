import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from '@/features/header';

import {
  MultiStepHero,
  QuoteModal,
} from './index';
import {
  useVehicleData,
  useServiceData,
  useTierSelection,
  useReviews,
} from '../hooks';
import type { ServiceTier } from '../types';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Custom hooks for data management
  const {
    selectedVehicle,
    availableVehicles,
    loadingVehicles,
    affiliateLoading,
    vehicleMakes,
    vehicleModels,
    vehicleYears,
    vehicleColors,
    vehicleDetails,
    selectVehicle,
    clearVehicleSelection,
    updateVehicleDetails,
  } = useVehicleData();

  const {
    selectedService,
    availableServices,
    isInitialLoading: loadingServices,
    selectService,
    clearServiceSelection,
  } = useServiceData(selectedVehicle, { autoSelectFirst: true });

  const {
    currentTierIndex,
    selectedTierForService,
    getTierPosition,
    goLeft,
    goRight,
    selectTier,
    clearTierSelection,
    initializeTierPositions,
  } = useTierSelection();

  const { averageRating, totalReviews } = useReviews();

  // Modal state
  const [selectedTierForModal, setSelectedTierForModal] = useState<ServiceTier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize tier positions based on popular tiers when services are loaded
  useEffect(() => {
    if (availableServices.length > 0 && !loadingServices) {
      initializeTierPositions(availableServices);
    }
  }, [availableServices, loadingServices, initializeTierPositions]);

  // Remove auto-scroll since we're using a single hero section

  const handleBackToHome = () => {
    void navigate('/');
  };

  const handleVehicleDetailsChange = useCallback((details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => {
    updateVehicleDetails(details);
  }, [updateVehicleDetails]);

  const handleTierSelect = useCallback((serviceId: string, tierIndex: number) => {
    selectTier(serviceId, tierIndex, availableServices, selectService, (serviceId, tierId) => {
      // This is handled by the selectTier function
    });
  }, [selectTier, availableServices, selectService]);

  const handleTierNavigate = useCallback((serviceId: string, direction: 'left' | 'right') => {
    const service = availableServices.find(s => s.id === serviceId);
    if (service && service.tiers) {
      if (direction === 'left') {
        goLeft(serviceId);
      } else {
        goRight(serviceId, service.tiers);
      }
    }
  }, [availableServices, goLeft, goRight]);

  const handleTierModalOpen = useCallback((tier: ServiceTier) => {
    setSelectedTierForModal(tier);
    setIsModalOpen(true);
  }, []);

  const handleTierModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTierForModal(null);
  }, []);

  const handleSelectTier = useCallback(() => {
    // This would be called when user confirms tier selection in modal
    // For now, just close the modal
    handleTierModalClose();
  }, [handleTierModalClose]);


  return (
    <div className="min-h-screen bg-stone-900">
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      
      {/* Dynamic Header */}
      <Header />

      {/* Multi-Step Hero Section */}
      <MultiStepHero
        availableVehicles={availableVehicles}
        selectedVehicle={selectedVehicle}
        loadingVehicles={affiliateLoading || loadingVehicles}
        vehicleMakes={vehicleMakes}
        vehicleModels={vehicleModels}
        vehicleYears={vehicleYears}
        vehicleColors={vehicleColors}
        vehicleDetails={vehicleDetails}
        availableServices={availableServices}
        selectedService={selectedService}
        loadingServices={loadingServices}
        selectedTierForService={selectedTierForService}
        currentTierIndex={currentTierIndex}
        averageRating={averageRating}
        totalReviews={totalReviews}
        onVehicleSelect={selectVehicle}
        onVehicleDetailsChange={handleVehicleDetailsChange}
        onTierSelect={handleTierSelect}
        onTierNavigate={handleTierNavigate}
        onTierModalOpen={handleTierModalOpen}
        onBackToHome={handleBackToHome}
      />

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={handleTierModalClose}
        tier={selectedTierForModal}
        onSelectTier={handleSelectTier}
      />
    </div>
  );
};

export default BookingPage;
