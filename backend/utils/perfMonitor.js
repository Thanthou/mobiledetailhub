/**
 * Performance Monitor
 * Tracks and aggregates route performance metrics
 */

import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('perfMonitor');

// In-memory storage for metrics (in production, consider Redis or database)
const metrics = new Map();

// Configuration
const CONFIG = {
  MAX_SAMPLES: 1000, // Keep last 1000 samples per route
  SLOW_REQUEST_THRESHOLD: 1000, // 1 second
  PERCENTILES: [50, 75, 90, 95, 99], // p50, p75, p90, p95, p99
};

/**
 * Record a route performance metric
 */
export function recordMetric(method, route, duration, statusCode) {
  const key = `${method} ${route}`;
  
  if (!metrics.has(key)) {
    metrics.set(key, {
      method,
      route,
      samples: [],
      count: 0,
      totalDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      errorCount: 0,
      slowRequestCount: 0,
      lastUpdated: Date.now(),
    });
  }

  const stat = metrics.get(key);

  // Add sample (keep only last MAX_SAMPLES)
  stat.samples.push({
    duration,
    statusCode,
    timestamp: Date.now(),
  });

  if (stat.samples.length > CONFIG.MAX_SAMPLES) {
    stat.samples.shift(); // Remove oldest
  }

  // Update aggregates
  stat.count++;
  stat.totalDuration += duration;
  stat.minDuration = Math.min(stat.minDuration, duration);
  stat.maxDuration = Math.max(stat.maxDuration, duration);
  stat.lastUpdated = Date.now();

  // Track errors (4xx and 5xx)
  if (statusCode >= 400) {
    stat.errorCount++;
  }

  // Track slow requests
  if (duration > CONFIG.SLOW_REQUEST_THRESHOLD) {
    stat.slowRequestCount++;
    
    logger.warn({
      event: 'slow_request',
      method,
      route,
      duration,
      statusCode,
      threshold: CONFIG.SLOW_REQUEST_THRESHOLD
    }, `Slow request detected: ${method} ${route} took ${duration}ms`);
  }
}

/**
 * Calculate percentiles from samples
 */
function calculatePercentiles(samples) {
  if (samples.length === 0) return {};

  const durations = samples.map(s => s.duration).sort((a, b) => a - b);
  const percentiles = {};

  for (const p of CONFIG.PERCENTILES) {
    const index = Math.ceil((p / 100) * durations.length) - 1;
    percentiles[`p${p}`] = durations[Math.max(0, index)];
  }

  return percentiles;
}

/**
 * Get performance statistics for a specific route
 */
export function getRouteStats(method, route) {
  const key = `${method} ${route}`;
  const stat = metrics.get(key);

  if (!stat) {
    return null;
  }

  const percentiles = calculatePercentiles(stat.samples);
  const avgDuration = stat.count > 0 ? stat.totalDuration / stat.count : 0;
  const errorRate = stat.count > 0 ? (stat.errorCount / stat.count) * 100 : 0;

  return {
    method: stat.method,
    route: stat.route,
    count: stat.count,
    avgDuration: Math.round(avgDuration),
    minDuration: stat.minDuration === Infinity ? 0 : stat.minDuration,
    maxDuration: stat.maxDuration,
    ...percentiles,
    errorCount: stat.errorCount,
    errorRate: Math.round(errorRate * 100) / 100,
    slowRequestCount: stat.slowRequestCount,
    slowRequestRate: Math.round((stat.slowRequestCount / stat.count) * 10000) / 100,
    lastUpdated: new Date(stat.lastUpdated).toISOString(),
  };
}

/**
 * Get all performance statistics
 */
export function getAllStats() {
  const allStats = [];

  for (const [key, stat] of metrics.entries()) {
    allStats.push(getRouteStats(stat.method, stat.route));
  }

  // Sort by total time (count * avgDuration) to show most impactful routes first
  return allStats.sort((a, b) => {
    const aImpact = a.count * a.avgDuration;
    const bImpact = b.count * b.avgDuration;
    return bImpact - aImpact;
  });
}

/**
 * Get summary statistics
 */
export function getSummary() {
  const allStats = getAllStats();

  if (allStats.length === 0) {
    return {
      totalRoutes: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      totalErrors: 0,
      totalSlowRequests: 0,
    };
  }

  const summary = {
    totalRoutes: allStats.length,
    totalRequests: allStats.reduce((sum, s) => sum + s.count, 0),
    totalErrors: allStats.reduce((sum, s) => sum + s.errorCount, 0),
    totalSlowRequests: allStats.reduce((sum, s) => sum + s.slowRequestCount, 0),
    avgResponseTime: 0,
    slowestRoutes: [],
    mostUsedRoutes: [],
  };

  // Calculate overall average response time
  const totalDuration = allStats.reduce((sum, s) => sum + (s.avgDuration * s.count), 0);
  summary.avgResponseTime = Math.round(totalDuration / summary.totalRequests);

  // Get top 5 slowest routes
  summary.slowestRoutes = [...allStats]
    .sort((a, b) => b.avgDuration - a.avgDuration)
    .slice(0, 5)
    .map(s => ({
      route: `${s.method} ${s.route}`,
      avgDuration: s.avgDuration,
      count: s.count,
    }));

  // Get top 5 most used routes
  summary.mostUsedRoutes = [...allStats]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(s => ({
      route: `${s.method} ${s.route}`,
      count: s.count,
      avgDuration: s.avgDuration,
    }));

  return summary;
}

/**
 * Reset all metrics (useful for testing)
 */
export function resetMetrics() {
  metrics.clear();
  logger.info('Performance metrics reset');
}

/**
 * Get metrics for the last N minutes
 */
export function getRecentMetrics(minutes = 5) {
  const cutoff = Date.now() - (minutes * 60 * 1000);
  const recentStats = [];

  for (const [key, stat] of metrics.entries()) {
    const recentSamples = stat.samples.filter(s => s.timestamp >= cutoff);
    
    if (recentSamples.length === 0) continue;

    const percentiles = calculatePercentiles(recentSamples);
    const totalDuration = recentSamples.reduce((sum, s) => sum + s.duration, 0);
    const avgDuration = totalDuration / recentSamples.length;
    const errorCount = recentSamples.filter(s => s.statusCode >= 400).length;

    recentStats.push({
      method: stat.method,
      route: stat.route,
      count: recentSamples.length,
      avgDuration: Math.round(avgDuration),
      ...percentiles,
      errorCount,
      errorRate: Math.round((errorCount / recentSamples.length) * 10000) / 100,
    });
  }

  return recentStats.sort((a, b) => b.count - a.count);
}

/**
 * Log performance summary (for scheduled reporting)
 */
export function logSummary() {
  const summary = getSummary();

  logger.info({
    event: 'performance_summary',
    ...summary
  }, `Performance Summary: ${summary.totalRequests} requests across ${summary.totalRoutes} routes, avg ${summary.avgResponseTime}ms`);

  return summary;
}

export default {
  recordMetric,
  getRouteStats,
  getAllStats,
  getSummary,
  getRecentMetrics,
  resetMetrics,
  logSummary,
  CONFIG,
};

