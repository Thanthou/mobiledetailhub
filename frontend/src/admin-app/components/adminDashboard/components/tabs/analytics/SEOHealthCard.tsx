import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Search, FileText } from 'lucide-react';
import axios from 'axios';

interface SEOAuditData {
  lighthouse: {
    mainSite: number | null;
    tenantApp: number | null;
    adminApp: number | null;
    average: number | null;
  };
  schema: {
    score: number | null;
    totalCount: number;
    validCount: number;
    errorCount: number;
    warningCount: number;
    typesCovered: string[];
  };
  meta: {
    tagsComplete: boolean;
    analyticsDetected: boolean;
    sitemapFound: boolean;
    robotsTxtFound: boolean;
  };
  overall: {
    score: number;
    status: string;
    source: string;
    checkedAt: string;
  };
}

interface SEOHealthCardProps {
  tenantSlug?: string;
}

export const SEOHealthCard: React.FC<SEOHealthCardProps> = ({ tenantSlug = 'system' }) => {
  const [seoData, setSeoData] = useState<SEOAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSEOData();
  }, [tenantSlug]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/health-monitoring/seo/${tenantSlug}`);
      
      if (response.data.data.hasData) {
        setSeoData(response.data.data.audit);
      } else {
        setError('No SEO audit data available. Run: npm run audit:seo');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch SEO data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">SEO Health</h3>
        </div>
        <div className="text-gray-400">Loading SEO data...</div>
      </div>
    );
  }

  if (error || !seoData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">SEO Health</h3>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number | null) => {
    if (score === null) return <Minus className="w-4 h-4" />;
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">SEO Health</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getScoreColor(seoData.overall.score)}`}>
            {seoData.overall.score}/100
          </span>
          {getScoreIcon(seoData.overall.score)}
        </div>
      </div>

      {/* Lighthouse Scores */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Lighthouse SEO Scores</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-400 mb-1">Main Site</div>
            <div className={`text-xl font-bold ${getScoreColor(seoData.lighthouse.mainSite)}`}>
              {seoData.lighthouse.mainSite ?? 'N/A'}/100
            </div>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-400 mb-1">Tenant App</div>
            <div className={`text-xl font-bold ${getScoreColor(seoData.lighthouse.tenantApp)}`}>
              {seoData.lighthouse.tenantApp ?? 'N/A'}/100
            </div>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-400 mb-1">Admin App</div>
            <div className={`text-xl font-bold ${getScoreColor(seoData.lighthouse.adminApp)}`}>
              {seoData.lighthouse.adminApp ?? 'N/A'}/100
            </div>
          </div>
          <div className="bg-gray-900 rounded p-3 border border-blue-500">
            <div className="text-xs text-gray-400 mb-1">Average</div>
            <div className={`text-xl font-bold ${getScoreColor(seoData.lighthouse.average)}`}>
              {seoData.lighthouse.average ?? 'N/A'}/100
            </div>
          </div>
        </div>
      </div>

      {/* Schema Validation */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Structured Data (Schema.org)</h4>
        <div className="bg-gray-900 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Validation Score</span>
            <span className={`text-lg font-bold ${getScoreColor(seoData.schema.score)}`}>
              {seoData.schema.score ?? 0}/100
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400">Total Schemas:</span>
              <span className="text-white ml-2">{seoData.schema.totalCount}</span>
            </div>
            <div>
              <span className="text-gray-400">Valid:</span>
              <span className="text-green-400 ml-2">{seoData.schema.validCount}</span>
            </div>
            <div>
              <span className="text-gray-400">Errors:</span>
              <span className="text-red-400 ml-2">{seoData.schema.errorCount}</span>
            </div>
            <div>
              <span className="text-gray-400">Warnings:</span>
              <span className="text-yellow-400 ml-2">{seoData.schema.warningCount}</span>
            </div>
          </div>
          {seoData.schema.typesCovered.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <span className="text-xs text-gray-400">Types: </span>
              <span className="text-xs text-blue-400">{seoData.schema.typesCovered.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Meta & Technical SEO */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Technical SEO</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            {seoData.meta.tagsComplete ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-gray-300">Meta Tags</span>
          </div>
          <div className="flex items-center gap-2">
            {seoData.meta.analyticsDetected ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-gray-300">Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            {seoData.meta.sitemapFound ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-gray-300">Sitemap</span>
          </div>
          <div className="flex items-center gap-2">
            {seoData.meta.robotsTxtFound ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-gray-300">Robots.txt</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <span>Last audit: {formatDate(seoData.overall.checkedAt)}</span>
        <button 
          onClick={fetchSEOData}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

