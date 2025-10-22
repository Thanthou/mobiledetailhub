import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price?: number;
}

export interface ScheduleOption {
  date: string;
  timeSlots: TimeSlot[];
  available: boolean;
}

/**
 * Hook to load schedule options for a specific location and service
 */
export const useScheduleOptions = (locationId?: string, serviceId?: string, dateRange?: { start: string; end: string }): UseQueryResult<ScheduleOption[]> => {
  return useQuery<ScheduleOption[]>({
    queryKey: ['scheduleOptions', locationId, serviceId, dateRange],
    queryFn: async (): Promise<ScheduleOption[]> => {
      // TODO: Replace with actual API call
      // For now, return mock data with current dates
      const today = new Date();
      const mockScheduleOptions: ScheduleOption[] = [];
      
      // Generate available dates for the next 30 days (calendar will default future dates to available)
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Make all future dates available (past dates are handled by calendar component)
        const isAvailable = true;
        
        mockScheduleOptions.push({
          date: dateStr,
          available: isAvailable,
          timeSlots: [
            { id: `${String(i)}-1`, time: '9:00 AM', available: true },
            { id: `${String(i)}-2`, time: '10:00 AM', available: true },
            { id: `${String(i)}-3`, time: '11:00 AM', available: i % 4 !== 0 }, // Some unavailable
            { id: `${String(i)}-4`, time: '1:00 PM', available: true },
            { id: `${String(i)}-5`, time: '2:00 PM', available: true },
            { id: `${String(i)}-6`, time: '3:00 PM', available: i % 5 !== 0 } // Some unavailable
          ]
        });
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockScheduleOptions;
    },
    enabled: !!locationId && !!serviceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get available time slots for a specific date
 */
export const useTimeSlots = (date: string, locationId?: string, serviceId?: string) => {
  const { data: scheduleOptions, ...rest } = useScheduleOptions(locationId, serviceId);
  
  const foundOption = scheduleOptions?.find((option: ScheduleOption) => option.date === date);
  const timeSlots: TimeSlot[] = foundOption?.timeSlots ?? [];
  
  return {
    timeSlots,
    ...rest
  };
};
