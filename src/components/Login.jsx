import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            padding: { xs: 3, sm: 4 }, 
            width: '100%',
            maxWidth: 400,
            borderRadius: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              component="h1" 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue shopping
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  transform: 'none',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box 
              sx={{ 
                mt: 3, 
                p: 2.5, 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center" 
                gutterBottom
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Test Credentials
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Username: <strong>emilys</strong> | Password: <strong>emilyspass</strong>
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                align="center" 
                display="block" 
                sx={{ mt: 1 }}
              >
                Or use any username/password from dummyjson.com/users
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

