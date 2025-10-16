/**
 * Tests for useSEO hook - SEO metadata management
 */

import { renderHook } from '@testing-library/react';
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import { useSEO } from '../useSEO';

// Mock the dependencies
vi.mock('../useBrowserTab', () => ({
  useBrowserTab: vi.fn()
}));

vi.mock('../useMetaTags', () => ({
  useMetaTags: vi.fn()
}));

import { useBrowserTab } from '../useBrowserTab';
import { useMetaTags } from '../useMetaTags';

const mockUseBrowserTab = vi.mocked(useBrowserTab);
const mockUseMetaTags = vi.mocked(useMetaTags);

describe('useSEO', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseBrowserTab.mockReturnValue(undefined);
    mockUseMetaTags.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call useBrowserTab and useMetaTags with default options', () => {
    renderHook(() => useSEO());

    expect(mockUseBrowserTab).toHaveBeenCalledWith({
      title: undefined,
      favicon: undefined
    });
    
    expect(mockUseMetaTags).toHaveBeenCalledWith({
      title: undefined,
      description: undefined,
      keywords: undefined,
      ogImage: undefined,
      twitterImage: undefined,
      canonicalPath: undefined
    });
  });

  it('should pass custom options to both hooks', () => {
    const options = {
      title: 'Custom Title',
      favicon: '/custom-favicon.ico',
      description: 'Custom description',
      keywords: ['keyword1', 'keyword2'],
      ogImage: '/custom-og.jpg',
      twitterImage: '/custom-twitter.jpg',
      canonicalPath: '/custom-path'
    };

    renderHook(() => useSEO(options));

    expect(mockUseBrowserTab).toHaveBeenCalledWith({
      title: 'Custom Title',
      favicon: '/custom-favicon.ico'
    });
    
    expect(mockUseMetaTags).toHaveBeenCalledWith({
      title: 'Custom Title',
      description: 'Custom description',
      keywords: ['keyword1', 'keyword2'],
      ogImage: '/custom-og.jpg',
      twitterImage: '/custom-twitter.jpg',
      canonicalPath: '/custom-path'
    });
  });

  it('should skip browser tab updates when skipBrowserTab is true', () => {
    renderHook(() => useSEO({ 
      title: 'Custom Title',
      skipBrowserTab: true 
    }));

    expect(mockUseBrowserTab).not.toHaveBeenCalled();
    expect(mockUseMetaTags).toHaveBeenCalledWith({
      title: 'Custom Title',
      description: undefined,
      keywords: undefined,
      ogImage: undefined,
      twitterImage: undefined,
      canonicalPath: undefined
    });
  });

  it('should skip meta tag updates when skipMetaTags is true', () => {
    renderHook(() => useSEO({ 
      description: 'Custom description',
      skipMetaTags: true 
    }));

    expect(mockUseBrowserTab).toHaveBeenCalledWith({
      title: undefined,
      favicon: undefined
    });
    expect(mockUseMetaTags).not.toHaveBeenCalled();
  });

  it('should skip both when both skip flags are true', () => {
    renderHook(() => useSEO({ 
      title: 'Custom Title',
      description: 'Custom description',
      skipBrowserTab: true,
      skipMetaTags: true
    }));

    expect(mockUseBrowserTab).not.toHaveBeenCalled();
    expect(mockUseMetaTags).not.toHaveBeenCalled();
  });

  it('should handle empty options object', () => {
    renderHook(() => useSEO({}));

    expect(mockUseBrowserTab).toHaveBeenCalledWith({
      title: undefined,
      favicon: undefined
    });
    
    expect(mockUseMetaTags).toHaveBeenCalledWith({
      title: undefined,
      description: undefined,
      keywords: undefined,
      ogImage: undefined,
      twitterImage: undefined,
      canonicalPath: undefined
    });
  });

  it('should handle partial options', () => {
    const options = {
      title: 'Only Title',
      description: 'Only Description'
    };

    renderHook(() => useSEO(options));

    expect(mockUseBrowserTab).toHaveBeenCalledWith({
      title: 'Only Title',
      favicon: undefined
    });
    
    expect(mockUseMetaTags).toHaveBeenCalledWith({
      title: 'Only Title',
      description: 'Only Description',
      keywords: undefined,
      ogImage: undefined,
      twitterImage: undefined,
      canonicalPath: undefined
    });
  });

  it('should return undefined (no return value)', () => {
    const { result } = renderHook(() => useSEO());
    expect(result.current).toBeUndefined();
  });
});
