import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Rating,
  TextField,
  Paper,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart,
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Star,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { getProductById, getProductReviews, addProductReview, getProductRecommendations, addToRecentlyViewed } from '../services/api';
import { formatPrice } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState({ reviews: [], total: 0, rating: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === parseInt(id));

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchRecommendations();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data);
      addToRecentlyViewed(data);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getProductReviews(id);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await getProductRecommendations(id);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
      } else {
        dispatch(addToWishlist(product));
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      return;
    }

    setSubmittingReview(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await addProductReview(id, {
        userId: user.id || 'user',
        username: user.username || 'Anonymous',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      
      // Refresh reviews
      await fetchReviews();
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const averageRating = reviews.rating || 0;
  const reviewCount = reviews.total || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.thumbnail}
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                backgroundColor: '#f5f5f5',
                padding: 2,
              }}
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip label={product.category} color="primary" size="small" />
              {product.brand && <Chip label={product.brand} color="secondary" size="small" />}
            </Box>

            <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
              {formatPrice(product.price)}
              {product.discountPercentage && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, textDecoration: 'line-through' }}
                >
                  {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                </Typography>
              )}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
              <IconButton
                color={isInWishlist ? 'error' : 'default'}
                onClick={handleWishlistToggle}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                {isInWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            {product.stock !== undefined && (
              <Typography variant="body2" color="text.secondary">
                Stock: {product.stock} available
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Reviews Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reviews ({reviewCount})
        </Typography>

        {/* Review Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>
          <Box component="form" onSubmit={handleSubmitReview}>
            <Box sx={{ mb: 2 }}>
              <Typography component="label" variant="body2" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(e, newValue) => {
                  setReviewForm({ ...reviewForm, rating: newValue || 5 });
                }}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submittingReview || !reviewForm.comment.trim()}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Box>
        </Paper>

        {/* Reviews List */}
        {reviews.reviews.length === 0 ? (
          <Alert severity="info">No reviews yet. Be the first to review this product!</Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.reviews.map((review) => (
              <Paper key={review.id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.username}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" gutterBottom>
            You May Also Like
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {recommendations.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <CardMedia
                    component="img"
                    image={item.thumbnail}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      padding: 1,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(item.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ProductDetail;

