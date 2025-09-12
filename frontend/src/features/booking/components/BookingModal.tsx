import type React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSiteContext } from '@/shared/hooks';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { businessSlug } = useParams();
  const { isAffiliate } = useSiteContext();

  useEffect(() => {
    if (isOpen) {
      // Automatically navigate to booking page when modal opens
      onClose(); // Close the modal first
      
      // Navigate to the appropriate booking route based on context
      if (isAffiliate && businessSlug) {
        void navigate(`/${businessSlug}/booking`);
      } else {
        void navigate('/booking');
      }
    }
  }, [isOpen, navigate, onClose, isAffiliate, businessSlug]);

  // Don't render anything since we're redirecting immediately
  return null;
};

export default BookingModal;
