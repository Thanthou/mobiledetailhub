import { z } from 'zod';

export const baseLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits')
});

export const uploadFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string().url()
});

export const affiliateApplicationSchema = z.object({
  legal_name: z.string().min(2, 'Legal business name is required'),
  business_name: z.string().min(2, 'Business name is required'),
  business_phone: z.string().min(10, 'Business phone is required'),
  business_email: z.string().email('Valid business email is required'),
  base_location: baseLocationSchema,
  service_categories: z.array(z.string()).min(1, 'At least one service category is required'),
  social_media: z.object({
    instagram: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal(''))
  }).optional(),
  proof_of_work_type: z.enum(['social_media', 'file_upload']),
  uploaded_files: z.array(uploadFileSchema).optional(),
  has_insurance: z.boolean().refine(val => val, 'Insurance confirmation is required'),
  accepts_terms: z.boolean().refine(val => val, 'Terms acceptance is required'),
  accepts_notifications: z.boolean().refine(val => val, 'Notification consent is required'),
  referral_source: z.string().min(1, 'Referral source is required'),
  notes: z.string().optional()
});

export const draftApplicationSchema = affiliateApplicationSchema.partial();

export const fileUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required').max(3, 'Maximum 3 files allowed'),
  applicationId: z.string().optional()
});

export const businessNameValidationSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  isAvailable: z.boolean(),
  suggestions: z.array(z.string()).optional()
});

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

export const applicationStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'needs_changes']),
  submittedAt: z.string(),
  reviewedAt: z.string().optional(),
  notes: z.string().optional(),
  nextSteps: z.array(z.string()).optional()
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'needs_changes']).optional(),
  notes: z.string().optional(),
  reviewerNotes: z.string().optional()
});

export type BaseLocation = z.infer<typeof baseLocationSchema>;
export type UploadFile = z.infer<typeof uploadFileSchema>;
export type AffiliateApplication = z.infer<typeof affiliateApplicationSchema>;
export type DraftApplication = z.infer<typeof draftApplicationSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type BusinessNameValidation = z.infer<typeof businessNameValidationSchema>;
export type ServiceAreas = z.infer<typeof serviceAreasSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;

export const ApplicationStatusEnum = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_CHANGES: 'needs_changes'
} as const;

export type ApplicationStatusType = typeof ApplicationStatusEnum[keyof typeof ApplicationStatusEnum];

export const ServiceCategories = {
  AUTO: 'auto',
  BOAT: 'boat',
  RV: 'rv',
  PPF: 'ppf',
  CERAMIC: 'ceramic',
  PAINT_CORRECTION: 'paint_correction'
} as const;

export type ServiceCategoryType = typeof ServiceCategories[keyof typeof ServiceCategories];

export const ProofOfWorkType = {
  SOCIAL_MEDIA: 'social_media',
  FILE_UPLOAD: 'file_upload'
} as const;

export type ProofOfWorkTypeType = typeof ProofOfWorkType[keyof typeof ProofOfWorkType];


