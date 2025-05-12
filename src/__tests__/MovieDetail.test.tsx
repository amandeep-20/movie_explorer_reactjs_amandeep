import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoviesDetail from '../components/movieDetail/MovieDetail';
import { useSubscriptionStatus } from '../components/hooks/useSubscriptionStatus';

// Mock dependencies
jest.mock('../components/hooks/useSubscriptionStatus', () => ({
  useSubscriptionStatus: jest.fn(),
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, sx, ...props }: any) => <div style={sx} data-testid="box" {...props}>{children}</div>,
  Typography: ({ children, sx, variant, ...props }: any) => (
    <div style={sx} data-testid={`typography-${variant || 'undefined'}`} {...props}>{children}</div>
  ),
  Button: ({ children, sx, ...props }: any) => (
    <button style={sx} data-testid="button" {...props}>{children}</button>
  ),
  Rating: ({ value, ...props }: any) => <div data-testid="rating" {...props}>{value}</div>,
  Chip: ({ label, sx, icon, ...props }: any) => (
    <span style={sx} data-testid={`chip-${label}`} {...props}>{icon}{label}</span>
  ),
  Container: ({ children, sx, ...props }: any) => (
    <div style={sx} data-testid="container" {...props}>{children}</div>
  ),
  Stack: ({ children, sx, ...props }: any) => (
    <div style={sx} data-testid="stack" {...props}>{children}</div>
  ),
  Avatar: ({ children, sx, ...props }: any) => (
    <div style={sx} data-testid="avatar" {...props}>{children}</div>
  ),
  Divider: ({ sx, ...props }: any) => <hr style={sx} data-testid="divider" {...props} />,
  Alert: ({ children, sx, ...props }: any) => (
    <div style={sx} data-testid="alert" {...props}>{children}</div>
  ),
}));
jest.mock('@mui/icons-material', () => ({
  PlayArrowIcon: () => <span data-testid="play-arrow-icon" />,
  CalendarTodayIcon: () => <span data-testid="calendar-today-icon" />,
  AccessTimeIcon: () => <span data-testid="access-time-icon" />,
  StarIcon: () => <span data-testid="star-icon" />,
  MovieFilterIcon: () => <span data-testid="movie-filter-icon" />,
  PersonIcon: () => <span data-testid="person-icon" />,
  TvIcon: () => <span data-testid="tv-icon" />,
}));

describe('MoviesDetail', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action,Drama',
    release_year: 2020,
    rating: 8.5,
    director: 'John Doe',
    duration: 120,
    description: 'This is a test movie description. It has multiple sentences.',
    premium: false,
    main_lead: 'Jane Smith',
    streaming_platform: 'Test Platform',
    poster_url: 'http://example.com/poster.jpg',
    banner_url: 'http://example.com/banner.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: 'basic',
      loading: false,
      error: null,
    });
  });

  it('renders loading state', () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: 'basic',
      loading: true,
      error: null,
    });
    render(<MoviesDetail movie={mockMovie} />);
    expect(screen.getByTestId('typography-undefined')).toHaveTextContent('Loading subscription status...');
  });

  it('renders error state', () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: null,
      loading: false,
      error: 'Subscription error',
    });
    render(<MoviesDetail movie={mockMovie} />);
    expect(screen.getByTestId('typography-undefined')).toHaveTextContent('Subscription error');
  });

  it('truncates description correctly', () => {
    const movieWithLongDesc = {
      ...mockMovie,
      description: 'This is a long description. It has multiple sentences. Another sentence.',
    };
    render(<MoviesDetail movie={movieWithLongDesc} />);
    expect(screen.getByTestId('typography-subtitle1')).toHaveTextContent('This is a long description.');
  });
});