/**
 * ConfigProvider Component
 * 
 * Wraps the application with runtime configuration context
 * This should be placed high in the component tree, typically in the main app
 */

import React, { ReactNode } from 'react';
import { ConfigProvider as ConfigContextProvider } from '../contexts/ConfigContext';
import { config } from '../env';

interface ConfigProviderProps {
  children: ReactNode;
}

/**
 * Main ConfigProvider component that wraps the app with runtime configuration
 */
export function ConfigProvider({ children }: ConfigProviderProps) {
  // Create fallback config from build-time environment variables
  const fallbackConfig = {
    apiBaseUrl: config.apiBaseUrl,
    apiUrl: config.apiUrl,
    googleMapsApiKey: config.googleMapsApiKey,
    stripePublishableKey: config.stripePublishableKey,
    features: {
      serviceWorker: config.serviceWorkerEnabled,
      analytics: false, // Default to false, enable via runtime config
      maps: !!config.googleMapsApiKey,
      stripe: !!config.stripePublishableKey,
      debugMode: config.isDevelopment,
    },
    environment: {
      mode: config.mode,
      version: '1.0.0', // This could come from build-time env
      buildTime: new Date().toISOString(),
    },
    tenant: {
      defaultDomain: 'thatsmartsite.com',
      subdomainPattern: '*.thatsmartsite.com',
    },
  };

  return (
    <ConfigContextProvider fallbackConfig={fallbackConfig}>
      {children}
    </ConfigContextProvider>
  );
}

/**
 * Example component showing how to use runtime configuration
 */
export function ConfigExample() {
  const { config, loading, error } = React.useContext(React.createContext<{
    config: any;
    loading: boolean;
    error: string | null;
  }>({ config: null, loading: false, error: null }));

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  if (error) {
    return <div>Error loading configuration: {error}</div>;
  }

  if (!config) {
    return <div>No configuration available</div>;
  }

  return (
    <div>
      <h3>Runtime Configuration</h3>
      <p>API Base URL: {config.apiBaseUrl}</p>
      <p>Environment: {config.environment.mode}</p>
      <p>Service Worker Enabled: {config.features.serviceWorker ? 'Yes' : 'No'}</p>
      <p>Analytics Enabled: {config.features.analytics ? 'Yes' : 'No'}</p>
      <p>Maps Enabled: {config.features.maps ? 'Yes' : 'No'}</p>
      <p>Stripe Enabled: {config.features.stripe ? 'Yes' : 'No'}</p>
    </div>
  );
}
