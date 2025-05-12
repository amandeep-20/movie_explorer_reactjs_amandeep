import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Header from '../components/common/Header';
import { onMessage, messaging } from '../notifications/firebase';
import { useSubscriptionStatus } from '../components/hooks/useSubscriptionStatus';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock dependencies
jest.mock('../notifications/firebase', () => ({
  messaging: {},
  onMessage: jest.fn(),
}));
jest.mock('../components/hooks/useSubscriptionStatus', () => ({
  useSubscriptionStatus: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  AppBar: ({ children, sx, ...props }: any) => <div style={sx} data-testid="appbar" {...props}>{children}</div>,
  Toolbar: ({ children, sx, ...props }: any) => <div style={sx} data-testid="toolbar" {...props}>{children}</div>,
  Typography: ({ children, sx, variant, ...props }: any) => (
    <div style={sx} data-testid={`typography-${variant}`} {...props}>{children}</div>
  ),
  Button: ({ children, onClick, sx, startIcon, ...props }: any) => (
    <button style={sx} onClick={onClick} data-testid={props['aria-label'] || 'button'} {...props}>
      {startIcon}
      {children}
    </button>
  ),
  IconButton: ({ children, onClick, sx, ...props }: any) => (
    <button style={sx} onClick={onClick} data-testid={props['aria-label'] || 'icon-button'} {...props}>
      {children}
    </button>
  ),
  Box: ({ children, sx, ...props }: any) => <div style={sx} data-testid="box" {...props}>{children}</div>,
  Badge: ({ children, badgeContent, sx, ...props }: any) => (
    <div style={sx} data-testid="badge" {...props}>
      {children}
      {badgeContent && <span data-testid="badge-content">{badgeContent}</span>}
    </div>
  ),
  Modal: ({ children, open, onClose, ...props }: any) => (
    open ? <div data-testid="modal" onClick={onClose} {...props}>{children}</div> : null
  ),
  Paper: ({ children, sx, ...props }: any) => <div style={sx} data-testid="paper" {...props}>{children}</div>,
  Chip: ({ label, sx, ...props }: any) => <span style={sx} data-testid="chip" {...props}>{label}</span>,
  Tooltip: ({ children, title }: any) => <div data-testid={`tooltip-${title}`}>{children}</div>,
  Fade: ({ children, in: inProp }: any) => (inProp ? <div data-testid="fade">{children}</div> : null),
  Collapse: ({ children, in: inProp }: any) => (inProp ? <div data-testid="collapse">{children}</div> : null),
  Drawer: ({ children, open, onClose, PaperProps, ...props }: any) => (
    open ? (
      <div style={PaperProps?.sx} data-testid="drawer" onClick={onClose} {...props}>
        {children}
      </div>
    ) : null
  ),
  List: ({ children, ...props }: any) => <ul data-testid="list" {...props}>{children}</ul>,
  ListItem: ({ children, sx, component, to, ...props }: any) => {
    const Component = component || 'li';
    return (
      <Component style={sx} data-testid={`list-item-${to || 'generic'}`} {...props}>
        {children}
      </Component>
    );
  },
  ListItemIcon: ({ children, sx, ...props }: any) => (
    <div style={sx} data-testid="list-item-icon" {...props}>{children}</div>
  ),
  ListItemText: ({ primary, sx, ...props }: any) => (
    <span style={sx} data-testid="list-item-text" {...props}>{primary}</span>
  ),
  Divider: ({ sx, ...props }: any) => <hr style={sx} data-testid="divider" {...props} />,
  Avatar: ({ children, sx, ...props }: any) => (
    <div style={sx} data-testid="avatar" {...props}>{children}</div>
  ),
  useMediaQuery: jest.fn(),
  useTheme: jest.fn(() => ({ breakpoints: { down: jest.fn() } })),
}));
jest.mock('@mui/icons-material', () => ({
  MovieIcon: () => <span data-testid="movie-icon" />,
  PersonIcon: () => <span data-testid="person-icon" />,
  LoginIcon: () => <span data-testid="login-icon" />,
  LogoutIcon: () => <span data-testid="logout-icon" />,
  NotificationsIcon: () => <span data-testid="notifications-icon" />,
  HomeIcon: () => <span data-testid="home-icon" />,
  ExploreIcon: () => <span data-testid="explore-icon" />,
  MenuIcon: () => <span data-testid="menu-icon" />,
  CloseIcon: () => <span data-testid="close-icon" />,
  SubscriptionsIcon: () => <span data-testid="subscriptions-icon" />,
  StarIcon: () => <span data-testid="star-icon" />,
}));

