import React, { useState } from 'react';
import { useData } from '@/features/header';
import { getImageOpacityClasses, getTransitionStyles } from '@/shared/utils';
import { useReviews, useRotatingReviews, useReviewsContent } from '../hooks';
import { ReviewsProps } from '../types/types';
import ReviewsHeader from './ReviewsHeader';
import ReviewsSummary from '@/shared/ui/ReviewsSummary';
import ReviewsCarousel from './ReviewsCarousel';
import ReviewModal from './ReviewModal';

const Reviews: React.FC<ReviewsProps> = ({
  maxReviews = 50,
  tenantSlug,
  customHeading,
  customIntro,
  feedKey,
  locationData
}) => {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get content from database (with fallbacks)
  const { title, subtitle } = useReviewsContent({ locationData, customHeading, customIntro });
  
  // Get tenant context
  let isTenant = false;
  try {
    const tenantData = useData();
    isTenant = tenantData?.isTenant || false;
  } catch {
    // Not in tenant context, so it's main site
    isTenant = false;
  }

  // Build query parameters based on props and site context
  const queryParams: any = {
    limit: maxReviews
  };

  // Add tenant slug if provided
  if (tenantSlug) {
    queryParams.tenant_slug = tenantSlug;
  }

  // TODO: Implement feedKey for GBP/Yelp integration
  // The feedKey prop is available for future implementation of external review feeds
  // Example: feedKey: "gbp:bullhead-city-az" for Google Business Profile
  // Example: feedKey: "yelp:las-vegas-nv" for Yelp integration
  const finalFeedKey = feedKey || locationData?.reviewsSection?.feedKey;
  if (finalFeedKey) {
    console.log('FeedKey available for future implementation:', finalFeedKey);
  }

  if (isTenant) {
    // For tenant sites, use the tenant slug from the URL
    const urlSlug = window.location.pathname.split('/')[1];
    if (urlSlug) {
      queryParams.tenant_slug = urlSlug;
    }
  }

  // Fetch reviews from database
  const { reviews, loading, error } = useReviews(queryParams);
  

  // Use rotating review images as background
  const { images: backgroundImages, currentIndex, loading: backgroundLoading } = useRotatingReviews(reviews);

  const handleReviewClick = (review: any) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // Show loading state
  if (loading) {
    return (
      <section id="reviews" className="relative h-screen snap-start snap-always overflow-hidden">
        {/* Rotating Background Images with Overlay */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Customer reviews background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
              style={getTransitionStyles(2000)}
              decoding={index === 0 ? 'sync' : 'async'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-stone-900/85"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="reviews" className="relative h-screen snap-start snap-always overflow-hidden">
        {/* Rotating Background Images with Overlay */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Customer reviews background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
              style={getTransitionStyles(2000)}
              decoding={index === 0 ? 'sync' : 'async'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-stone-900/85"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">Error loading reviews</p>
            <p className="text-white text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!reviews.length) {
    return (
      <section id="reviews" className="relative h-screen snap-start snap-always overflow-hidden">
        {/* Rotating Background Images with Overlay */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Customer reviews background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
              style={getTransitionStyles(2000)}
              decoding={index === 0 ? 'sync' : 'async'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-stone-900/85"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-lg">No reviews available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="relative h-screen snap-start snap-always overflow-hidden">
      {/* Rotating Background Images with Overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Customer reviews background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
            style={getTransitionStyles(2000)}
            decoding={index === 0 ? 'sync' : 'async'}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-stone-900/85"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="max-w-6xl mx-auto w-full">
          <ReviewsHeader 
            title={title}
            subtitle={subtitle}
          />
          <ReviewsSummary className="mb-8" />
          <ReviewsCarousel 
            reviews={reviews}
            onReviewClick={handleReviewClick}
          />
        </div>
      </div>

      <ReviewModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Reviews;
