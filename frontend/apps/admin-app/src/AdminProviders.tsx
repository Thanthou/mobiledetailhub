import React from 'react';

import { AppShell } from '../../../src/shared/bootstrap/AppShell';

interface AdminProvidersProps {
  children: React.ReactNode;
}

/**
 * Admin app providers using the unified AppShell
 * Provides minimal context stack for admin functionality
 */
export const AdminProviders: React.FC<AdminProvidersProps> = ({ children }) => {
  return (
    <AppShell appType="admin">
      {children}
    </AppShell>
  );
};
