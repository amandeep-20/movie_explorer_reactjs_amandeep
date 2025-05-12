import React, { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import authImg from '../../../src/assets/images/loginbackground.jpg';

interface AuthLayoutProps {
  children: ReactNode;
}

class AuthLayout extends React.Component<AuthLayoutProps> {
  handleNavigate = () => {
    window.location.href = '/user/dashboard';
  };

  render() {
    const { children } = this.props;
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${authImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay to match image
            zIndex: 1,
          }}
        />
        
        <Button
          onClick={this.handleNavigate}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderRadius: '9999px',
            px: 2,
            py: 0.5,
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MovieIcon sx={{ fontSize: 32, color: '#ffffff', mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: '#ffffff' }}
          >
            Movie Explorer
          </Typography>
        </Button>
        
        <Box
          sx={{
            zIndex: 2,
            width: { xs: '90%', sm: '80%', md: '400px' },
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
}

export default AuthLayout;