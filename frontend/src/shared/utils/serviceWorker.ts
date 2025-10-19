/**
 * Service Worker Registration Utility
 * 
 * Handles service worker registration with runtime configuration support
 */

import { isServiceWorkerEnabled } from '../env';

interface ServiceWorkerConfig {
  features?: {
    serviceWorker?: boolean;
  };
}

/**
 * Register service worker if enabled via runtime config
 * @param runtimeConfig - Runtime configuration from ConfigContext
 * @param swPath - Path to service worker file (default: '/sw.js')
 */
export async function registerServiceWorker(
  runtimeConfig?: ServiceWorkerConfig,
  swPath: string = '/sw.js'
): Promise<ServiceWorkerRegistration | null> {
  // Check if service worker should be enabled
  if (!isServiceWorkerEnabled(runtimeConfig)) {
    console.log('Service worker disabled via runtime configuration');
    return null;
  }

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: '/',
    });

    console.log('Service worker registered successfully:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, prompt user to refresh
            console.log('New content available, please refresh');
            // You could show a notification here
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service worker unregistered');
    }
    
    return true;
  } catch (error) {
    console.error('Service worker unregistration failed:', error);
    return false;
  }
}

/**
 * Check if service worker is currently active
 */
export async function isServiceWorkerActive(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration !== undefined;
  } catch (error) {
    console.error('Error checking service worker status:', error);
    return false;
  }
}

/**
 * Get service worker registration info
 */
export async function getServiceWorkerInfo(): Promise<{
  isSupported: boolean;
  isActive: boolean;
  registration?: ServiceWorkerRegistration;
} | null> {
  if (!('serviceWorker' in navigator)) {
    return {
      isSupported: false,
      isActive: false,
    };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    return {
      isSupported: true,
      isActive: registration !== undefined,
      registration: registration || undefined,
    };
  } catch (error) {
    console.error('Error getting service worker info:', error);
    return null;
  }
}
