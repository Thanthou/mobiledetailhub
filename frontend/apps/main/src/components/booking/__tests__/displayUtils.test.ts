import { describe, expect,it } from 'vitest';

import { formatPrice,getCardDescription } from '../utils/displayUtils';

describe('displayUtils', () => {
  describe('getCardDescription', () => {
    it('should return service description when available', () => {
      const serviceData = {
        description: 'Premium detailing service'
      };
      const featureKeys = ['feature1', 'feature2'];
      const featuresData = {};

      const result = getCardDescription(serviceData, featureKeys, featuresData);
      expect(result).toBe('Premium detailing service');
    });

    it('should generate description from feature names when no service description', () => {
      const serviceData = {};
      const featureKeys = ['feature1', 'feature2'];
      const featuresData = {
        feature1: { name: 'Wash' },
        feature2: { name: 'Wax' }
      };

      const result = getCardDescription(serviceData, featureKeys, featuresData);
      expect(result).toBe('Wash, Wax');
    });

    it('should truncate features when exceeding maxFeatures', () => {
      const serviceData = {};
      const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4'];
      const featuresData = {
        feature1: { name: 'Wash' },
        feature2: { name: 'Wax' },
        feature3: { name: 'Polish' },
        feature4: { name: 'Seal' }
      };

      const result = getCardDescription(serviceData, featureKeys, featuresData, 2);
      expect(result).toBe('Wash, Wax...');
    });

    it('should handle missing features gracefully', () => {
      const serviceData = {};
      const featureKeys = ['feature1', 'feature2'];
      const featuresData = {
        feature1: { name: 'Wash' }
        // feature2 is missing
      };

      const result = getCardDescription(serviceData, featureKeys, featuresData);
      expect(result).toBe('Wash, feature2');
    });

    it('should return fallback message when no features available', () => {
      const serviceData = {};
      const featureKeys: string[] = [];
      const featuresData = {};

      const result = getCardDescription(serviceData, featureKeys, featuresData);
      expect(result).toBe('No features available');
    });
  });

  describe('formatPrice', () => {
    it('should format price with 2 decimal places', () => {
      expect(formatPrice(123.45)).toBe('123.45');
      expect(formatPrice(100)).toBe('100.00');
      expect(formatPrice(0)).toBe('0.00');
    });

    it('should handle large numbers with commas', () => {
      expect(formatPrice(1234.56)).toBe('1,234.56');
      expect(formatPrice(1000000)).toBe('1,000,000.00');
    });
  });
});
