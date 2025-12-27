import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from '@mui/material';
import { ShoppingCart, Logout, History, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectWishlistItems } from '../store/slices/wishlistSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = wishlistItems.length;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg,rgb(154, 155, 195) 0%,rgb(157, 171, 214) 100%)',
        borderBottom: '1px solid rgba(195, 231, 35, 0.08)',
        boxShadow: '0 4px 20px rgba(5, 3, 19, 0.15)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.9,
            },
          }}
          onClick={() => navigate('/')}
        >
          🛍️ E-Commerce Store
        </Typography>
        
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/orders')}
              startIcon={<History />}
              sx={{
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Orders
            </Button>
            <IconButton
              color="inherit"
              onClick={() => navigate('/wishlist')}
              sx={{
                borderRadius: 0,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Badge 
                badgeContent={wishlistCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    minWidth: 20,
                    height: 20,
                  },
                }}
              >
                <Favorite />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/checkout')}
              sx={{
                borderRadius: 0,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Badge 
                badgeContent={cartCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    minWidth: 20,
                    height: 20,
                  },
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              startIcon={<Logout />}
              sx={{
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

