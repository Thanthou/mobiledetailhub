import { useState, useEffect } from 'react';

interface Appointment {
  id: number;
  time: string;
  duration: number;
  customer: string;
  service: string;
  phone: string;
  status: 'confirmed' | 'pending';
}

export const useScheduleData = (selectedDate: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockAppointments: Appointment[] = [
        { id: 1, time: '09:00', duration: 120, customer: 'John Smith', service: 'Premium Wash & Wax', phone: '(555) 0123', status: 'confirmed' },
        { id: 2, time: '11:30', duration: 180, customer: 'Sarah Johnson', service: 'Ceramic Coating', phone: '(555) 0124', status: 'confirmed' },
        { id: 3, time: '14:00', duration: 90, customer: 'Mike Davis', service: 'Interior Detail', phone: '(555) 0125', status: 'pending' },
        { id: 4, time: '16:00', duration: 150, customer: 'Lisa Chen', service: 'Paint Correction', phone: '(555) 0126', status: 'confirmed' },
      ];
      
      setTimeout(() => {
        setAppointments(mockAppointments);
        setLoading(false);
      }, 500);
    };

    fetchAppointments();
  }, [selectedDate]);

  return { appointments, loading };
};