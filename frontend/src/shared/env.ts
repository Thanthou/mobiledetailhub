import { z } from "zod";

const EnvSchema = z.object({
  // Vite built-in variables
  MODE: z.enum(["development", "production", "test"]),
  DEV: z.boolean(),
  PROD: z.boolean(),
  
  // API Configuration
  VITE_API_URL: z.url().optional(),
  VITE_API_URL_LOCAL: z.url().optional(),
  VITE_API_URL_LIVE: z.url().optional(),
  
  // Add other VITE_* variables you use
});

export const env = EnvSchema.parse(import.meta.env);