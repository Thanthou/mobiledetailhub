/**
 * Performance monitoring utilities for lazy loading and prefetching
 */

interface PerformanceMetrics {
  componentLoadTime: number;
  prefetchTime: number;
  totalTime: number;
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetrics>();
  private startTimes = new Map<string, number>();

  /**
   * Start timing a component load
   */
  startTiming(componentName: string): void {
    this.startTimes.set(componentName, performance.now());
  }

  /**
   * End timing and record metrics
   */
  endTiming(componentName: string, type: 'load' | 'prefetch'): void {
    const startTime = this.startTimes.get(componentName);
    if (!startTime) return;

    const endTime = performance.now();
    const duration = endTime - startTime;

    const existing = this.metrics.get(componentName) || {
      componentLoadTime: 0,
      prefetchTime: 0,
      totalTime: 0
    };

    if (type === 'load') {
      existing.componentLoadTime = duration;
    } else {
      existing.prefetchTime = duration;
    }

    existing.totalTime = existing.componentLoadTime + existing.prefetchTime;
    this.metrics.set(componentName, existing);

    // Log performance data in development
    if (import.meta.env.DEV) {
      // Performance measurement logged
    }
  }

  /**
   * Get performance metrics for a component
   */
  getMetrics(componentName: string): PerformanceMetrics | undefined {
    return this.metrics.get(componentName);
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for monitoring component performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startLoad = () => { performanceMonitor.startTiming(componentName); };
  const endLoad = () => { performanceMonitor.endTiming(componentName, 'load'); };
  const startPrefetch = () => { performanceMonitor.startTiming(componentName); };
  const endPrefetch = () => { performanceMonitor.endTiming(componentName, 'prefetch'); };

  return {
    startLoad,
    endLoad,
    startPrefetch,
    endPrefetch
  };
};
