import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  imageLoadTimes: Map<string, number>;
  videoLoadTimes: Map<string, number>;
  failedLoads: Set<string>;
  totalLoadTime: number;
}

export const usePerformanceMonitor = () => {
  const metrics = useRef<PerformanceMetrics>({
    imageLoadTimes: new Map(),
    videoLoadTimes: new Map(),
    failedLoads: new Set(),
    totalLoadTime: 0,
  });

  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Monitor image performance
    const originalImage = window.Image;
    window.Image = function() {
      const img = new originalImage();
      const startTime = performance.now();
      
      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        metrics.current.imageLoadTimes.set(img.src, loadTime);
        
        if (loadTime > 2000) { // Log slow images
          if (import.meta.env.DEV) {
            console.warn(`Slow image load: ${img.src} took ${loadTime.toFixed(2)}ms`);
          }
        }
      });
      
      img.addEventListener('error', () => {
        metrics.current.failedLoads.add(img.src);
        if (import.meta.env.DEV) {
          console.error(`Failed to load image: ${img.src}`);
        }
      });
      
      return img;
    };

    // Monitor video performance
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'video') {
        const startTime = performance.now();
        
        element.addEventListener('loadeddata', () => {
          const loadTime = performance.now() - startTime;
          metrics.current.videoLoadTimes.set(element.src, loadTime);
          
          if (loadTime > 3000) { // Log slow videos
            if (import.meta.env.DEV) {
              console.warn(`Slow video load: ${element.src} took ${loadTime.toFixed(2)}ms`);
            }
          }
        });
        
        element.addEventListener('error', () => {
          metrics.current.failedLoads.add(element.src);
          if (import.meta.env.DEV) {
            console.error(`Failed to load video: ${element.src}`);
          }
        });
      }
      
      return element;
    };

    // Cleanup function
    return () => {
      window.Image = originalImage;
      document.createElement = originalCreateElement;
    };
  }, []);

  const getMetrics = () => {
    const totalTime = Date.now() - startTime.current;
    metrics.current.totalLoadTime = totalTime;
    
    return {
      ...metrics.current,
      totalLoadTime: totalTime,
      averageImageLoadTime: Array.from(metrics.current.imageLoadTimes.values()).reduce((a, b) => a + b, 0) / metrics.current.imageLoadTimes.size || 0,
      averageVideoLoadTime: Array.from(metrics.current.videoLoadTimes.values()).reduce((a, b) => a + b, 0) / metrics.current.videoLoadTimes.size || 0,
    };
  };

  const logPerformanceReport = () => {
    const report = getMetrics();
    
    if (import.meta.env.DEV) {
      console.group('🚀 Performance Report');
      console.log(`Total page load time: ${report.totalLoadTime}ms`);
      console.log(`Images loaded: ${report.imageLoadTimes.size}`);
      console.log(`Videos loaded: ${report.videoLoadTimes.size}`);
      console.log(`Failed loads: ${report.failedLoads.size}`);
      console.log(`Average image load time: ${report.averageImageLoadTime.toFixed(2)}ms`);
      console.log(`Average video load time: ${report.averageVideoLoadTime.toFixed(2)}ms`);
      
      if (report.failedLoads.size > 0) {
        console.warn('Failed media loads:', Array.from(report.failedLoads));
      }
      
      console.groupEnd();
    }
    
    return report;
  };

  return {
    getMetrics,
    logPerformanceReport,
  };
};
