import { z } from 'zod';

// Coordinates schema
export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Location data schema
export const locationDataSchema = z.object({
  city: z.string().min(1),
  state: z.string().min(2).max(2), // State abbreviation
  zipCode: z.string().optional(),
  fullLocation: z.string().min(1),
  coordinates: coordinatesSchema.optional(),
});

// Search result schema
export const searchResultSchema = z.object({
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zipCode: z.string().optional(),
  coordinates: coordinatesSchema.optional(),
});

// Service area schema
export const serviceAreaSchema = z.object({
  id: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zipCode: z.string().optional(),
  fullLocation: z.string().min(1),
  primary: z.boolean().optional(),
  coordinates: coordinatesSchema.optional(),
});

// Location search props schema
export const locationSearchPropsSchema = z.object({
  placeholder: z.string().optional(),
  className: z.string().optional(),
  id: z.string().optional(),
  showIcon: z.boolean().optional(),
  buttonClassName: z.string().optional(),
  displayText: z.string().optional(),
  gapClassName: z.string().optional(),
});

// Location selector props schema
export const locationSelectorPropsSchema = z.object({
  locations: z.array(locationDataSchema),
  selectedLocation: locationDataSchema.optional(),
  placeholder: z.string().optional(),
  className: z.string().optional(),
});

// Export types
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type LocationData = z.infer<typeof locationDataSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type ServiceArea = z.infer<typeof serviceAreaSchema>;
export type LocationSearchProps = z.infer<typeof locationSearchPropsSchema>;
export type LocationSelectorProps = z.infer<typeof locationSelectorPropsSchema>;
