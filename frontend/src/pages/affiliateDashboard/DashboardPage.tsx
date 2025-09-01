import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardTabs } from './components/DashboardTabs';
import { TabContent } from './components/TabContent';
import type { DetailerData, DashboardTab } from './types';



const DashboardPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [detailerData, setDetailerData] = useState<DetailerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch affiliate data based on business slug
  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!businessSlug) {
        setError('No business slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const url = `/api/admin/users?status=affiliates&slug=${businessSlug}`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.users && data.users.length > 0) {
            const affiliate = data.users[0];
            // Transform affiliate data to DetailerData format
            const transformedData: DetailerData = {
              business_name: affiliate.business_name || 'Unknown Business',
              first_name: affiliate.owner?.split(' ')[0] || 'Unknown',
              last_name: affiliate.owner?.split(' ').slice(1).join(' ') || 'Unknown',
              email: affiliate.email || 'No email',
              phone: affiliate.phone || 'No phone',
              location: affiliate.service_areas && affiliate.service_areas.length > 0 
                ? `${affiliate.service_areas[0].city}, ${affiliate.service_areas[0].state}` 
                : 'No location',
              services: affiliate.service_areas && affiliate.service_areas.length > 0 
                ? affiliate.service_areas.map((area: any) => area.city).slice(0, 4)
                : ['Mobile Detailing'],
              memberSince: affiliate.created_at ? new Date(affiliate.created_at).getFullYear().toString() : 'Unknown'
            };
            setDetailerData(transformedData);
          } else {
            setError('Affiliate not found');
          }
        } else {
          setError('Failed to fetch affiliate data');
        }
      } catch (error) {
        setError('Failed to fetch affiliate data');
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [businessSlug]);

  const handleDataUpdate = (data: Partial<DetailerData>) => {
    if (detailerData) {
      setDetailerData({ ...detailerData, ...data });
    }
  };

  const handleBackToForm = () => {
    // Navigate back to main site or form
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading affiliate dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !detailerData) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg text-red-600">Error: {error || 'Failed to load affiliate data'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          detailerData={detailerData}
          onBackToForm={handleBackToForm}
        />
        
        <DashboardTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <TabContent 
          activeTab={activeTab}
          detailerData={detailerData}
          onDataUpdate={handleDataUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;