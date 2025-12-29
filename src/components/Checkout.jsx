import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  TextField,
  Grid,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, Bookmark } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectSavedForLater,
  updateQuantity,
  removeFromCart,
  clearCart,
  saveForLater,
  moveToCart,
  removeFromSavedForLater,
} from '../store/slices/cartSlice';
import { addOrder } from '../store/slices/orderSlice';
import { formatPrice } from '../utils/currency';
import {
  createDefaultShippingAddress,
  validateShippingAddress,
  isShippingAddressValid,
  SHIPPING_FIELDS,
  SHIPPING_FIELD_LABELS,
  SHIPPING_FIELD_PLACEHOLDERS,
} from '../utils/shippingConstants';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const savedForLater = useSelector(selectSavedForLater);
  const total = useSelector(selectCartTotal);
  const [tabValue, setTabValue] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(createDefaultShippingAddress());
  const [errors, setErrors] = useState({});

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleSaveForLater = (id) => {
    dispatch(saveForLater(id));
  };

  const handleMoveToCart = (id) => {
    dispatch(moveToCart(id));
  };

  const handleRemoveFromSaved = (id) => {
    dispatch(removeFromSavedForLater(id));
  };

  const handleCheckout = () => {
    // Validate shipping address using utility function
    const validationErrors = validateShippingAddress(shippingAddress);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Create order
    const order = {
      items: cartItems,
      total: total,
      subtotal: total,
      shipping: 0,
      shippingAddress: shippingAddress,
      status: 'confirmed',
    };

    dispatch(addOrder(order));
    dispatch(clearCart());
    
    // Navigate to order confirmation
    navigate('/orders');
  };

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="info">Your cart is empty!</Alert>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Checkout
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<ShoppingCart />} iconPosition="start" label={`Cart (${cartItems.length})`} />
          <Tab icon={<Bookmark />} iconPosition="start" label={`Saved for Later (${savedForLater.length})`} />
        </Tabs>
      </Box>

      {/* Cart Items Tab */}
      {tabValue === 0 && (
        <>
          {cartItems.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Your cart is empty. Check your saved items!
            </Alert>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                mt: 2,
                borderRadius: 1,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow 
                      key={item.id}
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'grey.50',
                        },
                      }}
                    >
                      <TableCell>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateX(4px)',
                            },
                          }}
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          <Box
                            component="img"
                            src={item.thumbnail}
                            alt={item.title}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'contain',
                              borderRadius: 2,
                              bgcolor: '#f8fafc',
                              p: 1,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item.id, item.quantity - 1);
                            }}
                            sx={{
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'primary.50',
                                borderColor: 'primary.main',
                              },
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              minWidth: 30,
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item.id, item.quantity + 1);
                            }}
                            sx={{
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'primary.50',
                                borderColor: 'primary.main',
                              },
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 600, color: '#667EEA' }}>
                          {formatPrice(item.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 700, color: '#667EEA' }}>
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveForLater(item.id);
                            }}
                            title="Save for later"
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'warning.50',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <Bookmark />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.id);
                            }}
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'error.50',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Saved for Later Tab */}
      {tabValue === 1 && (
        <>
          {savedForLater.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              You don't have any saved items.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedForLater.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.7
                            }
                          }}
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }}
                          />
                          <Typography variant="body1">{item.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatPrice(item.price)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ShoppingCart />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToCart(item.id);
                            }}
                          >
                            Move to Cart
                          </Button>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSaved(item.id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Shipping Address Form */}
      {tabValue === 0 && cartItems.length > 0 && (
        <>
          <Paper 
            sx={{ 
              p: 3, 
              mt: 3,
              borderRadius: 1,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Shipping Address
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.NAME]}
                  required
                  value={shippingAddress[SHIPPING_FIELDS.NAME]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.NAME]: e.target.value });
                    if (errors[SHIPPING_FIELDS.NAME]) setErrors({ ...errors, [SHIPPING_FIELDS.NAME]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.NAME]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.NAME]}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                {errors[SHIPPING_FIELDS.NAME] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.NAME]}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.ADDRESS]}
                  required
                  value={shippingAddress[SHIPPING_FIELDS.ADDRESS]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.ADDRESS]: e.target.value });
                    if (errors[SHIPPING_FIELDS.ADDRESS]) setErrors({ ...errors, [SHIPPING_FIELDS.ADDRESS]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.ADDRESS]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.ADDRESS]}
                />
                {errors[SHIPPING_FIELDS.ADDRESS] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.ADDRESS]}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.CITY]}
                  required
                  value={shippingAddress[SHIPPING_FIELDS.CITY]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.CITY]: e.target.value });
                    if (errors[SHIPPING_FIELDS.CITY]) setErrors({ ...errors, [SHIPPING_FIELDS.CITY]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.CITY]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.CITY]}
                />
                {errors[SHIPPING_FIELDS.CITY] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.CITY]}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.STATE]}
                  required
                  value={shippingAddress[SHIPPING_FIELDS.STATE]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.STATE]: e.target.value });
                    if (errors[SHIPPING_FIELDS.STATE]) setErrors({ ...errors, [SHIPPING_FIELDS.STATE]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.STATE]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.STATE]}
                />
                {errors[SHIPPING_FIELDS.STATE] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.STATE]}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.ZIP_CODE]}
                  required
                  value={shippingAddress[SHIPPING_FIELDS.ZIP_CODE]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.ZIP_CODE]: e.target.value });
                    if (errors[SHIPPING_FIELDS.ZIP_CODE]) setErrors({ ...errors, [SHIPPING_FIELDS.ZIP_CODE]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.ZIP_CODE]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.ZIP_CODE]}
                />
                {errors[SHIPPING_FIELDS.ZIP_CODE] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.ZIP_CODE]}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.COUNTRY]}
                  required
                  value={shippingAddress[SHIPPING_FIELDS.COUNTRY]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.COUNTRY]: e.target.value });
                    if (errors[SHIPPING_FIELDS.COUNTRY]) setErrors({ ...errors, [SHIPPING_FIELDS.COUNTRY]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.COUNTRY]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.COUNTRY]}
                />
                {errors[SHIPPING_FIELDS.COUNTRY] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.COUNTRY]}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={SHIPPING_FIELD_LABELS[SHIPPING_FIELDS.CONTACT]}
                  required
                  type="tel"
                  value={shippingAddress[SHIPPING_FIELDS.CONTACT]}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, [SHIPPING_FIELDS.CONTACT]: e.target.value });
                    if (errors[SHIPPING_FIELDS.CONTACT]) setErrors({ ...errors, [SHIPPING_FIELDS.CONTACT]: '' });
                  }}
                  error={!!errors[SHIPPING_FIELDS.CONTACT]}
                  placeholder={SHIPPING_FIELD_PLACEHOLDERS[SHIPPING_FIELDS.CONTACT]}
                />
                {errors[SHIPPING_FIELDS.CONTACT] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors[SHIPPING_FIELDS.CONTACT]}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {tabValue === 0 && cartItems.length > 0 && (
        <Paper 
          sx={{ 
            p: 3, 
            mt: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Subtotal:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#667EEA' }}>{formatPrice(total)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatPrice(0)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Total:</Typography>
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667EEA 0%, #667EEA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatPrice(total)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleCheckout}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Place Order
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Checkout;