describe('Header', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: '/user/dashboard' };
  const mockOnMessageCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useSubscriptionStatus as jest.Mock).mockReturnValue({ subscriptionPlan: 'basic', loading: false });
    (onMessage as jest.Mock).mockReturnValue(mockOnMessageCallback);
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    (window.localStorage.removeItem as jest.Mock).mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
    (window.localStorage.getItem as jest.Mock).mockRestore();
    (window.localStorage.removeItem as jest.Mock).mockRestore();
  });

  it('renders Header for guest user on desktop', () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByTestId('appbar')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('typography-h5')).toHaveTextContent('MExplorer');
    expect(screen.getByTestId('movie-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-Home')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-Explore')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent('Login/Signup');
    expect(screen.getByTestId('login-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('tooltip-Notifications')).not.toBeInTheDocument();
  });

  it('renders Header for authenticated user on desktop', async () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByTestId('avatar')).toHaveTextContent('T');
    expect(screen.getByTestId('typography-body2')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('tooltip-Notifications')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-Subscriber')).toBeInTheDocument();
    expect(screen.getByTestId('subscriptions-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-Logout')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('renders Header for supervisor with premium membership on desktop', () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'supervisor', email: 'admin@example.com', membership: 'premium' })
    );
    (useSubscriptionStatus as jest.Mock).mockReturnValue({ subscriptionPlan: 'premium', loading: false });
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByTestId('avatar')).toHaveTextContent('A');
    expect(screen.getByTestId('typography-body2')).toHaveTextContent('Supervisor');
    expect(screen.getByTestId('chip')).toHaveTextContent('PREMIUM');
    expect(screen.getByTestId('tooltip-Create New')).toBeInTheDocument();
    expect(screen.getByTestId('person-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-Premium Subscriber')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('renders Header for guest user on mobile', () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(true); // Mobile
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent('');
    expect(screen.getByTestId('login-icon')).toBeInTheDocument();
  });

  it('renders Header for authenticated user on mobile', () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(true); // Mobile
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByTestId('avatar')).toHaveTextContent('T');
    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('toggles mobile menu and renders drawer content', async () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(true); // Mobile
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('icon-button'));
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(screen.getByTestId('list-item-/user/dashboard')).toHaveTextContent('Home');
    expect(screen.getByTestId('list-item-/user/getMovies')).toHaveTextContent('Explore');
    expect(screen.getByTestId('list-item-/user/subscription')).toHaveTextContent('Subscriber');
    expect(screen.getByTestId('list-item-generic')).toHaveTextContent('Logout');
    await userEvent.click(screen.getByTestId('close-icon'));
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
  });

  it('handles logout', async () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByTestId('logout'));
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('opens and closes notification modal', async () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('notifications'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('typography-h6')).toHaveTextContent('Notifications');
    await userEvent.click(screen.getByTestId('modal'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('handles firebase notifications', async () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    (window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    const payload = {
      notification: { title: 'Test', body: 'Message' },
    };
    (onMessage as jest.Mock).mock.calls[0][1](payload);
    await waitFor(() => {
      expect(screen.getByTestId('badge-content')).toHaveTextContent('1');
    });
    await userEvent.click(screen.getByTestId('notifications'));
    expect(screen.getByText('Test: Message')).toBeInTheDocument();
  });

  it('handles localStorage parsing error', () => {
    (require('@mui/material').useMediaQuery).mockReturnValue(false); // Desktop
    (window.localStorage.getItem as jest.Mock).mockReturnValue('invalid-json');
    render(
      <MemoryRouter initialEntries={['/user/dashboard']}>
        <Header />
      </MemoryRouter>
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error parsing user data from localStorage:',
      expect.any(Error)
    );
    expect(screen.getByTestId('button')).toHaveTextContent('Login/Signup');
  });
});

// Mock console methods
global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
};