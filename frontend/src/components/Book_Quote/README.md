# Book_Quote Components

This folder contains all components related to booking appointments and requesting quotes.

## Components

### CTAButton
A call-to-action button component that can be configured for either "Book Now" or "Request a Quote" actions.

**Props:**
- `type`: 'book' | 'quote' - Determines button text and styling
- `onClick`: Function to handle button clicks
- `className`: Additional CSS classes
- `variant`: 'filled' | 'outlined' - Button style variant

### CTAButtonsContainer
A container component that can hold multiple CTA buttons with flexible layout options.

**Props:**
- `onBookNow`: Function to handle booking actions
- `onRequestQuote`: Function to handle quote requests
- `className`: Additional CSS classes
- `variant`: 'stacked' | 'side-by-side' - Layout variant

### QuoteModal
A modal component for collecting quote request information from users.

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal

**Features:**
- Form validation
- Phone number formatting
- Service and vehicle type selection
- API integration for quote submission

### BookingModal
A placeholder modal component for future booking functionality.

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal

## Usage

```tsx
import { CTAButton, CTAButtonsContainer, QuoteModal, BookingModal } from '../Book_Quote';

// Use individual components
<CTAButton type="quote" onClick={handleQuoteRequest} />

// Use container with multiple buttons
<CTAButtonsContainer 
  onBookNow={handleBooking}
  onRequestQuote={handleQuoteRequest}
/>

// Use modals
<QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
<BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
```

## Future Enhancements

- [ ] Implement actual booking functionality in BookingModal
- [ ] Add calendar/scheduling integration
- [ ] Add payment processing
- [ ] Add appointment confirmation emails
- [ ] Add recurring appointment options
