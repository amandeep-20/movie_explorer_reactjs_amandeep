import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Carousel from '../components/moviesLayout/Carousel';
import { getMoviesByGenre } from '../utils/API';
import { useSubscriptionStatus } from '../components/hooks/useSubscriptionStatus';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../utils/API', () => ({
  getMoviesByGenre: jest.fn(),
}));
jest.mock('../components/hooks/useSubscriptionStatus', () => ({
  useSubscriptionStatus: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, sx, ...props }: any) => <div style={sx} data-testid="box" {...props}>{children}</div>,
  Typography: ({ children, sx, variant, ...props }: any) => (
    <div style={sx} data-testid={`typography-${variant || 'undefined'}`} {...props}>{children}</div>
  ),
  IconButton: ({ children, onClick, sx, ...props }: any) => (
    <button style={sx} onClick={onClick} data-testid={props['aria-label'] || 'icon-button'} {...props}>
      {children}
    </button>
  ),
  CircularProgress: ({ sx, ...props }: any) => <div style={sx} data-testid="circular-progress" {...props} />,
}));
jest.mock('@mui/icons-material', () => ({
  ArrowBackIosIcon: () => <span data-testid="arrow-back-icon" />,
  ArrowForwardIosIcon: () => <span data-testid="arrow-forward-icon" />,
}));
jest.mock('../components/moviesLayout/MovieItem', () => {
  const MockMovieItem = ({ episode, index, role, subscriptionPlan, onDelete }: any) => (
    <div
      data-testid={`movie-item-${episode.id}`}
      onClick={() => onDelete && onDelete(episode.id)}
    >
      {episode.title} - {subscriptionPlan}
      {role === 'supervisor' && <button data-testid={`delete-button-${episode.id}`}>Delete</button>}
    </div>
  );
  MockMovieItem.displayName = 'MovieItem';
  return MockMovieItem;
});

// Mock console methods
global.console = {
  ...global.console,
  error: jest.fn(),
};

describe('Carousel', () => {
  const mockNavigate = jest.fn();
  const mockMovies = [
    {
      id: 1,
      title: 'Movie 1',
      genre: 'Action',
      release_year: 2020,
      rating: 8,
      director: 'Director 1',
      duration: 120,
      description: 'Description 1',
      premium: false,
      main_lead: 'Actor 1',
      streaming_platform: 'Platform 1',
      poster_url: 'http://example.com/poster1.jpg',
      banner_url: 'http://example.com/banner1.jpg',
    },
    {
      id: 2,
      title: 'Movie 2',
      genre: 'Action',
      release_year: 2021,
      rating: 7,
      director: 'Director 2',
      duration: 150,
      description: 'Description 2',
      premium: true,
      main_lead: 'Actor 2',
      streaming_platform: 'Platform 2',
      poster_url: 'http://example.com/poster2.jpg',
      banner_url: 'http://example.com/banner2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-router-dom').useNavigate).mockReturnValue(mockNavigate);
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: 'basic',
      loading: false,
      error: null,
    });
    (getMoviesByGenre as jest.Mock).mockResolvedValue({ movies: mockMovies });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders loading state', () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: 'basic',
      loading: true,
      error: null,
    });
    render(<Carousel title="Action Movies" genre="Action" />);
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (getMoviesByGenre as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<Carousel title="Action Movies" genre="Action" />);
    await waitFor(() => {
      expect(screen.getByTestId('typography-undefined')).toHaveTextContent('Failed to load movies');
    });
    expect(console.error).toHaveBeenCalledWith('Error fetching movies:', 'API Error');
  });

  it('renders no movies state', async () => {
    (getMoviesByGenre as jest.Mock).mockResolvedValue({ movies: [] });
    render(<Carousel title="Action Movies" genre="Action" />);
    await waitFor(() => {
      expect(screen.getByTestId('typography-undefined')).toHaveTextContent('No movies available');
    });
  });

  it('renders movies correctly', async () => {
    render(<Carousel title="Action Movies" genre="Action" />);
    await waitFor(() => {
      expect(screen.getByTestId('typography-h5')).toHaveTextContent('Action Movies');
      expect(screen.getByTestId('movie-item-1')).toHaveTextContent('Movie 1 - basic');
      expect(screen.getByTestId('movie-item-2')).toHaveTextContent('Movie 2 - basic');
      expect(screen.queryByTestId('Scroll Action Movies left')).not.toBeInTheDocument();
      expect(screen.getByTestId('Scroll Action Movies right')).toBeInTheDocument();
    });
  });

  it('navigates to /user/getMovies on See All click', async () => {
    render(<Carousel title="Action Movies" genre="Action" />);
    await waitFor(() => {
      expect(screen.getByText('See All')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('See All'));
    expect(mockNavigate).toHaveBeenCalledWith('/user/getMovies');
  });

  it('handles movie deletion for supervisor role', async () => {
    const mockOnDelete = jest.fn();
    render(<Carousel title="Action Movies" genre="Action" role="supervisor" onDelete={mockOnDelete} />);
    await waitFor(() => {
      expect(screen.getByTestId('movie-item-1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('delete-button-1'));
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(screen.queryByTestId('movie-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('movie-item-2')).toBeInTheDocument();
  });

  it('does not show delete button for non-supervisor role', async () => {
    render(<Carousel title="Action Movies" genre="Action" role="user" />);
    await waitFor(() => {
      expect(screen.getByTestId('movie-item-1')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('delete-button-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button-2')).not.toBeInTheDocument();
  });

  it('updates scroll buttons based on scroll position', async () => {
    render(<Carousel title="Action Movies" genre="Action" />);
    await waitFor(() => {
      expect(screen.getByTestId('movie-item-1')).toBeInTheDocument();
    });

    const scrollContainer = screen.getByRole('region', { name: 'Action Movies' });
    Object.defineProperty(scrollContainer, 'scrollLeft', { value: 0, writable: true });
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 1000 });
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 500 });

    fireEvent.scroll(scrollContainer);
    expect(screen.queryByTestId('Scroll Action Movies left')).not.toBeInTheDocument();
    expect(screen.getByTestId('Scroll Action Movies right')).toBeInTheDocument();

    Object.defineProperty(scrollContainer, 'scrollLeft', { value: 500 });
    fireEvent.scroll(scrollContainer);
    expect(screen.getByTestId('Scroll Action Movies left')).toBeInTheDocument();
    expect(screen.queryByTestId('Scroll Action Movies right')).not.toBeInTheDocument();
  });

  it('handles subscription error', async () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: null,
      loading: false,
      error: 'Subscription error',
    });
    render(<Carousel title="Action Movies" genre="Action" />);
    await waitFor(() => {
      expect(screen.getByTestId('typography-undefined')).toHaveTextContent('Subscription error');
    });
  });
});