# Booking Hero Images

**Note**: Currently using the main site hero images.

This directory is reserved for future booking-specific hero images.

## Current Setup

The booking flow currently loads images from:
- `/images/booking/hero-default/hero1.png`
- `/images/booking/hero-default/hero2.png`

## Future Booking Images (when implemented)

### Base Images (PNG format)
- `booking-hero1.png` - Primary booking hero image
- `booking-hero2.png` - Secondary booking hero image  
- `booking-hero3.png` - Tertiary booking hero image

### Optimized Formats (Optional but recommended)

#### AVIF Format (Best compression)
- `booking-hero1.avif`
- `booking-hero2.avif`
- `booking-hero3.avif`

#### WebP Format (Responsive sizes)
- `booking-hero1-sm.webp` (640w)
- `booking-hero1-md.webp` (1024w)
- `booking-hero1-lg.webp` (1920w)
- `booking-hero1-xl.webp` (2560w)
- `booking-hero2-sm.webp` (640w)
- `booking-hero2-md.webp` (1024w)
- `booking-hero2-lg.webp` (1920w)
- `booking-hero2-xl.webp` (2560w)
- `booking-hero3-sm.webp` (640w)
- `booking-hero3-md.webp` (1024w)
- `booking-hero3-lg.webp` (1920w)
- `booking-hero3-xl.webp` (2560w)

## Image Specifications

- **Dimensions**: 1920x1080 (16:9 aspect ratio)
- **Format**: PNG for base images, AVIF/WebP for optimized versions
- **Content**: Should be related to vehicle detailing, booking, or service selection
- **Style**: Should complement the booking flow UI and be distinct from main site hero images

## Suggested Content Themes

1. **Vehicle Selection**: Cars, trucks, boats, RVs in detailing context
2. **Service Process**: Before/after detailing shots, service in progress
3. **Professional Setup**: Clean work environment, professional equipment
4. **Customer Experience**: Happy customers, quality results

## Usage

These images are used in the `MultiStepHero` component and rotate every 6 seconds to create visual interest during the booking process.
