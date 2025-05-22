import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Box, Typography, Chip, Paper, InputBase, IconButton, CircularProgress, Pagination, Collapse, Alert, List, ListItem, ListItemText } from '@mui/material';
import { getAllMovies, getMoviesByGenre, searchMoviesByTitle, deleteMovie } from '../../utils/API';
import MovieItem from '../../components/moviesLayout/MovieItem';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSubscriptionStatus } from '../../components/hooks/useSubscriptionStatus';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'horror', name: 'Horror' },
    { id: 'sci-fi', name: 'Sci-Fi' },
    { id: 'romance', name: 'Romance' },
  ];

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const loadMovies = async (genre: string = 'all', page: number = 1, title: string = '') => {
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
          image: movie.poster_url || '',
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
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const movieData: MovieResponse = await searchMoviesByTitle(query, 1, selectedGenre);
      const movieTitles = movieData?.movies?.map((movie: Movie) => movie.title) || [];
      setSuggestions(movieTitles.slice(0, 5));
    } catch (error: any) {
      console.error('Error fetching suggestions:', error.message);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      fetchSuggestions(query);
    }, 500),
    [selectedGenre]
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const prevMovies = movies;
    try {
      const updatedMovies = movies.filter((movie) => movie.id !== id);
      setMovies(updatedMovies);

      const newTotalCount = pagination.total_count - 1;
      const newTotalPages = Math.ceil(newTotalCount / pagination.per_page);
      let newCurrentPage = pagination.current_page;

      if (updatedMovies.length === 0 && pagination.current_page > 1) {
        newCurrentPage = pagination.current_page - 1;
        setPagination({
          current_page: newCurrentPage,
          total_count: newTotalCount,
          total_pages: newTotalPages,
          per_page: pagination.per_page,
        });
        setSearchParams({ page: newCurrentPage.toString(), genre: selectedGenre });
        await loadMovies(selectedGenre, newCurrentPage, searchQuery);
      } else {
        setPagination((prev) => ({
          ...prev,
          total_count: newTotalCount,
          total_pages: newTotalPages,
        }));
      }

      await deleteMovie(id);
      console.log(`Successfully deleted movie with id: ${id}`);
    } catch (error: any) {
      console.error('Error deleting movie:', error.message);
      setError('Failed to delete movie');
      setMovies(prevMovies);
      setPagination((prev) => ({
        ...prev,
        total_count: prev.total_count,
        total_pages: Math.ceil(prev.total_count / prev.per_page),
      }));
    } finally {
      setDeletingId(null);
    }
  };

  // Immediate search function (no debounce)
  const triggerSearch = (query: string, genre: string, page: number) => {
    setPagination({ ...pagination, current_page: page });
    setSearchParams({ page: page.toString(), genre });
    loadMovies(genre, page, query);
  };

  const debouncedSearch = useCallback(
    debounce((query: string, genre: string, page: number) => {
      setPagination({ ...pagination, current_page: page });
      setSearchParams({ page: page.toString(), genre });
      loadMovies(genre, page, query);
    }, 3000),
    [pagination, setSearchParams]
  );

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const genreFromUrl = searchParams.get('genre') || 'all';

    const validGenre = genres.some(genre => genre.id === genreFromUrl) ? genreFromUrl : 'all';
    setSelectedGenre(validGenre);
    setPagination((prev) => ({ ...prev, current_page: pageFromUrl }));
    loadMovies(validGenre, pageFromUrl, searchQuery);
    window.scrollTo(0, 0);
  }, [searchParams]);

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
    setPagination({ ...pagination, current_page: 1 });
    setSearchParams({ page: '1', genre: genreId });
    loadMovies(genreId, 1, searchQuery);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination({ ...pagination, current_page: page });
    setSearchParams({ page: page.toString(), genre: selectedGenre });
    loadMovies(selectedGenre, page, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, selectedGenre, 1); // Debounced search while typing
    debouncedFetchSuggestions(query); // Fetch suggestions as the user types
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Clear suggestions after selection
    triggerSearch(suggestion, selectedGenre, 1); // Immediate search on suggestion click
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]); // Clear suggestions on submit
    triggerSearch(searchQuery, selectedGenre, 1); // Immediate search on Enter
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSuggestions([]); // Clear suggestions when closing the search bar
    }
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
          >
            <SearchIcon />
          </IconButton>
        </Box>

        <Collapse in={searchOpen}>
          <Box sx={{ position: 'relative', p: 2, bgcolor: 'rgba(18, 18, 40, 0.95)' }}>
            <Paper
              component="form"
              sx={{
                width: '100%',
                p: 1.5,
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 251, 0.2)',
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
              <IconButton sx={{ p: '10px', color: '#E50914' }} aria-label="search" type="submit">
                <SearchIcon />
              </IconButton>
            </Paper>

            {suggestions.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  bgcolor: '#fff',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                <List>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.05)',
                        },
                      }}
                    >
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
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

      {loading ? (
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
              transition: 'opacity 0.3s ease',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {movies.length > 0 ? (
              movies.map((item) => (
                <MovieItem
                  key={item.id}
                  episode={item}
                  index={item.id}
                  role={role}
                  subscriptionPlan={subscriptionPlan === 'premium' ? 'premium' : 'none'}
                  onDelete={handleDelete}
                  isDeleting={deletingId === item.id}
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

export default React.memo(GetMovies);