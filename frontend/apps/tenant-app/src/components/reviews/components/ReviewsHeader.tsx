import React from 'react';

interface ReviewsHeaderProps {
  title?: string;
  subtitle?: string;
}

const ReviewsHeader: React.FC<ReviewsHeaderProps> = ({
  title = "Customer Reviews",
  subtitle = "See what our customers are saying about our mobile detailing services"
}) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">
        {title}
      </h2>
      <p className="text-xl text-theme-text-muted max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default ReviewsHeader;
