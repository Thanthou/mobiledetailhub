import { z } from 'zod';

export const TenantConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.object({
    logo: z.string().optional(),
    theme: z.enum(['default', 'southwest', 'coastal']).default('default'),
  }).default({ theme: 'default' }),
  domains: z.array(z.string()),
  phones: z.object({
    main: z.string(),
    sms: z.string().optional(),
  }),
  email: z.string().email().optional(),
  socials: z.object({
    gbp: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
  }).default({}),
  analytics: z.object({
    ga4: z.string().optional(),
  }).default({}),
  serviceAreas: z.record(z.string(), z.array(z.string())),
  services: z.object({
    paintCorrection: z.boolean().default(false),
    ceramicCoating: z.boolean().default(false),
    ppf: z.boolean().default(false),
  }).default({ paintCorrection: false, ceramicCoating: false, ppf: false }),
  features: z.object({
    booking: z.boolean().default(false),
    login: z.boolean().default(false),
  }).default({ booking: false, login: false }),
});

export type TenantConfig = z.infer<typeof TenantConfigSchema>;
