// Booking state management exports
export type { BookingContext, BookingEvent, BookingState } from './bookingMachine';
export { 
  bookingReducer, 
  getNextStep, 
  getPreviousStep, 
  getStepNumber, 
  getTotalSteps, 
  initialBookingState 
} from './bookingMachine';
