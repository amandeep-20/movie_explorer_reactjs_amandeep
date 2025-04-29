import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Carousel from '../../components/moviesLayout/Carousel';
import BigSlider from '../../components/moviesLayout/BigSlider';
import { Episode } from '../../../config/MoviesData';
import { getAllMovies } from '../../utils/API';

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

interface MoviesResponse {
  movies: Movie[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

const UserDashboard = () => {
  const [topRatedMovies, setTopRatedMovies] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carousels = [
    { title: 'Sci-Fi', genre: 'Sci-Fi' },
    { title: 'Romance', genre: 'Romance' },
    { title: 'Action', genre: 'Action' },
    { title: 'Thriller', genre: 'Thriller' },
  ];

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        console.log('Fetching top-rated movies...');
        const movieData = await getAllMovies();
        console.log('Raw API response:', movieData);

        const movieArray = movieData ?.movies || [];
        if (Array.isArray(movieArray) && movieArray.length > 0) {
          const formattedMovies: Episode[] = movieArray
            .filter((movie) => movie.rating >= 8) // Filter for top-rated (adjust as needed)
            .map((movie: Movie) => ({
              id: movie.id,
              title: movie.title || 'Untitled',
              image: movie.banner_url || movie.poster_url || 'https://via.placeholder.com/1200x800',
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
          console.log('Mapped top-rated movies:', formattedMovies);
          setTopRatedMovies(formattedMovies);
        } else {
          console.log('No top-rated movies found');
          setError('No top-rated movies available');
        }
      } catch (err: any) {
        console.error('Error fetching top-rated movies:', err.message);
        setError('Failed to load top-rated movies');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, []);

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3, minHeight: '100vh' }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3, minHeight: '100vh' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header role="user" />
      <BigSlider items={topRatedMovies} />
      {carousels.map((carousel, index) => (
        <Carousel key={index} title={carousel.title} genre={carousel.genre} />
      ))}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      ></Box>
      <Footer />
    </Box>
  );
};

export default UserDashboard;