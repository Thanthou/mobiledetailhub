import React, { useReducer } from 'react';

import { Button } from '@/shared/ui';

import { StepPayment, StepReview, StepSchedule, StepServices, StepVehicle } from '../index';
import { type BookingContext,bookingReducer, initialBookingState } from '../state';

interface BookingFlowProps {
  onComplete: (bookingData: BookingContext) => void;
  onCancel: () => void;
  services: Array<{
    id: string;
    name: string;
    description: string;
    base_price_cents: string;
    duration: number;
  }>;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ 
  onComplete, 
  onCancel, 
  services 
}) => {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);

  const handleVehicleNext = (vehicleData: { type: string; make: string; model: string; year: number }) => {
    dispatch({ type: 'SELECT_VEHICLE', data: vehicleData });
  };

  const handleVehicleDetailsNext = () => {
    dispatch({ type: 'CONFIRM_VEHICLE_DETAILS' });
  };

  const handleServicesNext = (serviceData: { services: string[] }) => {
    dispatch({ type: 'SELECT_SERVICES', data: serviceData.services });
  };

  const handleScheduleNext = (scheduleData: { date: string; time: string; location: string }) => {
    dispatch({ type: 'SELECT_SCHEDULE', data: scheduleData });
  };

  const handleReviewNext = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const handlePaymentNext = (paymentData: { method: string; cardNumber: string; expiryDate: string; cvv: string }) => {
    dispatch({ type: 'SUBMIT_PAYMENT', data: paymentData });
    onComplete(state);
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const handleEditStep = (step: string) => {
    // Navigate back to the specified step
    switch (step) {
      case 'vehicle':
        dispatch({ type: 'SELECT_VEHICLE', data: state.vehicleData });
        break;
      case 'services':
        dispatch({ type: 'SELECT_SERVICES', data: state.selectedServices });
        break;
      case 'schedule':
        dispatch({ type: 'SELECT_SCHEDULE', data: state.scheduleData });
        break;
      default:
        break;
    }
  };

  const calculateTotal = () => {
    if (!state.selectedServices) return 0;
    return state.selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? parseInt(service.base_price_cents) : 0);
    }, 0) / 100;
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'vehicle':
        return (
          <StepVehicle
            onNext={handleVehicleNext}
            onPrevious={onCancel}
            initialData={state.vehicleData}
          />
        );
      
      case 'vehicleDetails':
        return (
          <StepVehicleDetails
            onNext={handleVehicleDetailsNext}
            onPrevious={handlePrevious}
            vehicleData={state.vehicleData || { type: '', make: '', model: '', year: '' }}
          />
        );
      
      case 'services':
        return (
          <StepServices
            onNext={handleServicesNext}
            onPrevious={handlePrevious}
            initialData={{ services: state.selectedServices || [] }}
            services={services}
          />
        );
      
      case 'schedule':
        return (
          <StepSchedule
            onNext={handleScheduleNext}
            onPrevious={handlePrevious}
            initialData={state.scheduleData}
          />
        );
      
      case 'review':
        return (
          <StepReview
            onNext={handleReviewNext}
            onPrevious={handlePrevious}
            onEditStep={handleEditStep}
            vehicleData={state.vehicleData || { type: '', make: '', model: '', year: 0 }}
            serviceData={{ services: state.selectedServices || [] }}
            scheduleData={state.scheduleData || { date: '', time: '', location: '' }}
            services={services}
          />
        );
      
      case 'payment':
        return (
          <StepPayment
            onNext={handlePaymentNext}
            onPrevious={handlePrevious}
            totalAmount={calculateTotal()}
          />
        );
      
      case 'success':
        return (
          <div className="max-w-2xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h2>
            <p className="text-gray-300 mb-6">
              Your booking has been successfully created. You will receive a confirmation email shortly.
            </p>
            <Button
              onClick={onCancel}
              variant="primary"
              size="md"
              className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
            >
              Close
            </Button>
          </div>
        );
      
      case 'error':
        return (
          <div className="max-w-2xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Booking Error</h2>
            <p className="text-gray-300 mb-6">
              {state.error || 'An error occurred while processing your booking.'}
            </p>
            <Button
              onClick={handlePrevious}
              variant="primary"
              size="md"
              className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
            >
              Try Again
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {renderCurrentStep()}
    </div>
  );
};

export default BookingFlow;
