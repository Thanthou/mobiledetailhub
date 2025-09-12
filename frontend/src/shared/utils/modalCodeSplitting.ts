/**
 * Advanced modal code-splitting utilities for optimal performance
 * This module provides intelligent prefetching strategies to minimize first paint delay
 */

type ModalType = 'quote' | 'login';

interface PrefetchStrategy {
  immediate: boolean;
  onHover: boolean;
  onFocus: boolean;
  onViewport: boolean;
  delay?: number;
}

interface ModalPrefetchConfig {
  [key: string]: PrefetchStrategy;
}

// Default prefetch strategies for different modals
const DEFAULT_PREFETCH_CONFIG: ModalPrefetchConfig = {
  quote: {
    immediate: false,
    onHover: true,
    onFocus: true,
    onViewport: true,
    delay: 2000, // Prefetch after 2 seconds
  },
  login: {
    immediate: false,
    onHover: true,
    onFocus: true,
    onViewport: true,
    delay: 1500, // Login is more commonly used, prefetch sooner
  },
};

import type React from 'react';

// Type for dynamic imports
type ModalModule = {
  default: React.ComponentType<unknown>;
  [key: string]: unknown;
};

class ModalPrefetchManager {
  private prefetchedModules = new Map<ModalType, Promise<ModalModule>>();
  private prefetchStrategies = new Map<ModalType, PrefetchStrategy>();
  private intersectionObserver?: IntersectionObserver;
  private prefetchTimers = new Map<ModalType, ReturnType<typeof setTimeout>>();

  constructor(config: ModalPrefetchConfig = DEFAULT_PREFETCH_CONFIG) {
    Object.entries(config).forEach(([modalType, strategy]) => {
      this.prefetchStrategies.set(modalType as ModalType, strategy);
    });

    this.setupIntersectionObserver();
    this.setupDelayedPrefetching();
  }

  private setupIntersectionObserver() {
    if (typeof window === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const modalType = entry.target.getAttribute('data-modal-trigger') as ModalType | null;
            if (modalType) {
              void this.prefetch(modalType);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Start prefetching when element is 100px away from viewport
      }
    );
  }

  private setupDelayedPrefetching() {
    this.prefetchStrategies.forEach((strategy, modalType) => {
      if (strategy.delay && strategy.delay > 0) {
        const timer = setTimeout(() => {
          void this.prefetch(modalType);
        }, strategy.delay);
        this.prefetchTimers.set(modalType, timer);
      }
    });
  }

  private shouldPrefetchOnViewport(modalType: ModalType): boolean {
    return this.prefetchStrategies.get(modalType)?.onViewport ?? false;
  }

  async prefetch(modalType: ModalType): Promise<void> {
    if (this.prefetchedModules.has(modalType)) {
      return; // Already prefetched or in progress
    }

    let importPromise: Promise<ModalModule>;

    switch (modalType) {
      case 'quote':
        importPromise = import('@/features/booking/components/QuoteModal') as Promise<ModalModule>;
        break;
      case 'login':
        importPromise = import('@/features/auth/components/LoginModal') as Promise<ModalModule>;
        break;
      default:
        // Unknown modal type
        return;
    }

    this.prefetchedModules.set(modalType, importPromise);

    try {
      await importPromise;
      // Modal prefetched successfully
    } catch (error) {
      console.error(`❌ Failed to prefetch ${modalType} modal:`, error);
      // Remove failed prefetch so it can be retried
      this.prefetchedModules.delete(modalType);
    }
  }

  observeElement(element: HTMLElement, modalType: ModalType) {
    if (this.intersectionObserver && this.shouldPrefetchOnViewport(modalType)) {
      element.setAttribute('data-modal-trigger', modalType);
      this.intersectionObserver.observe(element);
    }
  }

  unobserveElement(element: HTMLElement) {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }
  }

  // Event handlers for manual triggering
  handleHover = (modalType: ModalType): void => {
    const strategy = this.prefetchStrategies.get(modalType);
    if (strategy?.onHover) {
      void this.prefetch(modalType);
    }
  };

  handleFocus = (modalType: ModalType): void => {
    const strategy = this.prefetchStrategies.get(modalType);
    if (strategy?.onFocus) {
      void this.prefetch(modalType);
    }
  };

  // Check if a modal is already prefetched
  isPrefetched(modalType: ModalType): boolean {
    return this.prefetchedModules.has(modalType);
  }

  // Get prefetch status for debugging
  getStatus() {
    const status: Record<string, boolean> = {};
    this.prefetchStrategies.forEach((_, modalType) => {
      status[modalType] = this.isPrefetched(modalType);
    });
    return status;
  }

  // Cleanup method
  destroy() {
    this.intersectionObserver?.disconnect();
    this.prefetchTimers.forEach((timer) => { clearTimeout(timer); });
    this.prefetchTimers.clear();
  }
}

// Global manager instance
let globalPrefetchManager: ModalPrefetchManager | null = null;

export const getModalPrefetchManager = (): ModalPrefetchManager => {
  if (!globalPrefetchManager) {
    globalPrefetchManager = new ModalPrefetchManager();
  }
  return globalPrefetchManager;
};

// Convenience hooks and utilities
export const useModalPrefetch = () => {
  const manager = getModalPrefetchManager();

  return {
    prefetch: (modalType: ModalType) => manager.prefetch(modalType),
    handleHover: (modalType: ModalType) => { manager.handleHover(modalType); },
    handleFocus: (modalType: ModalType) => { manager.handleFocus(modalType); },
    observeElement: (element: HTMLElement, modalType: ModalType) => 
      { manager.observeElement(element, modalType); },
    unobserveElement: (element: HTMLElement) => { manager.unobserveElement(element); },
    isPrefetched: (modalType: ModalType) => manager.isPrefetched(modalType),
    getStatus: () => manager.getStatus(),
  };
};

// React hook for automatic element observation
export const useModalTriggerRef = (modalType: ModalType) => {
  const manager = getModalPrefetchManager();

  return (element: HTMLElement | null) => {
    if (element) {
      manager.observeElement(element, modalType);
      return () => { manager.unobserveElement(element); };
    }
  };
};

// Preload critical modals on app initialization
export const preloadCriticalModals = async (): Promise<void> => {
  const manager = getModalPrefetchManager();
  
  // Preload login modal as it's commonly used
  await manager.prefetch('login');
  
  // Optionally preload quote modal after a short delay
  setTimeout(() => {
    void manager.prefetch('quote');
  }, 3000);
};

export type { ModalPrefetchConfig, ModalType, PrefetchStrategy };
