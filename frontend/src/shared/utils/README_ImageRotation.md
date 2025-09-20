# Image Rotation Utilities

This utility provides reusable functions and hooks for creating image carousels with fade transitions, auto-rotation, and performance optimizations.

## Features

- ✅ **Fade transitions** between images
- ✅ **Auto-rotation** with configurable intervals
- ✅ **Performance optimization** (only renders visible images)
- ✅ **Image preloading** for smoother transitions
- ✅ **Hover pause** functionality
- ✅ **Accessibility** support
- ✅ **TypeScript** support
- ✅ **Navigation controls** (arrows, dots)

## Quick Start

### Using the Hook

```tsx
import { useImageRotation } from '@/shared/utils';

const MyCarousel = () => {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  
  const rotation = useImageRotation({
    images,
    autoRotate: true,
    interval: 5000,
    fadeDuration: 2000,
    preloadNext: true,
    pauseOnHover: true
  });

  return (
    <div className="relative h-64">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
            index === rotation.currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: '2000ms' }}
        />
      ))}
    </div>
  );
};
```

### Using the Component

```tsx
import { ImageCarousel } from '@/shared/utils';

const MyCarousel = () => {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

  return (
    <ImageCarousel
      images={images}
      autoRotate={true}
      interval={5000}
      fadeDuration={2000}
      showArrows={true}
      showDots={true}
      gradientOverlay={true}
      className="h-64"
    />
  );
};
```

## Configuration Options

### ImageRotationConfig

```typescript
interface ImageRotationConfig {
  images: string[];           // Required: Array of image URLs
  autoRotate?: boolean;       // Default: true
  interval?: number;          // Default: 7000ms
  fadeDuration?: number;      // Default: 2000ms
  preloadNext?: boolean;      // Default: true
  pauseOnHover?: boolean;     // Default: false
}
```

### ImageCarousel Props

```typescript
interface ImageCarouselProps extends ImageRotationConfig {
  className?: string;         // Container CSS class
  imageClassName?: string;    // Individual image CSS class
  altText?: string;          // Alt text template
  showDots?: boolean;        // Show navigation dots
  showArrows?: boolean;      // Show navigation arrows
  gradientOverlay?: boolean; // Show gradient overlay
  gradientClassName?: string; // Custom gradient classes
  decorative?: boolean;      // Images are decorative
}
```

## Utility Functions

### Core Functions

```typescript
// Calculate indices
getNextImageIndex(currentIndex, totalImages)
getPreviousImageIndex(currentIndex, totalImages)

// CSS utilities
getImageOpacityClasses(imageIndex, currentIndex, fadeDuration)
getTransitionStyles(durationMs)
getTransitionDuration(durationMs)

// Performance
getVisibleImageIndices(currentIndex, totalImages, preloadNext)
preloadImage(imageUrl)
preloadImages(imageUrls)

// Validation
validateImageRotationConfig(config)

// Accessibility
getAccessibilityAttributes(currentIndex, totalImages, autoRotate)
```

## Examples

### Hero Section Carousel

```tsx
import { useImageRotation } from '@/shared/utils';

const HeroCarousel = () => {
  const siteData = useSiteContext();
  const images = siteData.hero.images.map(img => img.url);
  
  const rotation = useImageRotation({
    images,
    autoRotate: true,
    interval: 7000,
    fadeDuration: 2000,
    preloadNext: true
  });

  return (
    <div className="absolute inset-0">
      {images.map((image, index) => {
        if (index !== rotation.currentIndex && 
            index !== rotation.nextIndex) return null;
        
        return (
          <img
            key={index}
            src={image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
              index === rotation.currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDuration: '2000ms' }}
            decoding={index === 0 ? 'sync' : 'async'}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
    </div>
  );
};
```

### Reviews Carousel

```tsx
import { ImageCarousel } from '@/shared/utils';

const ReviewsCarousel = ({ reviews }) => {
  const images = reviews.map(review => review.image);

  return (
    <ImageCarousel
      images={images}
      autoRotate={true}
      interval={4000}
      fadeDuration={1500}
      showDots={true}
      showArrows={true}
      pauseOnHover={true}
      className="h-96 rounded-lg"
      altText="Review image"
    />
  );
};
```

## Performance Tips

1. **Use preloadNext**: Enables smoother transitions
2. **Only render visible images**: The utility handles this automatically
3. **Set proper loading attributes**: First image eager, others lazy
4. **Use appropriate fade durations**: 1500-3000ms works well
5. **Validate configurations**: Use the validation function

## Accessibility

The utility automatically provides:
- `aria-label` with current position
- `aria-live` for auto-rotating carousels
- `role="img"` for screen readers
- Proper alt text support

## Migration from Existing Code

### Before (Hero ImageCarousel)

```tsx
// Old implementation
const { currentImage } = useImageCarousel({
  autoRotate,
  interval,
  images
});
```

### After (Using New Utility)

```tsx
// New implementation
const rotation = useImageRotation({
  images,
  autoRotate,
  interval,
  fadeDuration: 2000,
  preloadNext: true
});

const { currentIndex: currentImage } = rotation;
```

The new utility provides the same core functionality with additional features and better performance optimizations.
