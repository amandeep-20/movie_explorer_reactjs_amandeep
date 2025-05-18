// import React, { FormEvent, ComponentType } from 'react';
// import {
//   TextField,
//   Button,
//   InputAdornment,
//   IconButton,
//   Typography,
// } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { toast } from 'react-toastify';
// import AuthLayout from '../../components/layouts/AuthLayout';
// import { loginAPI, signup } from '../../utils/API'; // Import signup from api.ts
// import WithNavigation from '../common/WithNavigation';

// // AuthForm Component
// interface Errors {
//   name?: string;
//   lastName?: string;
//   email: string;
//   phone?: string;
//   password: string;
// }

// interface AuthFormProps {
//   isSignup?: boolean;
//   navigate: (path: string) => void;
// }

// interface AuthFormState {
//   name: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   password: string;
//   errors: Errors;
//   showPassword: boolean;
//   loading: boolean;
// }

// class AuthForm extends React.Component<AuthFormProps, AuthFormState> {
//   constructor(props: AuthFormProps) {
//     super(props);
//     this.state = {
//       name: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       password: '',
//       errors: { email: '', password: '' },
//       showPassword: false,
//       loading: false,
//     };
//   }

//   validateEmail = (email: string): boolean => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   validatePassword = (password: string): boolean => {
//     const minLength = password.length >= 8;
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     return minLength && hasUppercase && hasLowercase && hasSpecialChar;
//   };

//   validateName = (name: string): boolean => {
//     return name.trim().length > 0;
//   };

//   validateLastName = (lastName: string): boolean => {
//     return lastName.trim().length > 0;
//   };

//   validatePhone = (phone: string): boolean => {
//     const regex = /^\+?[\d\s-]{10,}$/;
//     return phone.trim().length === 0 || regex.test(phone);
//   };

//   handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const { isSignup = false, navigate } = this.props;
//     const { name, lastName, email, phone, password } = this.state;
//     let newErrors: Errors = { email: '', password: '' };
//     let isValid = true;

//     if (isSignup && !this.validateName(name)) {
//       newErrors.name = 'Please enter your first name';
//       isValid = false;
//     }

//     if (isSignup && !this.validateLastName(lastName)) {
//       newErrors.lastName = 'Please enter your last name';
//       isValid = false;
//     }

//     if (!email) {
//       newErrors.email = 'Please enter your email address';
//       isValid = false;
//     } else if (!this.validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     if (isSignup && !this.validatePhone(phone)) {
//       newErrors.phone = 'Please enter a valid phone number';
//       isValid = false;
//     }

//     if (!password) {
//       newErrors.password = 'Please enter your password';
//       isValid = false;
//     } else if (!this.validatePassword(password)) {
//       newErrors.password =
//         'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character';
//       isValid = false;
//     }

//     this.setState({ errors: newErrors });

//     if (isValid) {
//       this.setState({ loading: true });
//       try {
//         const data = isSignup
//           ? await signup({
//               first_name: name,
//               email,
//               password,
//               mobile_number: phone,
//               last_name: lastName,
//             })
//           : await loginAPI({ email, password });

//         if (!data) {
//           throw new Error('No data returned from API');
//         }

//         console.log(`${isSignup ? 'Sign-up' : 'Sign-in'} successful:`, data);
//         navigate(isSignup ? '/' : '/user/dashboard');
//       } catch (error: any) {
//         console.error(`${isSignup ? 'Sign-up' : 'Sign-in'} failed:`, error.message);
//         this.setState((prevState) => ({
//           errors: {
//             ...prevState.errors,
//             email: 'Sign-up failed. Please check your email and password.',
//           },
//         }));
//       } finally {
//         this.setState({ loading: false });
//       }
//     }
//   };

//   toggleShowPassword = () => {
//     this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
//   };

//   commonTextFieldStyles = {
//     mb: 2,
//     '& .MuiOutlinedInput-root': {
//       backgroundColor: 'rgba(30, 41, 59, 0.6)',
//       borderRadius: '8px',
//       '& fieldset': {
//         borderColor: 'rgba(255, 255, 255, 0.2)',
//       },
//       '&:hover fieldset': {
//         borderColor: 'rgba(255, 255, 255, 0.4)',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: 'rgba(255, 255, 255, 0.6)',
//       },
//     },
//     '& .MuiInputBase-input': {
//       padding: '16px',
//       fontSize: '1rem',
//       color: '#ffffff',
//       '&::placeholder': {
//         color: 'rgba(255, 255, 255, 0.7)',
//         opacity: 1,
//       },
//     },
//     '& .MuiFormHelperText-root': {
//       color: '#f87171',
//     },
//   };

