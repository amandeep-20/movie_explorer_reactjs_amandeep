import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  PersonAdd as PersonIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Diamond as DiamondIcon,
  ArrowBack as ArrowBackIcon,
  Subscriptions,
  Explore,
} from '@mui/icons-material';
import { useSubscriptionStatus } from '../../../src/components/hooks/useSubscriptionStatus';

// Custom dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4a6de5', // Professional blue
    },
    secondary: {
      main: '#f5c518', // Premium gold
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
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
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Sidebar navigation items
const navItems = [
  { icon: <DashboardIcon />, text: 'Dashboard', path: '/user/dashboard' },
  { icon: <Explore />, text: 'Explore', path: '/user/getMovies' },
  { icon: <Subscriptions/>, text: 'subscription', path: '/user/subscription' },
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('guest');
  const { subscriptionPlan, loading, error } = useSubscriptionStatus();

  // Mock user data for fields not in localStorage
  const user = {
    username: '',
    joinDate: '',
  };

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const storedEmail = parsedUser?.email;
        const storedRole = parsedUser?.role;

        if (storedEmail) {
          setEmail(storedEmail);
        }
        if (storedRole && ['user', 'supervisor', 'guest'].includes(storedRole)) {
          setRole(storedRole);
        } else {
          setRole('guest');
        }
      } else {
        setRole('guest');
        setEmail('');
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      setRole('guest');
      setEmail('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data on logout
    console.log('Logging out...');
    navigate('/');
  };

  const handleUpgradeClick = () => {
    navigate('/user/subscription');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar Navigation */}
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
              MExplorer
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
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.primary',
                  },
                  py: 1.5,
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', pb: 6 }}>
          {/* Page Content */}
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" color="white" component="h1" sx={{ mb: 4 }}>
              User Profile
            </Typography>

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
                      <Typography variant="body1" sx={{ p: 3, textAlign: 'center' }}>
                        Loading subscription status...
                      </Typography>
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
                                color: 'secondary.main',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
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

                            <Box sx={{ mt: 2 }}>
                              {subscriptionPlan === 'premium' ? (
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        mr: 2,
                                      }}
                                    />
                                    <Typography variant="body2">Unlimited project creation</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        mr: 2,
                                      }}
                                    />
                                    <Typography variant="body2">24/7 priority support</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        mr: 2,
                                      }}
                                    />
                                    <Typography variant="body2">Advanced analytics</Typography>
                                  </Box>
                                </>
                              ) : (
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        mr: 2,
                                      }}
                                    />
                                    <Typography variant="body2">Limited project creation</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        mr: 2,
                                      }}
                                    />
                                    <Typography variant="body2">Standard support</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        mr: 2,
                                      }}
                                    />
                                    <Typography variant="body2">Basic analytics</Typography>
                                  </Box>
                                </>
                              )}
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {subscriptionPlan === 'premium' ? (
                              <>
                                <Typography
                                  variant="h4"
                                  sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}
                                >
                                  Active
                                </Typography>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  sx={{
                                    borderWidth: 2,
                                    '&:hover': {
                                      borderWidth: 2,
                                    },
                                  }}
                                >
                                  Subscription
                                </Button>
                              </>
                            ) : (
                              <>
                                <Typography
                                  variant="h4"
                                  sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 2 }}
                                >
                                  Active
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={handleUpgradeClick}
                                  sx={{
                                    bgcolor: 'secondary.main',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                      bgcolor: 'secondary.light',
                                    },
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

              {/* User Information Section */}
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
                      {email ? email.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h5" align="center">
                      {user.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                      {email || 'Not provided'}
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
                        sx={{
                          color: 'primary.light',
                          fontWeight: 500,
                        }}
                      >
                        {role === 'supervisor' ? 'Supervisor' : (role === 'user' ? 'User' : 'Guest')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Member since
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
                      <Typography variant="body1">{user.joinDate}</Typography>
                    </Box>
                  </Box>

                  {role === 'supervisor' && (
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
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      Create New Content
                    </Button>
                  )}
                </Paper>
              </Box>
            </Box>

            {/* Logout Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                component={RouterLink}
                to="/"
                onClick={handleLogout}
                startIcon={<ArrowBackIcon />}
                sx={{
                  bgcolor: '#ff4d4d', // Red color for the button
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '20px', // Rounded corners
                  padding: '8px 16px',
                  textTransform: 'uppercase',
                  '&:hover': {
                    bgcolor: '#e64444', // Slightly darker red on hover
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserProfile;