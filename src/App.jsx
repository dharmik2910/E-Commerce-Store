import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Checkout from './components/Checkout';
import ProductDetail from './components/ProductDetail';
import OrderHistory from './components/OrderHistory';
import OrderDetails from './components/OrderDetails';
import Wishlist from './components/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.08)',
    '0 8px 16px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.1)',
    '0 16px 32px rgba(0,0,0,0.1)',
    '0 20px 40px rgba(0,0,0,0.12)',
    '0 24px 48px rgba(0,0,0,0.12)',
    '0 28px 56px rgba(0,0,0,0.14)',
    '0 32px 64px rgba(0,0,0,0.14)',
    '0 36px 72px rgba(0,0,0,0.16)',
    '0 40px 80px rgba(0,0,0,0.16)',
    '0 44px 88px rgba(0,0,0,0.18)',
    '0 48px 96px rgba(0,0,0,0.18)',
    '0 52px 104px rgba(0,0,0,0.2)',
    '0 56px 112px rgba(0,0,0,0.2)',
    '0 60px 120px rgba(0,0,0,0.22)',
    '0 64px 128px rgba(0,0,0,0.22)',
    '0 68px 136px rgba(0,0,0,0.24)',
    '0 72px 144px rgba(0,0,0,0.24)',
    '0 76px 152px rgba(0,0,0,0.26)',
    '0 80px 160px rgba(0,0,0,0.26)',
    '0 84px 168px rgba(0,0,0,0.28)',
    '0 88px 176px rgba(0,0,0,0.28)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box sx={{ pt: 8 }}>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
