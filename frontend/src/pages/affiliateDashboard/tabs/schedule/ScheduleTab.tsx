import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ScheduleHeader } from './components/ScheduleHeader';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ScheduleSidebar } from './components/ScheduleSidebar';
import { useScheduleData } from './hooks/useScheduleData';

export const ScheduleTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  const { appointments, loading } = useScheduleData(selectedDate);

  return (
    <div className="space-y-6">
      <ScheduleHeader 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ScheduleGrid 
          selectedDate={selectedDate}
          appointments={appointments}
          loading={loading}
        />
        <ScheduleSidebar />
      </div>
    </div>
  );
};

export default ScheduleTab;