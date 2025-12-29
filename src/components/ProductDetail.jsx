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
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import {
  AddShoppingCart,
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Star,
  CheckCircle,
  LocalShipping,
  AssignmentReturn,
  Security,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import {
  fetchProductById,
  fetchProductReviews,
  submitProductReview,
  fetchProductRecommendations,
  addToRecentlyViewed,
  loadRecentlyViewed,
} from '../store/slices/productSlice';
import {
  selectCurrentProduct,
  selectProductLoading,
  selectProductError,
  selectProductReviews,
  selectProductRecommendations,
} from '../store/slices/productSelectors';
import { formatPrice } from '../utils/currency';
import { getProductImages, calculateOriginalPrice, formatCategoryName } from '../utils/productConstants';
import {
  getProductDetails,
  getProductSpecifications,
  getProductShippingInfo,
  getProductWarrantyInfo,
  getProductReturnInfo,
  formatProductDimensions,
} from '../utils/productDetails';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Redux state
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const reviews = useSelector(selectProductReviews(id));
  const recommendations = useSelector(selectProductRecommendations(id));

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === parseInt(id));

  useEffect(() => {
    // Load recently viewed on mount
    dispatch(loadRecentlyViewed());
    
    // Fetch product data
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
    dispatch(fetchProductRecommendations({ productId: id }));
  }, [dispatch, id]);

  // Add to recently viewed when product is loaded
  useEffect(() => {
    if (product) {
      dispatch(addToRecentlyViewed(product));
    }
  }, [dispatch, product]);

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
      await dispatch(submitProductReview({
        productId: id,
        review: {
          userId: user.id || 'user',
          username: user.username || 'Anonymous',
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        },
      })).unwrap();
      
      // Refresh reviews
      dispatch(fetchProductReviews(id));
      
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

  // Use reviews rating if available, otherwise fall back to product rating from API
  const averageRating = reviews.rating || product?.rating || 0;
  const reviewCount = reviews.total || 0;

  // Get all product images
  const productImages = product ? getProductImages(product) : [];

  // Calculate original price if discount exists
  const originalPrice = product?.discountPercentage 
    ? calculateOriginalPrice(product.price, product.discountPercentage)
    : null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateX(-4px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
        {/* Product Images */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              mb: 2,
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
          >
            <CardMedia
              component="img"
              image={productImages[selectedImage] || product.thumbnail}
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: { xs: 250, sm: 320, md: 360 },
                minHeight: { xs: 180, sm: 220 },
                objectFit: 'contain',
                backgroundColor: '#f8fafc',
                padding: 3,
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            />
          </Card>
          {/* Image Gallery */}
          {productImages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {productImages.map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 70,
                    height: 70,
                    cursor: 'pointer',
                    border: selectedImage === index ? 3 : 1,
                    borderColor: selectedImage === index ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(243, 246, 62, 0.3)',
                    },
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`${product.title} ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: 1,
                      bgcolor: '#f8fafc',
                    }}
                  />
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg,rgb(27, 32, 53) 0%,rgb(36, 41, 61) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Rating 
                value={averageRating} 
                precision={0.1} 
                readOnly 
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#fbbf24',
                  },
                }}
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.3s ease',
                }}
                onClick={() => {
                  document.getElementById('reviews-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {(() => {
                // Collect all tags and remove duplicates (case-insensitive)
                const allTags = [];
                const seenTags = new Set();
                
                // Add category if exists
                if (product.category) {
                  const categoryName = formatCategoryName(product.category);
                  const categoryLower = categoryName.toLowerCase();
                  if (!seenTags.has(categoryLower)) {
                    allTags.push({ label: categoryName, type: 'category', color: 'primary' });
                    seenTags.add(categoryLower);
                  }
                }
                
                // Add brand if exists and not duplicate
                if (product.brand) {
                  const brandLower = product.brand.toLowerCase();
                  if (!seenTags.has(brandLower)) {
                    allTags.push({ label: product.brand, type: 'brand', color: 'secondary' });
                    seenTags.add(brandLower);
                  }
                }
                
                // Add product tags if not duplicates
                if (product.tags && product.tags.length > 0) {
                  product.tags.forEach((tag) => {
                    const tagLower = tag.toLowerCase();
                    if (!seenTags.has(tagLower)) {
                      allTags.push({ label: tag, type: 'tag', variant: 'outlined' });
                      seenTags.add(tagLower);
                    }
                  });
                }
                
                return allTags.map((item, index) => (
                  <Chip
                    key={index}
                    label={item.label}
                    color={item.color}
                    variant={item.variant || 'filled'}
                    size="small"
                  />
                ));
              })()}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ color: '#667EEA', fontWeight: 'bold' }}>
                  {formatPrice(product.price)}
                </Typography>
                {originalPrice && (
                  <>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(originalPrice)}
                    </Typography>
                    <Chip
                      label={`${Math.round(product.discountPercentage)}% OFF`}
                      color="error"
                      size="small"
                    />
                  </>
                )}
              </Box>
              {product.sku && (
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                sx={{ 
                  flex: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  backgroundColor: 'rgb(65, 131, 245)',
                  boxShadow: '0 4px 12px rgba(65, 131, 245, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgb(45, 111, 225)',
                    boxShadow: '0 6px 16px rgba(65, 131, 245, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add to Cart
              </Button>
              <IconButton
                color={isInWishlist ? 'error' : 'default'}
                onClick={handleWishlistToggle}
                sx={{ 
                  border: 2, 
                  borderColor: isInWishlist ? 'error.main' : 'divider',
                  borderRadius: 2,
                  width: 56,
                  height: 56,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    borderColor: 'error.main',
                    bgcolor: 'error.50',
                  },
                }}
              >
                {isInWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
              {product.stock !== undefined && (
                <Typography 
                  variant="body2" 
                  color={product.stock > 0 ? 'success.main' : 'error.main'}
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <CheckCircle fontSize="small" />
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Typography>
              )}
              {product.availabilityStatus && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Status: {product.availabilityStatus}
                </Typography>
              )}
              {product.minimumOrderQuantity && (
                <Typography variant="body2" color="text.secondary">
                  Minimum order: {product.minimumOrderQuantity} items
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Product Specifications */}
      {(() => {
        const specifications = getProductSpecifications(product);
        const shippingInfo = getProductShippingInfo(product);
        const warrantyInfo = getProductWarrantyInfo(product);
        const returnInfo = getProductReturnInfo(product);
        const hasPhysicalSpecs = specifications.physical && Object.keys(specifications.physical).length > 0;
        const hasShippingPolicies = shippingInfo?.shippingInformation || warrantyInfo?.warrantyInformation || returnInfo?.returnPolicy;

        if (!hasPhysicalSpecs && !hasShippingPolicies) return null;

        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Product Specifications
            </Typography>
            <Grid container spacing={3}>
              {/* Physical Specifications */}
              {hasPhysicalSpecs && (
                <Grid item xs={12} sm={6}>
                  <Paper 
                    sx={{ 
                      p: 3,
                      borderRadius: 1,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                      Physical Details
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {specifications.physical.weight && (
                          <TableRow>
                            <TableCell><strong>{specifications.physical.weight.label}</strong></TableCell>
                            <TableCell>{specifications.physical.weight.value}</TableCell>
                          </TableRow>
                        )}
                        {specifications.physical.dimensions && (
                          <TableRow>
                            <TableCell><strong>{specifications.physical.dimensions.label}</strong></TableCell>
                            <TableCell>
                              {specifications.physical.dimensions.formatted || formatProductDimensions(product.dimensions)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              )}

              {/* Shipping & Policy Information */}
              {hasShippingPolicies && (
                <Grid item xs={12} sm={6}>
                  <Paper 
                    sx={{ 
                      p: 3,
                      borderRadius: 1,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                      Shipping & Policies
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {shippingInfo?.shippingInformation && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <LocalShipping color="primary" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Shipping
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {shippingInfo.shippingInformation}
                            </Typography>
                            {shippingInfo.estimatedDelivery && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                Estimated delivery: {shippingInfo.estimatedDelivery}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                      {warrantyInfo?.warrantyInformation && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Security color="primary" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Warranty
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {warrantyInfo.warrantyInformation}
                            </Typography>
                            {warrantyInfo.warrantyPeriod && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                Period: {warrantyInfo.warrantyPeriod}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                      {returnInfo?.returnPolicy && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <AssignmentReturn color="primary" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Return Policy
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {returnInfo.returnPolicy}
                            </Typography>
                            {returnInfo.returnPeriod && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                Return period: {returnInfo.returnPeriod}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        );
      })()}

      <Divider sx={{ my: 4 }} />

      {/* Reviews Section */}
      <Box id="reviews-section" sx={{ mb: 4, scrollMarginTop: '80px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
            Reviews ({reviewCount})
          </Typography>
          {reviewCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                document.getElementById('reviews-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View All Reviews
            </Button>
          )}
        </Box>

        {/* Review Form */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
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
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
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
              <Paper 
                key={review.id} 
                sx={{ 
                  p: 2.5,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {review.username}
                    </Typography>
                    <Rating 
                      value={review.rating} 
                      size="small" 
                      readOnly
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#fbbf24',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{review.comment}</Typography>
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
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
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
                      height: 150,
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

