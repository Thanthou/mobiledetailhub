/**
 * Gallery API Layer
 * Handles all gallery-related API calls
 */

import { GalleryImage } from '@/shared/types/gallery';

const GALLERY_DATA_URL = '/mobile-detailing/data/gallery.json';

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
      const allImages = await galleryApi.getGalleryImages();
      
      // Filter out images that might be used for avatars (you can customize this logic)
      const backgroundImages = allImages.filter(img => 
        !img.filename?.toLowerCase().includes('avatar') &&
        !img.filename?.toLowerCase().includes('profile')
      );
      
      // Shuffle and take the requested count
      const shuffled = [...backgroundImages].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    } catch (error) {
      console.error('Random Gallery API Error:', error);
      throw new Error(`Failed to load random gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get gallery images for a specific category
   */
  getGalleryImagesByCategory: async (category: string): Promise<GalleryImage[]> => {
    try {
      const allImages = await galleryApi.getGalleryImages();
      return allImages.filter(img => 
        img.category?.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Gallery Category API Error:', error);
      throw new Error(`Failed to load gallery images for category ${category}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get featured gallery images
   */
  getFeaturedGalleryImages: async (): Promise<GalleryImage[]> => {
    try {
      const allImages = await galleryApi.getGalleryImages();
      return allImages.filter(img => img.featured === true);
    } catch (error) {
      console.error('Featured Gallery API Error:', error);
      throw new Error(`Failed to load featured gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
