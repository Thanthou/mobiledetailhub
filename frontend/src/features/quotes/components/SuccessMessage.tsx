import React from 'react';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/shared/ui';

interface SuccessMessageProps {
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onClose }) => {
  return (
    <div className="text-center py-8">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <p className="text-lg text-gray-700 mb-2">Thank you for your quote request!</p>
      <p className="text-gray-600">We have received your information and will get back to you shortly.</p>
      <Button onClick={onClose} className="mt-6">
        Close
      </Button>
    </div>
  );
};

export default SuccessMessage;
