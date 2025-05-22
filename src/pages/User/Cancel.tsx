import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Cancel as CancelIcon, ArrowBack } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const Cancel = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [location.search]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Card
            elevation={6}
            sx={{
              backgroundColor: 'rgba(25, 28, 36, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}
          >
            {/* Header decoration */}
            <Box
              sx={{
                height: 8,
                width: '100%',
                background: 'linear-gradient(90deg, #E50914 0%, #FF9800 100%)'
              }}
            />

            <CardContent sx={{ p: 4 }}>
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                  <CircularProgress 
                    size={60} 
                    thickness={4} 
                    sx={{ 
                      color: '#E50914',
                      mb: 3
                    }} 
                  />
                  <Typography variant="h5" color="white" gutterBottom>
                    Processing Cancellation
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Please wait while we process your cancellation request...
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', py: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: isMobile ? 'center' : 'flex-start',
                      flex: 1,
                      pr: isMobile ? 0 : 4,
                      textAlign: isMobile ? 'center' : 'left' 
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 90,
                        height: 90,
                        bgcolor: 'rgba(244, 67, 54, 0.2)',
                        mb: 3,
                        mt: isMobile ? 0 : 2
                      }}
                    >
                      <CancelIcon sx={{ fontSize: 54, color: '#f44336' }} />
                    </Avatar>
                    <Typography variant="h3" component="h1" color="white" gutterBottom>
                      Subscription Cancelled
                    </Typography>
                    <Typography variant="body1" color="white" sx={{ mb: 2 }}>
                      Your subscription attempt has been cancelled.
                    </Typography>
                    <Typography variant="body1" color="white" sx={{ mb: 3 }}>
                      No charges have been made to your account.
                    </Typography>
                  </Box>

                  {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />}
                  {isMobile && <Divider sx={{ my: 3, width: '100%', bgcolor: 'rgba(255,255,255,0.1)' }} />}

                  <Box 
                    sx={{ 
                      flex: isMobile ? undefined : 0.8,
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      alignItems: isMobile ? 'center' : 'flex-start',
                      textAlign: isMobile ? 'center' : 'left'
                    }}
                  >
                    <Typography variant="h6" color="white" gutterBottom>
                      What Would You Like To Do?
                    </Typography>
                    <Typography variant="body1" color="white" paragraph sx={{ mb: 4 }}>
                      You can try subscribing again or explore our available plans to find one that meets your needs.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, width: '100%' }}>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ArrowBack />}
                        onClick={() => (window.location.href = '/user/dashboard')}
                        fullWidth={isMobile}
                        sx={{
                          px: 3,
                          py: 1.5,
                          color: '#fff',
                          borderColor: 'rgba(255,255,255,0.3)',
                          '&:hover': { 
                            borderColor: '#fff',
                            bgcolor: 'rgba(255,255,255,0.05)'
                          },
                          borderRadius: 2
                        }}
                      >
                        Return Home
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => (window.location.href = '/user/subscription')}
                        fullWidth={isMobile}
                        sx={{
                          px: 3,
                          py: 1.5,
                          bgcolor: '#E50914',
                          '&:hover': { bgcolor: '#b20710' },
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)'
                        }}
                      >
                        Try Again
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Cancel;