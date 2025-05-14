import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import GetMovies from '../../src/components/moviesLayout/GetMovies';
import * as API from '../utils/API';
import '@testing-library/jest-dom';
import { useSubscriptionStatus } from '../components/hooks/useSubscriptionStatus';

jest.mock('@firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(() => Promise.resolve('mock-token')),
  onMessage: jest.fn(() => () => {}),
}));

jest.mock('../utils/API', () => ({
  getAllMovies: jest.fn(),
  getMoviesByGenre: jest.fn(),
  searchMoviesByTitle: jest.fn(),
  deleteMovie: jest.fn(),
}));

jest.mock('../components/hooks/useSubscriptionStatus', () => ({
  useSubscriptionStatus: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

// Mock window.scrollTo
global.scrollTo = jest.fn();

const mockMoviesResponse = {
  movies: [
    {
      id: 1,
      title: 'Test Movie',
      genre: 'Action',
      release_year: 2023,
      rating: 8.5,
      director: 'John Doe',
      duration: 120,
      description: 'A test movie description',
      premium: false,
      main_lead: 'Jane Doe',
      streaming_platform: 'Test Platform',
      poster_url: 'https://example.com/poster.jpg',
      banner_url: 'https://example.com/banner.jpg',
    },
  ],
  pagination: {
    current_page: 1,
    total_pages: 2,
    total_count: 15,
    per_page: 10,
  },
};

describe('GetMovies Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ page: '1' }),
      jest.fn(),
    ]);

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(
      JSON.stringify({ role: 'user' })
    );

    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: 'basic',
      loading: false,
      error: null,
    });

    (API.getAllMovies as jest.Mock).mockResolvedValue(mockMoviesResponse);
  });

  afterEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockRestore();
  });

  test('renders loading state initially when subscription is loading', async () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders subscription error when subscription fails', async () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: null,
      loading: false,
      error: 'Failed to load subscription',
    });

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    expect(screen.getByText('Failed to load subscription')).toBeInTheDocument();
  });

  test('renders movies and pagination when data is loaded', async () => {
    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  test('displays subscription banner for non-premium users', async () => {
    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Unlock premium movies with a subscription!')).toBeInTheDocument();
      expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
    });
  });

  test('hides subscription banner for premium users', async () => {
    (useSubscriptionStatus as jest.Mock).mockReturnValue({
      subscriptionPlan: 'premium',
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Unlock premium movies with a subscription!')
      ).not.toBeInTheDocument();
    });
  });

  test('handles genre selection', async () => {
    (API.getMoviesByGenre as jest.Mock).mockResolvedValue(mockMoviesResponse);

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      const actionChip = screen.getByText('Action');
      fireEvent.click(actionChip);

      expect(API.getMoviesByGenre).toHaveBeenCalledWith('Action', 1);
    });
  });

  test('handles search input and submits search', async () => {
    (API.searchMoviesByTitle as jest.Mock).mockResolvedValue(mockMoviesResponse);

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    // Target the search toggle button by its aria-label
    const searchToggleButton = screen.getByLabelText('search');
    fireEvent.click(searchToggleButton);

    const searchInput = screen.getByPlaceholderText('Search for movies, shows, genres...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Target the search submit button by its type and role
    const searchSubmitButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchSubmitButton);

    await waitFor(
      () => {
        expect(API.searchMoviesByTitle).toHaveBeenCalledWith('Test', 1, 'all');
      },
      { timeout: 3500 }
    );
  });

  test('displays error message when no movies are found', async () => {
    (API.getAllMovies as jest.Mock).mockResolvedValue({
      movies: [],
      pagination: { current_page: 1, total_pages: 1, total_count: 0, per_page: 10 },
    });

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No movies available for this category')).toBeInTheDocument();
    });
  });

  test('handles pagination change', async () => {
    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      const pageTwoButton = screen.getByText('2');
      fireEvent.click(pageTwoButton);

      expect(API.getAllMovies).toHaveBeenCalledWith(2);
    });
  });

  test('handles movie deletion for admin role', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(
      JSON.stringify({ role: 'admin' })
    );
    (API.deleteMovie as jest.Mock).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Adjust based on actual delete button identifier in MovieItem
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(API.deleteMovie).toHaveBeenCalledWith(1);
    });
  });

  test('displays error when movie deletion fails', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(
      JSON.stringify({ role: 'admin' })
    );
    (API.deleteMovie as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    render(
      <MemoryRouter>
        <GetMovies />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Adjust based on actual delete button identifier in MovieItem
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to delete movie')).toBeInTheDocument();
    });
  });
});