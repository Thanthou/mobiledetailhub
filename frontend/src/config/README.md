# Configuration Documentation

## Phone Numbers Configuration

### Overview
Phone numbers are stored in the database and displayed consistently across components using the `formatPhoneNumber` utility. This ensures all phone numbers are formatted as `(###) ###-####` for a professional appearance.

### Usage

#### Basic Usage
```typescript
import { formatPhoneNumber } from '../utils/fields/phoneFormatter';

// Format phone number from database
const formattedPhone = formatPhoneNumber(affiliateData.phone);
// Result: "(555) 123-4567"
```

#### In Components
```typescript
// In header components
{affiliateData.phone && (
  <span>{formatPhoneNumber(affiliateData.phone)}</span>
)}
```

### Database Structure

Phone numbers are stored in the database and accessed through:

- **Affiliate Data**: `affiliateData.phone` from the `useAffiliate()` hook
- **MDH Config**: `mdhConfig.phone` from the `useMDHConfig()` hook (if available)

### Adding New Phone Numbers

1. **Add to database:**
   - Phone numbers are stored in the `affiliates` table
   - Access via `affiliateData.phone` in components

2. **Use in components:**
```typescript
{affiliateData.phone && (
  <span>{formatPhoneNumber(affiliateData.phone)}</span>
)}
```

### Available Functions

- `formatPhoneNumber(input)` - Formats phone numbers as `(###) ###-####`
- `isCompletePhoneNumber(input)` - Validates if phone number has 10 digits
- `getPhoneDigits(input)` - Extracts only digits from phone number
- `formatPhoneNumberAsTyped(input, cursorPosition)` - Real-time formatting for input fields

### Benefits

✅ **Database-Driven** - Phone numbers stored centrally in database
✅ **Consistent Formatting** - All phone numbers display as `(###) ###-####`
✅ **Professional Appearance** - Clean, standardized phone number format
✅ **Easy Updates** - Change phone numbers in database, not code
✅ **Type Safety** - Full TypeScript support with proper validation
✅ **Real-time Formatting** - Input fields format as user types

### Migration Notes

- **Before**: Phone numbers were inconsistently formatted across components
- **After**: Phone numbers use consistent `(###) ###-####` format via `formatPhoneNumber` utility
- **Components**: Now use `formatPhoneNumber(affiliateData.phone)` for consistent display
- **Database**: Phone numbers are stored centrally and accessed via hooks
