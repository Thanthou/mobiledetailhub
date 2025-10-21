import React from 'react';

// Import the actual tenant onboarding component
import TenantApplicationPage from '@admin-app/components/tenantOnboarding/components/TenantApplicationPage';

export function TenantOnboardingPage() {
  // The TenantApplicationPage is a complete onboarding flow
  // with its own header, steps, and layout
  return <TenantApplicationPage />;
}
