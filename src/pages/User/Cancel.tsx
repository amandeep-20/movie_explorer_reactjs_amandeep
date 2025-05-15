import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const Cancel = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [location.search]);

  return (
    <Box
      sx={{
        bgcolor: 'rgb(20, 20, 30)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'rgba(20, 20, 20, 0.9)',
              color: '#fff',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={40} color="inherit" sx={{ mb: 2 }} />
                <Typography variant="h6">
                  Processing cancellation...
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'error.light',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CancelIcon color="error" sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h4" component="h2" gutterBottom>
                  Subscription Cancelled
                </Typography>
                <Typography
                  variant="body1"
                  color="rgba(255,255,255,0.7)"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  Your subscription attempt has been cancelled. No charges have been made to your account.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={() => (window.location.href = '/user/subscription')}
                  sx={{
                    bgcolor: '#E50914',
                    '&:hover': { bgcolor: '#c7000d' },
                  }}
                >
                  Try Again
                </Button>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Cancel;