# Shared Form Primitives

Reusable form components to prevent duplication across features. All components follow these principles:

- **No network calls** - pure presentational components
- **Consistent styling** - Tailwind + shadcn/ui conventions
- **Built-in validation** - error display and required field indicators
- **Type-safe** - full TypeScript support

## Available Components

### TextField
Basic text input with validation and error display.

```tsx
import { TextField } from '@/shared/ui';

<TextField
  label="Full Name"
  value={name}
  onChange={(value) => setName(value)}
  error={errors.name}
  placeholder="Enter your name"
  required
/>
```

**Props:**
- `label` - Field label (required)
- `value` - Current value (required)
- `onChange` - Value change handler (required)
- `error` - Error message(s) to display
- `type` - Input type: 'text', 'email', 'url', 'password' (default: 'text')
- `placeholder` - Placeholder text
- `required` - Show required indicator
- `disabled` - Disable input
- `helperText` - Helper text below input
- `autoComplete` - Autocomplete attribute

### PhoneField
Phone number input with auto-formatting.

```tsx
import { PhoneField } from '@/shared/ui';

<PhoneField
  label="Phone Number"
  value={phone}
  onChange={(value) => setPhone(value)}
  error={errors.phone}
  required
/>
```

**Props:** Same as TextField (minus `type`)

### SelectField
Dropdown/select input.

```tsx
import { SelectField } from '@/shared/ui';

<SelectField
  label="Vehicle Type"
  value={vehicleType}
  onChange={(value) => setVehicleType(value)}
  options={['Sedan', 'SUV', 'Truck']}
  // Or with complex options:
  // options={[{ value: 'sedan', label: 'Sedan' }, ...]}
  error={errors.vehicleType}
  placeholder="Select vehicle type"
  required
/>
```

**Props:**
- `options` - Array of strings or `{ value, label, disabled? }` objects
- Other props same as TextField

### TextAreaField
Multi-line text input.

```tsx
import { TextAreaField } from '@/shared/ui';

<TextAreaField
  label="Message"
  value={message}
  onChange={(value) => setMessage(value)}
  error={errors.message}
  rows={4}
  maxLength={500}
  helperText="Tell us about your needs"
/>
```

**Props:**
- `rows` - Number of visible rows (default: 4)
- `maxLength` - Maximum character count (shows counter)
- Other props same as TextField

### PriceInput
Currency input that handles price in cents (backend format).

```tsx
import { PriceInput } from '@/shared/ui';

<PriceInput
  label="Price"
  value={priceCents}  // e.g., 12500 for $125.00
  onChange={(cents) => setPriceCents(cents)}
  error={errors.price}
  min={1000}  // $10 minimum
  max={100000}  // $1000 maximum
/>
```

**Props:**
- `value` - Price in cents (number)
- `onChange` - Returns price in cents (number)
- `min`, `max` - Min/max values in cents
- Other props same as TextField

### CheckboxField
Checkbox input with label.

```tsx
import { CheckboxField } from '@/shared/ui';

<CheckboxField
  label="I agree to the terms and conditions"
  checked={agreedToTerms}
  onChange={(checked) => setAgreedToTerms(checked)}
  error={errors.terms}
  helperText="Please read our terms carefully"
/>
```

**Props:**
- `label` - Label text (required)
- `checked` - Current checked state (required)
- `onChange` - Change handler (required)
- `error`, `helperText`, `disabled` - Same as other fields

### SubmitButton
Form submit button with loading states.

```tsx
import { SubmitButton } from '@/shared/ui';

<SubmitButton
  isLoading={isSubmitting}
  disabled={!isFormValid}
  variant="primary"
  size="lg"
  fullWidth
>
  Submit Quote Request
</SubmitButton>
```

**Props:**
- `isLoading` - Show loading spinner
- `disabled` - Disable button
- `variant` - 'primary', 'secondary', 'danger' (default: 'primary')
- `size` - 'sm', 'md', 'lg' (default: 'md')
- `fullWidth` - Expand to full width
- `type` - 'submit' or 'button' (default: 'submit')
- `loadingText` - Text to show while loading (default: 'Loading...')

## Migration Example

See `ContactSection.refactored.tsx` in `features/quotes/components/` for a complete before/after example.

## Benefits

1. **Less boilerplate** - No manual class string construction
2. **Consistent styling** - Forms look the same across all features
3. **Built-in accessibility** - Proper labels, ARIA attributes
4. **Easier maintenance** - Update one component, fix everywhere
5. **Type safety** - Catch errors at compile time

## Adding New Primitives

When adding new form primitives:

1. Create file in `frontend/src/shared/ui/forms/[ComponentName].tsx`
2. Follow the existing pattern (props interface, component with proper types)
3. Export from `frontend/src/shared/ui/index.ts`
4. Add documentation here
5. No network calls - keep components pure
6. Use Tailwind for styling (no ad-hoc inline styles)

