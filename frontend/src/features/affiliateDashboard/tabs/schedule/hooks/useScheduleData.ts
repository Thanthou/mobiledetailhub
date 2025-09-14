import { useEffect, useState, useCallback } from 'react';
import { getAppointments, getTimeBlocks, getBlockedDays } from '../api';
import type { Appointment, TimeBlock, BlockedDay } from '../types';

export const useScheduleData = (selectedDate: string, viewMode: 'day' | 'week' | 'month' = 'day') => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on view mode
  const getDateRange = (date: string, mode: 'day' | 'week' | 'month') => {
    const selectedDateObj = new Date(date);
    
    switch (mode) {
      case 'day':
        return { startDate: date, endDate: date };
      
      case 'week':
        // Get Monday to Sunday of the week containing the selected date
        const dayOfWeek = selectedDateObj.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(selectedDateObj);
        monday.setDate(selectedDateObj.getDate() + mondayOffset);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        return {
          startDate: monday.toISOString().split('T')[0],
          endDate: sunday.toISOString().split('T')[0]
        };
      
      case 'month':
        // Get first and last day of the month
        const firstDay = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
        const lastDay = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0);
        
        return {
          startDate: firstDay.toISOString().split('T')[0],
          endDate: lastDay.toISOString().split('T')[0]
        };
      
      default:
        return { startDate: date, endDate: date };
    }
  };

  const fetchScheduleData = useCallback(async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = getDateRange(selectedDate, viewMode);
      
      const [appointmentsData, timeBlocksData, blockedDaysData] = await Promise.all([
        getAppointments(startDate, endDate),
        getTimeBlocks(startDate, endDate),
        getBlockedDays(startDate, endDate)
      ]);
      
      setAppointments(appointmentsData);
      setTimeBlocks(timeBlocksData);
      setBlockedDays(blockedDaysData);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule data');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, viewMode]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  const refreshData = useCallback(() => {
    if (!selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    const { startDate, endDate } = getDateRange(selectedDate, viewMode);
    
    Promise.all([
      getAppointments(startDate, endDate),
      getTimeBlocks(startDate, endDate),
      getBlockedDays(startDate, endDate)
    ]).then(([appointmentsData, timeBlocksData, blockedDaysData]) => {
      setAppointments(appointmentsData);
      setTimeBlocks(timeBlocksData);
      setBlockedDays(blockedDaysData);
    }).catch((err) => {
      console.error('Error fetching schedule data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule data');
    }).finally(() => {
      setLoading(false);
    });
  }, [selectedDate, viewMode]);

  return { 
    appointments, 
    timeBlocks, 
    blockedDays,
    loading, 
    error, 
    refreshData 
  };
};