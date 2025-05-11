import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../pages/Auth/Login';
import AuthForm from '../components/layouts/AuthForm';
import '@testing-library/jest-dom';

// Mock the AuthForm component to avoid testing its internal logic
jest.mock('../components/layouts/AuthForm', () => {
  return function MockAuthForm() {
    return <div data-testid="auth-form">Mocked AuthForm</div>;
  };
});

describe('Login Component', () => {
  test('renders AuthForm component', () => {
    render(<Login />);
    
    // Check if the mocked AuthForm is rendered
    const authFormElement = screen.getByTestId('auth-form');
    expect(authFormElement).toBeInTheDocument();
    expect(authFormElement).toHaveTextContent('Mocked AuthForm');
  });
});