/**
 * Unit tests for assetLocator utility
 */

import { describe, expect,it } from 'vitest';

import {
  type AssetLocatorOptions as _AssetLocatorOptions,
  getTenantAssetUrl,
  getTenantAssetUrls,
  getTenantLogoUrls,
  hasFileExtension,
  normalizeAssetUrl,
} from '../assetLocator';

describe('assetLocator', () => {
  describe('getTenantAssetUrl', () => {
    it('should return vertical default when no tenantId provided', () => {
      const url = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'logo',
      });
      
      expect(url).toBe('/mobile-detailing/icons/logo.webp');
    });
    
    it('should return tenant upload URL when tenantId provided', () => {
      const url = getTenantAssetUrl({
        tenantId: 'jps',
        vertical: 'mobile-detailing',
        type: 'logo',
      });
      
      expect(url).toBe('/uploads/jps/icons/logo.webp');
    });
    
    it('should force vertical default when forceVerticalDefault is true', () => {
      const url = getTenantAssetUrl({
        tenantId: 'jps',
        vertical: 'mobile-detailing',
        type: 'logo',
        forceVerticalDefault: true,
      });
      
      expect(url).toBe('/mobile-detailing/icons/logo.webp');
    });
    
    it('should handle hero images correctly', () => {
      const url1 = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'hero-1',
      });
      
      const url2 = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'hero-2',
      });
      
      expect(url1).toBe('/mobile-detailing/hero/hero1.webp');
      expect(url2).toBe('/mobile-detailing/hero/hero2.webp');
    });
    
    it('should handle avatars with custom filename', () => {
      const url = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'avatar',
        filename: 'user-123.jpg',
      });
      
      expect(url).toBe('/uploads/avatars/user-123.jpg');
    });
    
    it('should respect custom extension', () => {
      const url = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'logo',
        extension: 'svg',
      });
      
      expect(url).toBe('/mobile-detailing/icons/logo.svg');
    });
    
    it('should use svg for favicon by default', () => {
      const url = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'favicon',
      });
      
      expect(url).toBe('/mobile-detailing/icons/favicon.svg');
    });
    
    it('should handle og-image and twitter-image', () => {
      const ogUrl = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'og-image',
      });
      
      const twitterUrl = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'twitter-image',
      });
      
      expect(ogUrl).toBe('/mobile-detailing/social/og-image.webp');
      expect(twitterUrl).toBe('/mobile-detailing/social/twitter-image.webp');
    });
    
    it('should preserve extension in custom filename', () => {
      const url = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'avatar',
        filename: 'user-photo.png',
      });
      
      expect(url).toBe('/uploads/avatars/user-photo.png');
    });
    
    it('should handle logo variants', () => {
      const darkUrl = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'logo-dark',
      });
      
      const lightUrl = getTenantAssetUrl({
        vertical: 'mobile-detailing',
        type: 'logo-light',
      });
      
      expect(darkUrl).toBe('/mobile-detailing/icons/logo-dark.webp');
      expect(lightUrl).toBe('/mobile-detailing/icons/logo-light.webp');
    });
    
    it('should skip tenant uploads when useTenantUploads is false', () => {
      const url = getTenantAssetUrl({
        tenantId: 'jps',
        vertical: 'mobile-detailing',
        type: 'logo',
        useTenantUploads: false,
      });
      
      expect(url).toBe('/mobile-detailing/icons/logo.webp');
    });
  });
  
  describe('getTenantAssetUrls', () => {
    it('should return multiple asset URLs', () => {
      const urls = getTenantAssetUrls({
        vertical: 'mobile-detailing',
        types: ['hero-1', 'hero-2', 'hero-3'],
      });
      
      expect(urls).toEqual([
        '/mobile-detailing/hero/hero1.webp',
        '/mobile-detailing/hero/hero2.webp',
        '/mobile-detailing/hero/hero3.webp',
      ]);
    });
    
    it('should apply tenant ID to all URLs', () => {
      const urls = getTenantAssetUrls({
        tenantId: 'jps',
        vertical: 'mobile-detailing',
        types: ['logo', 'hero-1'],
      });
      
      expect(urls).toEqual([
        '/uploads/jps/icons/logo.webp',
        '/uploads/jps/hero/hero1.webp',
      ]);
    });
  });
  
  describe('getTenantLogoUrls', () => {
    it('should return all logo variants', () => {
      const logos = getTenantLogoUrls({
        vertical: 'mobile-detailing',
      });
      
      expect(logos).toEqual({
        default: '/mobile-detailing/icons/logo.webp',
        dark: '/mobile-detailing/icons/logo-dark.webp',
        light: '/mobile-detailing/icons/logo-light.webp',
      });
    });
    
    it('should use tenant ID for all variants', () => {
      const logos = getTenantLogoUrls({
        tenantId: 'jps',
        vertical: 'mobile-detailing',
      });
      
      expect(logos).toEqual({
        default: '/uploads/jps/icons/logo.webp',
        dark: '/uploads/jps/icons/logo-dark.webp',
        light: '/uploads/jps/icons/logo-light.webp',
      });
    });
  });
  
  describe('hasFileExtension', () => {
    it('should return true for common image extensions', () => {
      expect(hasFileExtension('photo.jpg')).toBe(true);
      expect(hasFileExtension('logo.png')).toBe(true);
      expect(hasFileExtension('icon.svg')).toBe(true);
      expect(hasFileExtension('image.webp')).toBe(true);
      expect(hasFileExtension('favicon.ico')).toBe(true);
    });
    
    it('should return false for filenames without extension', () => {
      expect(hasFileExtension('photo')).toBe(false);
      expect(hasFileExtension('logo')).toBe(false);
    });
    
    it('should be case insensitive', () => {
      expect(hasFileExtension('photo.JPG')).toBe(true);
      expect(hasFileExtension('logo.PNG')).toBe(true);
    });
  });
  
  describe('normalizeAssetUrl', () => {
    it('should add leading slash if missing', () => {
      expect(normalizeAssetUrl('images/logo.png')).toBe('/images/logo.png');
    });
    
    it('should preserve leading slash', () => {
      expect(normalizeAssetUrl('/images/logo.png')).toBe('/images/logo.png');
    });
    
    it('should preserve absolute URLs', () => {
      expect(normalizeAssetUrl('https://cdn.example.com/logo.png'))
        .toBe('https://cdn.example.com/logo.png');
      expect(normalizeAssetUrl('http://example.com/logo.png'))
        .toBe('http://example.com/logo.png');
    });
    
    it('should handle empty strings', () => {
      expect(normalizeAssetUrl('')).toBe('');
    });
  });
});

