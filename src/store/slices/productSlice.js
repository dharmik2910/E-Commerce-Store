import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productAPI from '../../services/api';

// Async thunks for product operations
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ skip = 0, limit = 30, category = '', searchQuery = '' }, { rejectWithValue }) => {
    try {
      const data = await productAPI.getProducts(skip, limit, category, searchQuery);
      return {
        products: data.products || [],
        total: data.total || 0,
        skip: data.skip || skip,
        limit: data.limit || limit,
        category,
        searchQuery,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const product = await productAPI.getProductById(productId);
      return product;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await productAPI.getCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const reviews = await productAPI.getProductReviews(productId);
      return { productId, reviews };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

export const submitProductReview = createAsyncThunk(
  'products/submitProductReview',
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const newReview = await productAPI.addProductReview(productId, review);
      return { productId, review: newReview };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit review');
    }
  }
);

export const fetchProductRecommendations = createAsyncThunk(
  'products/fetchProductRecommendations',
  async ({ productId, limit = 4 }, { rejectWithValue }) => {
    try {
      const recommendations = await productAPI.getProductRecommendations(productId, limit);
      return { productId, recommendations };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recommendations');
    }
  }
);

const initialState = {
  // Product list state
  products: [],
  productsLoading: false,
  productsError: null,
  productsTotal: 0,
  currentPage: 1,
  itemsPerPage: 30,
  
  // Filters and search
  selectedCategory: '',
  searchQuery: '',
  sortOption: 'default',
  
  // Categories
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  
  // Product detail state
  currentProduct: null,
  productLoading: false,
  productError: null,
  
  // Product reviews
  reviews: {}, // { productId: { reviews: [], total: 0, rating: 0 } }
  reviewsLoading: {},
  
  // Product recommendations
  recommendations: {}, // { productId: [products] }
  recommendationsLoading: {},
  
  // Recently viewed products
  recentlyViewed: (() => {
    try {
      const viewed = localStorage.getItem('recentlyViewed');
      return viewed ? JSON.parse(viewed) : [];
    } catch (error) {
      return [];
    }
  })(),
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.sortOption = 'default';
      state.currentPage = 1;
    },
    clearProductDetail: (state) => {
      state.currentProduct = null;
      state.productError = null;
    },
    addToRecentlyViewed: (state, action) => {
      const product = action.payload;
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(p => p.id !== product.id);
      // Add to beginning
      state.recentlyViewed.unshift(product);
      // Keep only last 10
      state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      // Save to localStorage
      try {
        localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
    },
    loadRecentlyViewed: (state) => {
      try {
        const viewed = localStorage.getItem('recentlyViewed');
        state.recentlyViewed = viewed ? JSON.parse(viewed) : [];
      } catch (error) {
        state.recentlyViewed = [];
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload.products;
        state.productsTotal = action.payload.total;
        state.selectedCategory = action.payload.category;
        state.searchQuery = action.payload.searchQuery;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
        state.products = [];
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
        state.currentProduct = null;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
        state.categories = [];
      });

    // Fetch product reviews
    builder
      .addCase(fetchProductReviews.pending, (state, action) => {
        const productId = action.meta.arg;
        state.reviewsLoading[productId] = true;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        const { productId, reviews } = action.payload;
        state.reviews[productId] = reviews;
        state.reviewsLoading[productId] = false;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.reviewsLoading[productId] = false;
      });

    // Submit product review
    builder
      .addCase(submitProductReview.fulfilled, (state, action) => {
        const { productId, review } = action.payload;
        if (!state.reviews[productId]) {
          state.reviews[productId] = { reviews: [], total: 0, rating: 0 };
        }
        state.reviews[productId].reviews.push(review);
        state.reviews[productId].total = state.reviews[productId].reviews.length;
        state.reviews[productId].rating =
          state.reviews[productId].reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          state.reviews[productId].reviews.length;
      });

    // Fetch product recommendations
    builder
      .addCase(fetchProductRecommendations.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.recommendationsLoading[productId] = true;
      })
      .addCase(fetchProductRecommendations.fulfilled, (state, action) => {
        const { productId, recommendations } = action.payload;
        state.recommendations[productId] = recommendations;
        state.recommendationsLoading[productId] = false;
      })
      .addCase(fetchProductRecommendations.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.recommendationsLoading[productId] = false;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortOption,
  setCurrentPage,
  clearFilters,
  clearProductDetail,
  addToRecentlyViewed,
  loadRecentlyViewed,
} = productSlice.actions;

export default productSlice.reducer;

