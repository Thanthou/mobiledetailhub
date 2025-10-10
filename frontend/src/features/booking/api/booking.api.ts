import type { GalleryImage } from '@/shared/types';

/**
 * API client for booking-related data
 */

export async function getBookingGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await fetch('/mobile-detailing/data/gallery.json');
    if (!res.ok) {
      throw new Error(`Failed to fetch gallery data: ${res.status}`);
    }
    const data: unknown = await res.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Gallery data is not an array');
    }
    
    return data as GalleryImage[];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to load gallery images:', message);
    throw error;
  }
}

