import { useEffect,useState } from 'react';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning';
  message: string;
  time: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = (): void => {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockNotifications: Notification[] = [
        { id: 1, type: 'info', message: "New appointment request from Emma Wilson", time: "5 min ago" },
        { id: 2, type: 'success', message: "Payment received: $150 from John Smith", time: "1 hour ago" },
        { id: 3, type: 'warning', message: "Reminder: Restock ceramic coating supplies", time: "2 hours ago" },
      ];
      
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    };

    fetchNotifications();
  }, []);

  return { notifications, loading };
};