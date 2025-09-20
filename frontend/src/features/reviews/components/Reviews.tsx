import React, { useState } from 'react';
import { BackgroundCarousel } from '@/shared/ui';
import { useSiteContext } from '@/shared/hooks';
import siteData from '@/data/mdh/site.json';
import { useReviews } from '../hooks/useReviews';
import ReviewsHeader from './ReviewsHeader';
import ReviewsSubHeader from './ReviewsSubHeader';
import ReviewsCarousel from './ReviewsCarousel';
import ReviewModal from './ReviewModal';

const Reviews: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMainSite } = useSiteContext();

  // Build query parameters based on site context
  const queryParams: any = {
    type: (isMainSite ? 'affiliate' : 'mdh') as 'affiliate' | 'mdh',
    status: 'approved' as const,
    limit: 50,
    featured_only: false,
    verified_only: false
  };

  if (isMainSite) {
    queryParams.business_slug = 'jps';
  }

  // Fetch reviews from database
  const { reviews, loading, error } = useReviews(queryParams);

  const handleReviewClick = (review: any) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // Use hero images as background for now
  const backgroundImages = siteData.hero.images.map(img => img.url);

  // Show loading state
  if (loading) {
    return (
      <section id="reviews" className="relative h-screen snap-start snap-always overflow-hidden">
        <BackgroundCarousel
          images={backgroundImages}
          interval={8000}
          overlay={true}
          overlayOpacity={0.7}
          altText="Customer reviews background"
        />
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
        <BackgroundCarousel
          images={backgroundImages}
          interval={8000}
          overlay={true}
          overlayOpacity={0.7}
          altText="Customer reviews background"
        />
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
        <BackgroundCarousel
          images={backgroundImages}
          interval={8000}
          overlay={true}
          overlayOpacity={0.7}
          altText="Customer reviews background"
        />
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
      {/* Background Carousel */}
      <BackgroundCarousel
        images={backgroundImages}
        interval={8000}
        overlay={true}
        overlayOpacity={0.7}
        altText="Customer reviews background"
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="max-w-6xl mx-auto w-full">
          <ReviewsHeader 
            title={siteData.reviews.title}
            subtitle={siteData.reviews.subtitle}
          />
                 <ReviewsSubHeader 
                   averageRating={parseFloat(siteData.reviews.ratingValue)}
                   totalReviews={siteData.reviews.reviewCount}
                   googleBusinessUrl={siteData.socials.googleBusiness}
                 />
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
