// Affiliate onboarding validation schemas
import { z } from 'zod';

// Base location schema
export const baseLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits')
});

// Upload file schema
export const uploadFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.url()
});

// Affiliate application schema
export const affiliateApplicationSchema = z.object({
  // Business identity
  legal_name: z.string().min(2, 'Legal business name is required'),
  business_name: z.string().min(2, 'Business name is required'),
  business_phone: z.string().min(10, 'Business phone is required'),
  business_email: z.email('Valid business email is required'),
  
  // Location
  base_location: baseLocationSchema,
  
  // Service categories
  service_categories: z.array(z.string()).min(1, 'At least one service category is required'),
  
  // Social media (optional)
  social_media: z.object({
    instagram: z.url().optional().or(z.literal('')),
    facebook: z.url().optional().or(z.literal('')),
    youtube: z.url().optional().or(z.literal('')),
    tiktok: z.url().optional().or(z.literal('')),
    website: z.url().optional().or(z.literal(''))
  }).optional(),
  
  // Proof of work
  proof_of_work_type: z.enum(['social_media', 'file_upload']),
  uploaded_files: z.array(uploadFileSchema).optional(),
  
  // Legal and terms
  has_insurance: z.boolean().refine(val => val, 'Insurance confirmation is required'),
  accepts_terms: z.boolean().refine(val => val, 'Terms acceptance is required'),
  accepts_notifications: z.boolean().refine(val => val, 'Notification consent is required'),
  referral_source: z.string().min(1, 'Referral source is required'),
  notes: z.string().optional()
});

// Draft application schema (partial)
export const draftApplicationSchema = affiliateApplicationSchema.partial();

// File upload schema
export const fileUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required').max(3, 'Maximum 3 files allowed'),
  applicationId: z.string().optional()
});

// Business name validation schema
export const businessNameValidationSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  isAvailable: z.boolean(),
  suggestions: z.array(z.string()).optional()
});

// Service areas schema
export const serviceAreasSchema = z.object({
  location: baseLocationSchema,
  areas: z.array(z.object({
    name: z.string(),
    radius: z.number(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    })
  }))
});

// Application status schema
export const applicationStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'needs_changes']),
  submittedAt: z.string(),
  reviewedAt: z.string().optional(),
  notes: z.string().optional(),
  nextSteps: z.array(z.string()).optional()
});

// Application update schema
export const applicationUpdateSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'needs_changes']).optional(),
  notes: z.string().optional(),
  reviewerNotes: z.string().optional()
});

// Export types
export type BaseLocation = z.infer<typeof baseLocationSchema>;
export type UploadFile = z.infer<typeof uploadFileSchema>;
export type AffiliateApplication = z.infer<typeof affiliateApplicationSchema>;
export type DraftApplication = z.infer<typeof draftApplicationSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type BusinessNameValidation = z.infer<typeof businessNameValidationSchema>;
export type ServiceAreas = z.infer<typeof serviceAreasSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;

// Application status enum
export const ApplicationStatusEnum = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_CHANGES: 'needs_changes'
} as const;

export type ApplicationStatusType = typeof ApplicationStatusEnum[keyof typeof ApplicationStatusEnum];

// Service categories enum
export const ServiceCategories = {
  AUTO: 'auto',
  BOAT: 'boat',
  RV: 'rv',
  PPF: 'ppf',
  CERAMIC: 'ceramic',
  PAINT_CORRECTION: 'paint_correction'
} as const;

export type ServiceCategoryType = typeof ServiceCategories[keyof typeof ServiceCategories];

// Proof of work types
export const ProofOfWorkType = {
  SOCIAL_MEDIA: 'social_media',
  FILE_UPLOAD: 'file_upload'
} as const;

export type ProofOfWorkTypeType = typeof ProofOfWorkType[keyof typeof ProofOfWorkType];
