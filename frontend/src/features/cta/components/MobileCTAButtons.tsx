import React from 'react';
import { Calendar, MessageSquare, Phone } from 'lucide-react';

import { useData } from '@/shared/contexts';
import { cn } from '@/shared/utils/cn';

interface MobileCTAButtonsProps {
  onRequestQuote?: () => void;
  onBookNow?: () => void;
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'stacked';
}

/**
 * Mobile-optimized CTA buttons that adapt based on tenant booking capabilities
 * and mobile user behavior patterns
 */
const MobileCTAButtons: React.FC<MobileCTAButtonsProps> = ({
  onRequestQuote,
  onBookNow,
  className = '',
  layout = 'stacked'
}) => {
  const { phone, businessName, isPreview } = useData();
  
  // TODO: This should come from tenant settings/API
  // For now, we'll assume booking is enabled if we have a phone number
  const hasOnlineBooking = !!phone;
  const hasPhoneSupport = !!phone;

  // Format phone number for tel: link
  const formatPhoneForTel = (phoneNumber: string) => {
    return `tel:${phoneNumber.replace(/\D/g, '')}`;
  };

  // Mobile-optimized button styles
  const buttonBaseClasses = "flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-base transition-all duration-200 active:scale-95";
  
  const primaryButtonClasses = "bg-orange-500 hover:bg-orange-600 text-white shadow-lg";
  const secondaryButtonClasses = "bg-white/10 hover:bg-white/20 text-white border border-white/30";
  const tertiaryButtonClasses = "bg-transparent hover:bg-white/10 text-white border border-white/20";

  const containerClasses = {
    horizontal: 'flex flex-row gap-3',
    vertical: 'flex flex-col gap-3',
    stacked: 'flex flex-col gap-3'
  };

  const handleBookNowClick = () => {
    if (isPreview) {
      alert('📋 Preview Mode\n\nBooking is disabled in preview mode.\n\nThis is a demonstration site to showcase features to potential clients.');
      return;
    }
    onBookNow?.();
  };

  return (
    <div className={cn(containerClasses[layout], className)}>
      {/* Primary CTA - Book Now (full width) */}
      {hasOnlineBooking && (
        <button
          onClick={handleBookNowClick}
          className={cn(
            buttonBaseClasses, 
            primaryButtonClasses, 
            "w-full",
            isPreview && "cursor-pointer"
          )}
          aria-label={`Book an appointment with ${businessName}`}
        >
          <Calendar className="h-5 w-5" />
          Book Now
        </button>
      )}

      {/* Secondary CTAs - Call Now and Request Quote side by side */}
      <div className="flex gap-3">
        {/* Call Now */}
        {hasPhoneSupport && (
          <a
            href={formatPhoneForTel(phone)}
            className={cn(buttonBaseClasses, secondaryButtonClasses, "flex-1")}
            aria-label={`Call ${businessName} at ${phone}`}
          >
            <Phone className="h-5 w-5" />
            Call Now
          </a>
        )}

        {/* Request Quote */}
        <button
          onClick={onRequestQuote}
          className={cn(buttonBaseClasses, tertiaryButtonClasses, "flex-1")}
          aria-label={`Request a quote from ${businessName}`}
        >
          <MessageSquare className="h-5 w-5" />
          Request Quote
        </button>
      </div>
    </div>
  );
};

export default MobileCTAButtons;
