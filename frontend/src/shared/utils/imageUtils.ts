/**
 * Utility functions for responsive images
 */

/**
 * Generate srcset from a base URL by detecting common patterns
 * Supports URLs like:
 * - /images/hero-1280.jpg -> /images/hero-640.jpg, /images/hero-1920.jpg
 * - /images/hero.jpg -> /images/hero-640.jpg, /images/hero-960.jpg (explicit widths)
 * 
 * @param baseUrl - The base image URL
 * @param widths - Optional array of widths to generate (defaults to common sizes)
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [640, 750, 828, 1080, 1280, 1920, 2048, 3840]
): string | undefined {
  const { base, ext, query } = splitUrl(baseUrl);
  
  if (!ext) {
    // No extension found, return undefined (use src only)
    return undefined;
  }
  
  // Check if URL already has a size suffix pattern (e.g., -1280)
  const sizePattern = /-(\d{3,4})$/;
  const match = base.match(sizePattern);
  
  // Only generate srcset if URL already has a size suffix
  // This prevents generating invalid URLs for images that don't follow the pattern
  if (!match || !match[1]) {
    return undefined;
  }
  
  // URL already has size suffix - strip it and filter to relevant sizes
  const currentSize = parseInt(match[1], 10);
  const baseWithoutSize = base.replace(sizePattern, '');
  // Only include sizes up to and slightly beyond the current size
  const relevantSizes = widths.filter(s => s <= currentSize * 1.5);
  
  // Generate srcset string
  return relevantSizes
    .map(size => `${baseWithoutSize}-${size}${ext}${query} ${size}w`)
    .join(', ');
}

/**
 * Convert a JPG/PNG/WebP srcset to AVIF by switching the extension in each URL.
 * If the original URLs already have ".avif", returns them unchanged.
 */
export function toAvif(srcset: string): string {
  return swapExtInSrcset(srcset, 'avif');
}

/**
 * Convert a JPG/PNG/AVIF srcset to WebP by switching the extension in each URL.
 */
export function toWebp(srcset: string): string {
  return swapExtInSrcset(srcset, 'webp');
}

/* -------------------- helpers -------------------- */

function splitUrl(input: string): { base: string; ext: string; query: string } {
  // Preserve query/hash
  const parts = input.split(/([?#].*)/);
  const path = parts[0] ?? '';
  const query = parts[1] ?? '';

  // Handle no-extension URLs (e.g., from a CDN) by treating entire path as base
  const lastDot = path.lastIndexOf('.');
  if (lastDot <= path.lastIndexOf('/')) {
    // no extension
    return { base: path, ext: '', query };
  }

  const base = path.substring(0, lastDot);
  const ext = path.substring(lastDot); // includes the dot, e.g. ".jpg"
  return { base, ext, query };
}

function swapExtInSrcset(srcset: string, newExt: 'avif' | 'webp'): string {
  return srcset
    .split(',')
    .map((entry) => {
      const parts = entry.trim().split(/\s+/); // url + "640w"
      const u = parts[0] ?? '';
      const w = parts[1] ?? '';
      
      if (!u) return entry;
      
      const { base, ext, query } = splitUrl(u);
      const current = ext.toLowerCase();
      // Only swap for common raster formats
      if (!current || current === `.${newExt}`) return `${u} ${w}`.trim();
      if (!/\.(jpe?g|png|webp|avif)$/i.test(current)) return `${u} ${w}`.trim();
      return `${base}.${newExt}${query} ${w}`.trim();
    })
    .join(', ');
}

/**
 * Get appropriate sizes attribute for hero images
 * Mobile-first approach with proper breakpoints
 */
export function getHeroImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 100vw';
}

/**
 * Get appropriate sizes attribute for card/grid images
 * Cards are typically:
 * - 100vw on mobile
 * - 50vw on tablet (2 columns)
 * - 33vw on desktop (3 columns)
 */
export function getCardImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Get appropriate sizes attribute for service images
 * Service images are typically:
 * - 100vw on mobile
 * - 50vw on tablet and up
 */
export function getServiceImageSizes(): string {
  return '(max-width: 768px) 100vw, 50vw';
}

