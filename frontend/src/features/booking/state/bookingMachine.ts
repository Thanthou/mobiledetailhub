// Booking state management for managing booking flow
// Simple state management without external dependencies

// Booking states
export type BookingState = 
  | 'idle'
  | 'vehicle'
  | 'services'
  | 'schedule'
  | 'review'
  | 'payment'
  | 'success'
  | 'error';

// Booking context
export interface BookingContext {
  currentStep: BookingState;
  vehicleData?: {
    type: string;
    make: string;
    model: string;
    year: string;
  };
  selectedServices?: string[];
  selectedAddons?: string[];
  scheduleData?: {
    date: string;
    time: string;
    duration: number;
  };
  paymentData?: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
  customerData?: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  error?: string;
}

// Booking events
export type BookingEvent = 
  | { type: 'START_BOOKING' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SELECT_VEHICLE'; data: BookingContext['vehicleData'] }
  | { type: 'SELECT_SERVICES'; data: BookingContext['selectedServices'] }
  | { type: 'SELECT_SCHEDULE'; data: BookingContext['scheduleData'] }
  | { type: 'SUBMIT_PAYMENT'; data: BookingContext['paymentData'] }
  | { type: 'BOOKING_SUCCESS' }
  | { type: 'BOOKING_ERROR'; error: string }
  | { type: 'RESET_BOOKING' };

// Step order
const STEP_ORDER: BookingState[] = [
  'vehicle',
  'services', 
  'schedule',
  'review',
  'payment',
  'success'
];

// Simple booking state reducer
export const bookingReducer = (state: BookingContext, event: BookingEvent): BookingContext => {
  switch (event.type) {
    case 'START_BOOKING':
      return { ...state, currentStep: 'vehicle' };
    
    case 'SELECT_VEHICLE':
      return {
        ...state,
        vehicleData: event.data,
        currentStep: 'services'
      };
    
    case 'SELECT_SERVICES':
      return {
        ...state,
        selectedServices: event.data,
        currentStep: 'schedule'
      };
    
    case 'SELECT_SCHEDULE':
      return {
        ...state,
        scheduleData: event.data,
        currentStep: 'review'
      };
    
    case 'NEXT_STEP': {
      const nextStep = getNextStep(state.currentStep);
      return nextStep ? { ...state, currentStep: nextStep } : state;
    }
    
    case 'PREVIOUS_STEP': {
      const prevStep = getPreviousStep(state.currentStep);
      return prevStep ? { ...state, currentStep: prevStep } : state;
    }
    
    case 'SUBMIT_PAYMENT':
      return {
        ...state,
        paymentData: event.data,
        currentStep: 'success'
      };
    
    case 'BOOKING_ERROR':
      return {
        ...state,
        error: event.error,
        currentStep: 'error'
      };
    
    case 'RESET_BOOKING':
      return {
        currentStep: 'idle',
        vehicleData: undefined,
        selectedServices: undefined,
        selectedAddons: undefined,
        scheduleData: undefined,
        paymentData: undefined,
        customerData: undefined,
        error: undefined
      };
    
    default:
      return state;
  }
};

// Initial booking state
export const initialBookingState: BookingContext = {
  currentStep: 'idle'
};

// Helper functions
export const getNextStep = (currentStep: BookingState): BookingState | null => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : null;
};

export const getPreviousStep = (currentStep: BookingState): BookingState | null => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : null;
};

export const getStepNumber = (step: BookingState): number => {
  return STEP_ORDER.indexOf(step) + 1;
};

export const getTotalSteps = (): number => {
  return STEP_ORDER.length;
};