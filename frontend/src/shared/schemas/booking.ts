import { z } from 'zod';

/**
 * Zod schemas for booking data validation
 */

// Feature schema
export const FeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  explanation: z.string(),
  image: z.string(),
  duration: z.number(),
  features: z.array(z.string())
});

// Service schema
export const ServiceSchema = z.object({
  cost: z.number(),
  features: z.array(z.string()),
  popular: z.boolean().optional(),
  description: z.string().optional()
});

// Service tier schema
export const ServiceTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.array(z.string()),
  featureIds: z.array(z.string()),
  popular: z.boolean().optional()
});

// Addon schema
export const AddonSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.array(z.string()),
  featureIds: z.array(z.string()),
  popular: z.boolean().optional()
});

// Vehicle details schema
export const VehicleDetailsSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.string(),
  color: z.string(),
  length: z.string()
});

// Schedule schema
export const ScheduleSchema = z.object({
  date: z.string(),
  time: z.string()
});

// Booking data schema
export const BookingDataSchema = z.object({
  vehicle: z.string(),
  vehicleDetails: VehicleDetailsSchema,
  serviceTier: z.string(),
  addons: z.array(z.string()),
  schedule: ScheduleSchema,
  paymentMethod: z.string()
});

// Booking state schema
export const BookingStateSchema = z.object({
  currentStep: z.enum(['vehicle-selection', 'service-tier', 'addons', 'schedule', 'payment']),
  bookingData: BookingDataSchema,
  completedSteps: z.array(z.string()),
  isLoading: z.boolean(),
  errors: z.array(z.string())
});

// Type exports
export type Feature = z.infer<typeof FeatureSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type ServiceTier = z.infer<typeof ServiceTierSchema>;
export type Addon = z.infer<typeof AddonSchema>;
export type VehicleDetails = z.infer<typeof VehicleDetailsSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type BookingData = z.infer<typeof BookingDataSchema>;
export type BookingState = z.infer<typeof BookingStateSchema>;

// Validation helpers
export const validateServiceTier = (data: unknown): ServiceTier => {
  return ServiceTierSchema.parse(data);
};

export const validateAddon = (data: unknown): Addon => {
  return AddonSchema.parse(data);
};

export const validateBookingData = (data: unknown): BookingData => {
  return BookingDataSchema.parse(data);
};

export const validateServiceTiers = (data: unknown[]): ServiceTier[] => {
  return z.array(ServiceTierSchema).parse(data);
};

export const validateAddons = (data: unknown[]): Addon[] => {
  return z.array(AddonSchema).parse(data);
};
