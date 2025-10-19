import React, { PropsWithChildren } from 'react';

import { AppShell } from '@/shared/bootstrap';

interface TenantProvidersProps {
  children: React.ReactNode;
}

/**
 * Tenant app providers using the unified AppShell
 * Provides full context stack with SEO management for tenant sites
 */
export const TenantProviders: React.FC<TenantProvidersProps> = ({ children }) => {
  return (
    <AppShell appType="tenant" enableSEO>
      {children}
    </AppShell>
  );
};
