// Product details utilities and structure

// Product detail sections
export const PRODUCT_DETAIL_SECTIONS = {
  OVERVIEW: 'overview',
  SPECIFICATIONS: 'specifications',
  SHIPPING: 'shipping',
  WARRANTY: 'warranty',
  RETURNS: 'returns',
  REVIEWS: 'reviews',
};

// Product specification categories
export const SPECIFICATION_CATEGORIES = {
  PHYSICAL: 'physical',
  TECHNICAL: 'technical',
  FEATURES: 'features',
  COMPATIBILITY: 'compatibility',
  PACKAGE: 'package',
};

// Product detail field mappings
export const PRODUCT_DETAIL_FIELDS = {
  // Basic Information
  TITLE: 'title',
  DESCRIPTION: 'description',
  BRAND: 'brand',
  CATEGORY: 'category',
  SKU: 'sku',
  
  // Pricing
  PRICE: 'price',
  DISCOUNT_PERCENTAGE: 'discountPercentage',
  ORIGINAL_PRICE: 'originalPrice',
  
  // Stock & Availability
  STOCK: 'stock',
  AVAILABILITY_STATUS: 'availabilityStatus',
  MINIMUM_ORDER_QUANTITY: 'minimumOrderQuantity',
  
  // Physical Details
  WEIGHT: 'weight',
  DIMENSIONS: 'dimensions',
  
  // Shipping & Policies
  SHIPPING_INFORMATION: 'shippingInformation',
  WARRANTY_INFORMATION: 'warrantyInformation',
  RETURN_POLICY: 'returnPolicy',
  
  // Media
  IMAGES: 'images',
  THUMBNAIL: 'thumbnail',
  
  // Ratings & Reviews
  RATING: 'rating',
  REVIEWS: 'reviews',
  
  // Additional
  TAGS: 'tags',
  METADATA: 'metadata',
};

// Get product specifications organized by category
export const getProductSpecifications = (product) => {
  if (!product) return {};
  
  const specs = {
    [SPECIFICATION_CATEGORIES.PHYSICAL]: {},
    [SPECIFICATION_CATEGORIES.TECHNICAL]: {},
    [SPECIFICATION_CATEGORIES.FEATURES]: {},
    [SPECIFICATION_CATEGORIES.COMPATIBILITY]: {},
    [SPECIFICATION_CATEGORIES.PACKAGE]: {},
  };
  
  // Physical specifications
  if (product.weight) {
    specs[SPECIFICATION_CATEGORIES.PHYSICAL].weight = {
      label: 'Weight',
      value: `${product.weight} units`,
      raw: product.weight,
    };
  }
  
  if (product.dimensions) {
    specs[SPECIFICATION_CATEGORIES.PHYSICAL].dimensions = {
      label: 'Dimensions',
      value: product.dimensions,
      formatted: product.dimensions.width && product.dimensions.height && product.dimensions.depth
        ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} units`
        : 'N/A',
    };
  }
  
  // Technical specifications (if available in product)
  if (product.specifications) {
    Object.assign(specs[SPECIFICATION_CATEGORIES.TECHNICAL], product.specifications);
  }
  
  // Features (if available)
  if (product.features) {
    specs[SPECIFICATION_CATEGORIES.FEATURES] = product.features;
  }
  
  return specs;
};

// Get product shipping information
export const getProductShippingInfo = (product) => {
  if (!product) return null;
  
  return {
    shippingInformation: product.shippingInformation || null,
    estimatedDelivery: product.estimatedDelivery || null,
    shippingCost: product.shippingCost || null,
    shippingRestrictions: product.shippingRestrictions || null,
    weight: product.weight || null,
    dimensions: product.dimensions || null,
  };
};

// Get product warranty information
export const getProductWarrantyInfo = (product) => {
  if (!product) return null;
  
  return {
    warrantyInformation: product.warrantyInformation || null,
    warrantyPeriod: product.warrantyPeriod || null,
    warrantyType: product.warrantyType || null,
  };
};

// Get product return policy information
export const getProductReturnInfo = (product) => {
  if (!product) return null;
  
  return {
    returnPolicy: product.returnPolicy || null,
    returnPeriod: product.returnPeriod || null,
    returnConditions: product.returnConditions || null,
  };
};

// Get product availability details
export const getProductAvailability = (product) => {
  if (!product) return null;
  
  const stock = product.stock ?? null;
  const isAvailable = stock !== null && stock > 0;
  const isLowStock = stock !== null && stock > 0 && stock <= 10;
  
  return {
    stock,
    isAvailable,
    isLowStock,
    availabilityStatus: product.availabilityStatus || (isAvailable ? 'In Stock' : 'Out of Stock'),
    minimumOrderQuantity: product.minimumOrderQuantity || 1,
  };
};

// Get product pricing details
export const getProductPricing = (product) => {
  if (!product) return null;
  
  const price = product.price || 0;
  const discountPercentage = product.discountPercentage || 0;
  const originalPrice = discountPercentage > 0
    ? price / (1 - discountPercentage / 100)
    : null;
  
  return {
    price,
    originalPrice,
    discountPercentage,
    hasDiscount: discountPercentage > 0,
    savings: originalPrice ? originalPrice - price : 0,
  };
};

// Get product media
export const getProductMedia = (product) => {
  if (!product) return { images: [], thumbnail: null };
  
  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [];
  
  return {
    images,
    thumbnail: product.thumbnail || images[0] || null,
    imageCount: images.length,
  };
};

// Get complete product details structure
export const getProductDetails = (product) => {
  if (!product) return null;
  
  return {
    basic: {
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category,
      sku: product.sku,
      tags: product.tags || [],
    },
    pricing: getProductPricing(product),
    availability: getProductAvailability(product),
    specifications: getProductSpecifications(product),
    shipping: getProductShippingInfo(product),
    warranty: getProductWarrantyInfo(product),
    returns: getProductReturnInfo(product),
    media: getProductMedia(product),
    ratings: {
      rating: product.rating || 0,
      reviewCount: product.reviews?.length || 0,
    },
  };
};

// Format product dimensions for display
export const formatProductDimensions = (dimensions) => {
  if (!dimensions) return 'N/A';
  
  if (typeof dimensions === 'string') {
    return dimensions;
  }
  
  if (dimensions.width && dimensions.height && dimensions.depth) {
    return `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} units`;
  }
  
  return 'N/A';
};

// Check if product has detailed information
export const hasDetailedProductInfo = (product) => {
  if (!product) return false;
  
  return !!(
    product.shippingInformation ||
    product.warrantyInformation ||
    product.returnPolicy ||
    product.weight ||
    product.dimensions ||
    product.specifications
  );
};

