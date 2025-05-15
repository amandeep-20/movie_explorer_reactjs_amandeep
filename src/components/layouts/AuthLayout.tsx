import React, { ReactNode } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
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
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(17,17,51,0.9) 100%)',
            backdropFilter: 'blur(5px)',
            zIndex: 1,
          }}
        />
        
        <Button
          onClick={this.handleNavigate}
          sx={{
            position: 'absolute',
            top: 24,
            left: 24,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            px: 2.5,
            py: 1,
            zIndex: 2,
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(30, 30, 70, 0.5)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            },
          }}
        >
          <MovieIcon 
            sx={{ 
              fontSize: 32, 
              color: '#ff5e62', 
              mr: 1,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(10deg)'
              }
            }} 
          />
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 'bold', 
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
          >
            Movie Explorer
          </Typography>
        </Button>
        
        <Container
          maxWidth="sm"
          sx={{
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 4 },
            py: { xs: 3, sm: 4 },
            mx: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ff5e62 0%, #ff9966 100%)',
              opacity: 0.2,
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #614385 0%, #516395 100%)',
              opacity: 0.2,
            }}
          />
          
          {children}
        </Container>
      </Box>
    );
  }
}

export default AuthLayout;