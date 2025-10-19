import React, { useState } from 'react';
import { AlertCircle, Check, Copy, ExternalLink, Globe, Settings, Shield, Zap } from 'lucide-react';

const WebsiteDomainTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [domainData, setDomainData] = useState({
    primaryDomain: 'jpsmobiledetailing.com',
    customDomain: '',
    subdomain: 'jps',
    sslStatus: 'active',
    dnsStatus: 'configured',
    lastChecked: '2024-01-15T10:30:00Z',
    nameservers: [
      'ns1.example.com',
      'ns2.example.com'
    ],
    records: [
      { type: 'A', name: '@', value: '192.168.1.1', ttl: 3600 },
      { type: 'CNAME', name: 'www', value: 'jpsmobiledetailing.com', ttl: 3600 },
      { type: 'MX', name: '@', value: 'mail.example.com', ttl: 3600 }
    ]
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCopy = (text: string, field: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => { setCopiedField(null); }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'configured':
        return 'text-green-400 bg-green-900/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'error':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'configured':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Zap className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Domain Settings</h2>
          <p className="text-gray-400 mt-1">Manage your website domain and DNS configuration</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => { setIsEditing(!isEditing); }}
            className="flex items-center px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </button>
          )}
        </div>
      </div>

      {/* Domain Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-orange-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Primary Domain</h3>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domainData.sslStatus)}`}>
              {getStatusIcon(domainData.sslStatus)}
              <span className="ml-1 capitalize">{domainData.sslStatus}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-mono">{domainData.primaryDomain}</span>
            <button
              onClick={() => { handleCopy(domainData.primaryDomain, 'primary'); }}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {copiedField === 'primary' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-orange-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">SSL Certificate</h3>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domainData.sslStatus)}`}>
              {getStatusIcon(domainData.sslStatus)}
              <span className="ml-1 capitalize">{domainData.sslStatus}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Valid until: Jan 15, 2025</p>
        </div>

        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-orange-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">DNS Status</h3>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domainData.dnsStatus)}`}>
              {getStatusIcon(domainData.dnsStatus)}
              <span className="ml-1 capitalize">{domainData.dnsStatus}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Last checked: {new Date(domainData.lastChecked).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Domain Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Domain Settings */}
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-orange-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Primary Domain</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="domain-name-input" className="block text-sm font-medium text-gray-300 mb-2">
                Domain Name
              </label>
              {isEditing ? (
                <input
                  id="domain-name-input"
                  type="text"
                  value={domainData.primaryDomain}
                  onChange={(e) => { setDomainData({ ...domainData, primaryDomain: e.target.value }); }}
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono">{domainData.primaryDomain}</span>
                  <button
                    onClick={() => { handleCopy(domainData.primaryDomain, 'primary'); }}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedField === 'primary' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="subdomain-input" className="block text-sm font-medium text-gray-300 mb-2">
                Subdomain
              </label>
              {isEditing ? (
                <input
                  id="subdomain-input"
                  type="text"
                  value={domainData.subdomain}
                  onChange={(e) => { setDomainData({ ...domainData, subdomain: e.target.value }); }}
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono">{domainData.subdomain}.yourdomain.com</span>
                  <button
                    onClick={() => { handleCopy(`${domainData.subdomain}.yourdomain.com`, 'subdomain'); }}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedField === 'subdomain' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Domain Settings */}
        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <div className="flex items-center mb-4">
            <ExternalLink className="h-5 w-5 text-orange-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Custom Domain</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="custom-domain-input" className="block text-sm font-medium text-gray-300 mb-2">
                Custom Domain (Optional)
              </label>
              {isEditing ? (
                <input
                  id="custom-domain-input"
                  type="text"
                  value={domainData.customDomain}
                  onChange={(e) => { setDomainData({ ...domainData, customDomain: e.target.value }); }}
                  placeholder="your-custom-domain.com"
                  className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono">
                    {domainData.customDomain || 'No custom domain set'}
                  </span>
                  {domainData.customDomain && (
                    <button
                      onClick={() => { handleCopy(domainData.customDomain, 'custom'); }}
                      className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedField === 'custom' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-400">
              <p>To use a custom domain:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Purchase a domain from a registrar</li>
                <li>Point your domain&apos;s DNS to our nameservers</li>
                <li>Add your domain here once DNS is configured</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Records */}
      <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-orange-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">DNS Records</h3>
          </div>
          <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            Refresh DNS
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Value</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">TTL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domainData.records.map((record, index) => (
                <tr key={index} className="border-b border-stone-700/50">
                  <td className="py-3 px-4 text-sm text-white font-mono">{record.type}</td>
                  <td className="py-3 px-4 text-sm text-white font-mono">{record.name}</td>
                  <td className="py-3 px-4 text-sm text-white font-mono">{record.value}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{record.ttl}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => { handleCopy(record.value, `record-${index}`); }}
                      className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedField === `record-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Globe className="h-4 w-4 mr-2" />
            View Live Site
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            DNS Settings
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors">
            <Shield className="h-4 w-4 mr-2" />
            SSL Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDomainTab;
