// Shipping-related constants and utilities

// Shipping address field definitions
export const SHIPPING_FIELDS = {
  NAME: 'name',
  ADDRESS: 'address',
  CITY: 'city',
  STATE: 'state',
  ZIP_CODE: 'zipCode',
  COUNTRY: 'country',
  CONTACT: 'contact',
};

// Shipping address field labels
export const SHIPPING_FIELD_LABELS = {
  [SHIPPING_FIELDS.NAME]: 'Full Name',
  [SHIPPING_FIELDS.ADDRESS]: 'Address',
  [SHIPPING_FIELDS.CITY]: 'City',
  [SHIPPING_FIELDS.STATE]: 'State',
  [SHIPPING_FIELDS.ZIP_CODE]: 'Zip Code',
  [SHIPPING_FIELDS.COUNTRY]: 'Country',
  [SHIPPING_FIELDS.CONTACT]: 'Contact Number',
};

// Shipping address field placeholders
export const SHIPPING_FIELD_PLACEHOLDERS = {
  [SHIPPING_FIELDS.NAME]: 'John Doe',
  [SHIPPING_FIELDS.ADDRESS]: '123 Main Street',
  [SHIPPING_FIELDS.CITY]: 'New York',
  [SHIPPING_FIELDS.STATE]: 'NY',
  [SHIPPING_FIELDS.ZIP_CODE]: '10001',
  [SHIPPING_FIELDS.COUNTRY]: 'United States',
  [SHIPPING_FIELDS.CONTACT]: '+1 234 567 8900',
};

// Shipping address validation rules
export const SHIPPING_VALIDATION = {
  [SHIPPING_FIELDS.NAME]: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  [SHIPPING_FIELDS.ADDRESS]: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  [SHIPPING_FIELDS.CITY]: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  [SHIPPING_FIELDS.STATE]: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  [SHIPPING_FIELDS.ZIP_CODE]: {
    required: true,
    pattern: /^[0-9A-Z\s-]+$/i,
    minLength: 4,
    maxLength: 10,
  },
  [SHIPPING_FIELDS.COUNTRY]: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  [SHIPPING_FIELDS.CONTACT]: {
    required: true,
    pattern: /^[\d\s\-\+\(\)]+$/,
    minLength: 10,
    maxLength: 20,
  },
};

// Shipping methods
export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
  FREE: 'free',
};

// Shipping method labels
export const SHIPPING_METHOD_LABELS = {
  [SHIPPING_METHODS.STANDARD]: 'Standard Shipping',
  [SHIPPING_METHODS.EXPRESS]: 'Express Shipping',
  [SHIPPING_METHODS.OVERNIGHT]: 'Overnight Shipping',
  [SHIPPING_METHODS.FREE]: 'Free Shipping',
};

// Shipping method costs (in USD)
export const SHIPPING_COSTS = {
  [SHIPPING_METHODS.STANDARD]: 5.99,
  [SHIPPING_METHODS.EXPRESS]: 12.99,
  [SHIPPING_METHODS.OVERNIGHT]: 24.99,
  [SHIPPING_METHODS.FREE]: 0,
};

// Shipping method delivery times (in days)
export const SHIPPING_DELIVERY_TIMES = {
  [SHIPPING_METHODS.STANDARD]: '5-7 business days',
  [SHIPPING_METHODS.EXPRESS]: '2-3 business days',
  [SHIPPING_METHODS.OVERNIGHT]: '1 business day',
  [SHIPPING_METHODS.FREE]: '7-10 business days',
};

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 50;

// Default shipping address structure
export const createDefaultShippingAddress = () => ({
  [SHIPPING_FIELDS.NAME]: '',
  [SHIPPING_FIELDS.ADDRESS]: '',
  [SHIPPING_FIELDS.CITY]: '',
  [SHIPPING_FIELDS.STATE]: '',
  [SHIPPING_FIELDS.ZIP_CODE]: '',
  [SHIPPING_FIELDS.COUNTRY]: '',
  [SHIPPING_FIELDS.CONTACT]: '',
});

// Validate shipping address
export const validateShippingAddress = (address) => {
  const errors = {};
  
  Object.keys(SHIPPING_VALIDATION).forEach((field) => {
    const value = address[field];
    const rules = SHIPPING_VALIDATION[field];
    
    if (rules.required && !value) {
      errors[field] = `${SHIPPING_FIELD_LABELS[field]} is required`;
      return;
    }
    
    if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${SHIPPING_FIELD_LABELS[field]} must be at least ${rules.minLength} characters`;
        return;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${SHIPPING_FIELD_LABELS[field]} must be no more than ${rules.maxLength} characters`;
        return;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${SHIPPING_FIELD_LABELS[field]} format is invalid`;
        return;
      }
    }
  });
  
  return errors;
};

// Check if shipping address is valid
export const isShippingAddressValid = (address) => {
  const errors = validateShippingAddress(address);
  return Object.keys(errors).length === 0;
};

// Calculate shipping cost based on method and order total
export const calculateShippingCost = (method, orderTotal = 0) => {
  // Free shipping if order total exceeds threshold
  if (orderTotal >= FREE_SHIPPING_THRESHOLD && method === SHIPPING_METHODS.STANDARD) {
    return SHIPPING_COSTS[SHIPPING_METHODS.FREE];
  }
  
  return SHIPPING_COSTS[method] || SHIPPING_COSTS[SHIPPING_METHODS.STANDARD];
};

// Get shipping method details
export const getShippingMethodDetails = (method) => {
  return {
    method,
    label: SHIPPING_METHOD_LABELS[method] || method,
    cost: SHIPPING_COSTS[method] || 0,
    deliveryTime: SHIPPING_DELIVERY_TIMES[method] || 'N/A',
  };
};

// Format shipping address for display
export const formatShippingAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address[SHIPPING_FIELDS.ADDRESS],
    address[SHIPPING_FIELDS.CITY],
    address[SHIPPING_FIELDS.STATE],
    address[SHIPPING_FIELDS.ZIP_CODE],
    address[SHIPPING_FIELDS.COUNTRY],
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Product shipping information structure
export const PRODUCT_SHIPPING_INFO = {
  WEIGHT: 'weight',
  DIMENSIONS: 'dimensions',
  SHIPPING_CLASS: 'shippingClass',
  SHIPPING_RESTRICTIONS: 'shippingRestrictions',
  ESTIMATED_DELIVERY: 'estimatedDelivery',
  SHIPPING_COST: 'shippingCost',
};

// Default product shipping information
export const createDefaultProductShippingInfo = () => ({
  [PRODUCT_SHIPPING_INFO.WEIGHT]: null,
  [PRODUCT_SHIPPING_INFO.DIMENSIONS]: null,
  [PRODUCT_SHIPPING_INFO.SHIPPING_CLASS]: null,
  [PRODUCT_SHIPPING_INFO.SHIPPING_RESTRICTIONS]: null,
  [PRODUCT_SHIPPING_INFO.ESTIMATED_DELIVERY]: null,
  [PRODUCT_SHIPPING_INFO.SHIPPING_COST]: null,
});

