// Quote validation schemas and types
import { z } from 'zod';

// Quote request schema
export const quoteRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
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

// Quote update schema
export const quoteUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  estimatedPrice: z.number().optional(),
  estimatedDuration: z.number().optional()
});

// Quote response schema
export const quoteResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  vehicleType: z.string(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.string(),
  services: z.array(z.string()),
  message: z.string().optional(),
  location: z.string(),
  businessSlug: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  createdAt: z.string(),
  updatedAt: z.string(),
  estimatedPrice: z.number().optional(),
  estimatedDuration: z.number().optional(),
  notes: z.string().optional()
});

// Quote list query schema
export const quoteListQuerySchema = z.object({
  business_slug: z.string().optional(),
  user_id: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0)
});

// Quote cancellation schema
export const quoteCancellationSchema = z.object({
  reason: z.string().optional(),
  notes: z.string().optional()
});

// Export types
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type QuoteUpdate = z.infer<typeof quoteUpdateSchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
export type QuoteListQuery = z.infer<typeof quoteListQuerySchema>;
export type QuoteCancellation = z.infer<typeof quoteCancellationSchema>;

// Quote status enum
export const QuoteStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type QuoteStatusType = typeof QuoteStatus[keyof typeof QuoteStatus];

// Component prop types
export interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Form data type
export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  services: string[];
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor?: string;
  vehicleLength?: string;
  message?: string;
}

// Service area type
export interface ServiceArea {
  city: string;
  state: string;
  primary?: boolean;
}
