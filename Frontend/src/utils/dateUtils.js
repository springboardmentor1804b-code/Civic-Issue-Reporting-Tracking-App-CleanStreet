/**
 * Format date to DD/MM
 */
export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short"
  });
};

/**
 * Format date to Month Year (for monthly charts)
 */
export const formatMonthYear = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric"
  });
};
