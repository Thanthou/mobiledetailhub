import { z } from 'zod';

// Footer configuration schema
export const footerConfigSchema = z.object({
  phone: z.string().optional(),
  email: z.email().optional(),
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  tiktok: z.url().optional(),
  youtube: z.url().optional(),
  base_location: z.object({
    city: z.string().optional(),
    state_name: z.string().optional(),
  }).optional(),
  name: z.string().optional(),
});

// Service area schema
export const serviceAreaSchema = z.object({
  city: z.string(),
  state: z.string(),
  primary: z.boolean().optional(),
});

// Quick link schema
export const quickLinkSchema = z.object({
  name: z.string().min(1),
  href: z.string().min(1),
});

// Social media configuration schema
export const socialMediaConfigSchema = z.object({
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  tiktok: z.url().optional(),
  youtube: z.url().optional(),
});

// Footer props schema
export const footerPropsSchema = z.object({
  onRequestQuote: z.function(),
  onBookNow: z.function().optional(),
  onQuoteHover: z.function().optional(),
});

// Export types
export type FooterConfig = z.infer<typeof footerConfigSchema>;
export type ServiceArea = z.infer<typeof serviceAreaSchema>;
export type QuickLink = z.infer<typeof quickLinkSchema>;
export type SocialMediaConfig = z.infer<typeof socialMediaConfigSchema>;
export type FooterProps = z.infer<typeof footerPropsSchema>;
