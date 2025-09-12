// Booking-specific API calls
import { apiService } from '@/shared/api/api';

export const bookingApi = {
  // Submit a quote request
  submitQuoteRequest: async (quoteData: {
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    services: string[];
    message: string;
    location: string;
    businessSlug?: string;
  }) => {
    return await apiService.submitQuoteRequest(quoteData);
  },

  // Get available time slots
  getAvailableTimeSlots: async (date: string, serviceId: string) => {
    // TODO: Implement actual API call
    console.log('Getting time slots for date:', date, 'service:', serviceId);
    return Promise.resolve([]);
  },

  // Create a booking
  createBooking: async (bookingData: {
    customerId: string;
    serviceId: string;
    date: string;
    time: string;
    location: string;
    notes?: string;
  }) => {
    // TODO: Implement actual API call
    console.log('Creating booking:', bookingData);
    return Promise.resolve(null);
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string) => {
    // TODO: Implement actual API call
    console.log('Updating booking status:', bookingId, 'to:', status);
    return Promise.resolve(null);
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, reason?: string) => {
    // TODO: Implement actual API call
    console.log('Cancelling booking:', bookingId, 'reason:', reason);
    return Promise.resolve(null);
  }
};
