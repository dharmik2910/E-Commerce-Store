import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Rating,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../store/slices/wishlistSlice';
import {
  fetchProducts,
  fetchCategories,
  setSearchQuery,
  setSelectedCategory,
  setSortOption,
  setCurrentPage,
} from '../store/slices/productSlice';
import {
  selectSortedProducts,
  selectProductsLoading,
  selectProductsError,
  selectTotalPages,
  selectCurrentPage,
  selectCategories,
  selectSelectedCategory,
  selectSearchQuery,
  selectSortOption,
} from '../store/slices/productSelectors';
import { formatCategoryName, SORT_OPTIONS, SORT_OPTION_LABELS, calculateOriginalPrice } from '../utils/productConstants';
import { formatPrice } from '../utils/currency';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itemsPerPage = 15;

  // Redux state
  const products = useSelector(selectSortedProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const searchQuery = useSelector(selectSearchQuery);
  const sortOption = useSelector(selectSortOption);
  const wishlistItems = useSelector(selectWishlistItems);

  // Local state for search input (debounced)
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const skip = (currentPage - 1) * itemsPerPage;
    dispatch(fetchProducts({ skip, limit: itemsPerPage, category: selectedCategory, searchQuery }));
  }, [dispatch, selectedCategory, currentPage, searchQuery, itemsPerPage]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        dispatch(setSearchQuery(searchInput));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, dispatch]);

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    dispatch(setSelectedCategory(newCategory));
    dispatch(setCurrentPage(1));
    // Clear search when category changes
    if (newCategory) {
      dispatch(setSearchQuery(''));
      setSearchInput('');
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    // Clear category when searching
    if (value.trim() !== '' && selectedCategory) {
      dispatch(setSelectedCategory(''));
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setSearchQuery(''));
    dispatch(setCurrentPage(1));
  };

  const handleSortChange = (event) => {
    dispatch(setSortOption(event.target.value));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (event, value) => {
    dispatch(setCurrentPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  // Generate error message
  const errorMessage = error || (products.length === 0 && !loading && searchQuery
    ? `No products found for "${searchQuery}". Try a different search term.`
    : products.length === 0 && !loading && selectedCategory
    ? `No products available in the "${selectedCategory}" category. Try selecting a different category.`
    : null);

  if (loading && products.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%,rgb(54, 82, 222) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
          }}
        >
          Discover Products
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: { xs: 'nowrap', sm: 'wrap' }, 
          mt: 2, 
          alignItems: 'center',
          p: { xs: 1, sm: 2 },
          borderRadius: 1,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}>
          <TextField
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ 
              minWidth: { xs: 120, sm: 300 }, 
              flexGrow: 1, 
              maxWidth: { xs: 'none', sm: 500 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
                </InputAdornment>
              ),
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl 
            size="small"
            sx={{ 
              minWidth: { xs: 100, sm: 200 },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiSelect-select': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 0.75, sm: 1 },
              },
            }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>All Categories</MenuItem>
              {categories.map((category) => {
                const categoryStr = String(category);
                return (
                  <MenuItem key={categoryStr} value={categoryStr} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    {formatCategoryName(categoryStr)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl 
            size="small"
            sx={{ 
              minWidth: { xs: 100, sm: 200 },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiSelect-select': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 0.75, sm: 1 },
              },
            }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              label="Sort By"
              onChange={handleSortChange}
              sx={{ borderRadius: 2 }}
            >
              {Object.values(SORT_OPTIONS).map((option) => (
                <MenuItem key={option} value={option} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {SORT_OPTION_LABELS[option]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {(selectedCategory || searchQuery) && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={handleClearSearch}
                color="primary"
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Category: ${formatCategoryName(selectedCategory)}`}
                onDelete={() => {
                  dispatch(setSelectedCategory(''));
                  dispatch(setCurrentPage(1));
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {errorMessage && (
        <Alert severity={products.length === 0 && selectedCategory ? "info" : "error"} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {products.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(5, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 3,
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                  '& .product-image': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#f8fafc' }}>
                <CardMedia
                  component="img"
                  image={product.thumbnail}
                  alt={product.title}
                  className="product-image"
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'contain',
                    padding: 2,
                    transition: 'transform 0.5s ease',
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={(e) => handleWishlistToggle(e, product)}
                  color={wishlistItems.some((item) => item.id === product.id) ? 'error' : 'default'}
                >
                  {wishlistItems.some((item) => item.id === product.id) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                {product.discountPercentage && (
                  <Chip
                    label={`${Math.round(product.discountPercentage)}% OFF`}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating 
                    value={product.rating || 0} 
                    precision={0.1} 
                    readOnly 
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#fbbf24',
                      },
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {product.rating ? product.rating.toFixed(1) : '0.0'}
                  </Typography>
                  {product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0 && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      ({product.reviews.length})
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#667EEA',
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    {product.discountPercentage && (() => {
                      const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);
                      return originalPrice ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            textDecoration: 'line-through',
                            fontWeight: 500,
                          }}
                        >
                          {formatPrice(originalPrice)}
                        </Typography>
                      ) : null;
                    })()}
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCart />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      backgroundColor: 'rgb(65, 131, 245)',
                      boxShadow: '0 2px 8px rgba(65, 131, 245, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgb(45, 111, 225)',
                        boxShadow: '0 4px 12px rgba(65, 131, 245, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Home;

