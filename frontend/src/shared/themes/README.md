# Theme System

Centralized color themes for tenant sites. Each theme defines a cohesive color palette that can be applied to any industry.

## Available Themes

### Sunset
**File:** `sunset.json`  
**Best for:** Automotive, detailing, construction, active services  
**Colors:** Warm orange primary on dark gray background

```
Primary: #f97316 (orange-500)
Background: #111827 (gray-900)
Text: #ffffff (white)
```

### House Cleaning
**File:** `housecleaning.json`  
**Best for:** Cleaning services, maid service, spa - trustworthy, professional  
**Colors:** Fresh cyan/sky blue - calm, clean, professional

```
Primary: #0ea5e9 (sky-500)
Background: #0f172a (slate-950)
Text: #ffffff (white)
```

### Eco-Friendly
**File:** `ecofriendly.json`  
**Best for:** Green cleaning, organic services, eco-conscious brands  
**Colors:** Fresh sage green - natural, sustainable, eco-friendly

```
Primary: #10b981 (emerald-500)
Background: #0f172a (slate-950)  
Text: #ffffff (white)
Text muted: #d1fae5 (emerald-100) ← Light green tint
```

### Premium
**File:** `premium.json`  
**Best for:** Luxury services, spa, high-end cleaning, upscale positioning  
**Colors:** Elegant violet/purple - sophisticated, memorable, premium

```
Primary: #8b5cf6 (violet-500)
Background: #0f172a (slate-950)
Text: #ffffff (white)
Text muted: #e9d5ff (violet-100) ← Light purple tint
```

## Theme Structure

Each theme file contains:

```json
{
  "name": "theme-slug",
  "displayName": "Theme Name",
  "description": "When to use this theme",
  
  "colors": {
    // Hex/RGBA values for CSS variables
    "primary": "#hex",
    "background": "#hex",
    // ... more colors
  },
  
  "tailwind": {
    // Tailwind class equivalents (for reference)
    "primary": "orange-500",
    "background": "gray-900"
  }
}
```

## Usage

### In Industry Configs

Reference a theme in your industry config:

```json
// mobile-detailing/index.ts or config
{
  "theme": "sunset",
  // ... rest of config
}
```

### Applying Themes

The theme loader will:
1. Load the theme JSON
2. Apply CSS variables to `:root`
3. Enable Tailwind utilities like `bg-primary`, `text-primary`, etc.

## Creating New Themes

1. Copy `sunset.json` as a template
2. Update colors to match your vision
3. Test across components
4. Document which industries use it

## Future: Tenant Customization

Eventually, tenants can override theme colors:
- Custom primary color
- Custom accent color
- Logo-based color extraction

