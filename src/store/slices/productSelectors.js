// Product selectors for easy access to product state

// Products list selectors
export const selectProducts = (state) => state.products.products;
export const selectProductsLoading = (state) => state.products.productsLoading;
export const selectProductsError = (state) => state.products.productsError;
export const selectProductsTotal = (state) => state.products.productsTotal;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectItemsPerPage = (state) => state.products.itemsPerPage;

// Filter and search selectors
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSortOption = (state) => state.products.sortOption;

// Categories selectors
export const selectCategories = (state) => state.products.categories;
export const selectCategoriesLoading = (state) => state.products.categoriesLoading;
export const selectCategoriesError = (state) => state.products.categoriesError;

// Product detail selectors
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductLoading = (state) => state.products.productLoading;
export const selectProductError = (state) => state.products.productError;

// Reviews selectors
export const selectProductReviews = (productId) => (state) => 
  state.products.reviews[productId] || { reviews: [], total: 0, rating: 0 };
export const selectProductReviewsLoading = (productId) => (state) => 
  state.products.reviewsLoading[productId] || false;

// Recommendations selectors
export const selectProductRecommendations = (productId) => (state) => 
  state.products.recommendations[productId] || [];
export const selectProductRecommendationsLoading = (productId) => (state) => 
  state.products.recommendationsLoading[productId] || false;

// Recently viewed selectors
export const selectRecentlyViewed = (state) => state.products.recentlyViewed;

// Computed selectors
export const selectTotalPages = (state) => {
  const total = state.products.productsTotal;
  const perPage = state.products.itemsPerPage;
  return Math.ceil(total / perPage);
};

export const selectSortedProducts = (state) => {
  const products = [...state.products.products];
  const sortOption = state.products.sortOption;

  if (sortOption === 'default' || !products.length) {
    return products;
  }

  switch (sortOption) {
    case 'price-low':
      return products.sort((a, b) => a.price - b.price);
    case 'price-high':
      return products.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return products.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return products.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return products;
  }
};

export const selectHasFilters = (state) => {
  return !!(state.products.searchQuery || state.products.selectedCategory);
};

