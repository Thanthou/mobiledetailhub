import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { DashboardTab, DetailerData } from '@/features/affiliateDashboard/types';

import { DashboardHeader } from './DashboardHeader';
import { DashboardLayout } from './DashboardLayout';
import { DashboardTabs } from './DashboardTabs';
import { TabContent } from './TabContent';

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
        const url = `/api/tenants/${businessSlug}`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token ?? ''}`
          }
        });

        if (response.ok) {
          const data = await response.json() as { success: boolean; affiliate?: unknown };
          if (data.success && data.affiliate) {
            const affiliate = data.affiliate as {
              business_name?: string;
              first_name?: string;
              last_name?: string;
              owner?: string;
              business_email?: string;
              personal_email?: string;
              phone?: string;
              service_areas?: Array<{ city: string; state: string }>;
              created_at?: string;
            };
            // Transform affiliate data to DetailerData format
            const transformedData: DetailerData = {
              business_name: affiliate.business_name || 'Unknown Business',
              first_name: affiliate.first_name || (affiliate.owner ? affiliate.owner.split(' ')[0] : '') || 'Unknown',
              last_name: affiliate.last_name || (affiliate.owner ? affiliate.owner.split(' ').slice(1).join(' ') : '') || 'Unknown',
              email: affiliate.business_email || affiliate.personal_email || 'No email',
              phone: affiliate.phone || 'No phone',
              location: affiliate.service_areas && Array.isArray(affiliate.service_areas) && affiliate.service_areas.length > 0 
                ? `${affiliate.service_areas[0]?.city ?? ''}, ${affiliate.service_areas[0]?.state ?? ''}` 
                : 'No location',
              services: affiliate.service_areas && Array.isArray(affiliate.service_areas) && affiliate.service_areas.length > 0 
                ? affiliate.service_areas.map((area: { city: string }) => area.city).slice(0, 4)
                : ['Mobile Detailing'],
              memberSince: affiliate.created_at ? new Date(affiliate.created_at).getFullYear().toString() : 'Unknown'
            };
            setDetailerData(transformedData);
          } else {
            setError('Business not found');
          }
        } else {
          setError('Failed to fetch business data');
        }
      } catch {
        setError('Failed to fetch business data');
      } finally {
        setLoading(false);
      }
    };

    void fetchAffiliateData();
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
            <p className="text-lg text-gray-600">Loading business dashboard...</p>
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
            <p className="text-lg text-red-600">Error: {error || 'Failed to load business data'}</p>
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
