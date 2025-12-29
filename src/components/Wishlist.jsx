import { useState } from 'react';
import {
  Container,
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
    dispatch(removeFromWishlist(product.id));
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
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {sortedItems.map((product) => (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
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
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'error.main',
                      color: 'white',
                      transform: 'scale(1.1) rotate(90deg)',
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', gap: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#667EEA',
                      }}
                    >
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
    </Container>
  );
};

export default Wishlist;



