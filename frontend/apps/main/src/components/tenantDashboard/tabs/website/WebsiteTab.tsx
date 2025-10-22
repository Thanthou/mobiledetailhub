import React, { useState } from 'react';
import { BarChart3, FileText, Globe,Heart } from 'lucide-react';

import WebsiteContentTab from './WebsiteContentTab';
import WebsiteDomainTab from './WebsiteDomainTab';
import WebsiteHealthTab from './WebsiteHealthTab';
import WebsitePerformanceTab from './WebsitePerformanceTab';

type WebsiteSubTab = 'content' | 'performance' | 'health' | 'domain';

interface WebsiteTabProps {
  tenantSlug?: string;
}

const WebsiteTab: React.FC<WebsiteTabProps> = ({ tenantSlug }) => {
  const [activeSubTab, setActiveSubTab] = useState<WebsiteSubTab>('content');

  const subTabs = [
    { id: 'content' as const, name: 'Content', icon: FileText },
    { id: 'performance' as const, name: 'Performance', icon: BarChart3 },
    { id: 'health' as const, name: 'Health', icon: Heart },
    { id: 'domain' as const, name: 'Domain', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="border-b border-stone-700">
        <nav className="flex space-x-8">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSubTab(tab.id); }}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeSubTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sub-tab Content */}
      <div className="mt-6">
        {activeSubTab === 'content' && <WebsiteContentTab tenantSlug={tenantSlug} />}
        {activeSubTab === 'performance' && <WebsitePerformanceTab />}
        {activeSubTab === 'health' && <WebsiteHealthTab tenantSlug={tenantSlug} />}
        {activeSubTab === 'domain' && <WebsiteDomainTab />}
      </div>
    </div>
  );
};

export default WebsiteTab;
