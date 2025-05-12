import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AuthForm from '../components/layouts/AuthForm';
import { loginAPI, signup } from '../utils/API';

jest.mock('../utils/API');
jest.mock('../components/layouts/AuthLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('../components/common/WithNavigation', () => (Component: React.ComponentType) => (props: any) => <Component {...props} />);

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  TextField: ({ placeholder, value, onChange, error, helperText, InputProps, ...props }: any) => (
    <div>
      <input
        data-testid={`input-${placeholder}`}
        value={value}
        onChange={onChange}
        aria-invalid={error}
        aria-describedby={helperText ? `helper-${placeholder}` : undefined}
        {...props}
      />
      {helperText && (
        <span data-testid={`helper-${placeholder}`}>{helperText}</span>
      )}
      {InputProps?.endAdornment && (
        <div data-testid="input-adornment">{InputProps.endAdornment}</div>
      )}
    </div>
  ),
  Button: ({ children, disabled, onClick, ...props }: any) => (
    <button data-testid="submit-button" disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Typography: ({ children, ...props }: any) => <div data-testid="typography" {...props}>{children}</div>,
  InputAdornment: ({ children }: any) => <div>{children}</div>,
  IconButton: ({ children, onClick }: any) => (
    <button data-testid="toggle-password" onClick={onClick}>
      {children}
    </button>
  ),
  Visibility: () => <span>Visibility</span>,
  VisibilityOff: () => <span>VisibilityOff</span>,
}));

describe('AuthForm', () => {
  const mockNavigate = jest.fn();
  const defaultProps = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    (loginAPI as jest.Mock).mockResolvedValue({ success: true });
    (signup as jest.Mock).mockResolvedValue({ success: true });
  });

  it('renders login form correctly', () => {
    render(<AuthForm {...defaultProps} />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByTestId('input-Email')).toBeInTheDocument();
    expect(screen.getByTestId('input-Password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Login');
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders signup form correctly', () => {
    render(<AuthForm {...defaultProps} isSignup={true} />);
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByTestId('input-Name')).toBeInTheDocument();
    expect(screen.getByTestId('input-Email')).toBeInTheDocument();
    expect(screen.getByTestId('input-Phone Number')).toBeInTheDocument();
    expect(screen.getByTestId('input-Password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign Up');
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('updates input fields correctly', async () => {
    render(<AuthForm {...defaultProps} isSignup={true} />);
    const nameInput = screen.getByTestId('input-Name');
    const emailInput = screen.getByTestId('input-Email');
    const phoneInput = screen.getByTestId('input-Phone Number');
    const passwordInput = screen.getByTestId('input-Password');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(phoneInput, '+1234567890');
    await userEvent.type(passwordInput, 'Password123!');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('+1234567890');
    expect(passwordInput).toHaveValue('Password123!');
  });

  it('displays validation errors for invalid inputs on submit', async () => {
    render(<AuthForm {...defaultProps} isSignup={true} />);
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('helper-Name')).toHaveTextContent('Please enter your name');
      expect(screen.getByTestId('helper-Email')).toHaveTextContent('Please enter your email address');
      expect(screen.getByTestId('helper-Password')).toHaveTextContent('Please enter your password');
    });
  });

  it('validates password correctly', async () => {
    render(<AuthForm {...defaultProps} />);
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(passwordInput, 'weak');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('helper-Password')).toHaveTextContent(/Password must be at least 8 characters/);
    });
  });

  it('validates phone number correctly', async () => {
    render(<AuthForm {...defaultProps} isSignup={true} />);
    const phoneInput = screen.getByTestId('input-Phone Number');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(phoneInput, '123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('helper-Phone Number')).toHaveTextContent('Please enter a valid phone number');
    });
  });

  it('handles successful login submission', async () => {
    render(<AuthForm {...defaultProps} />);
    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginAPI).toHaveBeenCalledWith({ email: 'john@example.com', password: 'Password123!' });
      expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard');
      expect(submitButton).toHaveTextContent('Login');
    });
  });

  it('handles successful signup submission', async () => {
    render(<AuthForm {...defaultProps} isSignup={true} />);
    const nameInput = screen.getByTestId('input-Name');
    const emailInput = screen.getByTestId('input-Email');
    const phoneInput = screen.getByTestId('input-Phone Number');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(phoneInput, '+1234567890');
    await userEvent.type(passwordInput, 'Password123!');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        mobile_number: '+1234567890',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(submitButton).toHaveTextContent('Sign Up');
    });
  });

  it('handles API failure during submission', async () => {
    (loginAPI as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<AuthForm {...defaultProps} />);
    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('helper-Email')).toHaveTextContent('Sign-in failed. Please check your email and password.');
      expect(submitButton).toHaveTextContent('Login');
    });
  });

  it('toggles password visibility', async () => {
    render(<AuthForm {...defaultProps} />);
    const passwordInput = screen.getByTestId('input-Password');
    const toggleButton = screen.getByTestId('toggle-password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('navigates to signup from login form', async () => {
    render(<AuthForm {...defaultProps} />);
    const signupLink = screen.getByText('Sign Up');
    fireEvent.click(signupLink);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('disables button during submission', async () => {
    render(<AuthForm {...defaultProps} />);
    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Login...');
      expect(submitButton).toBeDisabled();
    });
  });
});

global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
};