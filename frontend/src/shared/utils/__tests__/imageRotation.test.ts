/**
 * Tests for Image Rotation Utilities
 */

import {
  getNextImageIndex,
  getPreviousImageIndex,
  getTransitionDuration,
  getImageOpacityClasses,
  getVisibleImageIndices,
  validateImageRotationConfig,
  getAccessibilityAttributes
} from '../imageRotation';

describe('Image Rotation Utilities', () => {
  describe('getNextImageIndex', () => {
    it('should return next index in sequence', () => {
      expect(getNextImageIndex(0, 5)).toBe(1);
      expect(getNextImageIndex(2, 5)).toBe(3);
    });

    it('should wrap to first index when at end', () => {
      expect(getNextImageIndex(4, 5)).toBe(0);
    });

    it('should handle single image', () => {
      expect(getNextImageIndex(0, 1)).toBe(0);
    });
  });

  describe('getPreviousImageIndex', () => {
    it('should return previous index in sequence', () => {
      expect(getPreviousImageIndex(2, 5)).toBe(1);
      expect(getPreviousImageIndex(4, 5)).toBe(3);
    });

    it('should wrap to last index when at beginning', () => {
      expect(getPreviousImageIndex(0, 5)).toBe(4);
    });

    it('should handle single image', () => {
      expect(getPreviousImageIndex(0, 1)).toBe(0);
    });
  });

  describe('getTransitionDuration', () => {
    it('should format duration correctly', () => {
      expect(getTransitionDuration(2000)).toBe('2000ms');
      expect(getTransitionDuration(500)).toBe('500ms');
    });
  });

  describe('getImageOpacityClasses', () => {
    it('should return active classes for current image', () => {
      const classes = getImageOpacityClasses(2, 2, 1500);
      expect(classes).toContain('opacity-100');
      expect(classes).toContain('transition-opacity');
      expect(classes).toContain('duration-[1500ms]');
    });

    it('should return inactive classes for non-current image', () => {
      const classes = getImageOpacityClasses(1, 2, 1500);
      expect(classes).toContain('opacity-0');
      expect(classes).toContain('transition-opacity');
    });
  });

  describe('getVisibleImageIndices', () => {
    it('should return current index for single image', () => {
      expect(getVisibleImageIndices(0, 1, true)).toEqual([0]);
    });

    it('should return current and next indices for multiple images', () => {
      expect(getVisibleImageIndices(2, 5, true)).toEqual([2, 3]);
    });

    it('should wrap next index when at end', () => {
      expect(getVisibleImageIndices(4, 5, true)).toEqual([4, 0]);
    });

    it('should only return current index when preloadNext is false', () => {
      expect(getVisibleImageIndices(2, 5, false)).toEqual([2]);
    });
  });

  describe('validateImageRotationConfig', () => {
    it('should validate correct configuration', () => {
      const config = {
        images: ['image1.jpg', 'image2.jpg'],
        autoRotate: true,
        interval: 5000,
        fadeDuration: 1000
      };
      
      const result = validateImageRotationConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty images array', () => {
      const config = {
        images: [],
        autoRotate: true
      };
      
      const result = validateImageRotationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Images array cannot be empty');
    });

    it('should reject short interval', () => {
      const config = {
        images: ['image1.jpg'],
        interval: 500
      };
      
      const result = validateImageRotationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Interval should be at least 1000ms for better UX');
    });

    it('should reject short fade duration', () => {
      const config = {
        images: ['image1.jpg'],
        fadeDuration: 50
      };
      
      const result = validateImageRotationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fade duration should be at least 100ms');
    });
  });

  describe('getAccessibilityAttributes', () => {
    it('should return correct accessibility attributes', () => {
      const attrs = getAccessibilityAttributes(2, 5, true);
      
      expect(attrs.role).toBe('img');
      expect(attrs['aria-label']).toBe('Image 3 of 5');
      expect(attrs['aria-live']).toBe('polite');
      expect(attrs['aria-atomic']).toBe(true);
    });

    it('should set aria-live to off when not auto-rotating', () => {
      const attrs = getAccessibilityAttributes(1, 3, false);
      expect(attrs['aria-live']).toBe('off');
    });
  });
});
