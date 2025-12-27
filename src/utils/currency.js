// Currency formatting utility
// DummyJSON API returns prices in USD
// Formatting prices in USD according to the data

/**
 * Formats price in USD with $ symbol
 * @param {number} price - Price in USD
 * @returns {string} Formatted price in USD with $ symbol
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  
  return `$${price.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};


