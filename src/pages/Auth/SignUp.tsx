import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthLayout from '../../components/layouts/AuthLayout';
import { signup } from '../../utils/API';

interface Errors {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUppercase && hasLowercase && hasSpecialChar;
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors: Errors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Please enter your email address';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        const data = await signup({ name, email, password, phone });
        console.log('Sign-up successful:', data);
        navigate('/user/dashboard');
      } catch (error: any) {
        console.error('Sign-up failed:', error.message);
        alert(`Sign-up failed: ${error.message}`);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <AuthLayout>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          color: '#ffffff', 
          mb: 6, 
          textAlign: 'center',
          fontSize: { xs: '2rem', sm: '2.5rem' }
        }}
      >
        Create Your Account
      </Typography>

      <form onSubmit={handleSignUp} style={{ width: '100%' }}>
        <TextField
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
            },
            '& .MuiInputBase-input': {
              padding: '16px',
              fontSize: '1rem',
              color: '#ffffff',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#f87171',
            },
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />
        
        <TextField
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
            },
            '& .MuiInputBase-input': {
              padding: '16px',
              fontSize: '1rem',
              color: '#ffffff',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#f87171',
            },
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />
        <TextField
          placeholder="Phone Number"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
            },
            '& .MuiInputBase-input': {
              padding: '16px',
              fontSize: '1rem',
              color: '#ffffff',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#f87171',
            },
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />
        
        <TextField
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          variant="outlined"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
            },
            '& .MuiInputBase-input': {
              padding: '16px',
              fontSize: '1rem',
              color: '#ffffff',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#f87171',
            },
          }}
          InputProps={{
            style: { color: '#ffffff' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={toggleShowPassword} 
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          sx={{
            bgcolor: 'rgba(30, 41, 59, 0.6)',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 500,
            padding: '16px',
            borderRadius: '8px',
            textTransform: 'none',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(30, 41, 59, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          Sign Up
        </Button>
        
        <Typography
          variant="body2"
          sx={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            mt: 2, 
            textAlign: 'center' 
          }}
        >
          Already have an account?{' '}
          <Link
            className="font-medium text-white hover:underline"
            to="/login"
            style={{ color: '#ffffff' }}
          >
            Login
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
};

export default SignUp;