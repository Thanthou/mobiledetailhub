// Legacy BookingSteps component - now just exports BookingFlowController
// This maintains backward compatibility while using the new architecture
import React from 'react';

import BookingFlowController from './BookingFlowController';

const BookingSteps: React.FC = () => {
  return <BookingFlowController />;
};

export default BookingSteps;
