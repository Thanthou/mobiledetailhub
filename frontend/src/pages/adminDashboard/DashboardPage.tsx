import React, { useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { AdminTabs } from './components/AdminTabs';
import { TabContent } from './components/TabContent';
import { useAdminData } from './hooks/useAdminData';
import type { AdminTab } from './types';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('database');
  const { adminData, updateAdminData } = useAdminData();

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
