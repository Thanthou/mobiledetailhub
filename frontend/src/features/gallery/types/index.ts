// Gallery feature types
// GalleryImage and ImageVariant moved to @/shared/types/gallery.types.ts
export type { GalleryImage, ImageVariant } from '@/shared/types/gallery.types';

export interface GalleryProps {
  onRequestQuote?: () => void;
  locationData?: Record<string, unknown>;
}
