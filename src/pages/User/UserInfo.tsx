import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from '@mui/material';
import {
  PersonAdd as PersonIcon,
  Dashboard as DashboardIcon,
  ArrowBack as ArrowBackIcon,
  Subscriptions,
  Explore,
  Diamond as DiamondIcon,
} from '@mui/icons-material';
import { useSubscriptionStatus } from '../../../src/components/hooks/useSubscriptionStatus';
import { fetchCurrentUser } from '../../utils/API';


declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4a6de5' },
    secondary: { main: '#f5c518' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
    error: { main: '#ff4d4d' },
    neutral: { main: '#757575' }, 
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 16px',
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { backgroundColor: 'rgba(255, 255, 255, 0.08)' } },
    },
  },
  typography: {
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
});

const navItems = [
  { icon: <DashboardIcon />, text: 'Dashboard', path: '/user/dashboard' },
  { icon: <Explore />, text: 'Explore', path: '/user/getMovies' },
  { icon: <Subscriptions />, text: 'subscription', path: '/user/subscription' },
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', role: 'guest', username: '', joinDate: '', mobileNumber: '' });
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const { subscriptionPlan, createdAt, expiresAt, loading, error } = useSubscriptionStatus();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setErrorUser(null);

      try {
        const data = await fetchCurrentUser();
        setUser({
          email: data.email || '',
          role: ['user', 'supervisor', 'guest'].includes(data.role || '') ? data.role || 'guest' : 'guest',
          username: data.first_name || '',
          joinDate: data.join_date || '',
          mobileNumber: data.mobile_number || '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setErrorUser('Unable to load user data. Please try again later.');
        setUser({ email: '', role: 'guest', username: '', joinDate: '', mobileNumber: '' });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logging out...');
    navigate('/');
  };

  const handleUpgradeClick = () => {
    navigate('/user/subscription');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box
          component="nav"
          sx={{
            width: { sm: 240 },
            flexShrink: 0,
            display: { xs: 'none', sm: 'block' },
            bgcolor: 'background.paper',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
              FILMHUNT
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            {navItems.map((item, index) => (
              <Button
                key={index}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  width: '100%',
                  mb: 1,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'text.primary' },
                  py: 1.5,
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'auto', pb: 6 }}>
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h4" color="white" component="h1">
                User Profile
              </Typography>
              <Button
                component={RouterLink}
                to="/"
                onClick={handleLogout}
                startIcon={<ArrowBackIcon />}
                sx={{
                  bgcolor: '#ff4d4d',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  textTransform: 'uppercase',
                  '&:hover': { bgcolor: '#e64444' },
                }}
              >
                Logout
              </Button>
            </Box>

            {loadingUser ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress sx={{ color: 'error.main' }} />
              </Box>
            ) : errorUser ? (
              <Typography variant="body1" color="error" sx={{ p: 3, textAlign: 'center' }}>
                {errorUser}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Subscription Plan Section */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DiamondIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="h6">Subscription Plan</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ position: 'relative' }}>
                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                          <CircularProgress sx={{ color: 'error.main' }} />
                        </Box>
                      ) : error ? (
                        <Typography variant="body1" color="error" sx={{ p: 3, textAlign: 'center' }}>
                          {error}
                        </Typography>
                      ) : (
                        <Paper
                          sx={{
                            p: 3,
                            bgcolor: '#252525',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {subscriptionPlan === 'premium' && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 100,
                                height: 100,
                                overflow: 'hidden',
                                zIndex: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: 'secondary.main',
                                  color: '#000',
                                  transform: 'rotate(45deg)',
                                  transformOrigin: 'bottom right',
                                  position: 'absolute',
                                  bottom: 70,
                                  right: -70,
                                  width: 200,
                                }}
                              />
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{
                                  color: subscriptionPlan === 'premium' ? 'secondary.main' : 'neutral.main',
                                  fontWeight: 'bold',
                                  mb: 2,
                                }}
                              >
                                {subscriptionPlan === 'premium' ? 'Premium' : 'Basic'}
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>
                                {subscriptionPlan === 'premium'
                                  ? 'Access to all premium features with priority support'
                                  : 'Limited access with basic features'}
                              </Typography>
                              {subscriptionPlan === 'premium' && (
                                <>
                                  <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      Subscription Started
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                      }}
                                    >
                                      <Typography variant="body1">{formatDate(createdAt)}</Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      Subscription Expires
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                      }}
                                    >
                                      <Typography variant="body1">{formatDate(expiresAt)}</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                              <Box sx={{ mt: 2 }}>
                                {subscriptionPlan === 'premium' ? (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mr: 2 }} />
                                      <Typography variant="body2">Unlimited project creation</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mr: 2 }} />
                                      <Typography variant="body2">24/7 priority support</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mr: 2 }} />
                                      <Typography variant="body2">Advanced analytics</Typography>
                                    </Box>
                                  </>
                                ) : (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'neutral.main', mr: 2 }} />
                                      <Typography variant="body2">Limited project creation</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'neutral.main', mr: 2 }} />
                                      <Typography variant="body2">Standard support</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'neutral.main', mr: 2 }} />
                                      <Typography variant="body2">Basic analytics</Typography>
                                    </Box>
                                  </>
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              {subscriptionPlan === 'premium' ? (
                                <>
                                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                                    Active
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                                  >
                                    Subscription Active
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'neutral.main', mb: 2 }}>
                                    Active
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpgradeClick}
                                    sx={{
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                      fontWeight: 'bold',
                                      '&:hover': { bgcolor: 'primary.dark' },
                                    }}
                                  >
                                    Upgrade to Premium
                                  </Button>
                                </>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      )}
                    </Box>
                  </Paper>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          bgcolor: 'primary.main',
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          mb: 2,
                        }}
                      >
                        {user.email ? user.email.charAt(0).toUpperCase() : user.role.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h5" align="center">
                        {user.username || 'Unknown User'}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" align="center">
                        {user.email || 'Not provided'}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Role
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'rgba(74, 109, 229, 0.1)',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ color: 'primary.light', fontWeight: 500 }}
                        >
                          {user.role === 'supervisor' ? 'Supervisor' : (user.role === 'user' ? 'User' : 'Guest')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Mobile Number
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'rgba(255, 255, 255, 0.03)',
                        }}
                      >
                        <Typography variant="body1">{user.mobileNumber || 'Not provided'}</Typography>
                      </Box>
                    </Box>
                    {user.role === 'supervisor' && (
                      <Button
                        component={RouterLink}
                        to="/admin/manageTask"
                        variant="contained"
                        startIcon={<PersonIcon />}
                        fullWidth
                        sx={{
                          bgcolor: 'primary.main',
                          mt: 3,
                          py: 1.5,
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        Create New Content
                      </Button>
                    )}
                  </Paper>
                </Box>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserProfile;