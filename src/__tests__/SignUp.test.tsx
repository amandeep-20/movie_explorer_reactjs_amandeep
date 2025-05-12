import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUp from '../pages/Auth/SignUp';
import AuthForm from '../components/layouts/AuthForm';
import '@testing-library/jest-dom';

jest.mock('../components/layouts/AuthForm', () => {
  return function MockAuthForm() {
    return <div data-testid="auth-form">Mocked AuthForm</div>;
  };
});

describe('Login Component', () => {
  test('renders AuthForm component', () => {
    render(<SignUp />);
    const authFormElement = screen.getByTestId('auth-form');
    expect(authFormElement).toBeInTheDocument();
    expect(authFormElement).toHaveTextContent('Mocked AuthForm');
  });
});