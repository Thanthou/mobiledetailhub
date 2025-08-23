import React, { useState } from 'react';
import { AdminLayout, AdminTabs, TabContent } from './components';
import type { AdminTab } from './types';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('database');

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
  };

  return (
    <AdminLayout>
      <AdminTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <TabContent 
        activeTab={activeTab}
      />
    </AdminLayout>
  );
};

export default DashboardPage;
