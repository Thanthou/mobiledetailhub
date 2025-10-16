/**
 * Gallery API Layer
 * Handles all gallery-related API calls
 */

import { GalleryImage } from '@/shared/types/gallery';

const GALLERY_DATA_URL = '/mobile-detailing/data/gallery.json';

// Type guard to ensure we have a valid GalleryImage
const isValidGalleryImage = (item: unknown): item is GalleryImage => {
  return typeof item === 'object' && item !== null && 'src' in item && 'tags' in item;
};

export interface GalleryApiResponse {
  success: boolean;
  data: GalleryImage[];
  error?: string;
}

export const galleryApi = {
  /**
   * Fetch gallery images
   */
  getGalleryImages: async (): Promise<GalleryImage[]> => {
    try {
      const response = await fetch(GALLERY_DATA_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery data: ${response.status}`);
      }
      
      const data = await response.json() as GalleryImage[];
      return data;
    } catch (error) {
      console.error('Gallery API Error:', error);
      throw new Error(`Failed to load gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get random gallery images for background rotation
   */
  getRandomGalleryImages: async (count: number = 5): Promise<GalleryImage[]> => {
    try {
      // Call the getGalleryImages function directly to avoid circular reference
      const response = await fetch(GALLERY_DATA_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery data: ${response.status}`);
      }
      
      const allImages = await response.json() as GalleryImage[];
      
      // Filter out images that might be used for avatars (you can customize this logic)
      const backgroundImages = allImages.filter((img) => {
        if (!isValidGalleryImage(img)) return false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- TypeScript type inference issue with GalleryImage interface
        const src = img.src.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- TypeScript type inference issue with GalleryImage interface
        return !src.includes('avatar') && !src.includes('profile');
      });
      
      // Shuffle and take the requested count
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TypeScript type inference issue with filter result
      const shuffled = [...backgroundImages].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    } catch (error) {
      console.error('Random Gallery API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load random gallery images: ${errorMessage}`);
    }
  },

  /**
   * Get gallery images for a specific category
   */
  getGalleryImagesByCategory: async (category: string): Promise<GalleryImage[]> => {
    try {
      // Call the getGalleryImages function directly to avoid circular reference
      const response = await fetch(GALLERY_DATA_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery data: ${response.status}`);
      }
      
      const allImages = await response.json() as GalleryImage[];
      return allImages.filter((img) => {
        if (!isValidGalleryImage(img)) return false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- TypeScript type inference issue with GalleryImage interface
        return img.tags.some((tag: string) => tag.toLowerCase().includes(category.toLowerCase()));
      });
    } catch (error) {
      console.error('Gallery Category API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load gallery images for category ${category}: ${errorMessage}`);
    }
  },

  /**
   * Get featured gallery images
   */
  getFeaturedGalleryImages: async (): Promise<GalleryImage[]> => {
    try {
      const allImages = await galleryApi.getGalleryImages();
      // For now, return all images since there's no featured property
      // In the future, you could add a featured property to the data or use tags
      return allImages;
    } catch (error) {
      console.error('Featured Gallery API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to load featured gallery images: ${errorMessage}`);
    }
  }
};