//   render() {
//     const { isSignup = false } = this.props;
//     const { name, lastName, email, phone, password, errors, showPassword, loading } = this.state;

//     return (
//       <AuthLayout>
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 'bold',
//             color: '#ffffff',
//             mb: 6,
//             textAlign: 'center',
//             fontSize: { xs: '2rem', sm: '2.5rem' },
//           }}
//         >
//           {isSignup ? 'Create Your Account' : 'Welcome Back'}
//         </Typography>

//         <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
//           {isSignup && (
//             <TextField
//               placeholder="First Name"
//               type="text"
//               value={name}
//               onChange={(e) => this.setState({ name: e.target.value })}
//               error={!!errors.name}
//               helperText={errors.name}
//               fullWidth
//               variant="outlined"
//               sx={this.commonTextFieldStyles}
//               InputProps={{ style: { color: '#ffffff' } }}
//             />
//           )}

//           {isSignup && (
//             <TextField
//               placeholder="Last Name"
//               type="text"
//               value={lastName}
//               onChange={(e) => this.setState({ lastName: e.target.value })}
//               error={!!errors.lastName}
//               helperText={errors.lastName}
//               fullWidth
//               variant="outlined"
//               sx={this.commonTextFieldStyles}
//               InputProps={{ style: { color: '#ffffff' } }}
//             />
//           )}

//           <TextField
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={(e) => this.setState({ email: e.target.value })}
//             error={!!errors.email}
//             helperText={errors.email}
//             fullWidth
//             variant="outlined"
//             sx={this.commonTextFieldStyles}
//             InputProps={{ style: { color: '#ffffff' } }}
//           />

//           {isSignup && (
//             <TextField
//               placeholder="Phone Number"
//               type="text"
//               value={phone}
//               onChange={(e) => this.setState({ phone: e.target.value })}
//               error={!!errors.phone}
//               helperText={errors.phone}
//               fullWidth
//               variant="outlined"
//               sx={this.commonTextFieldStyles}
//               InputProps={{ style: { color: '#ffffff' } }}
//             />
//           )}

//           <TextField
//             placeholder="Password"
//             type={showPassword ? 'text' : 'password'}
//             value={password}
//             onChange={(e) => this.setState({ password: e.target.value })}
//             error={!!errors.password}
//             helperText={errors.password}
//             fullWidth
//             variant="outlined"
//             sx={{ ...this.commonTextFieldStyles, mb: 3 }}
//             InputProps={{
//               style: { color: '#ffffff' },
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={this.toggleShowPassword}
//                     edge="end"
//                     sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             type="submit"
//             fullWidth
//             disabled={loading}
//             sx={{
//               bgcolor: 'rgba(30, 41, 59, 0.6)',
//               color: '#ffffff',
//               fontSize: '1rem',
//               fontWeight: 500,
//               padding: '16px',
//               borderRadius: '8px',
//               textTransform: 'none',
//               border: '1px solid rgba(255, 255, 255, 0.2)',
//               '&:hover': {
//                 bgcolor: 'rgba(30, 41, 59, 0.8)',
//                 borderColor: 'rgba(255, 255, 255, 0.4)',
//               },
//               '&.Mui-disabled': {
//                 bgcolor: 'rgba(30, 41, 59, 0.4)',
//                 color: 'rgba(255, 255, 255, 0.5)',
//                 borderColor: 'rgba(255, 255, 255, 0.1)',
//               },
//             }}
//           >
//             {loading
//               ? isSignup
//                 ? 'Sign up...'
//                 : 'Login...'
//               : isSignup
//               ? 'Sign Up'
//               : 'Login'}
//           </Button>

//           <Typography
//             variant="body2"
//             sx={{
//               fontSize: '0.875rem',
//               color: 'rgba(255, 255, 255, 0.7)',
//               Vickers: 2,
//               textAlign: 'center',
//             }}
//           >
//             {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
//             <span
//               className="font-medium text-white hover:underline cursor-pointer"
//               onClick={() => this.props.navigate(isSignup ? '/' : '/signup')}
//               style={{ color: '#ffffff' }}
//             >
//               {isSignup ? 'Login' : 'Sign Up'}
//             </span>
//           </Typography>
//         </form>
//       </AuthLayout>
//     );
//   }
// }

// export default WithNavigation(AuthForm);


import React, { FormEvent, ComponentType } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/layouts/AuthLayout';
import { loginAPI, signup } from '../../utils/API';
import WithNavigation from '../common/WithNavigation';

