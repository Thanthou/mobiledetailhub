import React from 'react';
import BookingPage from './components/BookingPage';

/**
 * BookingApp - Main booking application component
 * Purely declarative - error boundaries should be handled higher up in the component tree
 */
const BookingApp: React.FC = () => {
  return <BookingPage />;
};

export default BookingApp;
