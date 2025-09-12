// Booking validation schemas
import { z } from 'zod';

// Quote request schema
export const quoteRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleYear: z.string().min(4, 'Vehicle year must be 4 digits'),
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  message: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  businessSlug: z.string().optional()
});

// Booking creation schema
export const bookingCreationSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional()
});

// Vehicle selection schema
export const vehicleSelectionSchema = z.object({
  type: z.string().min(1, 'Vehicle type is required'),
  make: z.string().min(1, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  year: z.string().min(4, 'Vehicle year must be 4 digits')
});

// Service selection schema
export const serviceSelectionSchema = z.object({
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  addons: z.array(z.string()).optional()
});

// Schedule selection schema
export const scheduleSelectionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(1, 'Duration must be at least 1 hour')
});

// Payment schema
export const paymentSchema = z.object({
  method: z.enum(['card', 'cash', 'check']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  billingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be at least 5 digits')
  }).optional()
});

// Export types
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type BookingCreation = z.infer<typeof bookingCreationSchema>;
export type VehicleSelection = z.infer<typeof vehicleSelectionSchema>;
export type ServiceSelection = z.infer<typeof serviceSelectionSchema>;
export type ScheduleSelection = z.infer<typeof scheduleSelectionSchema>;
export type Payment = z.infer<typeof paymentSchema>;
