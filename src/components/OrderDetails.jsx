import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectOrderById } from '../store/slices/orderSlice';
import { formatPrice } from '../utils/currency';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useSelector(selectOrderById(id));

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Order not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Order #{order.id.slice(-8)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.date)}
            </Typography>
          </Box>
          <Chip
            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            color={getStatusColor(order.status)}
            size="large"
          />
        </Box>

        {order.shippingAddress && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress.name}
              <br />
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
              {order.shippingAddress.contact && (
                <>
                  <br />
                  Contact: {order.shippingAddress.contact}
                </>
              )}
            </Typography>
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Typography variant="body1">{item.title}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{formatPrice(item.price)}</TableCell>
                <TableCell align="right">
                  {formatPrice(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">{formatPrice(order.subtotal || order.total)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Shipping:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatPrice(order.shipping || 0)}
              </Typography>
            </Box>
            {order.discount && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="success.main">
                  Discount:
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{formatPrice(order.discount)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(order.total)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderDetails;

