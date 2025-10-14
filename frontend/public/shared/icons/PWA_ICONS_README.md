# PWA Icons Guide

## Required Icons for "Add to Home Screen"

The PWA (Progressive Web App) functionality requires icons in specific sizes for different platforms.

### Icon Sizes Needed:

1. **192x192** - Android home screen
2. **512x512** - Android splash screen
3. **512x512 (maskable)** - Android adaptive icon
4. **180x180** - iOS home screen (apple-touch-icon)

### How to Generate Icons:

#### Option 1: From Business Logo (Automated - Future)
The system will automatically generate these from the tenant's uploaded logo.

#### Option 2: Default Fallback Icons (Current)
Place default icons in this directory:
- `default-dashboard-icon-192.png` (192x192)
- `default-dashboard-icon-512.png` (512x512)
- `default-dashboard-icon-maskable.png` (512x512 with safe zone)

#### Option 3: Quick Generation
Use a tool like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- Figma/Photoshop with templates

### Design Guidelines:

#### Standard Icon (192x192, 512x512):
- Square canvas
- Logo centered
- Background color (brand color or solid)
- No text (logo only)
- High contrast

#### Maskable Icon (512x512):
- Logo in center 80% safe zone
- Padding on all sides (at least 10%)
- Background extends to edges
- Works when cropped to circle/square/squircle

### Current Setup:

The manifest generator (`backend/routes/tenantManifest.js`) serves:
- Tenant's logo if available (`tenant.logo_url`)
- Falls back to default icons in this directory

### Testing:

1. **Android Chrome**:
   - Open site on mobile
   - Menu → "Add to Home Screen"
   - Check icon appearance

2. **iOS Safari**:
   - Open site on mobile
   - Share → "Add to Home Screen"
   - Check icon appearance

3. **Desktop PWA**:
   - Chrome → Menu → "Install [App Name]"
   - Check taskbar/dock icon

### Example Icon Structure:

```
frontend/public/shared/icons/
├── default-dashboard-icon-192.png
├── default-dashboard-icon-512.png
├── default-dashboard-icon-maskable.png
├── dashboard-shortcut.png (96x96)
└── website-shortcut.png (96x96)
```

### Quick Starter Icons:

For now, you can use the platform logo (`/shared/icons/logo.png`) as a temporary solution.
The system will automatically serve it in the correct sizes.

### Future Enhancement:

When implementing icon generation:
1. Upload business logo
2. System auto-generates all required sizes
3. Stores in `/uploads/tenant-icons/{slug}/`
4. Manifest serves tenant-specific icons

