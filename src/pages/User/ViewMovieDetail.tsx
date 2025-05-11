import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MoviesDetail from '../../components/movieDetail/MovieDetail';
import Carousel from '../../components/moviesLayout/Carousel';
import { getMoviesById } from '../../utils/API';
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

const ViewMovieDetail: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id?: string }>();
  const { subscriptionPlan, loading: subscriptionLoading, error: subscriptionError } = useSubscriptionStatus();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || 'user';

  useEffect(() => {
    console.log(`Route changed, ID: ${id}`);
    const fetchMovie = async () => {
      if (!id) {
        setError('No movie ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching movie with ID: ${id}`);
        const movieData = await getMoviesById(Number(id));
        if (movieData) {
          console.log(`Movie fetched: ${movieData.title} (ID: ${id})`);
          setMovie(movieData);
          window.scrollTo(0, 0);

        } else {
          setError('Movie not found');
        }
      } catch (err: any) {
        console.error('Error fetching movie:', err.message);
        setError('Failed to load movie');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading || subscriptionLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#0a0a0a',
          color: '#fff',
          p: 3,
        }}
      >
        <CircularProgress sx={{ color: '#E50914' }} />
      </Box>
    );
  }

  if (error || subscriptionError || !movie) {
    return (
      <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh', textAlign: 'center', p: 8 }}>
        <Header />
        <Typography variant="h4">{error || subscriptionError || 'Movie not found'}</Typography>
        <Footer />
      </Box>
    );
  }

  const primaryGenre = movie.genre.split(',')[0].trim();
  console.log(`Rendering Carousel with genre: ${primaryGenre}, role: ${role}, subscriptionPlan: ${subscriptionPlan}`);

  return (
    <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Header />
      <MoviesDetail movie={movie} />
      <Carousel title="Related Movies" genre={primaryGenre} role={role} subscriptionPlan={subscriptionPlan} />
      <Footer />
    </Box>
  );
};

export default ViewMovieDetail;