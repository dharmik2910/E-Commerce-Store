import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = async (skip = 0, limit = 30, category = '', searchQuery = '') => {
  try {
    let url;
    
    // If search query is provided, use search endpoint
    if (searchQuery && searchQuery.trim() !== '') {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      url = `${API_BASE_URL}/products/search?q=${encodedQuery}&skip=${skip}&limit=${limit}`;
    } else if (category) {
      // URL encode the category to handle special characters
      const encodedCategory = encodeURIComponent(category);
      url = `${API_BASE_URL}/products/category/${encodedCategory}?skip=${skip}&limit=${limit}`;
    } else {
      url = `${API_BASE_URL}/products?skip=${skip}&limit=${limit}`;
    }
    
    const response = await api.get(url);
    
    // Check if we got products back
    if (response.data && response.data.products) {
      return response.data;
    }
    
    // If no products array, return empty result
    return {
      products: [],
      total: 0,
      skip: skip,
      limit: limit
    };
  } catch (error) {
    // If it's a 404 or category doesn't exist, return empty results instead of throwing
    if (error.response && (error.response.status === 404 || error.response.status === 400)) {
      console.warn(`Category "${category}" or search query not found or has no products`);
      return {
        products: [],
        total: 0,
        skip: skip,
        limit: limit
      };
    }
    // For other errors, still throw
    throw error;
  }
};

// Fallback list of all DummyJSON category slugs
const FALLBACK_CATEGORIES = [
  'smartphones',
  'laptops',
  'fragrances',
  'skincare',
  'groceries',
  'home-decoration',
  'furniture',
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'automotive',
  'motorcycle',
  'lighting'
];

export const getCategories = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/products/categories`);
    let categories = [];
    
    if (Array.isArray(response.data)) {
      // DummyJSON returns an array of category objects with slug, name, and url
      // Extract the slug from each category object
      categories = response.data
        .map(cat => {
          // If it's an object with a slug property, use that
          if (cat && typeof cat === 'object' && cat.slug) {
            return cat.slug;
          }
          // If it's already a string, use it directly
          if (typeof cat === 'string') {
            return cat;
          }
          return null;
        })
        .filter(cat => cat !== null && cat.trim() !== '');
    } else if (response.data && typeof response.data === 'object') {
      // Sometimes APIs return objects, try to extract array
      const values = Object.values(response.data).flat();
      categories = values
        .map(cat => {
          if (cat && typeof cat === 'object' && cat.slug) {
            return cat.slug;
          }
          if (typeof cat === 'string') {
            return cat;
          }
          return null;
        })
        .filter(cat => cat !== null && cat.trim() !== '');
    }
    
    // Remove duplicates
    const uniqueCategories = [...new Set(categories)];
    
    // If we got categories from API, return them; otherwise use fallback
    return uniqueCategories.length > 0 ? uniqueCategories : FALLBACK_CATEGORIES;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return fallback categories if API fails
    return FALLBACK_CATEGORIES;
  }
};

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Product not found');
    }
    throw error;
  }
};

// Get product reviews (DummyJSON doesn't have reviews, so we'll simulate with localStorage)
export const getProductReviews = async (productId) => {
  try {
    // Try to get from API if available
    const response = await api.get(`${API_BASE_URL}/products/${productId}`);
    // DummyJSON doesn't have reviews endpoint, so we'll use localStorage
    const storedReviews = localStorage.getItem(`reviews_${productId}`);
    if (storedReviews) {
      return JSON.parse(storedReviews);
    }
    // Return empty reviews array
    return { reviews: [], total: 0, rating: 0 };
  } catch (error) {
    // Fallback to localStorage
    const storedReviews = localStorage.getItem(`reviews_${productId}`);
    if (storedReviews) {
      return JSON.parse(storedReviews);
    }
    return { reviews: [], total: 0, rating: 0 };
  }
};

// Add product review
export const addProductReview = async (productId, review) => {
  try {
    // Since DummyJSON doesn't have reviews API, we'll store in localStorage
    const storedReviews = localStorage.getItem(`reviews_${productId}`);
    let reviews = storedReviews ? JSON.parse(storedReviews) : { reviews: [], total: 0, rating: 0 };
    
    const newReview = {
      id: Date.now(),
      productId,
      userId: review.userId || 'user',
      username: review.username || 'Anonymous',
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString(),
    };
    
    reviews.reviews.push(newReview);
    reviews.total = reviews.reviews.length;
    reviews.rating = reviews.reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.total;
    
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
    return newReview;
  } catch (error) {
    throw error;
  }
};

// Get product recommendations (similar products by category)
export const getProductRecommendations = async (productId, limit = 4) => {
  try {
    // First get the product to know its category
    const product = await getProductById(productId);
    
    // Then get products from the same category
    const category = product.category;
    const data = await getProducts(0, limit + 1, category);
    
    // Filter out the current product
    const recommendations = data.products.filter(p => p.id !== productId).slice(0, limit);
    
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// Get recently viewed products
export const getRecentlyViewed = () => {
  try {
    const viewed = localStorage.getItem('recentlyViewed');
    return viewed ? JSON.parse(viewed) : [];
  } catch (error) {
    return [];
  }
};

// Add to recently viewed
export const addToRecentlyViewed = (product) => {
  try {
    const viewed = getRecentlyViewed();
    // Remove if already exists
    const filtered = viewed.filter(p => p.id !== product.id);
    // Add to beginning
    filtered.unshift(product);
    // Keep only last 10
    const limited = filtered.slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving recently viewed:', error);
  }
};

// Auth API
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

