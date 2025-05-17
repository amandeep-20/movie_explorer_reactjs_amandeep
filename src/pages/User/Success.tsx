// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Container,
//   Paper,
//   CircularProgress,
//   Button,
// } from '@mui/material';
// import { CheckCircle } from '@mui/icons-material';
// import { useLocation } from 'react-router-dom';
// import { verifySubscription } from '../../../src/utils/API'; // Adjust the path based on your file structure

// const Success = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
//   const location = useLocation();

//   useEffect(() => {
//     const verify = async () => {
//       const params = new URLSearchParams(location.search);
//       const sessionId = params.get('session_id');

//       if (!sessionId) {
//         setError('No session ID found in the URL.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const responseData = await verifySubscription(sessionId);
//         console.log('API Response:', responseData); 
//         setSubscriptionDetails(responseData); 
//         setLoading(false);
//       } catch (err: any) {
//         console.error('Error verifying subscription:', err);
//         setError(err || 'Failed to verify subscription. Please try again.');
//         setLoading(false);
//       }
//     };

//     verify();
//   }, [location.search]);

//   return (
//     <Box
//       sx={{
//         bgcolor: 'rgb(20, 20, 30)',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           p: 3,
//         }}
//       >
//         <Container maxWidth="sm">
//           <Paper
//             elevation={3}
//             sx={{
//               p: 4,
//               textAlign: 'center',
//               bgcolor: 'rgba(20, 20, 20, 0.9)',
//               color: '#fff',
//               borderRadius: 3,
//               border: '1px solid rgba(255, 255, 255, 0.08)',
//             }}
//           >
//             {loading ? (
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                 }}
//               >
//                 <CircularProgress size={40} color="inherit" sx={{ mb: 2 }} />
//                 <Typography variant="h6">
//                   Verifying your subscription...
//                 </Typography>
//               </Box>
//             ) : error ? (
//               <>
//                 <Typography variant="h4" component="h2" gutterBottom>
//                   Subscription Error
//                 </Typography>
//                 <Typography variant="body1" color="error" sx={{ mb: 3 }}>
//                   {error}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   onClick={() => (window.location.href = '/user/subscription')}
//                   sx={{
//                     bgcolor: '#E50914',
//                     '&:hover': { bgcolor: '#c7000d' },
//                   }}
//                 >
//                   Try Again
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Box
//                   sx={{
//                     width: 64,
//                     height: 64,
//                     bgcolor: 'success.light',
//                     borderRadius: '50%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     mx: 'auto',
//                     mb: 3,
//                   }}
//                 >
//                   <CheckCircle color="success" sx={{ fontSize: 36 }} />
//                 </Box>
//                 <Typography variant="h4" component="h2" gutterBottom>
//                   Subscription Activated!
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   color="rgba(255,255,255,0.7)"
//                   gutterBottom
//                   sx={{ mb: 3 }}
//                 >
//                   Your subscription has been successfully activated.
//                   {subscriptionDetails?.plan_name &&
//                     ` Enjoy your ${subscriptionDetails.plan_name}!`}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   fullWidth
//                   onClick={() => (window.location.href = '/user/dashboard')}
//                   sx={{
//                     bgcolor: '#E50914',
//                     '&:hover': { bgcolor: '#c7000d' },
//                   }}
//                 >
//                   Start Exploring Movies
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default Success;


import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Fade,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CheckCircle, ErrorOutline, ArrowForward } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { verifySubscription } from '../../../src/utils/API'; 

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type SubscriptionDetails = {
    plan_name?: string;
  };
  
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found in the URL.');
        setLoading(false);
        return;
      }

      try {
        const responseData = await verifySubscription(sessionId);
        console.log('API Response:', responseData);
        setSubscriptionDetails(responseData);
        setLoading(false);
      } catch (err) {
        console.error('Error verifying subscription:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to verify subscription. Please try again.';
        setError(errorMessage);
        setLoading(false);
      }
    };

    verify();
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
                    Verifying Your Subscription
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Please wait while we confirm your payment details...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'rgba(211, 47, 47, 0.2)',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <ErrorOutline sx={{ fontSize: 48, color: '#f44336' }} />
                  </Avatar>
                  <Typography variant="h4" color="white" gutterBottom>
                    Subscription Error
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="error" 
                    sx={{ 
                      maxWidth: 400, 
                      mx: 'auto', 
                      mb: 4,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'rgba(244, 67, 54, 0.1)'
                    }}
                  >
                    {error}
                  </Typography>
                  <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => (window.location.href = '/user/subscription')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        bgcolor: '#E50914',
                        '&:hover': { bgcolor: '#b20710' },
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)'
                      }}
                    >
                      Try Again
                    </Button>
                  </CardActions>
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
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        mb: 3,
                        mt: isMobile ? 0 : 2
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 54, color: '#4caf50' }} />
                    </Avatar>
                    <Typography variant="h3" component="h1" color="white" gutterBottom>
                      Thank You!
                    </Typography>
                    <Typography variant="h6" color="white" gutterBottom>
                      Your subscription has been successfully activated.
                    </Typography>
                    {subscriptionDetails?.plan_name && (
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: '#E50914', 
                          fontWeight: 'bold',
                          mb: 3 
                        }}
                      >
                        {subscriptionDetails.plan_name} Plan
                      </Typography>
                    )}
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
                      What's Next?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                      You now have full access to our premium content. Start exploring our vast library of movies and shows!
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => (window.location.href = '/user/dashboard')}
                      fullWidth={isMobile}
                      sx={{
                        px: 4,
                        py: 1.5,
                        bgcolor: '#E50914',
                        '&:hover': { bgcolor: '#b20710' },
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)'
                      }}
                    >
                      Go to Dashboard
                    </Button>
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

export default Success;