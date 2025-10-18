# Shared Icons Directory

This directory contains shared icons used across all tenants/industries.

## Required Files

### Review Source Icons
- `google.png` - Google Reviews icon
- `yelp.png` - Yelp icon  
- `facebook.png` - Facebook icon
- `website.png` - Generic website/star icon for website reviews

## Specifications

- **Format**: PNG (with transparency) or SVG
- **Size**: 64x64px minimum (will be scaled down in UI)
- **Background**: Transparent or white
- **Naming**: Lowercase, matching the `reviewSource` values from the database

## Favicon Handling

**Note:** Favicons are now dynamically loaded from each tenant's logo. The favicon automatically matches the header logo, so you don't need to add separate favicon files here.

## Usage

Review source icons are referenced in:
- `ReviewCard.tsx` - Small icon (20x20px rendered)
- `ReviewModal.tsx` - Larger icon (32x32px rendered)

## Getting Icons

You can get official brand icons from:
- **Google**: [Google Brand Resources](https://about.google/brand-resource-center/)
- **Yelp**: [Yelp Brand Guide](https://www.yelp.com/brand)
- **Facebook**: [Facebook Brand Resources](https://about.meta.com/brand/resources/facebook/logo/)

## Fallback

If an icon is missing, the review card will show an empty space. Make sure all icons are present for the best user experience.

