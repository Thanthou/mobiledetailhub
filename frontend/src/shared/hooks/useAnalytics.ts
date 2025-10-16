/**
 * useAnalytics - lightweight analytics wrapper
 * Falls back gracefully if GA4 is not available.
 */
import { useCallback } from 'react';

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const useAnalytics = () => {
  const isGAAvailable = typeof window !== 'undefined' && typeof window.gtag === 'function';

  const logEvent = useCallback((eventName: string, params: AnalyticsEventParams = {}) => {
    if (isGAAvailable) {
      try {
        if (window.gtag) {
          window.gtag('event', eventName, params);
        }
        return;
      } catch {
        // fallthrough to console
      }
    }
    // Dev fallback
    // eslint-disable-next-line no-console -- Dev fallback for analytics
    console.debug('[analytics:event]', eventName, params);
  }, [isGAAvailable]);

  const identify = useCallback((userId: string | number, params: AnalyticsEventParams = {}) => {
    if (isGAAvailable) {
      try {
        if (window.gtag) {
          window.gtag('set', { user_id: String(userId), ...params });
        }
        return;
      } catch {
        // fallthrough
      }
    }
    // eslint-disable-next-line no-console -- Dev fallback for analytics
    console.debug('[analytics:identify]', userId, params);
  }, [isGAAvailable]);

  const setUserProperties = useCallback((params: AnalyticsEventParams) => {
    if (isGAAvailable) {
      try {
        if (window.gtag) {
          window.gtag('set', 'user_properties', params);
        }
        return;
      } catch {
        // fallthrough
      }
    }
    // eslint-disable-next-line no-console -- Dev fallback for analytics
    console.debug('[analytics:user_properties]', params);
  }, [isGAAvailable]);

  return { logEvent, identify, setUserProperties };
};
