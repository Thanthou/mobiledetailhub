import React, { Suspense } from 'react';

import { type RequestQuoteModalProps } from '../types';

// Lazy load the modal component
const RequestQuoteModal = React.lazy(() => import('./RequestQuoteModal'));

const LazyRequestQuoteModal: React.FC<RequestQuoteModalProps> = (props) => {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-stone-800 text-white p-6 rounded-lg">
        <div className="animate-pulse">Loading quote form...</div>
      </div>
    </div>}>
      <RequestQuoteModal {...props} />
    </Suspense>
  );
};

export default LazyRequestQuoteModal;
