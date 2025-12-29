import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from '@mui/material';
import { ShoppingCart, Logout, History, Favorite } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectWishlistItems } from '../store/slices/wishlistSlice';
import { setCurrentPage, setSearchQuery, setSelectedCategory } from '../store/slices/productSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = wishlistItems.length;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleHomeClick = () => {
    // Reset filters and page
    dispatch(setCurrentPage(1));
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory(''));
    
    // Navigate to home if not already there
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg,rgb(65, 131, 245) 0%,rgb(65, 131, 245) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(10px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 3 }, minHeight: { xs: 48, sm: 64 } }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontSize: { xs: '0.875rem', sm: '1.25rem', md: '1.5rem' },
            color: 'white',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: { xs: 'calc(100vw - 200px)', sm: 'none' },
          }}
          onClick={handleHomeClick}
        >
          🛒 E-Commerce Store
        </Typography>
        
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/orders')}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                color: 'white',
                p: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
              title="Orders"
            >
              <History sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/wishlist')}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                color: 'white',
                p: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1) rotate(5deg)',
                },
              }}
              title="Wishlist"
            >
              <Badge 
                badgeContent={wishlistCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 700,
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    minWidth: { xs: 16, sm: 18 },
                    height: { xs: 16, sm: 18 },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Favorite sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/checkout')}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                color: 'white',
                p: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
              title="Cart"
            >
              <Badge 
                badgeContent={cartCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 700,
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    minWidth: { xs: 16, sm: 18 },
                    height: { xs: 16, sm: 18 },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <ShoppingCart sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                color: 'white',
                p: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
              title="Logout"
            >
              <Logout sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

