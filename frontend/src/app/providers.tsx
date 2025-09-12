import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AffiliateProvider, AuthProvider, FAQProvider, LocationProvider, MDHConfigProvider } from '@/shared/contexts';
import { ErrorBoundary } from '@/shared/ui';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <MDHConfigProvider>
            <FAQProvider>
              <Router>
                {children}
              </Router>
            </FAQProvider>
          </MDHConfigProvider>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Specialized provider for affiliate-specific routes
export const AffiliateProviders: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <MDHConfigProvider>
            <FAQProvider>
              <Router>
                <AffiliateProvider>
                  {children}
                </AffiliateProvider>
              </Router>
            </FAQProvider>
          </MDHConfigProvider>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
