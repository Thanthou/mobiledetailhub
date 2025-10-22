import { Routes, Route } from 'react-router-dom';
import { useRouterDebug } from '@shared/hooks';
import { MarketingSite } from './modes/MarketingSite';
import TenantApplicationPage from '@shared/components/tenantOnboarding/components/TenantApplicationPage';

export default function MainApp() {
  useRouterDebug('MainApp');

  // Phase 3A: Marketing site (Tenant-0) - KISS approach
  // Uses same components as tenant sites, just different JSON data
  // PreviewDataProvider (in MainProviders) handles data loading
  // TODO Phase 3B: Add tenant site mode for Tenant-N
  return (
    <Routes>
      <Route 
        path="/" 
        element={<MarketingSite />} 
      />
      <Route
        path="/onboarding"
        element={<TenantApplicationPage />}
      />
    </Routes>
  );
}

