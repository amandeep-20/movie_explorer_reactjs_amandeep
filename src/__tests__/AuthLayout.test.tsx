import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import MovieIcon from '@mui/icons-material/Movie';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';


// Mock dependencies
jest.mock('../../../src/assets/images/loginbackground.jpg', () => 'mocked-image.jpg');
jest.mock('@mui/icons-material/Movie', () => () => <span data-testid="movie-icon" />);

// Mock MUI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, sx, ...props }: any) => (
    <div style={sx} {...props} data-testid="box">
      {children}
    </div>
  ),
  Button: ({ children, onClick, sx, ...props }: any) => (
    <button onClick={onClick} style={sx} data-testid="nav-button" {...props}>
      {children}
    </button>
  ),
  Typography: ({ children, sx, variant, ...props }: any) => (
    <div style={sx} data-testid={`typography-${variant}`} {...props}>
      {children}
    </div>
  ),
}));

// Mock window.location.href
const mockLocationAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('AuthLayout', () => {
  const mockChildren = <div data-testid="child-content">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  it('renders AuthLayout with children', () => {
    render(<AuthLayout>{mockChildren}</AuthLayout>);
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    const mainContainer = screen.getAllByTestId('box').find((box) =>
      box.style.width === '100vw'
    );
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveStyle({
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(mocked-image.jpg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      overflow: 'hidden',
    });
  });

  it('renders overlay box', () => {
    render(<AuthLayout>{mockChildren}</AuthLayout>);
    const boxes = screen.getAllByTestId('box');
    const overlayBox = boxes.find((box) =>
      box.style.backgroundColor === 'rgba(0, 0, 0, 0.7)'
    );
    expect(overlayBox).toBeInTheDocument();
    expect(overlayBox).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '1',
    });
  });

  it('navigates to dashboard on button click', () => {
    render(<AuthLayout>{mockChildren}</AuthLayout>);
    const navButton = screen.getByTestId('nav-button');
    fireEvent.click(navButton);
    expect(window.location.href).toBe('/user/dashboard');
  });
});

// Mock console methods
global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
};