import { z } from 'zod';

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters (e.g., CA)').toUpperCase(),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
});

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  personalPhone: z.string().regex(phoneRegex, 'Invalid phone number'),
  personalEmail: z.email('Invalid email address'),
});

export const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(100),
  businessPhone: z.string().regex(phoneRegex, 'Invalid phone number'),
  businessEmail: z.email('Invalid email address'),
  businessAddress: addressSchema,
  industry: z.string().optional(),
});

export const planSelectionSchema = z.object({
  selectedPlan: z.enum(['starter', 'pro', 'enterprise'], {
    errorMap: () => ({ message: 'Please select a plan' }),
  }),
  planPrice: z.number().min(0),
});

export const paymentSchema = z.object({
  billingAddress: addressSchema,
  useSameAddress: z.boolean(),
});

/**
 * Formats a phone number as user types: (123) 456-7890
 */
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return value;

  const parts = [match[1], match[2], match[3]].filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
  return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
};

/**
 * Validates an email address using Zod
 */
export const validateEmail = (email: string): boolean => {
  try {
    z.email().parse(email);
    return true;
  } catch {
    return false;
  }
};

/**
 * Suggests email correction for common typos
 */
export const suggestEmailCorrection = (email: string): string | null => {
  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
  ];

  const parts = email.split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1].toLowerCase();

  for (const commonDomain of commonDomains) {
    if (domain !== commonDomain && isCloseMatch(domain, commonDomain)) {
      return `${parts[0]}@${commonDomain}`;
    }
  }

  return null;
};

function isCloseMatch(str1: string, str2: string): boolean {
  if (Math.abs(str1.length - str2.length) > 2) return false;

  let differences = 0;
  const maxLen = Math.max(str1.length, str2.length);

  for (let i = 0; i < maxLen; i++) {
    if (str1[i] !== str2[i]) differences++;
    if (differences > 2) return false;
  }

  return differences > 0 && differences <= 2;
}

