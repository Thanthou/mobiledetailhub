import { z } from 'zod';

// Dashboard tab schema
export const dashboardTabSchema = z.enum([
  'overview',
  'schedule', 
  'customers',
  'performance',
  'services',
  'locations',
  'profile'
]);

// Detailer data schema
export const detailerDataSchema = z.object({
  business_name: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  services: z.array(z.string()),
  memberSince: z.string().min(1),
  bio: z.string().optional(),
});

// Dashboard metrics schema
export const dashboardMetricsSchema = z.object({
  dailyRevenue: z.number().min(0),
  weeklyRevenue: z.number().min(0),
  monthlyRevenue: z.number().min(0),
  totalAppointments: z.number().min(0),
  totalCustomers: z.number().min(0),
  averageRating: z.number().min(0).max(5),
});

// Appointment schema
export const appointmentSchema = z.object({
  id: z.string().min(1),
  customer: z.string().min(1),
  service: z.string().min(1),
  time: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(['confirmed', 'pending', 'cancelled']),
  duration: z.number().min(0),
  phone: z.string().optional(),
});

// Customer schema
export const customerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  lastVisit: z.string().min(1),
  totalSpent: z.number().min(0),
  visits: z.number().min(0),
  rating: z.number().min(0).max(5),
  status: z.enum(['active', 'inactive']),
  favoriteService: z.string().min(1),
});

// Service schema
export const serviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  duration: z.number().min(0),
  category: z.string().min(1),
  active: z.boolean(),
  popularity: z.number().min(0).max(100),
});

// Service area schema
export const serviceAreaSchema = z.object({
  id: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  primary: z.boolean().optional(),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  business_name: z.string().min(1).optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.email().optional(),
  phone: z.string().min(1).optional(),
  bio: z.string().optional(),
});

// Export types
export type DashboardTab = z.infer<typeof dashboardTabSchema>;
export type DetailerData = z.infer<typeof detailerDataSchema>;
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ServiceArea = z.infer<typeof serviceAreaSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
