/**
 * Currency Formatting Utilities
 * Centralized currency formatting functions for consistent display across the app
 */

/**
 * Format a number as USD currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  amount: number,
  options: {
    showCents?: boolean;
    showSymbol?: boolean;
  } = {}
): string {
  const { showCents = true, showSymbol = true } = options;
  
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  
  return showSymbol ? `$${formatted}` : formatted;
}

/**
 * Format a price for display (always shows cents)
 * @param price - The price to format
 * @returns Formatted price string (e.g., "$1,234.56")
 */
export function formatPrice(price: number): string {
  return formatCurrency(price, { showCents: true, showSymbol: true });
}

/**
 * Format a price without the dollar sign
 * @param price - The price to format
 * @returns Formatted price string without symbol (e.g., "1,234.56")
 */
export function formatPriceNoSymbol(price: number): string {
  return formatCurrency(price, { showCents: true, showSymbol: false });
}

/**
 * Format a whole dollar amount (no cents)
 * @param amount - The amount to format
 * @returns Formatted amount string (e.g., "$1,234")
 */
export function formatDollars(amount: number): string {
  return formatCurrency(amount, { showCents: false, showSymbol: true });
}

/**
 * Parse a currency string to a number
 * @param currencyString - String like "$1,234.56" or "1234.56"
 * @returns Numeric value
 */
export function parseCurrency(currencyString: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format a percentage
 * @param value - The decimal value (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places to show
 * @returns Formatted percentage string (e.g., "15%")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format a discount percentage
 * @param value - The decimal value (e.g., 0.15 for 15% off)
 * @returns Formatted discount string (e.g., "15% off")
 */
export function formatDiscount(value: number): string {
  return `${formatPercentage(value)} off`;
}

/**
 * Calculate and format a price with tax
 * @param basePrice - The base price before tax
 * @param taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns Object with formatted base, tax, and total
 */
export function formatPriceWithTax(basePrice: number, taxRate: number): {
  base: string;
  tax: string;
  total: string;
  taxAmount: number;
  totalAmount: number;
} {
  const taxAmount = basePrice * taxRate;
  const totalAmount = basePrice + taxAmount;
  
  return {
    base: formatPrice(basePrice),
    tax: formatPrice(taxAmount),
    total: formatPrice(totalAmount),
    taxAmount,
    totalAmount,
  };
}

/**
 * Format a price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string (e.g., "$100 - $200")
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Format a compact currency amount (e.g., "$1.2K", "$1.5M")
 * @param amount - The amount to format
 * @returns Compact formatted string
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return formatPrice(amount);
}

