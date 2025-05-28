import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Check,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Plan } from './Types';
import { createSubscription } from '../../utils/API';
import { useSubscriptionStatus } from '../../components/hooks/useSubscriptionStatus'; 

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { subscriptionPlan, loading, error: subscriptionError } = useSubscriptionStatus();
  const hasActiveSubscription = subscriptionPlan === 'premium';

  const plans: Plan[] = [
    {
      id: '1_day',
      name: '1 Day Pass',
      price: '$1.99',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD quality',
        'No ads',
      ],
      duration: '24 hours of premium access',
    },
    {
      id: '7_days',
      name: '7 Day Pass',
      price: '$7.99',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD & 4K quality',
        'No ads',
        'Offline downloads',
      ],
      duration: '7 days of premium access',
      popular: true,
    },
    {
      id: '1_months',
      name: '1 Month Premium',
      price: '$19.99',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD & 4K quality',
        'No ads',
        'Offline downloads',
        'Priority customer support',
        'Early access to new releases',
      ],
      duration: '30 days of premium access',
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a plan.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        console.log('Redirecting to:', checkoutUrl);
        window.location.href = checkoutUrl;
        window.scrollTo(0, 0);
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err: any) {
      console.error('Error in handleSubscribe:', err);
      setError(err.message || 'Failed to initiate subscription. Please try again.');
      setIsProcessing(false);
    }
  };

  const themeColors = {
    background: 'rgb(20, 20, 30)',
    cardBg: '#000000',
    cardBgSelected: '#1a1a1a',
    primary: '#ff0000', 
    secondary: '#cc0000', 
    accent: '#ff3333', 
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    success: '#4caf50',
    highlight: '#ff9800',
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: themeColors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: themeColors.primary }} />
      </Box>
    );
  }

  if (subscriptionError) {
    return (
      <Box sx={{ bgcolor: themeColors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {subscriptionError}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            bgcolor: themeColors.primary,
            '&:hover': { bgcolor: themeColors.secondary },
            fontWeight: 'bold',
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: themeColors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* <Header /> */}
      <Box
        sx={{
          flex: 1,
          py: 6,
          backgroundImage: 'linear-gradient(to bottom, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.95)), url(/images/cinema-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {!hasActiveSubscription ? (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: themeColors.text }}
                >
                  Choose Your FILMHUNT Plan
                </Typography>
                <Typography variant="h6" color={themeColors.textSecondary}>
                  Unlock premium content with a subscription that fits your schedule
                </Typography>
              </>
            ) : (
              <Typography variant="h5"
                  component="h1" sx={{fontSize: { xs: '1rem', sm: '1rem', md: '1.6rem' }, color: themeColors.primary}}>
                You currently have an active subscription. Please wait until it expires to select a new plan.
              </Typography>
            )}
          </Box>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            mb: 6,
            gap: 3,
          }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                elevation={selectedPlan === plan.id ? 8 : 3}
                sx={{
                    position: 'relative',
                    width: { xs: '100%', md: 'calc(33.33% - 24px)' },
                    maxWidth: '400px',
                    transition: 'all 0.3s',
                    transform: selectedPlan === plan.id ? 'scale(1.02)' : 'scale(1)',
                    bgcolor: selectedPlan === plan.id ? themeColors.cardBgSelected : themeColors.cardBg,
                    color: themeColors.text,
                    borderRadius: 2,
                    overflow: 'visible',
                    border: selectedPlan === plan.id ? `2px solid ${themeColors.primary}` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '500px', 
                    '&:hover': {
                      transform: hasActiveSubscription ? 'none' : 'translateY(-5px)',
                      boxShadow: hasActiveSubscription
                        ? 'none'
                        : `0 10px 20px rgba(0,0,0,0.2), 0 0 0 2px ${themeColors.primary}30`,
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="MOST POPULAR"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 24,
                      bgcolor: themeColors.highlight,
                      color: '#000',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color={themeColors.textSecondary} gutterBottom>
                    {plan.duration}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 2,  }}>
                    {plan.price}
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Check sx={{ color: themeColors.success }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            color: themeColors.text,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                    size="large"
                    fullWidth
                    onClick={() => setSelectedPlan(plan.id)}
                    disabled={hasActiveSubscription}
                    sx={{
                      bgcolor: selectedPlan === plan.id ? themeColors.primary : 'transparent',
                      color: selectedPlan === plan.id ? '#fff' : themeColors.primary,
                      borderColor: themeColors.primary,
                      '&:hover': {
                        bgcolor: selectedPlan === plan.id ? themeColors.secondary : `${themeColors.primary}20`,
                        borderColor: themeColors.primary,
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255, 255, 255, 0.12)',
                        color: 'rgba(255, 255, 255, 0.3)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      py: 1,
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {selectedPlan && !hasActiveSubscription && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={5}
                sx={{
                  p: 4,
                  width: '100%',
                  maxWidth: 'md',
                  bgcolor: themeColors.cardBg,
                  color: themeColors.text,
                  borderRadius: 2,
                  border: `1px solid ${themeColors.primary}30`,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px ${themeColors.primary}20`,
                }}
              >
                <Typography variant="h4" component="h2" gutterBottom>
                  Confirm Your Subscription
                </Typography>
                <Typography variant="body1" color={themeColors.textSecondary} gutterBottom sx={{ mb: 3 }}>
                  You have selected the {plans.find((p) => p.id === selectedPlan)?.name} for {plans.find((p) => p.id === selectedPlan)?.price}.
                </Typography>
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isProcessing}
                  onClick={handleSubscribe}
                  sx={{
                    py: 1.5,
                    bgcolor: themeColors.primary,
                    '&:hover': { bgcolor: themeColors.secondary },
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {isProcessing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Processing...
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Subscribe Now <ArrowForward sx={{ ml: 1 }} />
                    </Box>
                  )}
                </Button>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}