// AuthForm Component
interface Errors {
  name?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
}

interface AuthFormProps {
  isSignup?: boolean;
  navigate: (path: string) => void;
}

interface AuthFormState {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  errors: Errors;
  showPassword: boolean;
  loading: boolean;
}

class AuthForm extends React.Component<AuthFormProps, AuthFormState> {
  constructor(props: AuthFormProps) {
    super(props);
    this.state = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      errors: { email: '', password: '' },
      showPassword: false,
      loading: false,
    };
  }

  validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUppercase && hasLowercase && hasSpecialChar;
  };

  validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  validateLastName = (lastName: string): boolean => {
    return lastName.trim().length > 0;
  };

  validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    const regex = /^\+?\d{10,10}$/;
    return regex.test(digitsOnly);
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { isSignup = false, navigate } = this.props;
    const { name, lastName, email, phone, password } = this.state;
    let newErrors: Errors = { email: '', password: '' };
    let isValid = true;

    if (isSignup && !this.validateName(name)) {
      newErrors.name = 'Please enter your first name';
      isValid = false;
    }

    if (isSignup && !this.validateLastName(lastName)) {
      newErrors.lastName = 'Please enter your last name';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Please enter your email address';
      isValid = false;
    } else if (!this.validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (isSignup && !phone) {
      newErrors.phone = 'Please enter your phone number';
      isValid = false;
    } else if (isSignup && !this.validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number (10 digits)';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    } else if (!this.validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character';
      isValid = false;
    }

    this.setState({ errors: newErrors });

    if (isValid) {
      this.setState({ loading: true });
      try {
        const data = isSignup
          ? await signup({
              first_name: name,
              email,
              password,
              mobile_number: phone,
              last_name: lastName,
            })
          : await loginAPI({ email, password });

        if (!data) {
          throw new Error('No data returned from API');
        }

        console.log(`${isSignup ? 'Sign-up' : 'Sign-in'} successful:`, data);
        navigate(isSignup ? '/' : '/user/dashboard');
      } catch (error: any) {
        console.error(`${isSignup ? 'Sign-up' : 'Sign-in'} failed:`, error.message);
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            email: `${
              isSignup ? 'Sign-up' : 'Sign-in'
            } failed. Please check your email and password.`,
          },
        }));
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  commonTextFieldStyles = {
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
  };

  render() {
    const { isSignup = false } = this.props;
    const { name, lastName, email, phone, password, errors, showPassword, loading } = this.state;

    return (
      <AuthLayout>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            mb: 6,
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          {isSignup ? 'Create Your Account' : 'Welcome Back'}
        </Typography>

        <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
          {isSignup && (
            <TextField
              placeholder="First Name"
              type="text"
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              variant="outlined"
              sx={this.commonTextFieldStyles}
              InputProps={{ style: { color: '#ffffff' } }}
            />
          )}

          {isSignup && (
            <TextField
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => this.setState({ lastName: e.target.value })}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
              variant="outlined"
              sx={this.commonTextFieldStyles}
              InputProps={{ style: { color: '#ffffff' } }}
            />
          )}

          <TextField
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => this.setState({ email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            variant="outlined"
            sx={this.commonTextFieldStyles}
            InputProps={{ style: { color: '#ffffff' } }}
          />

          {isSignup && (
            <TextField
              placeholder="Phone Number"
              type="text"
              value={phone}
              onChange={(e) => this.setState({ phone: e.target.value })}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              variant="outlined"
              sx={this.commonTextFieldStyles}
              InputProps={{ style: { color: '#ffffff' } }}
            />
          )}

          <TextField
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            variant="outlined"
            sx={{ ...this.commonTextFieldStyles, mb: 3 }}
            InputProps={{
              style: { color: '#ffffff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.toggleShowPassword}
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
            disabled={loading}
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
              '&.Mui-disabled': {
                bgcolor: 'rgba(30, 41, 59, 0.4)',
                color: 'rgba(255, 255, 255, 0.5)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {loading
              ? isSignup
                ? 'Sign up...'
                : 'Login...'
              : isSignup
              ? 'Sign Up'
              : 'Login'}
          </Button>

          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 2,
              textAlign: 'center',
            }}
          >
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="font-medium text-white hover:underline cursor-pointer"
              onClick={() => this.props.navigate(isSignup ? '/' : '/signup')}
              style={{ color: '#ffffff' }}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </span>
          </Typography>
        </form>
      </AuthLayout>
    );
  }
}

export default WithNavigation(AuthForm);
