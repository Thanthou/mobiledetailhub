import React from 'react';

interface ReviewModalProps {
  review: any;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, isOpen, onClose }) => {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-700">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white">Review Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-orange-400 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {review.reviewerUrl ? (
                <a 
                  href={review.reviewerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl overflow-hidden hover:bg-orange-600 transition-colors"
                >
                  {review.profileImage ? (
                    <img 
                      src={review.profileImage} 
                      alt={review.customerName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    review.customerName.charAt(0).toUpperCase()
                  )}
                </a>
              ) : (
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl overflow-hidden">
                  {review.profileImage ? (
                    <img 
                      src={review.profileImage} 
                      alt={review.customerName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    review.customerName.charAt(0).toUpperCase()
                  )}
                </div>
              )}
              <div>
                {review.reviewerUrl ? (
                  <a 
                    href={review.reviewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-white hover:text-orange-400 transition-colors"
                  >
                    {review.customerName}
                  </a>
                ) : (
                  <h4 className="text-xl font-semibold text-white">{review.customerName}</h4>
                )}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {review.reviewSource && review.reviewerUrl && (
                <a 
                  href={review.reviewerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={`/icons/${review.reviewSource}.png`}
                    alt={review.reviewSource}
                    className="w-8 h-8 rounded"
                  />
                </a>
              )}
              {review.reviewSource && !review.reviewerUrl && (
                <img 
                  src={`/icons/${review.reviewSource}.png`}
                  alt={review.reviewSource}
                  className="w-8 h-8 rounded"
                />
              )}
            </div>
          </div>

          {/* Review Title */}
          {review.title && (
            <h5 className="text-lg font-medium text-white mb-3">
              {review.title}
            </h5>
          )}
          
          <p className="text-gray-300 leading-relaxed mb-4">
            {review.reviewText}
          </p>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {review.serviceCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {review.serviceCategory}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
