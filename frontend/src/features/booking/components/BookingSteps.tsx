// Simple booking steps with Header, Footer navigation and hero background
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/features/header';
import { useSiteContext } from '@/shared/hooks';
import { Footer, HeroBackground } from './shared';
import { StepVehicleSelection, StepService, StepAddons, StepSchedule, StepPayment } from './steps';
import { BOOKING_HERO_CONSTANTS } from '../constants/hero';
import { useBookingStore } from '../state';

const BookingSteps: React.FC = () => {
  const navigate = useNavigate();
  const { businessSlug } = useSiteContext();
  
  // Use Zustand store for state management
  const {
    currentStep,
    bookingData,
    completedSteps,
    isLoading,
    errors,
    setVehicle,
    setServiceTier,
    setAddons,
    setSchedule,
    setPaymentMethod,
    nextStep,
    previousStep,
    setLoading,
    clearErrors
  } = useBookingStore();
  
  const stepOrder: BookingStep[] = ['vehicle-selection', 'service-tier', 'addons', 'schedule', 'payment'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleCancel = () => {
    // Navigate back to the appropriate site (affiliate or main)
    const homePath = businessSlug ? `/${businessSlug}` : '/';
    navigate(homePath);
  };

  // Data handlers for each step
  const handleVehicleSelected = (vehicle: string) => {
    setVehicle(vehicle);
  };

  const handleTierSelected = (tier: string) => {
    setServiceTier(tier);
  };

  const handleAddonsSelected = (addons: string[]) => {
    setAddons(addons);
  };

  const handleScheduleSelected = (schedule: { date: string; time: string }) => {
    setSchedule(schedule);
  };

  const handlePaymentComplete = () => {
    console.log('🎉 Final booking data:', bookingData);
    // Here you would typically send the data to your backend
    alert('Booking completed successfully!');
  };

  const renderStepContent = () => {
    console.log('🎬 Rendering step:', currentStep);
    console.log('📊 Current booking data:', bookingData);
    
    switch (currentStep) {
      case 'vehicle-selection':
        return <StepVehicleSelection 
          bookingData={bookingData}
          onVehicleSelected={handleVehicleSelected} 
        />;
        
      case 'service-tier':
        return <StepService 
          onTierSelected={handleTierSelected} 
        />;
        
      case 'addons':
        return <StepAddons 
          onAddonsSelected={handleAddonsSelected} 
        />;
        
      case 'schedule':
        return <StepSchedule 
          bookingData={bookingData}
          onScheduleSelected={handleScheduleSelected} 
        />;
        
      case 'payment':
        return <StepPayment 
          bookingData={bookingData}
          onPaymentComplete={handlePaymentComplete} 
        />;
        
      default:
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Unknown Step</h1>
          </div>
        );
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-stone-900 overflow-hidden">
      {/* Header */}
      <div className="relative z-30">
        <Header />
      </div>
      
      {/* Hero Background with Rotating Images */}
      <HeroBackground images={BOOKING_HERO_CONSTANTS.IMAGES} />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content Container */}
      <div className="relative z-20 flex flex-col justify-center min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center">
          {renderStepContent()}
        </div>

        {/* Footer with Navigation */}
        <Footer
          currentStep={currentStep}
          completedSteps={completedSteps}
          showStepProgress={true}
          averageRating={4.9}
          totalReviews={112}
          showTrustStrip={true}
          onNext={handleNext}
          onBack={handleBack}
          onCancel={handleCancel}
          canGoNext={currentStepIndex < stepOrder.length - 1}
          canGoBack={currentStepIndex > 0}
          canSkip={false}
          isLoading={false}
          nextLabel={currentStepIndex === stepOrder.length - 1 ? "Complete" : "Continue"}
          backLabel="Back"
          showNavigation={true}
          className="mt-auto"
        />
      </div>
    </section>
  );
};

export default BookingSteps;
