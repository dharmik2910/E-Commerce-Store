import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
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
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { getProducts, getCategories } from '../services/api';
import { formatPrice } from '../utils/currency';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itemsPerPage = 12;

  // Helper function to sort products
  const sortProducts = (productsList) => {
    if (sortOption === 'default' || !productsList || productsList.length === 0) {
      return productsList;
    }

    return [...productsList].sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage, searchQuery]);

  // Sort products whenever sort option changes
  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = sortProducts(products);
      setProducts(sortedProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  const fetchCategories = async () => {
    try {
      // First, try to get categories from the API
      const data = await getCategories();
      let categoryList = [];
      
      if (Array.isArray(data) && data.length > 0) {
        categoryList = data.filter(cat => typeof cat === 'string' && cat.trim() !== '');
      }
      
      // Also fetch products to verify which categories actually have products
      // This ensures we only show categories that have products available
      try {
        const productsData = await getProducts(0, 100);
        if (productsData.products && Array.isArray(productsData.products)) {
          const categoriesFromProducts = [...new Set(
            productsData.products
              .map(p => p.category)
              .filter(cat => cat && typeof cat === 'string')
          )];
          
          // Merge API categories with categories from products
          // This ensures we have all categories that actually have products
          const allCategories = [...new Set([...categoryList, ...categoriesFromProducts])];
          setCategories(allCategories.length > 0 ? allCategories : categoryList);
        } else {
          setCategories(categoryList);
        }
      } catch (productErr) {
        // If fetching products fails, still use the categories from API
        console.warn('Could not verify categories from products:', productErr);
        setCategories(categoryList);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set empty array, but the API service should have provided fallback
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const data = await getProducts(skip, itemsPerPage, selectedCategory, searchQuery);
      let productsList = data.products || [];
      
      // Sort products after fetching
      productsList = sortProducts(productsList);
      setProducts(productsList);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      
      // Show a message if no products found
      if (searchQuery && productsList.length === 0) {
        setError(`No products found for "${searchQuery}". Try a different search term.`);
      } else if (selectedCategory && productsList.length === 0) {
        setError(`No products available in the "${selectedCategory}" category. Try selecting a different category.`);
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
    // Clear search when category changes
    setSearchQuery('');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    // Clear category when searching
    if (event.target.value.trim() !== '') {
      setSelectedCategory('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

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
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            sx={{ minWidth: 300, flexGrow: 1, maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={handleClearSearch}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Clear fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => {
                const categoryStr = String(category);
                return (
                  <MenuItem key={categoryStr} value={categoryStr}>
                    {categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
              <MenuItem value="name-desc">Name: Z to A</MenuItem>
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
                label={`Category: ${selectedCategory}`}
                onDelete={() => {
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity={products.length === 0 && selectedCategory ? "info" : "error"} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} justifyContent="center">
        {products.length === 0 && !loading ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
            </Box>
          </Grid>
        ) : (
          products.map((product) => (
          <Grid item xs={10} sm={5} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 280,
                width: '100%',
                margin: '0 auto',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardMedia
                component="img"
                image={product.thumbnail}
                alt={product.title}
                sx={{
                  width: '100%',
                  height: 250,
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5',
                  padding: 1,
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
                  {product.description?.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h6" color="primary">
                    {formatPrice(product.price)}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCart />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
        )}
      </Grid>

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

