import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Box, Typography, Chip, Paper, InputBase, IconButton, CircularProgress, Pagination, Collapse, Alert } from '@mui/material';
import { getAllMovies, getMoviesByGenre, searchMoviesByTitle, deleteMovie } from '../../utils/API';
import MovieItem from './MovieItem';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSubscriptionStatus } from '../../../src/components/hooks/useSubscriptionStatus';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director: string;
  duration: number;
  description: string;
  premium: boolean;
  main_lead: string;
  streaming_platform: string;
  poster_url: string;
  banner_url: string;
}

interface Episode {
  id: number;
  title: string;
  image: string;
  starRating: number;
  year: number;
  duration: string;
  date: string;
  desc: string;
  director: string;
  main_lead: string;
  streaming_platform: string;
  premium: boolean;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface MovieResponse {
  movies: Movie[];
  pagination: PaginationData;
}

const GetMovies = () => {
  const [movies, setMovies] = useState<Episode[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 10,
  });
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { subscriptionPlan, loading: subscriptionLoading, error: subscriptionError } = useSubscriptionStatus();

  const [searchParams, setSearchParams] = useSearchParams();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || 'user';

  const genres = [
    { id: 'all', name: 'All Movies' },
    { id: 'Action', name: 'Action' },
    { id: 'Comedy', name: 'Comedy' },
    { id: 'Horror', name: 'Horror' },
    { id: 'Thriller', name: 'Thriller' },
    { id: 'Si-Fi', name: 'Si-Fi' },
    { id: 'Romance', name: 'Romance' },
  ];

