import React, { useState } from 'react';
import { Star, Send, AlertCircle, User, Link, MessageSquare, Upload } from 'lucide-react';
import { createReview, uploadAvatar, type TenantReviewData } from '../../../api/reviewsApi';

interface ReviewFormData {
  customerName: string;
  reviewerUrl: string;
  rating: number;
  comment: string;
  vehicleType: string;
  paintCorrection: boolean;
  ceramicCoating: boolean;
  paintProtectionFilm: boolean;
  source: 'website' | 'google' | 'yelp' | 'facebook';
  avatarFile?: File;
}

interface AddReviewFormProps {
  tenantSlug?: string;
}

export const AddReviewForm: React.FC<AddReviewFormProps> = ({ tenantSlug }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    customerName: '',
    reviewerUrl: '',
    rating: 0,
    comment: '',
    vehicleType: 'car',
    paintCorrection: false,
    ceramicCoating: false,
    paintProtectionFilm: false,
    source: 'website',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const vehicleTypes = [
    { value: 'car', label: 'Car' },
    { value: 'truck', label: 'Truck' },
    { value: 'suv', label: 'SUV' },
    { value: 'boat', label: 'Boat' },
    { value: 'rv', label: 'RV' },
    { value: 'motorcycle', label: 'Motorcycle' },
  ];

  const detectReviewSource = (url: string): 'website' | 'google' | 'yelp' | 'facebook' => {
    if (!url) return 'website';
    
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('google.com') || lowerUrl.includes('maps.google') || lowerUrl.includes('google.com/maps')) {
      return 'google';
    }
    if (lowerUrl.includes('yelp.com')) {
      return 'yelp';
    }
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
      return 'facebook';
    }
    
    return 'website';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
      
      // Auto-detect review source when reviewer URL changes
      if (name === 'reviewerUrl') {
        newData.source = detectReviewSource(value as string);
      }
      
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage({
          type: 'error',
          message: 'Avatar file must be less than 5MB',
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
      }));
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => interactive && handleRatingClick(index + 1)}
        disabled={!interactive}
        className={`h-8 w-8 transition-colors ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-300'
        } ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
      >
        <Star className="h-full w-full" />
      </button>
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setSubmitMessage({
        type: 'error',
        message: 'Please select a rating',
      });
      return;
    }

    if (!tenantSlug) {
      setSubmitMessage({
        type: 'error',
        message: 'Tenant information is missing. Please refresh the page.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Step 1: Create the review first (without avatar)
      const reviewData: TenantReviewData = {
        customer_name: formData.customerName,
        rating: formData.rating,
        comment: formData.comment,
        reviewer_url: formData.reviewerUrl || undefined,
        vehicle_type: formData.vehicleType as TenantReviewData['vehicle_type'],
        paint_correction: formData.paintCorrection,
        ceramic_coating: formData.ceramicCoating,
        paint_protection_film: formData.paintProtectionFilm,
        source: formData.source,
        // Don't include avatar_filename yet - we'll upload the file first
      };

      const createResponse = await createReview(tenantSlug, reviewData);
      const reviewId = createResponse.data?.id;
      
      console.log('Review created:', { reviewId, response: createResponse });

      // Step 2: Upload avatar if provided
      if (formData.avatarFile && reviewId) {
        try {
          console.log('Uploading avatar:', { 
            fileName: formData.avatarFile.name, 
            customerName: formData.customerName, 
            reviewId 
          });
          const avatarResult = await uploadAvatar(formData.avatarFile, formData.customerName, reviewId);
          console.log('Avatar upload result:', avatarResult);
        } catch (avatarError) {
          // Avatar upload failed, but review was created successfully
          console.warn('Avatar upload failed:', avatarError);
          // Don't fail the entire operation for avatar upload failure
        }
      }
      
      setSubmitMessage({
        type: 'success',
        message: 'Review published successfully!',
      });
      
      // Reset form
      setFormData({
        customerName: '',
        reviewerUrl: '',
        rating: 0,
        comment: '',
        vehicleType: 'car',
        paintCorrection: false,
        ceramicCoating: false,
        paintProtectionFilm: false,
        source: 'website',
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to add review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.customerName.trim() && 
                     formData.rating > 0 && 
                     formData.comment.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white">Add New Review</h3>
        <p className="text-gray-400 text-sm">
          Add a customer review to showcase your services
        </p>
      </div>

      {/* Form */}
      <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="flex items-center text-sm font-medium text-white mb-2">
                <User className="h-4 w-4 mr-2" />
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reviewerUrl" className="flex items-center text-sm font-medium text-white mb-2">
                <Link className="h-4 w-4 mr-2" />
                Reviewer Profile URL
              </label>
              <input
                type="url"
                id="reviewerUrl"
                name="reviewerUrl"
                value={formData.reviewerUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., https://www.google.com/maps/contrib/123456789"
              />
              <p className="text-xs text-gray-400 mt-1">
                Link to reviewer's profile page (Google, Yelp, etc.)
              </p>
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-white mb-2">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-1/4 px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Types */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Service Types
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paintCorrection"
                  name="paintCorrection"
                  checked={formData.paintCorrection}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 bg-stone-700 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="paintCorrection" className="ml-2 text-sm text-white">
                  Paint Correction
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ceramicCoating"
                  name="ceramicCoating"
                  checked={formData.ceramicCoating}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 bg-stone-700 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="ceramicCoating" className="ml-2 text-sm text-white">
                  Ceramic Coating
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paintProtectionFilm"
                  name="paintProtectionFilm"
                  checked={formData.paintProtectionFilm}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 bg-stone-700 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="paintProtectionFilm" className="ml-2 text-sm text-white">
                  Paint Protection Film
                </label>
              </div>
            </div>
          </div>

          {/* Review Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-white mb-2">
              Review Source
              {formData.reviewerUrl && (
                <span className="text-xs text-gray-400 ml-2">(auto-detected)</span>
              )}
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="w-1/4 px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="website">Website</option>
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="facebook">Facebook</option>
            </select>
            {formData.reviewerUrl && (
              <p className="text-xs text-gray-400 mt-1">
                Automatically detected from profile URL. You can change this manually if needed.
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars(formData.rating, true)}
              {formData.rating > 0 && (
                <span className="ml-3 text-gray-300">
                  {formData.rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="flex items-center text-sm font-medium text-white mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Review Comment *
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Enter the customer's review comment..."
              required
            />
          </div>


          {/* Avatar Image Upload */}
          <div>
            <label htmlFor="avatarFile" className="flex items-center text-sm font-medium text-white mb-2">
              <Upload className="h-4 w-4 mr-2" />
              Avatar Image (Optional)
            </label>
            <input
              type="file"
              id="avatarFile"
              name="avatarFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-600 file:text-white hover:file:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {formData.avatarFile && (
              <div className="mt-2 text-sm text-gray-400">
                Selected: {formData.avatarFile.name} ({(formData.avatarFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${
              submitMessage.type === 'success'
                ? 'bg-green-900/20 border border-green-700 text-green-400'
                : 'bg-red-900/20 border border-red-700 text-red-400'
            }`}>
              <AlertCircle className="h-5 w-5" />
              <span>{submitMessage.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isFormValid && !isSubmitting
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Adding Review...' : 'Add Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
