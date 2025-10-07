import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { 
  getHealthStatus, 
  triggerHealthScan, 
  getScoreColor, 
  getScoreBgColor, 
  getStatusColor, 
  formatDisplayValue,
  type HealthData,
  type HealthScanResponse
} from '../../../api/healthApi';

interface HealthTabProps {
  tenantSlug?: string;
}

export const HealthTab: React.FC<HealthTabProps> = ({ tenantSlug }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<HealthScanResponse['data'] | null>(null);

  const loadHealthData = async () => {
    if (!tenantSlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getHealthStatus(tenantSlug);
      setHealthData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load health data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async () => {
    if (!tenantSlug) return;

    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await triggerHealthScan(tenantSlug);
      setScanResult(response.data);
      
      // Reload health data after scan
      setTimeout(() => {
        loadHealthData();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run health scan');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, [tenantSlug]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderScoreRing = (score: number, size: string = 'w-16 h-16') => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - score / 100 * circumference;
    
    return (
      <div className={`${size} relative`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${getScoreColor(score).replace('text-', '')}`}
            style={{
              stroke: score >= 90 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
            }}
          />
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  const renderScoreCard = (title: string, score: number, color?: string) => (
    <div className="bg-stone-800 rounded-lg p-4">
      <div className="flex items-center gap-4">
        {renderScoreRing(score)}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-300">{title}</h4>
          <div className="text-xs text-gray-500 mt-1">
            {score >= 90 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Poor'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoreWebVitals = (data: any) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-300">Core Web Vitals</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {renderScoreRing(Math.round(data.lcp.score * 100), 'w-12 h-12')}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">LCP</span>
                <span className={`text-xs font-medium ${getScoreColor(data.lcp.score * 100)}`}>
                  {formatDisplayValue(data.lcp.value, 'ms')}
                </span>
              </div>
              <div className="text-xs text-gray-500">Largest Contentful Paint</div>
            </div>
          </div>
        </div>
        
        <div className="bg-stone-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {renderScoreRing(Math.round(data.fid.score * 100), 'w-12 h-12')}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">FID</span>
                <span className={`text-xs font-medium ${getScoreColor(data.fid.score * 100)}`}>
                  {formatDisplayValue(data.fid.value, 'ms')}
                </span>
              </div>
              <div className="text-xs text-gray-500">First Input Delay</div>
            </div>
          </div>
        </div>
        
        <div className="bg-stone-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {renderScoreRing(Math.round(data.cls.score * 100), 'w-12 h-12')}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">CLS</span>
                <span className={`text-xs font-medium ${getScoreColor(data.cls.score * 100)}`}>
                  {data.cls.value ? (typeof data.cls.value === 'number' ? data.cls.value.toFixed(3) : parseFloat(data.cls.value).toFixed(3)) : 'N/A'}
                </span>
              </div>
              <div className="text-xs text-gray-500">Cumulative Layout Shift</div>
            </div>
          </div>
        </div>
        
        <div className="bg-stone-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {renderScoreRing(Math.round(data.fcp.score * 100), 'w-12 h-12')}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">FCP</span>
                <span className={`text-xs font-medium ${getScoreColor(data.fcp.score * 100)}`}>
                  {formatDisplayValue(data.fcp.value, 'ms')}
                </span>
              </div>
              <div className="text-xs text-gray-500">First Contentful Paint</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOpportunities = (opportunities: any[]) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-300">Top Optimization Opportunities</h4>
      {opportunities.slice(0, 3).map((opp, index) => (
        <div key={index} className="bg-stone-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <h5 className="text-sm font-medium text-white">{opp.title}</h5>
            <span className="text-xs text-green-400">
              Save {formatDisplayValue(opp.savings, 'ms')}
            </span>
          </div>
          <p className="text-xs text-gray-400">{opp.description}</p>
        </div>
      ))}
    </div>
  );

  if (!tenantSlug) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No tenant selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Website Health</h3>
          <p className="text-sm text-gray-400">Monitor your website's performance and Core Web Vitals</p>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning || isLoading}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Run Health Scan'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 text-red-300 border border-red-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="bg-green-900 text-green-300 border border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Scan Completed</span>
          </div>
          <p className="text-sm mt-1">
            Overall Score: <span className="font-bold">{scanResult.overallScore}</span>
          </p>
          {scanResult.summary.priority.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-green-400">Priority Issues:</p>
              <ul className="text-xs mt-1 space-y-1">
                {scanResult.summary.priority.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !healthData && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-orange-500" />
            <span className="text-gray-400">Loading health data...</span>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && healthData && !healthData.hasData && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">No Health Data</h4>
            <p className="text-gray-400 mb-4">{healthData.message}</p>
            <button
              onClick={handleScan}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Run First Health Scan
            </button>
          </div>
        </div>
      )}

      {/* Health Data */}
      {healthData && healthData.hasData && (
        <div className="space-y-6">
          {/* Overall Status */}
          {healthData.overall && (
            <div className="bg-stone-800 rounded-lg p-6">
              <div className="flex items-center gap-6">
                {renderScoreRing(healthData.overall.score, 'w-20 h-20')}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(healthData.overall.status)}
                    <span className="text-lg font-semibold text-white">Overall Health</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {healthData.overall.score >= 90 ? 'Excellent' : healthData.overall.score >= 50 ? 'Needs Improvement' : 'Poor'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(healthData.lastUpdated || '').toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Scores */}
          {healthData.performance ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mobile Performance */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  📱 Mobile Performance
                </h4>
                
                {healthData.performance.mobile ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {renderScoreCard('Performance', healthData.performance.mobile.performanceScore || healthData.performance.mobile.overallScore || 0)}
                      {renderScoreCard('Accessibility', healthData.performance.mobile.accessibilityScore || 0)}
                      {renderScoreCard('Best Practices', healthData.performance.mobile.bestPracticesScore || 0)}
                      {renderScoreCard('SEO', healthData.performance.mobile.seoScore || 0)}
                    </div>

                    {healthData.performance.mobile.coreWebVitals && renderCoreWebVitals(healthData.performance.mobile.coreWebVitals)}
                    
                    {healthData.performance.mobile.opportunities && healthData.performance.mobile.opportunities.length > 0 && 
                      renderOpportunities(healthData.performance.mobile.opportunities)
                    }
                  </>
                ) : (
                  <div className="bg-stone-700 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No mobile performance data available</p>
                    <p className="text-xs text-gray-500 mt-1">Run a health scan to get mobile metrics</p>
                  </div>
                )}
              </div>

              {/* Desktop Performance */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  🖥️ Desktop Performance
                </h4>
                
                {healthData.performance.desktop ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {renderScoreCard('Performance', healthData.performance.desktop.performanceScore || healthData.performance.desktop.overallScore || 0)}
                      {renderScoreCard('Accessibility', healthData.performance.desktop.accessibilityScore || 0)}
                      {renderScoreCard('Best Practices', healthData.performance.desktop.bestPracticesScore || 0)}
                      {renderScoreCard('SEO', healthData.performance.desktop.seoScore || 0)}
                    </div>

                    {healthData.performance.desktop.coreWebVitals && renderCoreWebVitals(healthData.performance.desktop.coreWebVitals)}
                    
                    {healthData.performance.desktop.opportunities && healthData.performance.desktop.opportunities.length > 0 && 
                      renderOpportunities(healthData.performance.desktop.opportunities)
                    }
                  </>
                ) : (
                  <div className="bg-stone-700 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No desktop performance data available</p>
                    <p className="text-xs text-gray-500 mt-1">Run a health scan to get desktop metrics</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-800 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Performance Data</h3>
              <p className="text-gray-400 mb-4">Run a health scan to get detailed performance metrics for both mobile and desktop.</p>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Run Health Scan
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
