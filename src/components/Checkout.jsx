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

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const savedForLater = useSelector(selectSavedForLater);
  const total = useSelector(selectCartTotal);
  const [tabValue, setTabValue] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    contact: '',
  });
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
    // Validate shipping address
    const newErrors = {};
    if (!shippingAddress.name) newErrors.name = 'Name is required';
    if (!shippingAddress.address) newErrors.address = 'Address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode) newErrors.zipCode = 'Zip Code is required';
    if (!shippingAddress.country) newErrors.country = 'Country is required';
    if (!shippingAddress.contact) newErrors.contact = 'Contact is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      <Typography variant="h4" component="h1" gutterBottom>
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
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
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
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <Typography variant="body1">{item.title}</Typography>
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
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="body1">{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item.id, item.quantity + 1);
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatPrice(item.price)}</TableCell>
                      <TableCell align="right">
                        {formatPrice(item.price * item.quantity)}
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
                          >
                            <Bookmark />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.id);
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
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
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
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={shippingAddress.name}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={!!errors.name}
                />
                {errors.name && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  error={!!errors.address}
                />
                {errors.address && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.address}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  error={!!errors.city}
                />
                {errors.city && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.city}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, state: e.target.value });
                    if (errors.state) setErrors({ ...errors, state: '' });
                  }}
                  error={!!errors.state}
                />
                {errors.state && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.state}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  required
                  value={shippingAddress.zipCode}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value });
                    if (errors.zipCode) setErrors({ ...errors, zipCode: '' });
                  }}
                  error={!!errors.zipCode}
                />
                {errors.zipCode && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.zipCode}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  required
                  value={shippingAddress.country}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, country: e.target.value });
                    if (errors.country) setErrors({ ...errors, country: '' });
                  }}
                  error={!!errors.country}
                />
                {errors.country && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.country}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  required
                  type="tel"
                  value={shippingAddress.contact}
                  onChange={(e) => {
                    setShippingAddress({ ...shippingAddress, contact: e.target.value });
                    if (errors.contact) setErrors({ ...errors, contact: '' });
                  }}
                  error={!!errors.contact}
                  placeholder="e.g., +1 234 567 8900"
                />
                {errors.contact && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.contact}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {tabValue === 0 && cartItems.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Subtotal:</Typography>
            <Typography variant="h6">{formatPrice(total)}</Typography>
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
            <Typography variant="h5">Total:</Typography>
            <Typography variant="h5" color="primary">
              {formatPrice(total)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleCheckout}
          >
            Place Order
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Checkout;

