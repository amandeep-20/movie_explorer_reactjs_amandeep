import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MovieItem from '../components/moviesLayout/MovieItem';
import { useNavigate } from 'react-router-dom';
import { deleteMovie } from '../utils/API';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../utils/API', () => ({
  deleteMovie: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, sx, ...props }: any) => <div style={sx} data-testid={props['data-testid'] || 'box'} {...props}>{children}</div>,
  Typography: ({ children, sx, variant, ...props }: any) => (
    <div style={sx} data-testid={`typography-${variant}`} {...props}>{children}</div>
  ),
  IconButton: ({ children, onClick, sx, ...props }: any) => (
    <button style={sx} onClick={onClick} data-testid={props['aria-label'] || 'icon-button'} {...props}>
      {children}
    </button>
  ),
  Tooltip: ({ children, title }: any) => <div data-testid={`tooltip-${title}`}>{children}</div>,
  Chip: ({ label, sx, ...props }: any) => <span style={sx} data-testid="chip" {...props}>{label}</span>,
}));
jest.mock('@mui/icons-material', () => ({
  StarIcon: () => <svg data-testid="StarIcon" />,
  EditIcon: () => <svg data-testid="EditIcon" />,
  DeleteIcon: () => <svg data-testid="DeleteIcon" />,
  AccessTimeIcon: () => <svg data-testid="AccessTimeIcon" />,
  CalendarTodayIcon: () => <svg data-testid="CalendarTodayIcon" />,
  LockIcon: () => <svg data-testid="LockIcon" />,
}));

// Mock localStorage
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('MovieItem', () => {
  const mockNavigate = jest.fn();
  const mockOnDelete = jest.fn();
  const episode = {
    id: 1,
    title: 'Test Movie',
    image: 'test.jpg',
    starRating: 8.5,
    year: 2023,
    duration: '2h 30m',
    date: '2023-10-01',
    desc: 'A test movie',
    director: 'John Doe',
    main_lead: 'Jane Doe',
    streaming_platform: 'Netflix',
    premium: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    window.localStorage.clear();
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
  });

  it('renders MovieItem for guest user', () => {
    render(<MovieItem episode={episode} index={0} />);
    expect(screen.getByTestId('movie-item-root')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Test Movie' })).toHaveAttribute('src', 'test.jpg');
    expect(screen.getByTestId('typography-subtitle1')).toHaveTextContent('Test Movie');
    expect(screen.getByTestId('chip')).toHaveTextContent('Netflix');
    expect(screen.getByTestId('StarIcon')).toBeInTheDocument();
    const ratingElements = screen.getAllByTestId('typography-body2');
    expect(ratingElements.find((el) => el.textContent === '8.5')).toBeInTheDocument();
    expect(screen.getByTestId('CalendarTodayIcon')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByTestId('AccessTimeIcon')).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
    expect(screen.queryByTestId('tooltip-Edit movie')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tooltip-Delete movie')).not.toBeInTheDocument();
  });

  it('renders premium badge for premium movie', () => {
    const premiumEpisode = { ...episode, premium: true };
    render(<MovieItem episode={premiumEpisode} index={0} subscriptionPlan="none" />);
    const starIcons = screen.getAllByTestId('StarIcon');
    expect(starIcons.length).toBe(2); // One for premium badge, one for rating
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
  });

  it('renders supervisor controls for supervisor role', () => {
    render(<MovieItem episode={episode} index={0} role="supervisor" />);
    expect(screen.getByTestId('tooltip-Edit movie')).toBeInTheDocument();
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-Delete movie')).toBeInTheDocument();
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
  });

  it('navigates to login for guest user on click', async () => {
    render(<MovieItem episode={episode} index={0} />);
    await userEvent.click(screen.getByTestId('movie-item-root'));
    expect(toast.info).toHaveBeenCalledWith('Please log in to view movie details.');
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    expect(console.log).toHaveBeenCalledWith('Guest user detected, redirecting to login page');
  });

  it('navigates to subscription page for locked premium content', async () => {
    const premiumEpisode = { ...episode, premium: true };
    window.localStorage.setItem(
      'user',
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(<MovieItem episode={premiumEpisode} index={0} subscriptionPlan="none" />);
    await userEvent.click(screen.getByTestId('movie-item-root'));
    expect(toast.info).toHaveBeenCalledWith('Please upgrade to a premium plan to view this movie.');
    expect(mockNavigate).toHaveBeenCalledWith('/user/subscription', { replace: true });
    expect(console.log).toHaveBeenCalledWith('Premium content locked, redirecting to subscription page');
  });

  it('navigates to movie details for authenticated user with access', async () => {
    window.localStorage.setItem(
      'user',
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(<MovieItem episode={episode} index={0} subscriptionPlan="premium" />);
    await userEvent.click(screen.getByTestId('movie-item-root'));
    expect(mockNavigate).toHaveBeenCalledWith('/user/viewMovieDetail/1', { replace: true });
    expect(console.log).toHaveBeenCalledWith('Navigating to movie details: /user/viewMovieDetail/1');
  });

  it('prevents double navigation on rapid clicks', async () => {
    window.localStorage.setItem(
      'user',
      JSON.stringify({ role: 'user', email: 'test@example.com', membership: 'basic' })
    );
    render(<MovieItem episode={episode} index={0} subscriptionPlan="premium" />);
    await userEvent.click(screen.getByTestId('movie-item-root'));
    await userEvent.click(screen.getByTestId('movie-item-root'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Navigation already in progress, ignoring click');
  });

  it('navigates to edit page for supervisor', async () => {
    render(<MovieItem episode={episode} index={0} role="supervisor" />);
    await userEvent.click(screen.getByTestId('Edit Test Movie'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/manageTask/1');
    expect(console.log).toHaveBeenCalledWith('Editing movie: Test Movie (ID: 1)');
  });

  it('handles successful movie deletion for supervisor', async () => {
    (deleteMovie as jest.Mock).mockResolvedValue(true);
    render(<MovieItem episode={episode} index={0} role="supervisor" onDelete={mockOnDelete} />);
    await userEvent.click(screen.getByTestId('Delete Test Movie'));
    expect(deleteMovie).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith('Movie deleted successfully');
    expect(console.log).toHaveBeenCalledWith('Deleting movie: Test Movie (ID: 1)');
  });

  it('handles failed movie deletion for supervisor', async () => {
    (deleteMovie as jest.Mock).mockResolvedValue(false);
    render(<MovieItem episode={episode} index={0} role="supervisor" onDelete={mockOnDelete} />);
    await userEvent.click(screen.getByTestId('Delete Test Movie'));
    expect(deleteMovie).toHaveBeenCalledWith(1);
    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Failed to delete movie');
    expect(console.log).toHaveBeenCalledWith('Deleting movie: Test Movie (ID: 1)');
  });
});

// Mock console methods
global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
};