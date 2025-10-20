import React, { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { AppShell } from '@shared/bootstrap';

interface TenantProvidersProps {
  children: React.ReactNode;
}

/**
 * Tenant app providers using the unified AppShell
 * Provides full context stack with SEO management for tenant sites
 * 
 * Preview routes skip tenant data fetching to avoid redirects
 */
export const TenantProviders: React.FC<TenantProvidersProps> = ({ children }) => {
  // Just wrap everything in AppShell - no special logic
  return (
    <AppShell appType="tenant" enableSEO>
      {children}
    </AppShell>
  );
};
