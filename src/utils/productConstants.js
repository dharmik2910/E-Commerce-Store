// Product-related constants and configurations

// Sort options
export const SORT_OPTIONS = {
  DEFAULT: 'default',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
};

// Sort option labels for display
export const SORT_OPTION_LABELS = {
  [SORT_OPTIONS.DEFAULT]: 'Default',
  [SORT_OPTIONS.PRICE_LOW]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_HIGH]: 'Price: High to Low',
  [SORT_OPTIONS.NAME_ASC]: 'Name: A to Z',
  [SORT_OPTIONS.NAME_DESC]: 'Name: Z to A',
};

// Pagination defaults
export const DEFAULT_ITEMS_PER_PAGE = 12;
export const MAX_ITEMS_PER_PAGE = 100;

// Product display limits
export const MAX_RECENTLY_VIEWED = 10;
export const DEFAULT_RECOMMENDATIONS_LIMIT = 4;

// Product status
export const PRODUCT_STATUS = {
  IN_STOCK: 'in-stock',
  OUT_OF_STOCK: 'out-of-stock',
  LOW_STOCK: 'low-stock',
  PRE_ORDER: 'pre-order',
};

// Stock thresholds
export const LOW_STOCK_THRESHOLD = 10;

// Helper function to format category name for display
export const formatCategoryName = (category) => {
  if (!category) return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get product stock status
export const getProductStockStatus = (product) => {
  if (!product.stock && product.stock !== 0) return PRODUCT_STATUS.IN_STOCK;
  if (product.stock === 0) return PRODUCT_STATUS.OUT_OF_STOCK;
  if (product.stock <= LOW_STOCK_THRESHOLD) return PRODUCT_STATUS.LOW_STOCK;
  return PRODUCT_STATUS.IN_STOCK;
};

// Helper function to check if product is available
export const isProductAvailable = (product) => {
  return product.stock > 0;
};

// Helper function to get product images array
export const getProductImages = (product) => {
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (product.thumbnail) {
    return [product.thumbnail];
  }
  return [];
};

// Helper function to calculate original price from discount
export const calculateOriginalPrice = (price, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) return null;
  return price / (1 - discountPercentage / 100);
};

