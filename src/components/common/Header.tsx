import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography,
  Button, IconButton,
  Box, Badge,
  Modal, Paper,
  Chip, Tooltip,
  Fade, Collapse,
  Drawer, List,
  ListItem, ListItemIcon,
  ListItemText, Divider,
  Avatar, useMediaQuery, useTheme,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { onMessage, messaging } from '../../notifications/firebase';
import { useSubscriptionStatus } from '../../../src/components/hooks/useSubscriptionStatus';

const Header = () => {
  const [role, setRole] = useState('guest');
  const [email, setEmail] = useState('');
  const [membershipType, setMembershipType] = useState('basic');
  const [notificationCount, setNotificationCount] = useState(0);
  interface Notification {
    id: number;
    message: string;
    timestamp: string;
    read: boolean;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { subscriptionPlan, loading: subscriptionLoading } = useSubscriptionStatus();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const storedRole = user?.role;
        const storedEmail = user?.email;
        const storedMembership = user?.membership;

        if (storedRole && ['user', 'supervisor', 'guest'].includes(storedRole)) {
          setRole(storedRole);
        } else {
          setRole('guest');
        }

        if (storedEmail) {
          setEmail(storedEmail);
        }
        if (!subscriptionLoading) {
          if (subscriptionPlan === 'premium') {
            setMembershipType('premium');
          } else {
            setMembershipType(storedMembership && ['basic', 'premium'].includes(storedMembership) ? storedMembership : 'basic');
          }
        }
      } else {
        setRole('guest');
        setMembershipType('basic');
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      setRole('guest');
      setMembershipType('basic');
    }
    
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[Header] Received foreground message:', payload);
      const { notification } = payload;
      if (notification?.title && notification?.body) {
        const newNotification = {
          id: Date.now(),
          message: `${notification.title}: ${notification.body}`,
          timestamp: new Date().toLocaleTimeString(),
          read: false,
        };
        setNotifications((prev) => [...prev, newNotification]);
        setNotificationCount((prev) => prev + 1);
      }
    });

    return () => unsubscribe();
  }, [subscriptionPlan, subscriptionLoading]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setRole('guest');
    setEmail('');
    setMembershipType('basic');
    navigate('/');
  };

  const handleNotificationClick = () => {
    setNotificationModalOpen(true);
  };

  const handleCloseNotificationModal = () => {
    setNotificationModalOpen(false);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
    setNotificationCount(0);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const renderMembershipBadge = () => {
    if (role === 'guest') return null;
    return null;
  };

  const handleProfileClick = () => {
    navigate('/user/info');
  };

  const renderSubscriberButton = (isMobileDrawer = false) => {
    const isPremium = membershipType === 'premium';
    const commonStyles = {
      color: isActive('/user/subscription') ? '#E50914' : 'white',
      fontWeight: isActive('/user/subscription') ? 'bold' : 'normal',
      px: isMobileDrawer ? 2 : 2,
      py: isMobileDrawer ? 1 : 1,
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      position: 'relative',
      '&:after': isActive('/user/subscription')
        ? {
            content: '""',
            position: 'absolute',
            bottom: isMobileDrawer ? '-4px' : '0',
            left: '20%',
            width: '60%',
            height: '3px',
            bgcolor: '#E50914',
            borderRadius: '2px',
          }
        : {},
      '&:hover': {
        color: '#E50914',
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateY(-2px)',
      },
    };

    if (isPremium) {
      return isMobileDrawer ? (
        <ListItem
          component={RouterLink}
          to="/user/subscription"
          sx={{
            borderLeft: isActive('/user/subscription') ? '4px solid #E50914' : '4px solid transparent',
            bgcolor: isActive('/user/subscription') ? 'rgba(229, 9, 20, 0.1)' : 'rgba(250, 204, 21, 0.05)',
            pl: 2,
            '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: isActive('/user/subscription') ? '#E50914' : '#facc15', minWidth: '40px' }}>
            <StarIcon />
          </ListItemIcon>
          <ListItemText
            primary="Premium Subscriber"
            sx={{ color: isActive('/user/subscription') ? '#E50914' : '#facc15' }}
          />
        </ListItem>
      ) : (
        <Tooltip title="Premium Subscriber" arrow>
          <Button
            component={RouterLink}
            to="/user/subscription"
            variant="contained"
            startIcon={<StarIcon sx={{ color: isActive('/user/subscription') ? '#E50914' : '#facc15' }} />}
            aria-label="Premium Subscriber"
            sx={{
              background: isActive('/user/subscription')
                ? 'rgba(229, 9, 20, 0.1)'
                : 'rgba(250, 204, 21, 0.05)',
              borderBottom: isActive('/user/subscription') ? '4px solid #E50914' : '4px solid transparent',
              boxShadow: 'none',
              color: isActive('/user/subscription') ? '#E50914' : '#facc15',
              fontWeight: 'normal',
              justifyContent: 'flex-start',
              pl: 2,
              '&:hover': {
                background: 'rgba(250, 204, 21, 0.1)',
                boxShadow: 'none',
              },
            }}
          >
            Active
          </Button>
        </Tooltip>
      );
    }

    return isMobileDrawer ? (
      <ListItem
        component={RouterLink}
        to="/user/subscription"
        sx={{
          borderLeft: isActive('/user/subscription') ? '4px solid #E50914' : '4px solid transparent',
          bgcolor: isActive('/user/subscription') ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
          pl: 2,
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
        }}
      >
        <ListItemIcon sx={{ color: isActive('/user/subscription') ? '#E50914' : 'white', minWidth: '40px' }}>
          <SubscriptionsIcon />
        </ListItemIcon>
        <ListItemText
          primary="Subscriber"
          sx={{ color: isActive('/user/subscription') ? '#E50914' : 'white' }}
        />
      </ListItem>
    ) : (
      <Tooltip title="Subscriber" arrow>
        <Button
          component={RouterLink}
          to="/user/subscription"
          sx={commonStyles}
          startIcon={<SubscriptionsIcon />}
          aria-label="Subscriber"
        >
          Subscriber
        </Button>
      </Tooltip>
    );
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'black',
        backdropFilter: 'blur(10px)',
        color: '#f7b345',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        py: 0.5,
        px: { xs: 1, md: 2 },
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{
              color: 'white',
              mr: 1,
              transition: 'transform 0.2s ease',
              transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}

        <Button
          component={RouterLink}
          to="/user/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            px: { xs: 1, md: 1.5 },
            py: { xs: 0.25, md: 0.5 },
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <MovieIcon
            sx={{
              fontSize: { xs: 24, md: 30 },
              color: '#E50914',
              mr: 1,
              filter: 'drop-shadow(0 0 4px rgba(229, 9, 20, 0.5))',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              letterSpacing: '0.5px',
              transition: 'color 0.2s ease',
              '&:hover': { color: '#E50914' },
            }}
          >
            MExplorer
          </Typography>
        </Button>

        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Tooltip title="Home" arrow>
              <Button
                component={RouterLink}
                to="/user/dashboard"
                sx={{
                  color: isActive('/user/dashboard') ? '#E50914' : 'white',
                  fontWeight: isActive('/user/dashboard') ? 'bold' : 'normal',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:after': isActive('/user/dashboard')
                    ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '0',
                        left: '20%',
                        width: '60%',
                        height: '3px',
                        bgcolor: '#E50914',
                        borderRadius: '2px',
                      }
                    : {},
                  '&:hover': {
                    color: '#E50914',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                }}
                startIcon={<HomeIcon />}
              >
                Home
              </Button>
            </Tooltip>
            <Tooltip title="Explore" arrow>
              <Button
                component={RouterLink}
                to="/user/getMovies"
                sx={{
                  color: isActive('/user/getMovies') ? '#E50914' : 'white',
                  fontWeight: isActive('/user/getMovies') ? 'bold' : 'normal',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:after': isActive('/user/getMovies')
                    ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '0',
                        left: '20%',
                        width: '60%',
                        height: '3px',
                        bgcolor: '#E50914',
                        borderRadius: '2px',
                      }
                    : {},
                  '&:hover': {
                    color: '#E50914',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                }}
                startIcon={<ExploreIcon />}
              >
                Explore
              </Button>
            </Tooltip>

            {role !== 'guest' && renderSubscriberButton()}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {role !== 'guest' && (
            <Tooltip title="Notifications" arrow>
              <IconButton
                onClick={handleNotificationClick}
                sx={{
                  color: 'white',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#E50914',
                    transform: 'scale(1.1)',
                  },
                }}
                aria-label="notifications"
              >
                <Badge
                  badgeContent={notificationCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(45deg, #E50914, #ff3b30)',
                      boxShadow: '0 0 5px rgba(229, 9, 20, 0.7)',
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          {!isMobile && (
            <>
              {role === 'guest' ? (
                <Button
                  component={RouterLink}
                  to="/"
                  sx={{
                    background: 'linear-gradient(45deg, #E50914, #ff3b30)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 8px rgba(229, 9, 20, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(229, 9, 20, 0.4)',
                    },
                  }}
                  startIcon={<LoginIcon />}
                >
                  Login/Signup
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="View Profile" arrow>
                    <Box
                      onClick={handleProfileClick}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        py: 0.5,
                        px: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: '#E50914',
                          fontSize: '0.8rem',
                          boxShadow: '0 0 8px rgba(229, 9, 20, 0.4)',
                        }}
                      >
                        {email ? email.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          ml: 1,
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {role === 'supervisor' ? 'Supervisor' : (email || 'User')}
                        {renderMembershipBadge()}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </>
          )}

          {isMobile && role !== 'guest' && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                color: 'white',
                '&:hover': { color: '#E50914' },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: role === 'supervisor' ? '#4CAF50' : '#E50914',
                  fontSize: '0.8rem',
                  boxShadow: '0 0 8px rgba(229, 9, 20, 0.4)',
                }}
              >
                {email ? email.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}

          {isMobile && role === 'guest' && (
            <Button
              component={RouterLink}
              to="/"
              sx={{
                background: 'linear-gradient(45deg, #E50914, #ff3b30)',
                color: 'white',
                minWidth: 'auto',
                p: 0.5,
                borderRadius: '50%',
                width: 35,
                height: 35,
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <LoginIcon fontSize="small" />
            </Button>
          )}
        </Box>
      </Toolbar>

      <Collapse in={searchOpen}>
        <Box sx={{ p: 2, bgcolor: 'rgba(18, 18, 40, 0.95)' }}>
          <Box
            component="input"
            sx={{
              width: '100%',
              p: 1.5,
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              '&:focus': {
                border: '1px solid #E50914',
                boxShadow: '0 0 0 2px rgba(229, 9, 20, 0.2)',
              },
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
            placeholder="Search for movies, shows, genres..."
            autoFocus
          />
        </Box>
      </Collapse>

      <Drawer
        anchor="left"
        open={isMobile && mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: '300px',
            bgcolor: 'rgb(18, 18, 40)',
            color: 'white',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MovieIcon sx={{ color: '#E50914', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              MExplorer
            </Typography>
          </Box>
          <IconButton onClick={toggleMobileMenu} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        {role !== 'guest' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: role === 'supervisor' ? '#4CAF50' : '#E50914',
                }}
              >
                {email ? email.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ ml: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {email || (role === 'supervisor' ? 'Supervisor' : 'User')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderMembershipBadge()}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        <List>
          <ListItem
            component={RouterLink}
            to="/user/dashboard"
            sx={{
              borderLeft: isActive('/user/dashboard') ? '4px solid #E50914' : '4px solid transparent',
              bgcolor: isActive('/user/dashboard') ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
              pl: 2,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon
              sx={{ color: isActive('/user/dashboard') ? '#E50914' : 'white', minWidth: '40px' }}
            >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              sx={{ color: isActive('/user/dashboard') ? '#E50914' : 'white' }}
            />
          </ListItem>

          <ListItem
            component={RouterLink}
            to="/user/getMovies"
            sx={{
              borderLeft: isActive('/user/getMovies') ? '4px solid #E50914' : '4px solid transparent',
              bgcolor: isActive('/user/getMovies') ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
              pl: 2,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon
              sx={{ color: isActive('/user/getMovies') ? '#E50914' : 'white', minWidth: '40px' }}
            >
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText
              primary="Explore"
              sx={{ color: isActive('/user/getMovies') ? '#E50914' : 'white' }}
            />
          </ListItem>

          {role !== 'guest' && renderSubscriberButton(true)}

          {role !== 'guest' && (
            <ListItem
              component={RouterLink}
              to="/user/info"
              sx={{
                borderLeft: isActive('/user/info') ? '4px solid #E50914' : '4px solid transparent',
                bgcolor: isActive('/user/info') ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                pl: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              <ListItemIcon
                sx={{ color: isActive('/user/info') ? '#E50914' : 'white', minWidth: '40px' }}
              >
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText
                primary="User Info"
                sx={{ color: isActive('/user/info') ? '#E50914' : 'white' }}
              />
            </ListItem>
          )}

          {role === 'supervisor' && (
            <ListItem
              component={RouterLink}
              to="/admin/manageTask"
              sx={{
                borderLeft: isActive('/admin/manageTask') ? '4px solid #E50914' : '4px solid transparent',
                bgcolor: isActive('/admin/manageTask') ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                pl: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              <ListItemIcon
                sx={{ color: isActive('/admin/manageTask') ? '#E50914' : 'white', minWidth: '40px' }}
              >
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Create New"
                sx={{ color: isActive('/admin/manageTask') ? '#E50914' : 'white' }}
              />
            </ListItem>
          )}
        </List>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 'auto' }} />

        {role === 'guest' ? (
          <ListItem
            component={RouterLink}
            to="/"
            sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login/Signup" />
          </ListItem>
        ) : (
          <ListItem onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </Drawer>

      <Modal
        open={notificationModalOpen}
        onClose={handleCloseNotificationModal}
        aria-labelledby="notification-modal-title"
        closeAfterTransition
      >
        <Fade in={notificationModalOpen}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              maxWidth: 450,
              maxHeight: '80vh',
              overflow: 'auto',
              bgcolor: 'rgb(18, 18, 40)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              p: 3,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="notification-modal-title" variant="h6" component="h2" fontWeight="bold">
                Notifications
              </Typography>
              <IconButton onClick={handleCloseNotificationModal} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: notification.read ? 'rgba(255, 255, 255, 0.03)' : 'rgba(229, 9, 20, 0.08)',
                    border: notification.read ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(229, 9, 20, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: notification.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(229, 9, 20, 0.12)',
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {notification.timestamp}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1">No new notifications</Typography>
              </Box>
            )}
          </Paper>
        </Fade>
      </Modal>
    </AppBar>
  );
};

export default Header;