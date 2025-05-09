import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MovieItem from './MovieItem';
import { Episode } from '../../../config/MoviesData';
import { useNavigate } from 'react-router-dom';
import { getMoviesByGenre } from '../../utils/API';

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

interface CarouselProps {
  title: string;
  genre: string; 
}

const Carousel: React.FC<CarouselProps> = ({ title, genre }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [movies, setMovies] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log(`Fetching movies for genre: ${genre}`);
        const movieData = await getMoviesByGenre(genre);
        console.log('Raw API response:', movieData);

        if (Array.isArray(movieData) && movieData.length > 0) {
          const formattedMovies: Episode[] = movieData.map((movie: Movie) => ({
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
          }));
          console.log('Mapped movies:', formattedMovies);
          setMovies(formattedMovies);
        } else {
          console.log(`No movies found for genre: ${genre}`);
          setError('No movies available');
        }
      } catch (err: any) {
        console.error('Error fetching movies:', err.message);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre]);

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200 + 16;
      const scrollDistance = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
    }
  };

  const handleSeeAll = () => {
    navigate('/user/getMovies');
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3 }}>
        <Typography>Loading movies...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3 }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
      <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3 }}>
        <Typography>No movies to display</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color="#fff"
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        {title}
      </Typography>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography
          variant="h6"
          color="#fff"
          sx={{
            display: 'inline',
            fontWeight: 'bold',
            '&:before': {
              content: '"|"',
              color: '#ffd700',
              mr: 1,
            },
            '&:after': {
              content: '" >"',
              color: '#ffd700',
            },
          }}
        >
          "TV shows and movies just for you"
        </Typography>
        <Typography
          onClick={handleSeeAll}
          sx={{
            '&:hover': { color: '#E50914' },
            cursor: 'pointer',
          }}
        >
          See All
        </Typography>
      </Box>
      <Box position="relative">
        <Box
          ref={scrollRef}
          role="region"
          aria-label={title}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {movies.map((item, index) => (
            <MovieItem key={item.id} episode={item} index={index} />
          ))}
        </Box>
        {canScrollLeft && (
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            }}
            aria-label={`Scroll ${title} left`}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        {canScrollRight && (
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            }}
            aria-label={`Scroll ${title} right`}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(Carousel);