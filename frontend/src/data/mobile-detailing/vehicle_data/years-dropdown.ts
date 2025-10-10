/**
 * Generate years for vehicle dropdowns
 * Returns array from current year + 1 down to 1950, plus "Before 1950"
 */
export const getVehicleYears = (): (number | string)[] => {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 1;
  const minYear = 1950;
  
  const years: (number | string)[] = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }
  
  // Add "Before {minYear}" at the end
  years.push(`Before ${String(minYear)}`);
  
  return years;
};

/**
 * Static years data for reference
 */
export const yearsConfig = {
  minYear: 1950,
  maxYear: new Date().getFullYear() + 1,
  totalYears: new Date().getFullYear() + 1 - 1950 + 1
} as const;

/**
 * Get years formatted for display
 */
export const getFormattedYears = () => {
  return getVehicleYears().map(year => ({
    value: year,
    label: year.toString()
  }));
};
