import { useEffect,useState } from 'react';

interface Appointment {
  id: number;
  customer: string;
  service: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending';
}

export const useRecentAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAppointments = (): void => {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockAppointments: Appointment[] = [
        { id: 1, customer: "John Smith", service: "Premium Wash", time: "2:00 PM", date: "Today", status: "confirmed" },
        { id: 2, customer: "Sarah Johnson", service: "Ceramic Coating", time: "4:30 PM", date: "Today", status: "confirmed" },
        { id: 3, customer: "Mike Davis", service: "Paint Correction", time: "10:00 AM", date: "Tomorrow", status: "pending" },
        { id: 4, customer: "Lisa Chen", service: "Interior Detail", time: "1:00 PM", date: "Tomorrow", status: "confirmed" },
      ];
      
      setTimeout(() => {
        setAppointments(mockAppointments);
        setLoading(false);
      }, 500);
    };

    fetchAppointments();
  }, []);

  return { appointments, loading };
};