  // Custom debounce function
  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const loadMovies = useCallback(
    async (genre: string = 'all', page: number = 1, title: string = '') => {
      setLoading(true);
      setError(null);
      try {
        let movieData: MovieResponse;
        if (title) {
          console.log(`Searching movies with title: ${title}, page: ${page}`);
          movieData = await searchMoviesByTitle(title, page, genre);
        } else if (genre === 'all') {
          console.log(`Fetching all movies, page: ${page}`);
          movieData = await getAllMovies(page);
        } else {
          console.log(`Fetching movies for genre: ${genre}, page: ${page}`);
          movieData = await getMoviesByGenre(genre, page);
        }

        console.log('Raw API response:', movieData);

        const movieArray = movieData?.movies || [];
        const paginationData = movieData?.pagination || {
          current_page: page,
          total_pages: 1,
          total_count: movieArray.length,
          per_page: 10,
        };

        if (Array.isArray(movieArray) && movieArray.length > 0) {
          const formattedMovies: Episode[] = movieArray.map((movie: Movie) => ({
            id: movie.id,
            title: movie.title || 'Untitled',
            image: movie.poster_url || 'https://via.placeholder.com/200x300',
            starRating: movie.rating || 0,
            year: movie.release_year || 0,
            duration: movie.duration
              ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
              : '0h 0m',
            date: new Date().toISOString().split('T')[0],
            desc: movie.description || 'No description available',
            director: movie.director || 'Unknown',
            main_lead: movie.main_lead || 'Unknown',
            streaming_platform: movie.streaming_platform || 'Unknown',
            premium: movie.premium || false,
          }));
          console.log('Mapped movies:', formattedMovies);
          setMovies(formattedMovies);
          setPagination(paginationData);
        } else {
          console.log(`No movies found for ${title ? `title: ${title}` : `genre: ${genre}`}, page: ${page}`);
          setMovies([]);
          setError('No movies available for this category');
        }
      } catch (error: any) {
        console.error('Error loading movies:', error.message);
        setMovies([]);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      console.log(`Attempting to delete movie with id: ${id}`);
      const updatedMovies = movies.filter((movie) => movie.id !== id);
      setMovies(updatedMovies);

      const newTotalCount = pagination.total_count - 1;
      const newTotalPages = Math.ceil(newTotalCount / pagination.per_page);
      let newCurrentPage = pagination.current_page;

      if (updatedMovies.length === 0 && pagination.current_page > 1) {
        newCurrentPage = pagination.current_page - 1;
        setPagination((prev) => ({
          ...prev,
          current_page: newCurrentPage,
          total_count: newTotalCount,
          total_pages: newTotalPages,
        }));
        setSearchParams({ page: newCurrentPage.toString() });
        await loadMovies(selectedGenre, newCurrentPage, searchQuery);
      } else {
        setPagination((prev) => ({
          ...prev,
          total_count: newTotalCount,
          total_pages: newTotalPages,
        }));
      }

      const success = await deleteMovie(id);
      if (!success) {
        console.error('Failed to delete movie, refetching to restore state');
        setError('Failed to delete movie');
        await loadMovies(selectedGenre, newCurrentPage, searchQuery);
      } else {
        console.log(`Successfully deleted movie with id: ${id}`);
      }
    } catch (error: any) {
      console.error('Error deleting movie:', error.message);
      setError('Failed to delete movie');
      await loadMovies(selectedGenre, pagination.current_page, searchQuery);
    } finally {
      setDeleteLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string, genre: string, page: number) => {
      setPagination((prev) => ({ ...prev, current_page: page }));
      setSearchParams({ page: page.toString() });
      loadMovies(genre, page, query);
    }, 3000),
    [setSearchParams, loadMovies]
  );

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    setPagination((prev) => ({ ...prev, current_page: pageFromUrl }));
    loadMovies(selectedGenre, pageFromUrl, searchQuery);
    window.scrollTo(0, 0);
  }, [searchParams, selectedGenre, searchQuery, loadMovies]);

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
    setSearchQuery(''); // Reset search query on genre change
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    setSearchParams({ page: '1' });
    loadMovies(genreId, 1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    setSearchParams({ page: page.toString() });
    loadMovies(selectedGenre, page, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, selectedGenre, 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(searchQuery, selectedGenre, 1);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  if (subscriptionLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'rgb(20, 20, 30)',
          color: '#fff',
        }}
      >
        <CircularProgress sx={{ color: '#E50914' }} />
      </Box>
    );
  }

  if (subscriptionError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'rgb(20, 20, 30)',
          color: '#fff',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Header />
        <Typography>{subscriptionError}</Typography>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'rgb(20, 20, 30)',
        overflow: 'hidden',
      }}
    >
      <Header />

      {/* Subscription Banner for Non-Premium Users */}
      {subscriptionPlan !== 'premium' && (
        <Alert
          severity="info"
          sx={{ mx: 2, mt: 2, bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#fff' }}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                component="a"
                href="/user/subscription"
                variant="body2"
                sx={{
                  color: '#E50914',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: '#B20710' },
                }}
              >
                Upgrade Now
              </Typography>
            </Box>
          }
        >
          Unlock premium movies with a subscription!
        </Alert>
      )}

      <Box
        sx={{
          p: 2,
          borderRadius: { xs: 0, sm: 1 },
          mx: { xs: 0, sm: 2 },
          mt: 2,
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            color="white"
            sx={{
              fontWeight: 'bold',
              '&:before': {
                content: '"|"',
                color: '#E50914',
                mr: 1,
              },
            }}
          >
            Explore Movies
          </Typography>

          <IconButton
            onClick={toggleSearch}
            sx={{
              color: 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#E50914',
                transform: 'scale(1.1)',
              },
            }}
            aria-label="search"
            data-testid="search-toggle-button"
          >
            <SearchIcon />
          </IconButton>
        </Box>

        <Collapse in={searchOpen}>
          <Box sx={{ p: 2, bgcolor: 'rgba(18, 18, 40, 0.95)' }}>
            <Paper
              component="form"
              sx={{
                width: '100%',
                p: 1.5,
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  border: '1px solid #E50914',
                  boxShadow: '0 0 0 2px rgba(229, 9, 20, 0.2)',
                },
                display: 'flex',
                alignItems: 'center',
              }}
              onSubmit={handleSearchSubmit}
            >
              <InputBase
                sx={{
                  flex: 1,
                  color: 'white',
                  ml: 1,
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                placeholder="Search for movies, shows, genres..."
                inputProps={{ 'aria-label': 'search movies' }}
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              <IconButton
                sx={{ p: '10px', color: '#E50914' }}
                aria-label="search"
                type="submit"
                data-testid="search-submit-button"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Collapse>

        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 1,
            pb: 1.5,
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#333',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#555',
              borderRadius: '3px',
            },
          }}
        >
          {genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              onClick={() => handleGenreSelect(genre.id)}
              sx={{
                bgcolor: selectedGenre === genre.id ? '#E50914' : '#333',
                color: 'white',
                borderRadius: '16px',
                '&:hover': {
                  bgcolor: selectedGenre === genre.id ? '#E50914' : '#444',
                },
                minWidth: 'fit-content',
                px: 1,
                py: 0.5,
                fontWeight: selectedGenre === genre.id ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
              }}
              icon={genre.id === 'all' ? <FilterListIcon style={{ color: 'white' }} /> : undefined}
            />
          ))}
        </Box>
      </Box>

      {loading || deleteLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            p: 4,
          }}
        >
          <CircularProgress sx={{ color: '#E50914' }} />
        </Box>
      ) : error ? (
        <Typography
          color="white"
          sx={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            py: 5,
            fontSize: '1.1rem',
          }}
        >
          {error}
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: 2,
              p: 2,
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
            {movies.length > 0 ? (
              movies.map((item, index) => (
                <MovieItem
                  key={item.id}
                  episode={item}
                  index={index}
                  role={role}
                  subscriptionPlan={subscriptionPlan}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Typography
                color="white"
                sx={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  py: 5,
                  fontSize: '1.1rem',
                }}
              >
                No movies found
              </Typography>
            )}
          </Box>

          {pagination.total_pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <Pagination
                count={pagination.total_pages}
                page={pagination.current_page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                    bgcolor: '#333',
                    '&:hover': {
                      bgcolor: '#E50914',
                    },
                  },
                  '& .Mui-selected': {
                    bgcolor: '#E50914',
                    color: 'white',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
      <Footer />
    </Box>
  );
};

export default GetMovies;