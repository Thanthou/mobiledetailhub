import React, { useState } from 'react';
import { BarChart3, Clock, Eye, Globe, Monitor, Smartphone, TrendingUp, Users, AlertCircle, RefreshCw } from 'lucide-react';

import { useAnalyticsSummary, useRealtimeData, useGoogleAnalyticsStatus, initiateGoogleAnalyticsAuth } from '../../api/analytics';
import { useTenantId } from '../services/hooks/useTenantId';
import { useParams } from 'react-router-dom';

const WebsitePerformanceTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Get tenant ID and convert to number for API calls
  const tenantIdString = useTenantId();
  const tenantId = tenantIdString ? parseInt(tenantIdString) : undefined;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // Convert time range to days for API
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  
  // Fetch real data
  const { data: analyticsStatus, isLoading: statusLoading } = useGoogleAnalyticsStatus(tenantId);
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsSummary(tenantId, days);
  const { data: realtimeData, isLoading: realtimeLoading } = useRealtimeData(tenantId);
  
  const isLoading = statusLoading || analyticsLoading || realtimeLoading;

  // Connection status component
  const ConnectionStatus = () => {
    if (!analyticsStatus) return null;
    
    if (!analyticsStatus.connected) {
      return (
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-white">Google Analytics Not Connected</h3>
                <p className="text-gray-400 mt-1">Connect your Google Analytics account to view website performance data</p>
              </div>
            </div>
            <button
              onClick={() => tenantId && initiateGoogleAnalyticsAuth(tenantId)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Connect Analytics
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-stone-800 rounded-lg p-4 border border-stone-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-400 rounded-full mr-3"></div>
            <div>
              <span className="text-white font-medium">Google Analytics Connected</span>
              <p className="text-gray-400 text-sm">Last sync: {analyticsStatus.lastSync ? new Date(analyticsStatus.lastSync).toLocaleString() : 'Never'}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon 
  }: { 
    title: string; 
    value: string | number; 
    change: number; 
    trend: 'up' | 'down'; 
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-orange-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
        {change !== 0 && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${
              trend === 'down' ? 'rotate-180' : ''
            }`} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {change !== 0 && (
        <div className="text-xs text-gray-400">
          {trend === 'up' ? '↗' : '↘'} {change > 0 ? '+' : ''}{change}% from last period
        </div>
      )}
    </div>
  );

  // Helper function to format session duration
  const formatSessionDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Website Performance</h2>
          <p className="text-gray-400 mt-1">Analytics and performance metrics for your website</p>
        </div>
        {analyticsStatus?.connected && (
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => { setTimeRange(range); }}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-700 text-gray-300 hover:bg-stone-600'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Key Metrics */}
      {analyticsStatus?.connected && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-stone-800 rounded-lg p-6 border border-stone-700 animate-pulse">
                  <div className="h-4 bg-stone-700 rounded mb-4"></div>
                  <div className="h-8 bg-stone-700 rounded mb-2"></div>
                  <div className="h-3 bg-stone-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : analyticsError ? (
            <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Error Loading Analytics</h3>
                  <p className="text-gray-400 mt-1">Failed to fetch analytics data. Please try refreshing.</p>
                </div>
              </div>
            </div>
          ) : analyticsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Sessions"
                value={analyticsData.totalSessions.toLocaleString()}
                change={0}
                trend="up"
                icon={Users}
              />
              <StatCard
                title="Total Users"
                value={analyticsData.totalUsers.toLocaleString()}
                change={0}
                trend="up"
                icon={Eye}
              />
              <StatCard
                title="Bounce Rate"
                value={`${analyticsData.averageBounceRate.toFixed(1)}%`}
                change={0}
                trend="down"
                icon={BarChart3}
              />
              <StatCard
                title="Avg. Session"
                value={formatSessionDuration(analyticsData.averageSessionDuration)}
                change={0}
                trend="up"
                icon={Clock}
              />
            </div>
          ) : null}

          {/* Real-time Data */}
          {realtimeData && (
            <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Real-time Activity</h3>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-gray-400">Live</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{realtimeData.activeUsers}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{realtimeData.countries.length}</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Last Updated</div>
                  <div className="text-sm text-gray-300">
                    {new Date(realtimeData.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Actions */}
      {analyticsStatus?.connected && (
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.open('https://analytics.google.com', '_blank')}
              className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Full Analytics
            </button>
            <button 
              onClick={() => window.open(`https://${businessSlug}.thatsmartsite.com`, '_blank')}
              className="flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors"
            >
              <Globe className="h-4 w-4 mr-2" />
              Open Website
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsitePerformanceTab;
