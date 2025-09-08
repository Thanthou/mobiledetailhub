import { useEffect,useState } from 'react';

interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

export const useRecentReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchReviews = () => {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReviews: Review[] = [
        { id: 1, customer: "Robert Wilson", rating: 5, comment: "Amazing work! My car looks brand new.", date: "2 days ago" },
        { id: 2, customer: "Jennifer Taylor", rating: 5, comment: "Professional service and attention to detail.", date: "3 days ago" },
        { id: 3, customer: "David Brown", rating: 4, comment: "Great job, very satisfied with the results.", date: "1 week ago" },
      ];
      
      setTimeout(() => {
        setReviews(mockReviews);
        setLoading(false);
      }, 500);
    };

    fetchReviews();
  }, []);

  return { reviews, loading };
};