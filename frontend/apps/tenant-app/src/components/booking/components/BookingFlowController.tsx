import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBookingStep } from '@tenant-app/components/booking/state';

import BookingLayout from './BookingLayout';
import { StepAddons, StepLocation, StepPayment,StepSchedule, StepService, StepVehicleSelection } from './steps';

/**
 * BookingFlowController - Handles step logic, navigation, and state management
 * Uses Zustand store as single source of truth for step state
 */
const BookingFlowController: React.FC = () => {
  const navigate = useNavigate();
  
  // Get step management from narrow selector
  const { 
    currentStep,
    nextStep,
    previousStep
  } = useBookingStep();
  
  const stepOrder = ['vehicle-selection', 'location', 'service-tier', 'addons', 'schedule', 'payment'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  
  const handleNext = useCallback(() => {
    nextStep();
  }, [nextStep]);
  
  const handleBack = useCallback(() => {
    previousStep();
  }, [previousStep]);
  
  const handleCancel = useCallback(() => {
    void navigate('/');
  }, [navigate]);

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 'vehicle-selection':
        return <StepVehicleSelection />;
      
      case 'location':
        return <StepLocation />;
      
      case 'service-tier':
        return <StepService />;
      
      case 'addons':
        return <StepAddons />;
      
      case 'schedule':
        return <StepSchedule />;
      
      case 'payment':
        return (
          <StepPayment 
            onPaymentComplete={() => {
              // TODO: Handle payment completion and navigation
              // For now, just navigate back to home
              void navigate('/');
            }}
          />
        );
      
      default:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Unknown Step
            </h2>
            <p className="text-gray-300">Step not found</p>
          </div>
        );
    }
  }, [currentStep, navigate]);

  return (
    <BookingLayout
        currentStep={currentStep}
        completedSteps={stepOrder.slice(0, currentStepIndex)}
        onNext={handleNext}
        onBack={handleBack}
        onCancel={handleCancel}
        canGoNext={currentStepIndex < stepOrder.length - 1}
        canGoBack={currentStepIndex > 0}
        canSkip={false}
        isLoading={false}
        nextLabel={currentStepIndex === stepOrder.length - 1 ? "Complete" : "Continue"}
        backLabel="Exit"
        showNavigation={true}
        averageRating={4.9}
        totalReviews={112}
        showTrustStrip={true}
      >
        {renderStepContent()}
      </BookingLayout>
  );
};

export default BookingFlowController;
