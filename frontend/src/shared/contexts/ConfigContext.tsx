/**
 * Runtime Configuration Context
 * 
 * Provides runtime configuration loaded from the backend API
 * This allows changing configuration without rebuilding the frontend
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiCall } from '@shared/api';

export interface RuntimeConfig {
  // API Configuration
  apiBaseUrl: string;
  apiUrl: string;
  backendUrl?: string;
  
  // Third-party API Keys
  googleMapsApiKey?: string;
  stripePublishableKey?: string;
  
  // Feature Flags
  features: {
    serviceWorker: boolean;
    analytics: boolean;
    maps: boolean;
    stripe: boolean;
    debugMode: boolean;
    booking?: boolean;
    reviews?: boolean;
  };
  
  // Environment info
  environment: {
    mode: string;
    version: string;
    buildTime: string;
    commitHash?: string;
  };
  
  // Multi-tenant configuration
  tenant: {
    defaultDomain: string;
    subdomainPattern: string;
    allowCustomDomains?: boolean;
  };
  
  // Client-side settings
  client?: {
    maxUploadSize: number;
    sessionTimeout: number;
    enableOfflineMode: boolean;
  };
}

export interface ConfigContextType {
  config: RuntimeConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  fallbackConfig?: Partial<RuntimeConfig>;
}

export function ConfigProvider({ children, fallbackConfig }: ConfigProviderProps) {
  const [config, setConfig] = useState<RuntimeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiCall('/api/config', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (data.success && data.config) {
        const loadedConfig = data.config;
        setConfig(loadedConfig);
        
        console.log('[ConfigProvider] Runtime config loaded:', {
          apiBaseUrl: loadedConfig.apiBaseUrl,
          environment: loadedConfig.environment?.mode,
          features: Object.keys(loadedConfig.features || {})
        });
      } else {
        throw new Error('Invalid config response format');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Use fallback config if available
      if (fallbackConfig) {
        const fallback = fallbackConfig as RuntimeConfig;
        setConfig(fallback);
        console.log('[ConfigProvider] Using fallback config');
      }
      
      console.warn('Failed to fetch runtime config, using fallback:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, error, refetch: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

// Hook for accessing specific config values with fallbacks
export function useConfigValue<T>(key: string, fallback: T): T {
  const { config } = useConfig();
  
  if (!config) {
    return fallback;
  }
  
  // Navigate nested object keys (e.g., 'features.serviceWorker')
  const keys = key.split('.');
  let value: any = config;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback;
    }
  }
  
  return value as T;
}

// Convenience hooks for common config values
export function useApiBaseUrl(): string {
  return useConfigValue('apiBaseUrl', '/api');
}

export function useApiUrl(): string {
  return useConfigValue('apiUrl', '');
}

export function useGoogleMapsApiKey(): string | undefined {
  return useConfigValue('googleMapsApiKey', undefined);
}

export function useStripePublishableKey(): string {
  return useConfigValue('stripePublishableKey', 'pk_test_placeholder');
}

export function useServiceWorkerEnabled(): boolean {
  return useConfigValue('features.serviceWorker', false);
}

export function useAnalyticsEnabled(): boolean {
  return useConfigValue('features.analytics', false);
}

export function useMapsEnabled(): boolean {
  return useConfigValue('features.maps', false);
}

export function useStripeEnabled(): boolean {
  return useConfigValue('features.stripe', false);
}

export function useDebugMode(): boolean {
  return useConfigValue('features.debugMode', false);
}

export function useBookingEnabled(): boolean {
  return useConfigValue('features.booking', true);
}

export function useReviewsEnabled(): boolean {
  return useConfigValue('features.reviews', true);
}

export function useMaxUploadSize(): number {
  return useConfigValue('client.maxUploadSize', 5242880);
}

export function useSessionTimeout(): number {
  return useConfigValue('client.sessionTimeout', 86400000);
}

export function useOfflineMode(): boolean {
  return useConfigValue('client.enableOfflineMode', false);
}
