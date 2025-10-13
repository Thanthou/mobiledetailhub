# Tenant Onboarding

This directory contains the tenant onboarding system for Mobile Detail Hub.

## Structure

```
tenantOnboarding/
├── components/           # Reusable UI components
│   ├── ApplicationHeader.tsx      # Header with back button
│   ├── IdentityContactSection.tsx # Business identity and contact info
│   ├── OperatingBasicsSection.tsx # Service categories selection
│   ├── ProofOfWorkSection.tsx     # Social links or file uploads
│   ├── LegalTermsSection.tsx      # Terms, insurance, and source
│   ├── SuccessPage.tsx            # Success confirmation page
│   ├── SubmitSection.tsx          # Submit and save draft buttons
│   └── index.ts                   # Component exports
├── hooks/               # Custom React hooks
│   ├── useFileUpload.ts           # Handle file uploads and removal
│   ├── useFormHandlers.ts         # Form input change handlers
│   └── index.ts                   # Hook exports
├── api/                 # API functions
│   ├── api.ts           # Legacy API functions
│   └── onboarding.api.ts # New API functions
├── schemas/             # Zod validation schemas
│   └── onboarding.schemas.ts
├── types.ts             # TypeScript interfaces and constants
├── useLocalDraft.ts     # Local storage for draft saving
├── TenantApplicationPage.tsx   # Main page component
└── README.md            # This file
```

## Components

### ApplicationHeader
- Displays back button and title
- Shows saved indicator when draft is available

### IdentityContactSection
- Business name and primary contact
- Phone and email inputs
- Base location (city, state, ZIP)

### OperatingBasicsSection
- Service category checkboxes
- Auto, boat, RV, PPF, ceramic, paint correction

### ProofOfWorkSection
- Toggle between social links and file uploads
- Social media URL inputs
- File upload with drag & drop (max 3 images)

### LegalTermsSection
- Insurance confirmation
- Terms acceptance
- Notification consent
- Source selection
- Optional notes

### SuccessPage
- Application confirmation
- Summary display
- Navigation to dashboard or home

### SubmitSection
- Submit application button
- Save draft button
- Error message display

## Hooks

### useFileUpload
Manages file uploads, validation, and removal with proper state updates.

### useFormHandlers
Provides consistent input change handlers for both simple and nested form fields.

## Types

- `AffiliateApplication`: Main form data interface
- `BaseLocation`: Nested location object
- `UploadFile`: File metadata for uploads
- Constants: US states, service categories, referral sources

## Features

- **Auto-save**: Form data automatically saves to localStorage
- **File uploads**: Support for 2-3 work photos
- **Social links**: Alternative to file uploads for proof of work
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Type safety**: Full TypeScript coverage
- **Error handling**: Network and validation error display
- **Draft management**: Save and restore incomplete applications

## Usage

The main `TenantApplicationPage` component orchestrates all the pieces:

1. Loads existing draft on mount
2. Auto-saves form changes
3. Handles form submission
4. Shows success page on completion

Each section component receives only the props it needs, making them highly reusable and testable.
