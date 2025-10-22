import React, { PropsWithChildren } from 'react';

import { AppShell } from '@shared/bootstrap';

interface MainSiteProvidersProps {
  children: React.ReactNode;
}

/**
 * Main site providers using the unified AppShell
 * Provides full context stack with SEO management for marketing site
 */
export const MainSiteProviders: React.FC<MainSiteProvidersProps> = ({ children }) => {
  return (
    <AppShell appType="main" enableSEO>
      {children}
    </AppShell>
  );
};
