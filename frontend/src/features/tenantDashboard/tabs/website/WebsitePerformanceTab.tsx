import React, { useState } from 'react';
import { BarChart3, Clock, Eye, Globe, Monitor,Smartphone, TrendingUp, Users } from 'lucide-react';

const WebsitePerformanceTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data - in real implementation, this would come from analytics API
  const performanceData = {
    visitors: {
      total: 1247,
      change: 12.5,
      trend: 'up'
    },
    pageViews: {
      total: 3421,
      change: 8.3,
      trend: 'up'
    },
    bounceRate: {
      total: 42.1,
      change: -5.2,
      trend: 'down'
    },
    avgSessionDuration: {
      total: '2m 34s',
      change: 15.8,
      trend: 'up'
    },
    topPages: [
      { page: '/', views: 1247, percentage: 36.4 },
      { page: '/services', views: 892, percentage: 26.1 },
      { page: '/about', views: 456, percentage: 13.3 },
      { page: '/contact', views: 234, percentage: 6.8 },
      { page: '/gallery', views: 189, percentage: 5.5 },
    ],
    trafficSources: [
      { source: 'Direct', visitors: 456, percentage: 36.6 },
      { source: 'Google Search', visitors: 389, percentage: 31.2 },
      { source: 'Social Media', visitors: 234, percentage: 18.8 },
      { source: 'Referrals', visitors: 168, percentage: 13.4 },
    ],
    deviceBreakdown: [
      { device: 'Desktop', visitors: 623, percentage: 50.0 },
      { device: 'Mobile', visitors: 498, percentage: 39.9 },
      { device: 'Tablet', visitors: 126, percentage: 10.1 },
    ]
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
        <div className={`flex items-center text-sm ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendingUp className={`h-4 w-4 mr-1 ${
            trend === 'down' ? 'rotate-180' : ''
          }`} />
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400">
        {trend === 'up' ? '↗' : '↘'} {change > 0 ? '+' : ''}{change}% from last period
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Website Performance</h2>
          <p className="text-gray-400 mt-1">Analytics and performance metrics for your website</p>
        </div>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visitors"
          value={performanceData.visitors.total.toLocaleString()}
          change={performanceData.visitors.change}
          trend={performanceData.visitors.trend}
          icon={Users}
        />
        <StatCard
          title="Page Views"
          value={performanceData.pageViews.total.toLocaleString()}
          change={performanceData.pageViews.change}
          trend={performanceData.pageViews.trend}
          icon={Eye}
        />
        <StatCard
          title="Bounce Rate"
          value={`${performanceData.bounceRate.total}%`}
          change={performanceData.bounceRate.change}
          trend={performanceData.bounceRate.trend}
          icon={BarChart3}
        />
        <StatCard
          title="Avg. Session"
          value={performanceData.avgSessionDuration.total}
          change={performanceData.avgSessionDuration.change}
          trend={performanceData.avgSessionDuration.trend}
          icon={Clock}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {performanceData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">{page.page}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{page.views.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{page.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {performanceData.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-300">{source.source}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{source.visitors.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
        <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceData.deviceBreakdown.map((device, index) => {
            const Icon = device.device === 'Desktop' ? Monitor : 
                        device.device === 'Mobile' ? Smartphone : Monitor;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6 text-orange-400 mr-2" />
                  <span className="text-gray-300">{device.device}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {device.visitors.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">{device.percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Full Analytics
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors">
            <Globe className="h-4 w-4 mr-2" />
            Open Website
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsitePerformanceTab;
