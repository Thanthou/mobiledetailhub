import { z } from 'zod';

// Header configuration schema
export const headerConfigSchema = z.object({
  logo_url: z.url().optional(),
  header_display: z.string().optional(),
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  tiktok: z.url().optional(),
  youtube: z.url().optional(),
});

// Navigation link schema
export const navLinkSchema = z.object({
  name: z.string().min(1),
  href: z.string().min(1),
  isFAQ: z.boolean().optional(),
});

// Social media configuration schema
export const socialMediaConfigSchema = z.object({
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  tiktok: z.url().optional(),
  youtube: z.url().optional(),
});

// Export types
export type HeaderConfig = z.infer<typeof headerConfigSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type SocialMediaConfig = z.infer<typeof socialMediaConfigSchema>;
