import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AddShoppingCart, Favorite, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { removeFromWishlist, selectWishlistItems } from '../store/slices/wishlistSlice';
import { formatPrice } from '../utils/currency';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const [sortOption, setSortOption] = useState('default');

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

  const sortedItems = sortProducts(wishlistItems);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          My Wishlist ({wishlistItems.length})
        </Typography>
        
        {wishlistItems.length > 0 && (
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
        )}
      </Box>

      {wishlistItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start adding products you love to your wishlist!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {sortedItems.map((product) => (
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
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(product.id);
                  }}
                  color="error"
                >
                  <Delete />
                </IconButton>
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
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist;


