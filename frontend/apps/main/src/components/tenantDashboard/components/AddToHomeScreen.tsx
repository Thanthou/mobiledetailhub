/**
 * Add to Home Screen Component
 * Prompts users to install the PWA on mobile devices only
 * Works on iOS and Android mobile devices
 * Desktop and tablet users will not see this prompt
 */

/**
 * AddToHomeScreen Component - DISABLED FOR NOW
 * 
 * This component provides PWA "Add to Home Screen" functionality for tenant dashboards.
 * Moved from onboarding flow to dashboard where it makes more sense.
 * 
 * TODO: Enable this component in the tenant dashboard when ready.
 */

import React from 'react';

interface AddToHomeScreenProps {
  tenantSlug?: string;
  businessName?: string;
  onClose?: () => void;
  autoShow?: boolean;
}

export const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  tenantSlug: _tenantSlug,
  businessName: _businessName = 'Dashboard',
  onClose: _onClose,
  autoShow: _autoShow = true
}) => {
  // DISABLED FOR NOW - Component moved from onboarding to dashboard
  // TODO: Enable when ready to add PWA functionality to tenant dashboard
  return null;
};