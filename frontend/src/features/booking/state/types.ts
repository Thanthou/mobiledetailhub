// Booking state types
export type BookingStep = 'vehicle-selection' | 'service-tier' | 'addons' | 'schedule' | 'payment';

export interface BookingData {
  vehicle: string;
  serviceTier: string;
  addons: string[];
  schedule: { date: string; time: string };
  paymentMethod: string;
}

export interface BookingState {
  currentStep: BookingStep;
  bookingData: BookingData;
  completedSteps: BookingStep[];
  isLoading: boolean;
  errors: string[];
}

export interface BookingActions {
  setCurrentStep: (step: BookingStep) => void;
  updateBookingData: (data: Partial<BookingData>) => void;
  setVehicle: (vehicle: string) => void;
  setServiceTier: (tier: string) => void;
  setAddons: (addons: string[]) => void;
  setSchedule: (schedule: { date: string; time: string }) => void;
  setPaymentMethod: (method: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetBooking: () => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: string[]) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
}
